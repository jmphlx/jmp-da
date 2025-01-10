/*
 * Table Block
 * Recreate a table
 * https://www.hlx.live/developer/block-collection/table
 */

import { createTag } from '../../scripts/helper.js';

function buildCell(rowIndex) {
  const cell = rowIndex ? document.createElement('td') : document.createElement('th');
  if (!rowIndex) cell.setAttribute('scope', 'col');
  return cell;
}

export default async function decorate(block) {
  // If there is a table within the block, only write the nested table.
  const nestedTable = block.querySelector('table');
  if (nestedTable) {
    block.innerHTML = '';
    const headRow = nestedTable.querySelector('tr');
    headRow.querySelectorAll('td').forEach((el) => {
      const headEl = createTag('th', {}, el.innerHTML);
      el.replaceWith(headEl);
    });
    const tableHeader = createTag('thead', {}, headRow.innerHTML);
    headRow.replaceWith(tableHeader);
    block.append(nestedTable);
    return;
  }

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const header = !block.classList.contains('no-header');
  if (header) {
    table.append(thead);
  }
  table.append(tbody);

  [...block.children].forEach((child, i) => {
    const row = document.createElement('tr');
    if (header && i === 0) thead.append(row);
    else tbody.append(row);
    [...child.children].forEach((col) => {
      const cell = buildCell(header ? i : i + 1);
      cell.innerHTML = col.innerHTML;
      row.append(cell);
    });
  });
  block.innerHTML = '';
  block.append(table);
}
