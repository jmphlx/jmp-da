import { createTag } from '../../scripts/helper.js';
import {
  getBlockConfig,
  getJsonFromUrl,
} from '../../scripts/jmp.js';

function getSortValue(formula, page) {
  const dateMatch = formula.match(/^format\(json\.(\w+)/);
  if (dateMatch) {
    const ts = Number(page[dateMatch[1]]);
    const ms = ts < 1e10 ? ts * 1000 : ts;
    return Number.isNaN(ts) ? new Date(page[dateMatch[1]]).getTime() : ms;
  }
  const propMatch = formula.match(/json\.(\w+)/);
  return propMatch ? (page[propMatch[1]] ?? '') : '';
}

function createTableHeader(config, onSort) {
  const tableHeader = createTag('thead', { class: 'dt-thead' });
  const trEl = createTag('tr');
  Object.keys(config).forEach((key) => {
    const thEl = createTag('th', { class: key }, key);
    thEl.addEventListener('click', () => {
      const ascending = thEl.dataset.sort !== 'asc';
      trEl.querySelectorAll('th').forEach((th) => { delete th.dataset.sort; });
      thEl.dataset.sort = ascending ? 'asc' : 'desc';
      onSort(key, ascending);
    });
    trEl.append(thEl);
  });
  tableHeader.append(trEl);
  return tableHeader;
}

function format(value, fmt) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  if (!fmt) return date.toLocaleDateString(undefined, { timeZone: 'UTC' });

  const pad = (n) => String(n).padStart(2, '0');
  return fmt
    .replace('YYYY', date.getUTCFullYear())
    .replace('mmm', date.toLocaleDateString(undefined, { month: 'short', timeZone: 'UTC' }))
    .replace('MM', pad(date.getUTCMonth() + 1))
    .replace('DD', pad(date.getUTCDate()));
}

const formulaFunctions = { format };

function resolveCellValue(formula, page) {
  return formula
    .replace(/(\w+)\(json\.(\w+)(?:,\s*'([^']*)')?\)/g, (_, fn, prop, fmt) => {
      const resolvedFn = formulaFunctions[fn];
      return resolvedFn ? resolvedFn(page[prop] ?? '', fmt) : page[prop] ?? '';
    })
    .replace(/json\.(\w+)/g, (_, prop) => page[prop] ?? '');
}

function createTableBody(config, rowData) {
  const tableBody = createTag('tbody');

  rowData.forEach((page) => {
    const trEl = createTag('tr');
    Object.keys(config).forEach((key) => {
      const keyValue = config[key];
      const cellValue = resolveCellValue(keyValue, page);
      const tdEl = createTag('td', { class: key });
      const dateMatch = keyValue.match(/^format\(json\.(\w+)/);
      if (dateMatch) {
        const ts = Number(page[dateMatch[1]]);
        const ms = ts < 1e10 ? ts * 1000 : ts; // convert seconds to ms if needed
        const dateMs = Number.isNaN(ts) ? new Date(page[dateMatch[1]]).getTime() : ms;
        if (!Number.isNaN(dateMs)) tdEl.dataset.sortValue = dateMs;
      }
      tdEl.innerHTML = cellValue;
      trEl.append(tdEl);
    });
    tableBody.append(trEl);
  });

  return tableBody;
}

/**
 * From the block config, remove all block properties so that
 * we just have the columns to be included in the table.
 * @param {object} config
 */
function createRowConfig(config) {
  const rowConfig = JSON.parse(JSON.stringify(config));
  delete rowConfig.source;
  delete rowConfig.path;
  delete rowConfig.pageSize;
  delete rowConfig.sortBy;
  delete rowConfig.sortOrder;
  return rowConfig;
}

export default async function decorate(block) {
  const config = getBlockConfig(block);
  block.textContent = '';
  const rowConfig = createRowConfig(config);

  let matching = [];
  const path = config.path;
  const { data: allPages } = await getJsonFromUrl(config.source);

  if (path) {
    allPages.forEach((page) => {
      if (page.path.indexOf(path) > -1) {
        matching.push(page);
      }
    });
  } else {
    matching = allPages;
  }

  const size = parseInt(config.pageSize, 10) || 0;
  let currentPage = 0;

  const totalPages = size ? Math.ceil(matching.length / size) : 1;

  const pagination = size && matching.length > size ? createTag('div', { class: 'dt-pagination' }) : null;
  const prevBtn = pagination ? createTag('button', { class: 'dt-pagination-prev' }, '') : null;
  const nextBtn = pagination ? createTag('button', { class: 'dt-pagination-next' }, '') : null;
  const pageButtons = pagination ? createTag('div', { class: 'dt-pagination-pages' }) : null;
  let tableElement;

  function renderPage(page) {
    const slice = size ? matching.slice(page * size, page * size + size) : matching;
    const newTbody = createTableBody(rowConfig, slice);
    tableElement.replaceChild(newTbody, tableElement.querySelector('tbody'));
    currentPage = page;
    if (pagination) {
      pagination.querySelectorAll('button').forEach((btn) => {
        btn.classList.toggle('active', Number(btn.dataset.page) === page);
      });
      prevBtn.disabled = page === 0;
      nextBtn.disabled = page === totalPages - 1;
    }
  }

  function onSort(key, ascending) {
    const formula = rowConfig[key];
    matching.sort((a, b) => {
      const aVal = getSortValue(formula, a);
      const bVal = getSortValue(formula, b);
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return ascending ? aVal - bVal : bVal - aVal;
      }
      return ascending
        ? String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
        : String(bVal).localeCompare(String(aVal), undefined, { numeric: true });
    });
    renderPage(0);
  }

  const sortBy = config.sortBy;
  const ascending = config.sortOrder !== 'descending';
  if (sortBy && rowConfig[sortBy]) {
    const formula = rowConfig[sortBy];
    matching.sort((a, b) => {
      const aVal = getSortValue(formula, a);
      const bVal = getSortValue(formula, b);
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return ascending ? aVal - bVal : bVal - aVal;
      }
      return ascending
        ? String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
        : String(bVal).localeCompare(String(aVal), undefined, { numeric: true });
    });
  }

  tableElement = createTag('table', { class: 'datatable' });
  const thead = createTableHeader(rowConfig, onSort);
  const tbody = createTableBody(rowConfig, size ? matching.slice(0, size) : matching);

  if (sortBy && rowConfig[sortBy]) {
    thead.querySelector(`th.${sortBy}`)?.setAttribute('data-sort', ascending ? 'asc' : 'desc');
  }

  tableElement.append(thead, tbody);
  block.append(tableElement);

  if (!pagination) return;

  for (let i = 0; i < totalPages; i += 1) {
    const btn = createTag('button', { class: i === 0 ? 'active' : '', 'data-page': i }, i + 1);
    btn.addEventListener('click', () => renderPage(i));
    pageButtons.append(btn);
  }

  prevBtn.addEventListener('click', () => { if (currentPage > 0) renderPage(currentPage - 1); });
  nextBtn.addEventListener('click', () => { if (currentPage < totalPages - 1) renderPage(currentPage + 1); });
  prevBtn.disabled = true;

  pagination.append(prevBtn, pageButtons, nextBtn);
  block.append(pagination);
}
