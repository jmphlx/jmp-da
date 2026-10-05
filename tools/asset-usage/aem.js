/**
 * AEM Assets client for reading the DAM inventory and writing usage metadata back.
 *
 * Everything AEM-specific is collected here so the endpoints, property names and auth
 * can be adjusted in one place. Two calls are used:
 *   - QueryBuilder to enumerate assets under a folder, including whatever usage values
 *     they already carry, so the apply step can write deltas only.
 *   - The Assets HTTP API to update an asset's metadata node.
 *
 * Both run against the AEM author tier, which needs a CORS policy allowing the da.live
 * origin with credentials and the authorization header before a browser can reach them.
 */

export const AEM_AUTHOR_ORIGIN = 'https://author-p107857-e1299068.adobeaemcloud.com';
export const QUERY_BUILDER_PATH = '/bin/querybuilder.json';
export const ASSETS_API_PATH = '/api/assets';
export const DAM_ROOT = '/content/dam/jmp';

/**
 * Metadata properties written onto each asset. These must also be declared in the AEM
 * Assets metadata schema for them to render in the asset details panel, and indexed for
 * the usage facet to be filterable.
 */
export const USAGE_PROPS = {
  status: 'jmp:daUsageStatus',
  count: 'jmp:daUsageCount',
  scannedAt: 'jmp:daUsageScannedAt',
};

export const USAGE_STATUS = {
  usedPublished: 'used-published',
  usedUnpublished: 'used-unpublished',
  unused: 'unused',
};

/**
 * Maps a DAM repository path onto its Assets HTTP API equivalent.
 * The API is rooted at /api/assets, which corresponds to /content/dam.
 * @param {string} damPath canonical /content/dam/... path
 * @returns {string} Assets API path
 */
export function toAssetsApiPath(damPath) {
  return `${ASSETS_API_PATH}${damPath.replace('/content/dam', '')}`;
}

/**
 * Reads a selective QueryBuilder hit into a flat record.
 * Hit shape varies with how AEM nests the requested properties, so both the flattened
 * and the nested forms are accepted.
 * @param {Object} hit raw QueryBuilder hit
 * @returns {Object} asset record
 */
export function flattenHit(hit) {
  const metadata = hit?.['jcr:content']?.metadata ?? {};
  const read = (prop) => hit?.[prop] ?? metadata?.[prop];

  return {
    path: hit?.['jcr:path'] ?? hit?.path,
    currentStatus: read(USAGE_PROPS.status) ?? null,
    currentCount: Number(read(USAGE_PROPS.count) ?? 0) || 0,
  };
}

/**
 * Enumerates every asset under a DAM folder along with its existing usage values.
 * @param {Object} options options
 * @param {string} options.folder DAM folder to enumerate
 * @param {string} options.token bearer token accepted by AEM author
 * @param {Function} [options.fetchFn] injectable fetch, for tests
 * @returns {Promise<Object[]>} asset records
 */
export async function listAssets({ folder = DAM_ROOT, token, fetchFn = fetch }) {
  const params = new URLSearchParams({
    path: folder,
    type: 'dam:Asset',
    'p.limit': '-1',
    'p.hits': 'selective',
    'p.properties': [
      'jcr:path',
      `jcr:content/metadata/${USAGE_PROPS.status}`,
      `jcr:content/metadata/${USAGE_PROPS.count}`,
    ].join(' '),
  });

  const url = `${AEM_AUTHOR_ORIGIN}${QUERY_BUILDER_PATH}?${params}`;
  const resp = await fetchFn(url, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });

  if (!resp.ok) {
    throw new Error(`AEM asset listing failed (${resp.status}). ${await resp.text()}`);
  }

  const body = await resp.json();
  return (body.hits ?? []).map(flattenHit).filter((asset) => asset.path);
}

/**
 * Writes usage metadata onto a single asset.
 * @param {Object} options options
 * @param {string} options.damPath canonical /content/dam/... path
 * @param {string} options.status one of USAGE_STATUS
 * @param {number} options.count number of distinct pages referencing the asset
 * @param {string} options.scannedAt ISO timestamp of the scan
 * @param {string} options.token bearer token accepted by AEM author
 * @param {Function} [options.fetchFn] injectable fetch, for tests
 * @returns {Promise<void>} resolves once written
 */
export async function writeUsageMetadata({
  damPath, status, count, scannedAt, token, fetchFn = fetch,
}) {
  const url = `${AEM_AUTHOR_ORIGIN}${toAssetsApiPath(damPath)}`;

  const resp = await fetchFn(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      class: 'asset',
      properties: {
        metadata: {
          [USAGE_PROPS.status]: status,
          [USAGE_PROPS.count]: count,
          [USAGE_PROPS.scannedAt]: scannedAt,
        },
      },
    }),
  });

  if (!resp.ok) {
    throw new Error(`Metadata write failed for ${damPath} (${resp.status})`);
  }
}

/**
 * Selects the assets whose usage values actually changed.
 * Writing every asset on every run would churn the modified date and last modifier that
 * DAM administrators read, so an unchanged asset is left untouched.
 * @param {Object[]} rows compared rows
 * @returns {Object[]} rows needing a write
 */
export function selectDeltas(rows) {
  return rows.filter((row) => row.currentStatus !== row.status
    || row.currentCount !== row.count);
}
