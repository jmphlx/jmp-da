/**
 * Joins the DA scan to the live DAM inventory.
 *
 * Every asset ends up in exactly one of three states. Kept pure so it can be unit tested.
 */

export const STATUS = {
  referenced: 'referenced',
  unreferenced: 'unreferenced',
  missing: 'missing',
};

export const STATUS_LABELS = {
  [STATUS.referenced]: 'Referenced',
  [STATUS.unreferenced]: 'Unreferenced',
  [STATUS.missing]: 'Missing from DAM',
};

/**
 * Classifies every DAM asset, plus every DA reference that points at nothing in the DAM.
 *
 * "Missing" means the path is absent from the author DAM. It does not mean visitors see a
 * broken image: an asset deleted on author without being unpublished first stays live on the
 * publish tier, so the page can still render it.
 * @param {Object[]} usageRows rows from toRows - DAM paths DA references, with locations
 * @param {Set<string>} inventory every managed asset path in the DAM
 * @returns {Object[]} one row per asset or dangling reference, each carrying a status
 */
export function compareWithDam(usageRows, inventory) {
  const referenced = new Map((usageRows ?? []).map((row) => [row.damPath, row]));
  const out = [];

  (inventory ?? new Set()).forEach((damPath) => {
    const row = referenced.get(damPath);
    out.push(row
      ? { ...row, status: STATUS.referenced }
      : {
        damPath, count: 0, publishedCount: 0, pages: [], status: STATUS.unreferenced,
      });
  });

  (usageRows ?? []).forEach((row) => {
    if (!inventory?.has(row.damPath)) out.push({ ...row, status: STATUS.missing });
  });

  return out;
}

/**
 * Rows when the DAM could not be read: DA references only, all marked referenced, since
 * that is everything the scan can vouch for.
 * @param {Object[]} usageRows rows from toRows
 * @returns {Object[]} rows carrying a status
 */
export function referencesOnly(usageRows) {
  return (usageRows ?? []).map((row) => ({ ...row, status: STATUS.referenced }));
}

/**
 * Counts per status, for the summary and the export.
 * @param {Object[]} rows compared rows
 * @returns {Object} { referenced, unreferenced, missing, inDam }
 */
export function tally(rows) {
  const counts = { referenced: 0, unreferenced: 0, missing: 0 };
  (rows ?? []).forEach((row) => { counts[row.status] = (counts[row.status] ?? 0) + 1; });
  return { ...counts, inDam: counts.referenced + counts.unreferenced };
}
