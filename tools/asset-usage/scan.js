/**
 * Crawls the Document Authoring repository and reconciles it against the DAM inventory.
 *
 * The DA crawl is always run against the whole repository, never a subtree. Usage is a
 * property of the entire site: an asset referenced only from /de looks unused if the crawl
 * stopped at /en, and a false "unused" verdict is the one failure mode that gets a live
 * asset deleted. The DAM side is scoped instead, which is safe.
 */

// eslint-disable-next-line import/no-unresolved
import { crawl } from 'https://da.live/nx/public/utils/tree.js';
import {
  DA_CONSTANTS,
  createRateLimiter,
  getPageStatus,
  getPublishStatus,
} from '../../scripts/helper.js';
import { extractDamRefs, parseHtml, isUnpublishedPath } from './dam-refs.js';
import { toPagePath } from './compare.js';

/** admin.hlx.page permits 10 requests per 3 seconds. */
const rateLimit = createRateLimiter(10, 3000);

const REPO_ROOT = `/${DA_CONSTANTS.org}/${DA_CONSTANTS.repo}`;

/**
 * Decides whether a page counts as published.
 *
 * Without verification this falls back to path convention, which mirrors the drafts and
 * sandbox exclusions in configurations/query.yaml and costs no requests. Verification is
 * accurate but rate limited, so it is only ever asked about pages that reference an asset.
 * @param {Object} options options
 * @returns {Promise<boolean>} whether the page is live
 */
async function isPagePublished({ daPath, token, verify }) {
  if (isUnpublishedPath(daPath)) return false;
  if (!verify) return true;

  const statusObj = await rateLimit(() => getPageStatus(toPagePath(daPath), token));
  return getPublishStatus(statusObj) === 'published';
}

/**
 * Walks every document in the DA repository and records which DAM assets each one uses.
 * @param {Object} options options
 * @param {Object} options.actions DA SDK actions, providing daFetch
 * @param {string} options.token IMS token
 * @param {boolean} [options.verifyPublishStatus] confirm publish state via the status API
 * @param {Function} [options.onProgress] progress callback
 * @returns {Promise<Object>} usage map and crawl stats
 */
export async function buildUsageMap({
  actions, token, verifyPublishStatus = false, onProgress = () => {},
}) {
  const usage = new Map();
  const stats = { pagesScanned: 0, pagesFailed: 0, referencesFound: 0 };

  const record = (damPath, daPath, published) => {
    if (!usage.has(damPath)) {
      usage.set(damPath, { pages: new Set(), publishedPages: new Set() });
    }
    const entry = usage.get(damPath);
    entry.pages.add(daPath);
    if (published) entry.publishedPages.add(daPath);
  };

  const handleItem = async (item) => {
    if (!item.path?.endsWith('.html')) return;

    let resp;
    try {
      resp = await actions.daFetch(`${DA_CONSTANTS.sourceUrl}${item.path}`);
    } catch {
      stats.pagesFailed += 1;
      return;
    }

    if (!resp.ok) {
      stats.pagesFailed += 1;
      return;
    }

    const refs = extractDamRefs(parseHtml(await resp.text()));
    stats.pagesScanned += 1;
    onProgress(stats);

    if (refs.size === 0) return;

    const published = await isPagePublished({
      daPath: item.path,
      token,
      verify: verifyPublishStatus,
    });
    refs.forEach((damPath) => {
      record(damPath, item.path, published);
      stats.referencesFound += 1;
    });
  };

  const { results } = await crawl({
    path: REPO_ROOT,
    callback: handleItem,
    concurrent: 50,
    throttle: 5,
  });
  await results;

  return { usage, stats };
}
