/**
 * DAM Asset References - lists every DAM asset referenced by Document Authoring content.
 *
 * Read only. It opens documents and reports what they link; it writes nothing to DA or to
 * AEM, and needs no AEM credentials, so it runs without the CORS policy and metadata schema
 * that a writeback tool would require.
 */

// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import { buildUsageMap, toRows } from './scan.js';
import {
  downloadCsv, downloadXlsx, editUrl, liveUrl,
} from './export.js';
import { buildFolderTree, renderFolderTree } from './asset-tree.js';

let actions;
let rows = [];
let stats = null;
let filtered = [];
/** Selected DAM folder, or null for everything. */
let folder = null;

function el(selector) {
  return document.querySelector(selector);
}

function fmt(n) {
  return Number(n).toLocaleString();
}

/** Asset and document paths are author supplied, so they are escaped before templating. */
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

function setBusy(busy) {
  el('#scanButton').disabled = busy;
  el('#scanButton').textContent = busy ? 'Scanning…' : 'Scan repository';
}

function enableExports(enabled) {
  el('#csvButton').disabled = !enabled;
  el('#xlsxButton').disabled = !enabled;
}

function renderSummary() {
  if (!stats) return;
  const references = rows.reduce((total, r) => total + r.count, 0);
  el('.summary').innerHTML = `
    <span class="pill">${fmt(rows.length)} assets referenced</span>
    <span class="pill">${fmt(references)} references</span>
    <span class="pill">${fmt(stats.documentsWithRefs)} of ${fmt(stats.documentsScanned)} documents</span>
    ${stats.documentsFailed
    ? `<span class="pill warn">${fmt(stats.documentsFailed)} documents failed to load</span>`
    : ''}
  `;
}

/** Builds one asset's document list. Deferred until expanded: 14,000 links up front is what
 *  made rendering the whole list slow, not the rows themselves. */
function fillPages(cell, row) {
  const list = document.createElement('ul');
  list.className = 'pages';
  list.innerHTML = row.pages.map((page) => `
    <li>
      <span class="page-path">${escapeHtml(page)}</span>
      <a href="${escapeHtml(editUrl(page))}" target="_blank" rel="noopener">edit</a>
      <a href="${escapeHtml(liveUrl(page))}" target="_blank" rel="noopener">live</a>
    </li>`).join('');
  cell.append(list);
}

function renderRows() {
  const body = el('.results tbody');

  body.innerHTML = filtered.map((row, index) => `
      <tr class="asset-row">
        <td class="asset-path">${escapeHtml(row.damPath)}</td>
        <td class="num">${fmt(row.count)}</td>
        <td class="num">${fmt(row.publishedCount)}</td>
        <td><button type="button" class="link-button" data-i="${index}" aria-expanded="false">Show documents</button></td>
      </tr>
      <tr class="pages-row" hidden><td colspan="4"></td></tr>`).join('');

  el('.result-count').textContent = `${fmt(filtered.length)} assets${
    folder ? ` in ${folder}` : ''
  }${filtered.length === rows.length ? '.' : ` of ${fmt(rows.length)}.`}`;

  body.querySelectorAll('.link-button').forEach((button) => {
    button.addEventListener('click', () => {
      const pagesRow = button.closest('tr').nextElementSibling;
      const cell = pagesRow.firstElementChild;
      const open = !pagesRow.hidden;
      if (!open && !cell.hasChildNodes()) fillPages(cell, filtered[Number(button.dataset.i)]);
      pagesRow.hidden = open;
      button.setAttribute('aria-expanded', String(!open));
      button.textContent = open ? 'Show documents' : 'Hide documents';
    });
  });
}

/** Orders the visible rows. Fewest-first surfaces the single-use tail. */
function sortRows(list) {
  const order = el('#sortOrder').value;
  const byPath = (a, b) => a.damPath.localeCompare(b.damPath);
  if (order === 'path') return [...list].sort(byPath);
  if (order === 'least') return [...list].sort((a, b) => a.count - b.count || byPath(a, b));
  return [...list].sort((a, b) => b.count - a.count || byPath(a, b));
}

/** Reflects the chosen folder in the controls and narrows the list to it. */
function applyFolder() {
  el('#folderCurrent').textContent = folder ?? 'All folders';
  el('#folderClear').hidden = !folder;
  const scoped = folder
    ? rows.filter((row) => row.damPath.startsWith(`${folder}/`))
    : rows;
  filtered = sortRows(scoped);
  renderRows();
}

/** Rows the exports cover, and the label recorded in the workbook's Summary sheet. */
function exportSelection() {
  const everything = el('#exportScope').value === 'all';
  if (everything || !folder) {
    return { rows, scope: 'Every referenced asset' };
  }
  return { rows: filtered, scope: `Folder ${folder}` };
}

function selectFolder(path) {
  folder = path;
  const modal = el('#folderModal');
  // Clear is reachable with the dialog shut, and close() on a shut dialog throws in older engines.
  if (modal.open) modal.close();
  applyFolder();
}

function openFolderPicker() {
  renderFolderTree(el('#folderTree'), buildFolderTree(rows), selectFolder);
  el('#folderModal').showModal();
}

async function scan() {
  setBusy(true);
  enableExports(false);
  setStatus('Crawling the repository. This reads every page and sheet, so it takes a few minutes.');
  el('.results tbody').innerHTML = '';
  el('.summary').innerHTML = '';
  el('.result-count').textContent = '';

  try {
    const result = await buildUsageMap({
      actions,
      onProgress: (progress) => {
        if (progress.documentsScanned % 25 !== 0) return;
        setStatus(`Scanned ${fmt(progress.documentsScanned)} documents, `
          + `${fmt(progress.references)} references so far…`);
      },
    });
    stats = result.stats;
    rows = toRows(result.usage);
    folder = null;

    renderSummary();
    applyFolder();
    el('#folderButton').disabled = rows.length === 0;
    enableExports(rows.length > 0);
    setStatus(stats.documentsFailed
      ? `Done, but ${fmt(stats.documentsFailed)} documents could not be read. `
        + 'Their references are missing from this report.'
      : 'Done.');
  } catch (error) {
    setStatus(`Scan failed: ${error.message}`, true);
  } finally {
    setBusy(false);
  }
}

async function exportXlsx() {
  const button = el('#xlsxButton');
  button.disabled = true;
  const original = button.textContent;
  button.textContent = 'Building…';
  try {
    const selection = exportSelection();
    await downloadXlsx(selection.rows, stats, selection.scope);
    setStatus(`Excel workbook downloaded - ${selection.scope.toLowerCase()}.`);
  } catch (error) {
    setStatus(`Excel export failed: ${error.message}`, true);
  } finally {
    button.textContent = original;
    button.disabled = false;
  }
}

(async function init() {
  ({ actions } = await DA_SDK);
  el('#scanButton').addEventListener('click', scan);
  el('#folderButton').addEventListener('click', openFolderPicker);
  el('#folderClear').addEventListener('click', () => selectFolder(null));
  el('#sortOrder').addEventListener('change', applyFolder);
  el('#csvButton').addEventListener('click', () => {
    const selection = exportSelection();
    downloadCsv(selection.rows, stats);
    setStatus(`Two CSV files downloaded - ${selection.scope.toLowerCase()}: `
      + 'the asset list and the reference list.');
  });
  el('#xlsxButton').addEventListener('click', exportXlsx);
  enableExports(false);
  setStatus('Ready. The scan covers the whole repository, which is what makes the result trustworthy.');
}());
