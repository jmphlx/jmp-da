/**
 * Pure reconciliation logic, kept free of the DA crawl import so it can be unit tested.
 */

import { USAGE_STATUS } from './aem.js';
import { DA_CONSTANTS } from '../../scripts/helper.js';

const REPO_ROOT = `/${DA_CONSTANTS.org}/${DA_CONSTANTS.repo}`;

/**
 * Converts a DA source path into the page path the status API expects.
 * @param {string} daPath e.g. /jmphlx/jmp-da/en/home.html
 * @returns {string} e.g. en/home.html
 */
export function toPagePath(daPath) {
  return daPath.replace(`${REPO_ROOT}/`, '');
}

/**
 * Joins the DAM inventory to the crawled usage map.
 *
 * An asset referenced only from draft or sandbox pages is reported separately from one on
 * a live page. Both are in use, but only the first is safe to consider for cleanup, and
 * collapsing them into a single "used" value would hide the distinction that makes the
 * report actionable.
 * @param {Object} options options
 * @param {Object[]} options.assets records from the AEM inventory
 * @param {Map} options.usage usage map from buildUsageMap
 * @param {string} options.scannedAt ISO timestamp
 * @returns {Object[]} one row per asset
 */
export function compareUsage({ assets, usage, scannedAt }) {
  return assets.map((asset) => {
    const entry = usage.get(asset.path);
    const pages = entry ? [...entry.pages] : [];

    let status = USAGE_STATUS.unused;
    if (pages.length > 0) {
      status = entry.publishedPages.size > 0
        ? USAGE_STATUS.usedPublished
        : USAGE_STATUS.usedUnpublished;
    }

    return {
      ...asset,
      status,
      count: pages.length,
      pages,
      scannedAt,
    };
  });
}

/**
 * DAM paths referenced by content but absent from the scanned inventory.
 *
 * Usually these are assets outside the scoped folder, but a reference matching nothing
 * anywhere points at a deleted asset or a broken link, so it is surfaced rather than
 * silently dropped.
 * @param {Map} usage usage map
 * @param {Object[]} assets inventory records
 * @returns {string[]} unmatched DAM paths
 */
export function findUnmatchedRefs(usage, assets) {
  const known = new Set(assets.map((asset) => asset.path));
  return [...usage.keys()].filter((damPath) => !known.has(damPath));
}
