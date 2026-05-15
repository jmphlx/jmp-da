/* global before describe it beforeEach afterEach */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const searchHelper = await import('../../scripts/search.js');
const { clearJsonCache } = await import('../../scripts/jmp.js');

const cardTemplate = (title, description, href, displayUrl) => `<div class="results-body"><a class="title" href="${href}">${title}</a>` +
`<p class="description">${description}</p><a class="displayUrl" href="${href}">${displayUrl}</a></div>`;

describe('Search Script ', () => {
  describe('decorateCard', () => {
    it('Internal Card', () => {
      const hit = {
        title: 'My Title',
        description: 'My Description',
        path: '/en/home',
      };

      const card = searchHelper.decorateCard(hit);
      expect(card.innerHTML).to.equal(cardTemplate('My Title', 'My Description', '/en/home', 'http://localhost:2000/en/home'));
    });

    it('Escaped XSS', () => {
      const hit = {
        title: '<img src=x onerror=alert("BHIS")>',
        description: 'My Description',
        path: '/en/home',
      };

      const card = searchHelper.decorateCard(hit);
      expect(card.innerHTML).to.equal(cardTemplate('<img src="x">', 'My Description', '/en/home', 'http://localhost:2000/en/home'));
    });

    it('Card with redirect target', () => {
      const hit = {
        title: 'Redirect Page',
        description: 'Page with redirect',
        path: '/en/old-page',
        redirectTarget: 'https://example.com/new-page',
      };

      const card = searchHelper.decorateCard(hit);
      expect(card.querySelector('a.title')).to.exist;
      expect(card.querySelector('a.title').href).to.include('example.com/new-page');
    });

    it('Card with relative path', () => {
      const hit = {
        title: 'Relative Page',
        description: 'Page with relative path',
        path: 'relative/path',
      };

      const card = searchHelper.decorateCard(hit);
      expect(card.querySelector('a.title')).to.exist;
      expect(card.querySelector('a.displayUrl')).to.exist;
    });

    it('Card with special characters in title', () => {
      const hit = {
        title: 'Title & Description < > "Quotes"',
        description: 'Description with & and <tags>',
        path: '/en/special',
      };

      const card = searchHelper.decorateCard(hit);
      expect(card.querySelector('a.title')).to.exist;
      expect(card.querySelector('p.description')).to.exist;
    });

    it('Card with empty redirect target', () => {
      const hit = {
        title: 'No Redirect',
        description: 'No redirect target',
        path: '/en/page.html',
        redirectTarget: '',
      };

      const card = searchHelper.decorateCard(hit);
      expect(card.querySelector('a.title').href).to.include('/en/page');
    });
  });

  describe('getTranslationStringEnum', () => {
    it('should return translation strings object', () => {
      const translations = searchHelper.getTranslationStringEnum();
      expect(translations).to.exist;
      expect(translations.NO_RESULTS_FOUND).to.equal('No Results Found');
      expect(translations.SEARCH).to.equal('Search');
    });

    it('should return frozen object', () => {
      const translations = searchHelper.getTranslationStringEnum();
      expect(Object.isFrozen(translations)).to.be.true;
    });
  });

  describe('fetchIndex', () => {
    let fetchStub;

    beforeEach(() => {
      fetchStub = sinon.stub(window, 'fetch');
      window.searchIndex = undefined;
    });

    afterEach(() => {
      fetchStub.restore();
      window.searchIndex = undefined;
    });

    it('should fetch and cache index', async () => {
      const mockData = {
        data: [
          { title: 'Page 1', description: 'Desc 1', path: '/page1', noindex: false },
          { title: 'Page 2', description: 'Desc 2', path: '/page2', noindex: false },
        ],
      };
      fetchStub.resolves(new Response(JSON.stringify(mockData)));

      const result = await searchHelper.fetchIndex();
      expect(result.complete).to.be.true;
      expect(result.data.length).to.equal(2);
    });

    it('should return cached index on second call', async () => {
      const mockData = {
        data: [{ title: 'Page 1', description: 'Desc 1', path: '/page1', noindex: false }],
      };
      fetchStub.resolves(new Response(JSON.stringify(mockData)));

      const result1 = await searchHelper.fetchIndex();
      const result2 = await searchHelper.fetchIndex();

      expect(fetchStub.callCount).to.equal(1);
      expect(result1).to.equal(result2);
    });

    it('should filter out pages with robots noindex', async () => {
      const mockData = {
        data: [
          { title: 'Page 1', description: 'Desc 1', path: '/page1', robots: [] },
          { title: 'Noindex Page', description: 'Should be filtered', path: '/noindex', robots: ['noindex'] },
          { title: 'Page 2', description: 'Desc 2', path: '/page2', robots: [] },
        ],
      };
      fetchStub.resolves(new Response(JSON.stringify(mockData)));

      const result = await searchHelper.fetchIndex();
      expect(result.data.length).to.equal(2);
      expect(result.data.every(p => !p.robots || p.robots.length === 0)).to.be.true;
    });

    it('should fetch SKP index when isSKP is true', async () => {
      const mockData = { data: [{ title: 'SKP Page', description: 'SKP', path: '/skp', noindex: false }] };
      fetchStub.resolves(new Response(JSON.stringify(mockData)));

      await searchHelper.fetchIndex(true);
      expect(fetchStub.called).to.be.true;
    });
  });

  describe('getCommonsSheet', () => {
    let fetchStub;

    beforeEach(() => {
      clearJsonCache();
      window.commonsSheet = undefined;
      fetchStub = sinon.stub(window, 'fetch');
    });

    afterEach(() => {
      fetchStub.restore();
      window.commonsSheet = undefined;
    });

    it('should fetch and cache commons sheet', async () => {
      const mockData = {
        keywords: {
          data: [{ 'Top Keyword': '/en/page1, /en/page2' }],
        },
        translations: {
          data: [{ 'NO_RESULTS': 'No Results Found' }],
        },
      };
      fetchStub.resolves(new Response(JSON.stringify(mockData)));

      const result = await searchHelper.getCommonsSheet();
      expect(result.complete).to.be.true;
      expect(result.keywords).to.exist;
      expect(result.translations).to.exist;
    });

    it('should return cached commons sheet on second call', async () => {
      const mockData = {
        keywords: { data: [{}] },
        translations: { data: [{}] },
      };
      fetchStub.resolves(new Response(JSON.stringify(mockData)));

      const result1 = await searchHelper.getCommonsSheet();
      const result2 = await searchHelper.getCommonsSheet();

      expect(fetchStub.callCount).to.equal(1);
      expect(result1).to.equal(result2);
    });

    it('should handle null jsonData gracefully', async () => {
      fetchStub.resolves(new Response('null'));

      const result = await searchHelper.getCommonsSheet();
      expect(result.complete).to.be.true;
    });

    it('should convert keys to lowercase', async () => {
      const mockData = {
        keywords: { data: [{ 'TOP_KEYWORDS': '/en/page' }] },
        translations: { data: [{ 'NO_RESULTS_FOUND': 'No Results' }] },
      };
      fetchStub.resolves(new Response(JSON.stringify(mockData)));

      const result = await searchHelper.getCommonsSheet();
      expect(Object.keys(result.keywords).every(k => k === k.toLowerCase())).to.be.true;
    });
  });

  describe('getSearchResults', () => {
    beforeEach(() => {
      window.searchIndex = {
        data: [
          { title: 'JavaScript Basics', description: 'Learn JavaScript fundamentals', path: '/js-basics' },
          { title: 'Advanced JavaScript', description: 'Advanced JavaScript concepts', path: '/js-advanced' },
          { title: 'React Guide', description: 'Learn React framework', path: '/react-guide' },
          { title: 'CSS Styling', description: 'CSS techniques and best practices', path: '/css' },
          { title: 'Web Development', description: 'Web development resources and guides', path: '/web-dev' },
        ],
      };
    });

    it('should find results matching single term in title', () => {
      const results = searchHelper.getSearchResults(['javascript'], 10);
      expect(results.length).to.equal(2);
      expect(results.every(r => r.title.toLowerCase().includes('javascript'))).to.be.true;
    });

    it('should find results matching single term in description', () => {
      const results = searchHelper.getSearchResults(['fundamentals'], 10);
      expect(results.length).to.be.greaterThan(0);
    });

    it('should prioritize title matches over description matches', () => {
      const results = searchHelper.getSearchResults(['javascript'], 10);
      expect(results[0].title.toLowerCase().includes('javascript')).to.be.true;
    });

    it('should limit results to specified number', () => {
      const results = searchHelper.getSearchResults([''], 2);
      expect(results.length).to.be.lessThanOrEqual(2);
    });

    it('should match multiple search terms', () => {
      const results = searchHelper.getSearchResults(['web', 'development'], 10);
      expect(results.length).to.be.greaterThan(0);
      expect(results.every(r =>
        r.title.toLowerCase().includes('web') && r.title.toLowerCase().includes('development') ||
        r.description.toLowerCase().includes('web') && r.description.toLowerCase().includes('development')
      )).to.be.true;
    });

    it('should be case insensitive', () => {
      const results1 = searchHelper.getSearchResults(['JAVASCRIPT'], 10);
      const results2 = searchHelper.getSearchResults(['javascript'], 10);
      expect(results1.length).to.equal(results2.length);
    });

    it('should handle no matches', () => {
      const results = searchHelper.getSearchResults(['nonexistent'], 10);
      expect(results.length).to.equal(0);
    });

    it('should fill remaining slots with description matches', () => {
      const results = searchHelper.getSearchResults(['guide'], 5);
      expect(results.length).to.be.greaterThan(0);
    });

    it('should not include duplicate results', () => {
      const results = searchHelper.getSearchResults(['web'], 10);
      const paths = results.map(r => r.path);
      const uniquePaths = new Set(paths);
      expect(paths.length).to.equal(uniquePaths.size);
    });
  });

  describe('getTopResults', () => {
    let originalGetLanguage;

    beforeEach(() => {
      window.searchIndex = {
        data: [
          { title: 'Home Page', description: 'Homepage', path: '/en/home' },
          { title: 'About Page', description: 'About us', path: '/en/about' },
          { title: 'Contact Page', description: 'Contact us', path: '/en/contact' },
          { title: 'FR Home', description: 'Accueil', path: '/fr/home' },
        ],
      };
    });

    it('should return top results for matching keyword', () => {
      const keywords = { 'help': '/en/home,/en/about' };
      const results = searchHelper.getTopResults('help', keywords);
      expect(results.length).to.equal(2);
    });

    it('should be case insensitive', () => {
      const keywords = { 'help': '/en/home,/en/about' };
      const results1 = searchHelper.getTopResults('help', keywords);
      const results2 = searchHelper.getTopResults('HELP', keywords);
      expect(results1.length).to.equal(results2.length);
    });

    it('should return empty array for unknown keyword', () => {
      const keywords = { 'help': '/en/home' };
      const results = searchHelper.getTopResults('unknown', keywords);
      expect(results.length).to.equal(0);
    });

    it('should replaceAll language placeholder in paths', () => {
      const keywords = { 'help': '/en/home' };
      const results = searchHelper.getTopResults('help', keywords);
      expect(results).to.exist;
      expect(Array.isArray(results)).to.be.true;
    });

    it('should skip non-existent pages', () => {
      const keywords = { 'help': '/en/nonexistent,/en/home' };
      const results = searchHelper.getTopResults('help', keywords);
      expect(results.length).to.equal(1);
      expect(results[0].path).to.equal('/en/home');
    });

    it('should handle empty keywords object', () => {
      const results = searchHelper.getTopResults('help', {});
      expect(results.length).to.equal(0);
    });

    it('should return empty array when no pages found', () => {
      const keywords = { 'help': '/nonexistent/page1,/nonexistent/page2' };
      const results = searchHelper.getTopResults('help', keywords);
      expect(results.length).to.equal(0);
    });

    it('should handle keyword with single result', () => {
      const keywords = { 'contact': '/en/contact' };
      const results = searchHelper.getTopResults('contact', keywords);
      expect(results.length).to.equal(1);
      expect(results[0].path).to.equal('/en/contact');
    });
  });
});
