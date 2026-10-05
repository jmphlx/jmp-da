/**
 * DAM Asset Usage - reconciles the Document Authoring repository against AEM Assets and
 * writes a usage indicator back onto each asset.
 *
 * The scan always reports before it writes. Applying is a separate, explicit action, and
 * only assets whose usage actually changed are written, so re-running the scan on an
 * unchanged site touches nothing in the DAM.
 */

// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import addAppAccessControl from '../access-control/access-control.js';
import { createRateLimiter } from '../../scripts/helper.js';
import {
  DAM_ROOT,
  USAGE_STATUS,
  listAssets,
  selectDeltas,
  writeUsageMetadata,
} from './aem.js';
import { buildUsageMap } from './scan.js';
import { compareUsage, findUnmatchedRefs } from './compare.js';

const STATUS_LABELS = {
  [USAGE_STATUS.usedPublished]: 'Used - published',
  [USAGE_STATUS.usedUnpublished]: 'Used - unpublished only',
  [USAGE_STATUS.unused]: 'Unused',
};

const writeLimit = createRateLimiter(10, 1000);

let actions;
let token;
let rows = [];
let lastScannedAt = null;

function el(selector) {
  return document.querySelector(selector);
}

/** Asset paths and metadata values come from AEM, so they are escaped before templating. */
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

function setStatus(text, isError = false) {
  const status = el('.status-message');
  status.textContent = text;
  status.classList.toggle('error', isError);
}

/** The token AEM accepts may differ from the DA one; the field lets an admin override it. */
function aemToken() {
  return el('#aemToken').value.trim() || token;
}

function renderSummary(unmatched) {
  const counts = rows.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1;
    return acc;
  }, {});

  el('.summary').innerHTML = `
    <span class="pill used-published">${counts[USAGE_STATUS.usedPublished] ?? 0} used - published</span>
    <span class="pill used-unpublished">${counts[USAGE_STATUS.usedUnpublished] ?? 0} used - unpublished only</span>
    <span class="pill unused">${counts[USAGE_STATUS.unused] ?? 0} unused</span>
    <span class="pill neutral">${rows.length} assets scanned</span>
    ${unmatched.length
    ? `<span class="pill warn">${unmatched.length} references to assets outside this folder</span>`
    : ''}
  `;
}

function renderTable() {
  const body = el('.results tbody');
  body.innerHTML = '';

  rows.forEach((row) => {
    const tr = document.createElement('tr');
    const changed = row.currentStatus !== row.status || row.currentCount !== row.count;

    const pagesLabel = row.pages.length
      ? row.pages.map((page) => page.replace(/^\/[^/]+\/[^/]+/, '')).join('\n')
      : '-';

    tr.innerHTML = `
      <td class="path">${escapeHtml(row.path)}</td>
      <td><span class="badge ${row.status}">${STATUS_LABELS[row.status]}</span></td>
      <td class="count">${row.count}</td>
      <td class="pages" title="${escapeHtml(pagesLabel)}">${row.pages.length ? `${row.pages.length} page(s)` : '-'}</td>
      <td class="current">${escapeHtml(row.currentStatus ?? 'not set')}</td>
      <td class="changed">${changed ? 'yes' : 'no'}</td>
    `;
    body.appendChild(tr);
  });

  const deltas = selectDeltas(rows);
  const applyButton = el('#applyButton');
  applyButton.disabled = deltas.length === 0;
  applyButton.textContent = deltas.length
    ? `Apply ${deltas.length} change(s) to DAM`
    : 'Nothing to apply';
  el('#exportButton').disabled = rows.length === 0;
}

async function runScan() {
  rows = [];
  el('.results tbody').innerHTML = '';
  el('#applyButton').disabled = true;
  el('#exportButton').disabled = true;

  const folder = el('#damFolder').value.trim() || DAM_ROOT;
  const verifyPublishStatus = el('#verifyPublish').checked;

  try {
    setStatus('Listing DAM assets...');
    const assets = await listAssets({ folder, token: aemToken() });

    setStatus(`Found ${assets.length} assets. Crawling Document Authoring...`);
    const { usage, stats } = await buildUsageMap({
      actions,
      token,
      verifyPublishStatus,
      onProgress: (progress) => {
        setStatus(`Crawling Document Authoring... ${progress.pagesScanned} pages scanned`);
      },
    });

    lastScannedAt = new Date().toISOString();
    rows = compareUsage({ assets, usage, scannedAt: lastScannedAt });
    const unmatched = findUnmatchedRefs(usage, assets);

    renderSummary(unmatched);
    renderTable();

    const failed = stats.pagesFailed
      ? ` ${stats.pagesFailed} page(s) could not be read - results may be incomplete.`
      : '';
    setStatus(`Scanned ${stats.pagesScanned} pages.${failed}`, stats.pagesFailed > 0);
  } catch (error) {
    setStatus(`Scan failed: ${error.message}`, true);
  }
}

async function applyChanges() {
  const deltas = selectDeltas(rows);
  if (!deltas.length) return;

  // eslint-disable-next-line no-alert
  const confirmed = window.confirm(
    `Write usage metadata to ${deltas.length} asset(s) in the DAM? This updates each asset's modified date.`,
  );
  if (!confirmed) return;

  el('#applyButton').disabled = true;
  let written = 0;
  let failed = 0;

  await Promise.all(deltas.map((row) => writeLimit(async () => {
    try {
      await writeUsageMetadata({
        damPath: row.path,
        status: row.status,
        count: row.count,
        scannedAt: lastScannedAt,
        token: aemToken(),
      });
      row.currentStatus = row.status;
      row.currentCount = row.count;
      written += 1;
    } catch {
      failed += 1;
    }
    setStatus(`Applying... ${written + failed} of ${deltas.length}`);
  })));

  renderTable();
  setStatus(
    `Applied ${written} change(s).${failed ? ` ${failed} failed.` : ''}`,
    failed > 0,
  );
}

function exportCsv() {
  const header = ['Asset path', 'Status', 'Pages using', 'Referencing pages', 'Previous status'];
  const body = rows.map((row) => [
    row.path,
    row.status,
    row.count,
    row.pages.join(' | '),
    row.currentStatus ?? '',
  ]);

  const csv = [header, ...body]
    .map((cols) => cols.map((col) => `"${String(col).replaceAll('"', '""')}"`).join(','))
    .join('\n');

  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  link.download = `dam-asset-usage-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

async function init() {
  const sdk = await DA_SDK;
  actions = sdk.actions;
  token = sdk.token;

  el('#damFolder').value = DAM_ROOT;
  el('#scanButton').addEventListener('click', runScan);
  el('#applyButton').addEventListener('click', applyChanges);
  el('#exportButton').addEventListener('click', exportCsv);
}

async function startApp() {
  const hasAccess = await addAppAccessControl();
  if (hasAccess) {
    await init();
  }
}
startApp();
