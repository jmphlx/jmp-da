import { fixture, html, expect } from '@open-wc/testing';
import { onSearchInput } from '../../../blocks/header/search.js'; // Adjust if needed

describe('Search Module (with manual mocks)', () => {
  const originalFns = {};

  beforeEach(() => {
    // Mock global helper.createTag
    originalFns.createTag = window.createTag;
    window.createTag = (tag, attrs = {}, content = '') => {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([key, val]) => el.setAttribute(key, val));
      if (typeof content === 'string') {
        el.textContent = content;
      } else if (content instanceof HTMLElement) {
        el.appendChild(content);
      } else if (Array.isArray(content)) {
        content.forEach((child) => el.appendChild(child));
      }
      return el;
    };

    // Mock global search functions
    originalFns.fetchIndex = window.fetchIndex;
    originalFns.getCommonsSheet = window.getCommonsSheet;
    originalFns.getTranslationStringEnum = window.getTranslationStringEnum;
    originalFns.getTopResults = window.getTopResults;
    originalFns.getSearchResults = window.getSearchResults;

    window.fetchIndex = async () => {};
    window.getCommonsSheet = async () => {};
    window.getTranslationStringEnum = () => ({
      NO_RESULTS_FOUND: 'No results found',
    });

    window.commonsSheet = {
      keywords: [],
      translations: {
        'no results found': 'No results found',
      },
    };
  });

  afterEach(() => {
    Object.entries(originalFns).forEach(([key, fn]) => {
      window[key] = fn;
    });
    delete window.commonsSheet;
  });

  it('shows no results message when no hits are found', async () => {
    window.getTopResults = () => [];
    window.getSearchResults = () => [];

    const container = await fixture(html`<div></div>`);
    await onSearchInput('nosuchterm', container);

    const message = container.querySelector('.result-listing');
    expect(message).to.exist;
    expect(message.textContent).to.include('No results found');
  });

  it('renders top + search results', async () => {
    const fakeHit = {
      title: 'Found Title',
      description: 'Some description',
      path: '/test/page.html',
    };

    window.getTopResults = () => [fakeHit];
    window.getSearchResults = () => [fakeHit];

    const container = await fixture(html`<div></div>`);
    await onSearchInput('something', container);

    const results = container.querySelectorAll('.result-listing');
    expect(results.length).to.be.greaterThan(0);
    expect(container.textContent).to.include('Found Title');
    expect(container.textContent).to.include('Some description');
  });

  it('renders nothing for empty/whitespace input', async () => {
    let fetchCalled = false;
    window.fetchIndex = async () => { fetchCalled = true; };

    const container = await fixture(html`<div></div>`);
    await onSearchInput('   ', container);

    expect(fetchCalled).to.equal(false);
    expect(container.innerHTML.trim()).to.equal('');
  });

  it('deduplicates results and limits to 25', async () => {
    const fakeHit = {
      title: 'Repeated Title',
      description: 'Repeated Desc',
      path: '/duplicate/path.html',
    };

    const duplicates = Array(40).fill(fakeHit);
    window.getTopResults = () => duplicates.slice(0, 10);
    window.getSearchResults = () => duplicates.slice(0, 30);

    const container = await fixture(html`<div></div>`);
    await onSearchInput('repeat', container);

    const cards = container.querySelectorAll('.result-listing');
    expect(cards.length).to.equal(25);
  });
});