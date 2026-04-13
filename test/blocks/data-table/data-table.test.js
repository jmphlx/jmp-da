/* global beforeEach describe it */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const rawData = await readFile({ path: './data.json' });
const mockJson = JSON.parse(rawData);

function mockFetch() {
  window.fetch = async () => ({
    ok: true,
    json: async () => mockJson,
  });
}

const { default: decorate } = await import('../../../blocks/data-table/data-table.js');

describe('Data Table Block', () => {
  beforeEach(async () => {
    mockFetch();
    document.body.innerHTML = await readFile({ path: './data-table.html' });
  });

  describe('Table structure', () => {
    it('renders a table with thead and tbody', async () => {
      const block = document.querySelector('#data-table-block');
      await decorate(block);
      expect(block.querySelector('table.datatable')).to.exist;
      expect(block.querySelector('thead.dt-thead')).to.exist;
      expect(block.querySelector('tbody')).to.exist;
    });

    it('renders a header column for each configured column', async () => {
      const block = document.querySelector('#data-table-block');
      await decorate(block);
      const ths = block.querySelectorAll('thead th');
      expect(ths.length).to.equal(2);
      expect(ths[0].textContent).to.equal('Title');
      expect(ths[1].textContent).to.equal('Date');
    });

    it('renders a row for each data item on the first page', async () => {
      const block = document.querySelector('#data-table-block');
      await decorate(block);
      const rows = block.querySelectorAll('tbody tr');
      expect(rows.length).to.equal(2); // pageSize is 2, 3 total items
    });

    it('resolves json.property values into cell content', async () => {
      const block = document.querySelector('#data-table-no-pagination');
      await decorate(block);
      const firstRow = block.querySelector('tbody tr');
      expect(firstRow.querySelector('td.Title').textContent).to.equal('Security Bulletins');
    });
  });

  describe('Date formatting', () => {
    it('formats date string cells using format()', async () => {
      const block = document.querySelector('#data-table-no-pagination');
      await decorate(block);
      // first row has empty releaseDate, second row has 2025-07-22
      const rows = block.querySelectorAll('tbody tr');
      const dateCell = rows[1].querySelector('td.Date');
      expect(dateCell).to.exist;
      expect(dateCell.textContent).to.not.equal('2025-07-22');
      expect(dateCell.textContent.length).to.be.greaterThan(0);
    });

    it('sets data-sort-value on date cells with a valid date', async () => {
      const block = document.querySelector('#data-table-block');
      await decorate(block);
      // second row on page 1 has releaseDate 2025-07-22
      const rows = block.querySelectorAll('tbody tr');
      const dateCell = rows[1].querySelector('td.Date');
      expect(dateCell.dataset.sortValue).to.exist;
    });
  });

  describe('Path filtering', () => {
    it('only shows rows whose path matches config.path', async () => {
      const block = document.querySelector('#data-table-path-filter');
      await decorate(block);
      const rows = block.querySelectorAll('tbody tr');
      // two bulletin sub-pages match /en/company/security-bulletins/, the parent page does not
      expect(rows.length).to.equal(2);
    });
  });

  describe('Pagination', () => {
    it('renders pagination when data exceeds pageSize', async () => {
      const block = document.querySelector('#data-table-block');
      await decorate(block);
      expect(block.querySelector('.dt-pagination')).to.exist;
    });

    it('does not render pagination when all rows fit', async () => {
      const block = document.querySelector('#data-table-no-pagination');
      await decorate(block);
      expect(block.querySelector('.dt-pagination')).to.not.exist;
    });

    it('prev button is disabled on first page', async () => {
      const block = document.querySelector('#data-table-block');
      await decorate(block);
      const prevBtn = block.querySelector('.dt-pagination-prev');
      expect(prevBtn.disabled).to.be.true;
    });

    it('clicking a page button renders the correct rows', async () => {
      const block = document.querySelector('#data-table-block');
      await decorate(block);
      const pageButtons = block.querySelectorAll('.dt-pagination-pages button');
      pageButtons[1].click();
      const rows = block.querySelectorAll('tbody tr');
      expect(rows.length).to.equal(1); // 3 items, pageSize 2 → page 2 has 1 row
    });

    it('next button is disabled on last page', async () => {
      const block = document.querySelector('#data-table-block');
      await decorate(block);
      const pageButtons = block.querySelectorAll('.dt-pagination-pages button');
      pageButtons[pageButtons.length - 1].click();
      const nextBtn = block.querySelector('.dt-pagination-next');
      expect(nextBtn.disabled).to.be.true;
    });
  });

  describe('Sorting', () => {
    it('clicking a header sorts the full dataset ascending', async () => {
      const block = document.querySelector('#data-table-no-pagination');
      await decorate(block);
      const titleTh = block.querySelector('thead th.Title');
      titleTh.click();
      const rows = block.querySelectorAll('tbody tr');
      expect(rows[0].querySelector('td.Title').textContent).to.equal('JMP 18.2.2 Security Update');
      expect(rows[2].querySelector('td.Title').textContent).to.equal('Security Bulletins');
    });

    it('clicking the same header again sorts descending', async () => {
      const block = document.querySelector('#data-table-no-pagination');
      await decorate(block);
      const titleTh = block.querySelector('thead th.Title');
      titleTh.click();
      titleTh.click();
      const rows = block.querySelectorAll('tbody tr');
      expect(rows[0].querySelector('td.Title').textContent).to.equal('Security Bulletins');
    });

    it('sorts by date chronologically', async () => {
      const block = document.querySelector('#data-table-no-pagination');
      await decorate(block);
      const dateTh = block.querySelector('thead th.Date');
      dateTh.click();
      const rows = block.querySelectorAll('tbody tr');
      // 2025-07-22 before 2026-01-20; empty date sorts first
      expect(rows[1].querySelector('td.Title').textContent).to.equal('JMP 18.2.2 Security Update');
      expect(rows[2].querySelector('td.Title').textContent).to.equal('JMP 19.0.4 Security Update');
    });

    it('applies sortBy config on load', async () => {
      const block = document.querySelector('#data-table-sorted');
      await decorate(block);
      const rows = block.querySelectorAll('tbody tr');
      expect(rows[0].querySelector('td.Title').textContent).to.equal('Security Bulletins');
    });

    it('applies sortOrder descending on load', async () => {
      const block = document.querySelector('#data-table-sorted');
      await decorate(block);
      const titleTh = block.querySelector('thead th.Title');
      expect(titleTh.getAttribute('data-sort')).to.equal('desc');
    });
  });
});
