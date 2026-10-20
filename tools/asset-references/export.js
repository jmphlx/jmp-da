/**
 * CSV and Excel export for the asset reference report.
 *
 * The row builders are pure so they can be unit tested; only the two download helpers touch
 * the DOM. SheetJS is fetched on demand rather than on page load, because it is ~880KB and
 * most runs never export.
 */

import { DA_CONSTANTS } from '../../scripts/helper.js';

const SHEETJS_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';

export const EDIT_BASE = `${DA_CONSTANTS.editUrl}/${DA_CONSTANTS.org}/${DA_CONSTANTS.repo}/`;
export const LIVE_BASE = `${DA_CONSTANTS.mainUrl}/`;

/** The .html suffix is part of the source path but not of the edit or live URL. */
function withoutExtension(pagePath) {
  return pagePath.replace(/\.html$/, '');
}

export function editUrl(pagePath) {
  return `${EDIT_BASE}${withoutExtension(pagePath)}`;
}

export function liveUrl(pagePath) {
  return `${LIVE_BASE}${withoutExtension(pagePath)}`;
}

/**
 * Quotes a value for CSV. Asset paths do contain commas, so this is not optional.
 * @param {*} value cell value
 * @returns {string} escaped cell
 */
export function csvCell(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * Renders rows as CSV text.
 * @param {string[]} headers column headers
 * @param {Array[]} rows row values
 * @returns {string} CSV document
 */
export function toCsv(headers, rows) {
  return [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
}

/** Longest folder token allowed in a filename, before it stops being a filename. */
const MAX_TOKEN = 44;

/**
 * A short, recognisable token naming the folders an export covers.
 *
 * The last path segment is used rather than the whole path: a full path per folder makes the
 * filename unusable, and the leaf is what people recognise. Beyond three folders the rest
 * collapse into a count, for the same reason.
 * @param {string[]} folders selected DAM folder paths
 * @returns {string} token, or '' when the export covers everything
 */
export function folderToken(folders) {
  if (!Array.isArray(folders) || folders.length === 0) return '';
  const leaf = (folder) => String(folder).split('/').filter(Boolean).pop() ?? '';
  const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const parts = folders.map((f) => slug(leaf(f))).filter(Boolean);
  if (parts.length === 0) return '';

  const token = parts.length <= 3
    ? parts.join('+')
    : `${parts.slice(0, 2).join('+')}+${parts.length - 2}more`;
  return token.length > MAX_TOKEN ? `${token.slice(0, MAX_TOKEN).replace(/[+-]+$/, '')}+more` : token;
}

/**
 * Export filename: what it is, when it was taken, and which folders it covers.
 * The folder part is omitted entirely when the export covers everything.
 * @param {string} kind 'assets', 'references' or 'workbook'
 * @param {string} extension file extension without the dot
 * @param {string[]} folders selected DAM folder paths
 * @param {Date} [now] clock, injectable for tests
 * @returns {string} filename
 */
export function exportFileName(kind, extension, folders, now = new Date()) {
  const date = now.toISOString().slice(0, 10);
  const token = folderToken(folders);
  return `da-${kind}-${date}${token ? `-${token}` : ''}.${extension}`;
}

export const ASSET_HEADERS = ['Asset path', 'Folder', 'Type', 'Documents referencing it', 'Published documents'];
export const REFERENCE_HEADERS = ['Asset path', 'Referencing document', 'Edit in DA', 'Live URL'];

/** Segment of the DAM path that reads as the owning folder, e.g. /content/dam/jmp/images. */
export function folderOf(damPath) {
  const parts = damPath.split('/');
  return parts.slice(0, parts.length - 1).join('/') || damPath;
}

/** File extension, lowercased, or "(none)" when the name carries no dot. */
export function typeOf(damPath) {
  const name = damPath.split('/').pop();
  return name.includes('.') ? name.split('.').pop().toLowerCase() : '(none)';
}

/**
 * One row per referenced asset.
 * @param {Object[]} rows rows from toRows
 * @returns {Array[]} asset rows
 */
export function assetRows(rows) {
  return rows.map((r) => [
    r.damPath, folderOf(r.damPath), typeOf(r.damPath), r.count, r.publishedCount,
  ]);
}

/**
 * One row per asset-document pair, which is the shape pivot tables want.
 * @param {Object[]} rows rows from toRows
 * @returns {Array[]} reference rows
 */
export function referenceRows(rows) {
  const out = [];
  rows.forEach((r) => {
    r.pages.forEach((page) => {
      out.push([r.damPath, page, editUrl(page), liveUrl(page)]);
    });
  });
  return out;
}

/**
 * Summary rows describing the run, so an exported file explains itself.
 * @param {Object} stats crawl stats
 * @param {Object[]} rows rows from toRows
 * @returns {Array[]} label/value pairs
 */
export function summaryRows(stats, rows, scope = 'Every referenced asset') {
  const references = rows.reduce((total, r) => total + r.count, 0);
  return [
    ['Scanned', new Date().toISOString().slice(0, 10)],
    ['Repository', `${DA_CONSTANTS.org}/${DA_CONSTANTS.repo}`],
    ['This export covers', scope],
    ['Documents scanned', stats.documentsScanned],
    ['Documents that failed to load', stats.documentsFailed],
    ['Documents referencing at least one asset', stats.documentsWithRefs],
    ['Distinct DAM assets referenced', rows.length],
    ['Total references', references],
    ['', ''],
    ['Evidence', 'Document Authoring only. An asset absent from this report is unreferenced '
      + 'by DA, which is not the same as unused - links from email, the JMP Community or the '
      + 'JMP application are invisible here.'],
    ['Deduplication', 'References are counted once per document, so a <picture> emitting the '
      + 'same asset three times counts once.'],
  ];
}

function triggerDownload(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Revoking immediately can cancel the download in some browsers; a tick is enough.
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

/**
 * Saves the asset list and the long-form reference list as two CSV files.
 * @param {Object[]} rows rows from toRows
 * @param {string[]} folders folders the export covers, for the filename
 * @returns {string[]} the filenames offered
 */
export function downloadCsv(rows, folders) {
  const names = [
    exportFileName('assets', 'csv', folders),
    exportFileName('references', 'csv', folders),
  ];
  triggerDownload(
    new Blob([toCsv(ASSET_HEADERS, assetRows(rows))], { type: 'text/csv;charset=utf-8;' }),
    names[0],
  );
  triggerDownload(
    new Blob([toCsv(REFERENCE_HEADERS, referenceRows(rows))], { type: 'text/csv;charset=utf-8;' }),
    names[1],
  );
  return names;
}

let sheetJsPromise = null;

/** Loads SheetJS once, on first export. */
export function loadSheetJs() {
  if (window.XLSX) return Promise.resolve(window.XLSX);
  if (!sheetJsPromise) {
    sheetJsPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SHEETJS_SRC;
      script.onload = () => resolve(window.XLSX);
      script.onerror = () => {
        sheetJsPromise = null;
        reject(new Error('Could not load the Excel library.'));
      };
      document.head.appendChild(script);
    });
  }
  return sheetJsPromise;
}

/**
 * Saves a three sheet workbook: what the run was, the assets, and the references.
 * @param {Object[]} rows rows from toRows
 * @param {Object} stats crawl stats
 * @param {string} [scope] what the export covers, recorded on the Summary sheet
 * @param {string[]} [folders] folders the export covers, for the filename
 * @returns {Promise<void>} resolves once the download has been offered
 */
export async function downloadXlsx(rows, stats, scope, folders) {
  const XLSX = await loadSheetJs();
  const book = XLSX.utils.book_new();

  const summary = XLSX.utils.aoa_to_sheet(summaryRows(stats, rows, scope));
  summary['!cols'] = [{ wch: 42 }, { wch: 96 }];
  XLSX.utils.book_append_sheet(book, summary, 'Summary');

  const assets = XLSX.utils.aoa_to_sheet([ASSET_HEADERS, ...assetRows(rows)]);
  assets['!cols'] = [{ wch: 72 }, { wch: 46 }, { wch: 10 }, { wch: 22 }, { wch: 20 }];
  assets['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: 4, r: rows.length } }) };
  XLSX.utils.book_append_sheet(book, assets, 'Referenced assets');

  const refs = referenceRows(rows);
  const references = XLSX.utils.aoa_to_sheet([REFERENCE_HEADERS, ...refs]);
  references['!cols'] = [{ wch: 72 }, { wch: 54 }, { wch: 60 }, { wch: 60 }];
  references['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: 3, r: refs.length } }) };
  XLSX.utils.book_append_sheet(book, references, 'References');

  const data = XLSX.write(book, { bookType: 'xlsx', type: 'array' });
  triggerDownload(
    new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    exportFileName('workbook', 'xlsx', folders),
  );
}
