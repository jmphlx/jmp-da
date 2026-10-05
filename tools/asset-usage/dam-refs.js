/**
 * Extraction and canonicalization of DAM references found in Document Authoring sources.
 *
 * DA stores DAM references as absolute URLs, and more than one host is in play: existing
 * content points at the AEM publish tier and at www.jmp.com, while assets inserted through
 * Content Advisor point at the AEM author tier. All of them resolve to the same
 * /content/dam/... path, which is the key AEM Assets indexes on, so the path is what we
 * match on rather than the URL.
 *
 * Helix rewrites these references to media_<hash> blobs at preview/publish time, so usage
 * has to be read from the DA source. The rendered page has no DAM reference left in it.
 */

export const DAM_PATH_PREFIX = '/content/dam/';

/**
 * Hosts observed carrying DAM paths in this repo. Informational only -- matching keys off
 * the pathname, so a new host starts working without a code change.
 */
export const KNOWN_DAM_HOSTS = [
  'publish-p107857-e1299068.adobeaemcloud.com',
  'author-p107857-e1299068.adobeaemcloud.com',
  'www.jmp.com',
];

/** Subtrees excluded from the published indexes in configurations/query.yaml. */
export const UNPUBLISHED_SEGMENTS = ['/drafts/', '/sandbox/'];

/**
 * Reduces a DAM reference of any shape to the canonical repository path.
 * Absolute, protocol-relative and root-relative references are all accepted; query
 * strings and fragments are dropped, and percent-escapes are decoded so that a path
 * compares equal to the one AEM reports.
 * @param {string} rawUrl reference as authored
 * @returns {string|null} canonical /content/dam/... path, or null if not a DAM reference
 */
export function normalizeDamPath(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  let pathname;
  try {
    // The base only matters for relative refs; we never read the host back out.
    ({ pathname } = new URL(trimmed, 'https://placeholder.invalid'));
  } catch {
    return null;
  }

  if (!pathname.startsWith(DAM_PATH_PREFIX)) return null;

  try {
    return decodeURIComponent(pathname);
  } catch {
    // Malformed escape sequence; the raw pathname is still a usable key.
    return pathname;
  }
}

/**
 * Pulls the URLs out of a srcset attribute, discarding the width/density descriptors.
 * @param {string} value raw srcset attribute
 * @returns {string[]} candidate URLs
 */
export function parseSrcset(value) {
  if (!value || typeof value !== 'string') return [];
  return value
    .split(',')
    .map((candidate) => candidate.trim().split(/\s+/)[0])
    .filter(Boolean);
}

/**
 * Collects every distinct DAM asset a document references.
 *
 * Deduplication matters rather than merely being tidy: a <picture> emits the same asset
 * across two or three source/img elements, so counting raw matches inflates usage roughly
 * threefold. One page contributes one reference per asset.
 * @param {Document} doc parsed DA source
 * @returns {Set<string>} canonical DAM paths
 */
export function extractDamRefs(doc) {
  const paths = new Set();
  if (!doc) return paths;

  const add = (raw) => {
    const damPath = normalizeDamPath(raw);
    if (damPath) paths.add(damPath);
  };

  doc.querySelectorAll('[src]').forEach((el) => add(el.getAttribute('src')));
  doc.querySelectorAll('[href]').forEach((el) => add(el.getAttribute('href')));
  doc.querySelectorAll('[srcset]').forEach((el) => {
    parseSrcset(el.getAttribute('srcset')).forEach(add);
  });

  return paths;
}

/**
 * Parses a DA source document into a DOM.
 * @param {string} html raw source
 * @returns {Document} parsed document
 */
export function parseHtml(html) {
  return new DOMParser().parseFromString(html, 'text/html');
}

/**
 * Whether a DA path lives in a subtree that is never published.
 * Used as the cheap fallback when publish-status lookups are switched off.
 * @param {string} path DA path
 * @returns {boolean} true when the path is draft or sandbox content
 */
export function isUnpublishedPath(path) {
  if (!path) return false;
  return UNPUBLISHED_SEGMENTS.some((segment) => path.includes(segment));
}
