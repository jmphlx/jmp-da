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
import { buildFolderTree, refreshMarks, renderFolderTree } from './asset-tree.js';

let actions;
let rows = [];
let stats = null;
let filtered = [];
/** Selected DAM folders applied to the list. Empty means everything. */
let folders = [];
/** The picker's working selection, committed to `folders` only on apply. */
let draft = [];

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

  let where = '';
  if (folders.length === 1) where = ` in ${folders[0]}`;
  else if (folders.length > 1) where = ` across ${folders.length} folders`;
  const outOf = filtered.length === rows.length ? '.' : ` of ${fmt(rows.length)}.`;
  el('.result-count').textContent = `${fmt(filtered.length)} assets${where}${outOf}`;

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

/** Numeric so jmp-9 precedes jmp-10, which is what a human reads as A to Z. */
const PATH_COLLATOR = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

/**
 * Orders the visible rows.
 *
 * "Fewest references" and "path A to Z" look alike for the first several hundred rows: most
 * assets are referenced once, and that sort tie-breaks on path, so the head of both lists is
 * the same alphabetical run. The header marker exists so the active order stays legible even
 * when the rows barely move.
 */
function sortRows(list) {
  const order = el('#sortOrder').value;
  const byPath = (a, b) => PATH_COLLATOR.compare(a.damPath, b.damPath);
  if (order === 'path') return [...list].sort(byPath);
  if (order === 'least') return [...list].sort((a, b) => a.count - b.count || byPath(a, b));
  return [...list].sort((a, b) => b.count - a.count || byPath(a, b));
}

/** Marks the column the list is ordered by, so switching sorts is visible. */
function renderSortMarker() {
  const order = el('#sortOrder').value;
  el('#thAsset').textContent = order === 'path' ? 'Asset  A\u2192Z' : 'Asset';
  if (order === 'least') el('#thDocs').textContent = 'Documents \u2191';
  else if (order === 'refs') el('#thDocs').textContent = 'Documents \u2193';
  else el('#thDocs').textContent = 'Documents';
}

/*
 * The folder controls are mutually recursive by nature: a chip toggles the selection, which
 * re-renders the chips and the tree. Function declarations hoist, so the order below is safe;
 * the rule is relaxed rather than the cycle contrived away.
 */
/* eslint-disable no-use-before-define */

/** One removable chip per applied folder. Clicking a chip drops that folder. */
function renderChips() {
  const host = el('#folderChips');
  host.innerHTML = '';
  if (folders.length === 0) {
    const none = document.createElement('span');
    none.className = 'folder-current';
    none.textContent = 'All folders';
    host.append(none);
    return;
  }

  folders.forEach((path) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.title = `${path} - click to remove`;
    chip.setAttribute('aria-label', `Remove folder ${path} from the filter`);
    const label = document.createElement('span');
    label.textContent = path.replace('/content/dam/', '');
    const cross = document.createElement('span');
    cross.className = 'chip-x';
    cross.textContent = '\u00d7';
    cross.setAttribute('aria-hidden', 'true');
    chip.append(label, cross);
    chip.addEventListener('click', () => {
      folders = folders.filter((f) => f !== path);
      applyFilters();
    });
    host.append(chip);
  });

  if (folders.length > 1) {
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'link-button';
    clear.textContent = `Clear all ${folders.length}`;
    clear.addEventListener('click', () => {
      folders = [];
      applyFilters();
    });
    host.append(clear);
  }
}

/** Narrows the list to the union of the selected folders. */
function applyFilters() {
  renderChips();
  renderSortMarker();
  const scoped = folders.length
    ? rows.filter((row) => folders.some((f) => row.damPath.startsWith(`${f}/`)))
    : rows;
  filtered = sortRows(scoped);
  renderRows();
}

/** Rows the exports cover, and the label recorded in the workbook's Summary sheet. */
function exportSelection() {
  const everything = el('#exportScope').value === 'all';
  if (everything || folders.length === 0) {
    return { rows, scope: 'Every referenced asset', folders: [] };
  }
  const scope = folders.length === 1
    ? `Folder ${folders[0]}`
    : `${folders.length} folders: ${folders.join(', ')}`;
  return { rows: filtered, scope, folders };
}

/** Summarises the working selection beside the apply button. */
function renderDraftCount() {
  const count = draft.length;
  let text = 'No folders ticked - apply to show everything';
  if (count === 1) text = '1 folder ticked';
  else if (count > 1) text = `${count} folders ticked`;
  el('#folderDraftCount').textContent = text;
}

/**
 * Ticks or unticks a folder in the working selection.
 *
 * The list is not re-filtered here and the tree is not re-rendered: only the marks are
 * repainted, so folders the user opened stay open and the expensive re-filter happens once,
 * on apply.
 */
function toggleDraft(path) {
  draft = draft.includes(path)
    ? draft.filter((f) => f !== path)
    // A ticked parent already covers its children, so drop those rather than list them.
    : [...draft.filter((f) => !f.startsWith(`${path}/`)), path];
  refreshMarks(el('#folderTree'), draft);
  renderDraftCount();
}

function clearDraft() {
  draft = [];
  refreshMarks(el('#folderTree'), draft);
  renderDraftCount();
}

function applyDraft() {
  folders = [...draft];
  el('#folderModal').close();
  applyFilters();
}

function openFolderPicker() {
  draft = [...folders];
  el('#folderModal').showModal();
  renderFolderTree(el('#folderTree'), buildFolderTree(rows), {
    selected: () => draft,
    onToggle: toggleDraft,
    onClear: clearDraft,
  });
  renderDraftCount();
}

/* eslint-enable no-use-before-define */

async function scan() {
  setBusy(true);
  enableExports(false);
  setStatus('Crawling the repository. This reads every page and sheet, so it takes a few minutes.');
  // Drop the previous result outright. A failed scan used to leave the folder tree and the
  // rows behind, so the picker still offered folders from a run the status line said had failed.
  rows = [];
  filtered = [];
  folders = [];
  draft = [];
  stats = null;
  el('#folderButton').disabled = true;
  renderChips();
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
    folders = [];

    renderSummary();
    applyFilters();
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
    await downloadXlsx(selection.rows, stats, selection.scope, selection.folders);
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
  el('#sortOrder').addEventListener('change', applyFilters);
  el('#folderApply').addEventListener('click', applyDraft);
  el('#folderCancel').addEventListener('click', () => el('#folderModal').close());
  el('#csvButton').addEventListener('click', () => {
    const selection = exportSelection();
    const names = downloadCsv(selection.rows, selection.folders);
    setStatus(`Downloaded ${names.join(' and ')}.`);
  });
  el('#xlsxButton').addEventListener('click', exportXlsx);
  enableExports(false);
  setStatus('Ready. The scan covers the whole repository, which is what makes the result trustworthy.');
}());
