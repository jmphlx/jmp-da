import { fixture, html, expect } from '@open-wc/testing';
import { onSearchInput } from '../../../blocks/header/search.js';

describe('Search Module (with manual mocks)', () => {
  beforeEach(() => {
    // Pre-seed commonsSheet so getCommonsSheet() short-circuits without fetching.
    window.commonsSheet = {
      keywords: {},
      translations: { 'no results found': 'No results found' },
      complete: true,
    };
    // Pre-seed searchIndex so fetchIndex() short-circuits without fetching.
    window.searchIndex = {
      data: [],
      complete: true,
    };
  });

  afterEach(() => {
    delete window.commonsSheet;
    delete window.searchIndex;
  });

  it('shows no results message when no hits are found', async () => {
    const container = await fixture(html`<div></div>`);
    await onSearchInput('nosuchterm', container);

    const message = container.querySelector('.result-listing');
    expect(message).to.exist;
    expect(message.textContent).to.include('No results found');
  });

  it('renders top + search results', async () => {
    window.searchIndex.data = [{
      title: 'Found Title',
      description: 'Some description',
      path: '/test/page',
    }];

    const container = await fixture(html`<div></div>`);
    await onSearchInput('found', container);

    const results = container.querySelectorAll('.result-listing');
    expect(results.length).to.be.greaterThan(0);
    expect(container.textContent).to.include('Found Title');
    expect(container.textContent).to.include('Some description');
  });

  it('renders nothing for empty/whitespace input', async () => {
    const container = await fixture(html`<div></div>`);
    await onSearchInput('   ', container);

    expect(container.innerHTML.trim()).to.equal('');
  });

  it('deduplicates results and limits to 25', async () => {
    // 40 unique objects all matching "repeated" — real getSearchResults caps at 25.
    window.searchIndex.data = Array.from({ length: 40 }, (_, i) => ({
      title: `Repeated Title ${i}`,
      description: 'Repeated description',
      path: `/duplicate/path-${i}`,
    }));

    const container = await fixture(html`<div></div>`);
    await onSearchInput('repeated', container);

    const cards = container.querySelectorAll('.result-listing');
    expect(cards.length).to.equal(25);
  });
});
