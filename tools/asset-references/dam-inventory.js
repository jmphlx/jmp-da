/**
 * Reads the live DAM inventory from AEM author.
 *
 * The tool runs in an iframe served from the site's own preview origin
 * (https://<ref>--jmp-da--jmphlx.preview.da.live, or .aem.live), not from da.live. Author
 * already allowlists those origins for cross-origin GET, and accepts the IMS token DA hands
 * the app because the environment sets ADOBE_PROVIDED_CLIENT_ID=darkalley. So the inventory
 * can be read with the viewer's own DA session: no stored credential, nothing written.
 *
 * Paging is by offset, which is only sound when the result order is stable, so the query is
 * ordered by path and rows are keyed by path. The collected count is then checked against the
 * server's own total, so a paging fault is reported rather than silently shrinking the DAM.
 */

export const AEM_AUTHOR_ORIGIN = 'https://author-p107857-e1299068.adobeaemcloud.com';
export const INVENTORY_ROOT = '/content/dam';
export const PAGE_SIZE = 2000;

const QUERY_BUILDER = '/bin/querybuilder.json';

/** Raised for anything that stops the inventory being read, carrying the HTTP status. */
export class InventoryError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'InventoryError';
    this.status = status;
  }
}

/**
 * QueryBuilder URL for one page of the inventory.
 * @param {number} offset first row of the page
 * @param {number} [pageSize] rows per page
 * @returns {string} absolute URL
 */
export function inventoryUrl(offset, pageSize = PAGE_SIZE) {
  const params = new URLSearchParams({
    path: INVENTORY_ROOT,
    type: 'dam:Asset',
    orderby: '@jcr:path',
    'p.limit': String(pageSize),
    'p.offset': String(offset),
    'p.hits': 'selective',
    'p.properties': 'jcr:path',
  });
  return `${AEM_AUTHOR_ORIGIN}${QUERY_BUILDER}?${params}`;
}

/** QueryBuilder URL that asks only for the server's own count. */
export function totalUrl() {
  const params = new URLSearchParams({
    path: INVENTORY_ROOT,
    type: 'dam:Asset',
    'p.limit': '1',
    'p.guessTotal': '1000000',
  });
  return `${AEM_AUTHOR_ORIGIN}${QUERY_BUILDER}?${params}`;
}

/**
 * Whether a path is an asset someone manages, rather than a copy AEM keeps for itself.
 * Deleted assets park under a jcr:content/cq:discarded node, and those are not part of the
 * DAM a person browses or cleans up.
 * @param {string} path asset path
 * @returns {boolean} true for a real DAM asset
 */
export function isManagedAsset(path) {
  return typeof path === 'string'
    && path.startsWith(`${INVENTORY_ROOT}/`)
    && !path.includes('/jcr:content/');
}

/** Turns an HTTP failure into something a person can act on. */
function describeFailure(status) {
  if (status === 401 || status === 403) {
    return `AEM refused your session (${status}). Your account may lack access to the DAM, or `
      + 'the session expired - reload DA and try again.';
  }
  return `AEM returned ${status} while reading the DAM.`;
}

async function getJson(url, token, fetchFn) {
  let resp;
  try {
    resp = await fetchFn(url, { headers: { Authorization: `Bearer ${token}` } });
  } catch (error) {
    // A blocked cross-origin request surfaces as a TypeError with no status at all.
    throw new InventoryError(`Could not reach AEM: ${error.message}`, 0);
  }
  if (!resp.ok) throw new InventoryError(describeFailure(resp.status), resp.status);
  return resp.json();
}

/**
 * Reads every managed asset path in the DAM.
 * @param {Object} options options
 * @param {string} options.token IMS token from the DA SDK
 * @param {Function} [options.fetchFn] injectable fetch, for tests
 * @param {Function} [options.onProgress] called with the running count
 * @returns {Promise<Object>} { paths: Set, serverTotal, collected, matchesServer }
 */
export async function fetchDamInventory({ token, fetchFn = fetch, onProgress = () => {} }) {
  if (!token) throw new InventoryError('No DA session token was available to read the DAM.', 0);

  const seen = new Set();
  let offset = 0;
  // An empty page or a short page ends the walk; the guard stops a misbehaving server
  // from looping forever.
  for (let page = 0; page < 500; page += 1) {
    // eslint-disable-next-line no-await-in-loop
    const body = await getJson(inventoryUrl(offset), token, fetchFn);
    const hits = Array.isArray(body?.hits) ? body.hits : [];
    hits.forEach((hit) => {
      const path = hit?.['jcr:path'] ?? hit?.path;
      if (typeof path === 'string') seen.add(path);
    });
    onProgress(seen.size);
    if (hits.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  const totals = await getJson(totalUrl(), token, fetchFn);
  const serverTotal = Number(totals?.total);

  const paths = new Set([...seen].filter(isManagedAsset));
  return {
    paths,
    collected: seen.size,
    serverTotal: Number.isFinite(serverTotal) ? serverTotal : null,
    matchesServer: Number.isFinite(serverTotal) ? serverTotal === seen.size : null,
  };
}
