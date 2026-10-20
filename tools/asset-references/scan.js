/**
 * Crawls the Document Authoring repository and records which DAM assets each document uses.
 *
 * The crawl is always run against the whole repository, never a subtree. "Which assets are
 * referenced" is a property of the entire site: an asset used only by /de looks unreferenced
 * if the crawl stopped at /en, and a false negative is the failure mode that gets a live
 * asset deleted.
 *
 * Both .html pages and .json sheets are read. Sheets matter because redirects.json points
 * friendly URLs at DAM documents; an HTML-only crawl misses every one of those targets.
 */

// eslint-disable-next-line import/no-unresolved
import { crawl } from 'https://da.live/nx/public/utils/tree.js';
import { DA_CONSTANTS } from '../../scripts/helper.js';
import {
  extractDamRefs,
  extractDamRefsFromJson,
  isUnpublishedPath,
  parseHtml,
} from './dam-refs.js';

export const REPO_ROOT = `/${DA_CONSTANTS.org}/${DA_CONSTANTS.repo}`;

/** Extensions whose source can carry a DAM reference. */
export const SCANNED_EXTENSIONS = ['html', 'json'];

/**
 * Whether the crawler should open this item.
 * @param {string} path DA path
 * @returns {string|null} the extension to parse as, or null to skip
 */
export function scannableAs(path) {
  if (!path) return null;
  const match = SCANNED_EXTENSIONS.find((ext) => path.endsWith(`.${ext}`));
  return match ?? null;
}

/**
 * Turns a DA source path into the page path used for links and reports.
 * @param {string} daPath e.g. /jmphlx/jmp-da/en/home.html
 * @returns {string} e.g. en/home.html
 */
export function toPagePath(daPath) {
  return daPath.replace(`${REPO_ROOT}/`, '');
}

/**
 * Walks every document in the repository and records the DAM assets each one references.
 * @param {Object} options options
 * @param {Object} options.actions DA SDK actions, providing daFetch
 * @param {Function} [options.onProgress] progress callback, given the running stats
 * @returns {Promise<Object>} usage map and crawl stats
 */
export async function buildUsageMap({ actions, onProgress = () => {} }) {
  const usage = new Map();
  const stats = {
    documentsScanned: 0,
    documentsFailed: 0,
    documentsWithRefs: 0,
    references: 0,
  };

  const record = (damPath, daPath, published) => {
    if (!usage.has(damPath)) {
      usage.set(damPath, { pages: new Set(), publishedPages: new Set() });
    }
    const entry = usage.get(damPath);
    entry.pages.add(daPath);
    if (published) entry.publishedPages.add(daPath);
  };

  const handleItem = async (item) => {
    const ext = scannableAs(item.path);
    if (!ext) return;

    let resp;
    try {
      resp = await actions.daFetch(`${DA_CONSTANTS.sourceUrl}${item.path}`);
    } catch {
      stats.documentsFailed += 1;
      return;
    }
    if (!resp.ok) {
      stats.documentsFailed += 1;
      return;
    }

    const text = await resp.text();
    const refs = ext === 'json'
      ? extractDamRefsFromJson(text)
      : extractDamRefs(parseHtml(text));

    stats.documentsScanned += 1;
    onProgress(stats);
    if (refs.size === 0) return;

    stats.documentsWithRefs += 1;
    // Publish state is inferred from path. It never moves an asset between referenced and
    // unreferenced, so the cheap check is enough for this report.
    const published = !isUnpublishedPath(item.path);
    refs.forEach((damPath) => {
      record(damPath, item.path, published);
      stats.references += 1;
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

/**
 * Flattens the usage map into sorted, renderable rows.
 * @param {Map} usage usage map from buildUsageMap
 * @returns {Object[]} one row per referenced asset, most referenced first
 */
export function toRows(usage) {
  return [...usage.entries()]
    .map(([damPath, entry]) => ({
      damPath,
      count: entry.pages.size,
      publishedCount: entry.publishedPages.size,
      pages: [...entry.pages].map(toPagePath).sort(),
    }))
    .sort((a, b) => b.count - a.count || a.damPath.localeCompare(b.damPath));
}
