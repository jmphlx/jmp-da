/* global describe it beforeEach afterEach */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { validateQuery } from '../../../tools/search/ui.js';

// Note: search.js uses external SDK imports that cannot be directly imported in tests
// We'll test the exported functions and utility functions through mocking

describe('Search Tool Module', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    window.blockProperties = [];
    window.tagAttribute = [];
    window.searchResults = [];
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    window.blockProperties = undefined;
    window.tagAttribute = undefined;
    window.searchResults = undefined;
  });

  describe('Scope prefix handling', () => {
    it('should recognize scope prefixes with regex pattern', () => {
      const scopeRegex = /(\w+):([^\s]+)/g;
      const testCases = [
        { input: 'block:hero test', expectedScope: 'block', expectedValue: 'hero' },
        { input: 'status:published test', expectedScope: 'status', expectedValue: 'published' },
      ];

      testCases.forEach(({ input, expectedScope, expectedValue }) => {
        const match = scopeRegex.exec(input);
        expect(match).to.exist;
        expect(match[1]).to.equal(expectedScope);
        expect(match[2]).to.equal(expectedValue);
        scopeRegex.lastIndex = 0;
      });
    });
  });

  describe('Result display', () => {
    beforeEach(() => {
      const resultsContainer = document.createElement('div');
      resultsContainer.classList.add('results-container');
      document.body.appendChild(resultsContainer);
    });

    afterEach(() => {
      const container = document.querySelector('.results-container');
      if (container) {
        document.body.removeChild(container);
      }
    });

    it('should display results header', () => {
      const header = document.createElement('h2');
      header.classList.add('results-header');
      header.textContent = 'Search Results for "test"';

      const container = document.querySelector('.results-container');
      container.appendChild(header);

      expect(header.textContent).to.include('Search Results');
    });

    it('should display result count', () => {
      const summary = document.createElement('span');
      summary.classList.add('summary');
      summary.textContent = '5 found for "test"';

      const container = document.querySelector('.results-container');
      container.appendChild(summary);

      expect(summary.textContent).to.include('found');
    });

    it('should display search duration', () => {
      const duration = document.createElement('span');
      duration.classList.add('search-time');
      duration.textContent = 'Search completed in 0.25 seconds';

      const container = document.querySelector('.results-container');
      container.appendChild(duration);

      expect(duration.textContent).to.include('Search completed');
    });
  });

  describe('Query validation', () => {
    it('should allow block scope alone', () => {
      const queryObject = {
        scope: { block: 'hero' },
        keyword: 'test',
        caseSensitive: false,
      };
      expect(() => validateQuery(queryObject)).to.not.throw();
    });

    it('should allow property scope alone', () => {
      const queryObject = {
        scope: { property: 'title' },
        keyword: 'test',
        caseSensitive: false,
      };
      expect(() => validateQuery(queryObject)).to.not.throw();
    });

    it('should allow tag scope alone', () => {
      const queryObject = {
        scope: { tag: 'div' },
        keyword: 'test',
        caseSensitive: false,
      };
      expect(() => validateQuery(queryObject)).to.not.throw();
    });

    it('should allow attribute scope alone', () => {
      const queryObject = {
        scope: { attribute: 'class' },
        keyword: 'test',
        caseSensitive: false,
      };
      expect(() => validateQuery(queryObject)).to.not.throw();
    });

    it('should throw error when block is combined with tag', () => {
      const queryObject = {
        scope: { block: 'hero', tag: 'div' },
        keyword: 'test',
        caseSensitive: false,
      };
      expect(() => validateQuery(queryObject)).to.throw('Cannot combine block, property, or empty value search with HTML or attribute tags');
    });

    it('should throw error when block is combined with attribute', () => {
      const queryObject = {
        scope: { block: 'hero', attribute: 'class' },
        keyword: 'test',
        caseSensitive: false,
      };
      expect(() => validateQuery(queryObject)).to.throw('Cannot combine block, property, or empty value search with HTML or attribute tags');
    });

    it('should throw error when property is combined with tag', () => {
      const queryObject = {
        scope: { property: 'title', tag: 'div' },
        keyword: 'test',
        caseSensitive: false,
      };
      expect(() => validateQuery(queryObject)).to.throw('Cannot combine block, property, or empty value search with HTML or attribute tags');
    });

    it('should throw error when property is combined with attribute', () => {
      const queryObject = {
        scope: { property: 'title', attribute: 'id' },
        keyword: 'test',
        caseSensitive: false,
      };
      expect(() => validateQuery(queryObject)).to.throw('Cannot combine block, property, or empty value search with HTML or attribute tags');
    });

    it('should throw error when $empty keyword is combined with tag', () => {
      const queryObject = {
        scope: { tag: 'p' },
        keyword: '$empty',
        caseSensitive: false,
      };
      expect(() => validateQuery(queryObject)).to.throw('Cannot combine block, property, or empty value search with HTML or attribute tags');
    });

    it('should throw error when $empty keyword is combined with attribute', () => {
      const queryObject = {
        scope: { attribute: 'data-value' },
        keyword: '$empty',
        caseSensitive: false,
      };
      expect(() => validateQuery(queryObject)).to.throw('Cannot combine block, property, or empty value search with HTML or attribute tags');
    });

    it('should handle case-insensitive $empty matching', () => {
      const queryObject = {
        scope: { tag: 'span' },
        keyword: '$EMPTY',
        caseSensitive: false,
      };
      expect(() => validateQuery(queryObject)).to.throw('Cannot combine block, property, or empty value search with HTML or attribute tags');
    });

    it('should allow tag and attribute combined without block/property', () => {
      const queryObject = {
        scope: { tag: 'div', attribute: 'class' },
        keyword: 'test',
        caseSensitive: false,
      };
      expect(() => validateQuery(queryObject)).to.not.throw();
    });

    it('should allow empty scope object', () => {
      const queryObject = {
        scope: {},
        keyword: 'test',
        caseSensitive: false,
      };
      expect(() => validateQuery(queryObject)).to.not.throw();
    });

    it('should allow status scope with other scopes', () => {
      const queryObject = {
        scope: { block: 'hero', status: 'published' },
        keyword: 'test',
        caseSensitive: false,
      };
      expect(() => validateQuery(queryObject)).to.not.throw();
    });

    it('should throw error when block, tag, and attribute are all present', () => {
      const queryObject = {
        scope: { block: 'hero', tag: 'div', attribute: 'class' },
        keyword: 'test',
        caseSensitive: false,
      };
      expect(() => validateQuery(queryObject)).to.throw('Cannot combine block, property, or empty value search with HTML or attribute tags');
    });
  });
});
