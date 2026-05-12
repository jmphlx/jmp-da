/* global describe it beforeEach afterEach */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const ui = await import('../../../tools/search/ui.js');

describe('UI Module', () => {
  let fetchStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, 'fetch');
    window.blockProperties = [];
    window.tagAttribute = [];
    window.searchResults = [];
  });

  afterEach(() => {
    if (fetchStub) {
      fetchStub.restore();
    }
    window.blockProperties = undefined;
    window.tagAttribute = undefined;
    window.searchResults = undefined;
  });

  describe('clearResults', () => {
    it('should clear results when elements exist', () => {
      const resultsContainer = document.createElement('div');
      resultsContainer.classList.add('results-container');
      resultsContainer.innerHTML = '<h2>Test</h2>';
      document.body.appendChild(resultsContainer);

      const actionPrompt = document.createElement('div');
      actionPrompt.id = 'advanced-action-prompt';
      document.body.appendChild(actionPrompt);

      ui.clearResults();

      expect(resultsContainer.innerHTML).to.equal('');
      expect(actionPrompt.classList.contains('hidden')).to.be.true;

      document.body.removeChild(resultsContainer);
      document.body.removeChild(actionPrompt);
    });
  });

  describe('hideActionForms', () => {
    it('should not throw when forms exist', () => {
      const replaceForm = document.createElement('div');
      replaceForm.id = 'replace-text-form';
      document.body.appendChild(replaceForm);

      const exportForm = document.createElement('div');
      exportForm.id = 'export-form';
      document.body.appendChild(exportForm);

      const actionForm = document.createElement('div');
      actionForm.id = 'action-form';
      document.body.appendChild(actionForm);

      expect(() => {
        ui.hideActionForms();
      }).to.not.throw();

      document.body.removeChild(replaceForm);
      document.body.removeChild(exportForm);
      document.body.removeChild(actionForm);
    });

    it('should handle missing forms gracefully', () => {
      expect(() => {
        ui.hideActionForms();
      }).to.not.throw();
    });
  });

  describe('addLoadingSearch', () => {
    it('should handle valid container', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      expect(() => {
        ui.addLoadingSearch(container, 'Loading...');
      }).to.not.throw();

      document.body.removeChild(container);
    });
  });

  describe('addLoadingAction', () => {
    it('should handle valid container', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      expect(() => {
        ui.addLoadingAction(container, 'Processing...');
      }).to.not.throw();

      document.body.removeChild(container);
    });
  });

  describe('updateActionMessage', () => {
    it('should handle success message', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const result = { status: 'success', message: 'Done' };
      expect(() => {
        ui.updateActionMessage(container, result);
      }).to.not.throw();

      document.body.removeChild(container);
    });

    it('should handle error message', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const result = { status: 'error', message: 'Failed' };
      expect(() => {
        ui.updateActionMessage(container, result);
      }).to.not.throw();

      document.body.removeChild(container);
    });
  });

  describe('closeAdvancedSections', () => {
    it('should not throw', () => {
      expect(() => {
        ui.closeAdvancedSections();
      }).to.not.throw();
    });

    it('should handle sections with checkboxes', () => {
      const section = document.createElement('div');
      section.classList.add('advanced-section', 'open');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true;
      section.appendChild(checkbox);
      document.body.appendChild(section);

      expect(() => {
        ui.closeAdvancedSections();
      }).to.not.throw();

      document.body.removeChild(section);
    });
  });

  describe('addCheckboxEventListeners', () => {
    it('should handle search input with checkbox', () => {
      const searchInput = document.createElement('input');
      searchInput.name = 'searchTerms';
      document.body.appendChild(searchInput);

      const emptyCheckbox = document.createElement('input');
      emptyCheckbox.id = 'emptyValue';
      emptyCheckbox.type = 'checkbox';
      document.body.appendChild(emptyCheckbox);

      expect(() => {
        ui.addCheckboxEventListeners(searchInput);
      }).to.not.throw();

      document.body.removeChild(searchInput);
      document.body.removeChild(emptyCheckbox);
    });
  });

  describe('constructPageViewer', () => {
    it('should not throw', () => {
      const input = document.createElement('input');
      input.id = 'page-path-input';
      document.body.appendChild(input);

      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'toggle-edit';
      document.body.appendChild(toggleBtn);

      const lockIcon = document.createElement('svg');
      lockIcon.id = 'icon-lock';
      document.body.appendChild(lockIcon);

      expect(() => {
        ui.constructPageViewer();
      }).to.not.throw();

      document.body.removeChild(input);
      document.body.removeChild(toggleBtn);
      document.body.removeChild(lockIcon);
    });
  });

  describe('populateDropdowns', () => {
    it('should handle search input with dropdowns', () => {
      const searchInput = document.createElement('input');
      searchInput.name = 'searchTerms';
      document.body.appendChild(searchInput);

      const blockDropdown = document.createElement('select');
      blockDropdown.name = 'block_scope';
      document.body.appendChild(blockDropdown);

      const propertyDropdown = document.createElement('select');
      propertyDropdown.name = 'property_scope';
      document.body.appendChild(propertyDropdown);

      const tagDropdown = document.createElement('select');
      tagDropdown.name = 'tag_scope';
      document.body.appendChild(tagDropdown);

      const attributeDropdown = document.createElement('select');
      attributeDropdown.name = 'attribute_scope';
      document.body.appendChild(attributeDropdown);

      const statusDropdown = document.createElement('select');
      statusDropdown.id = 'publish_scope';
      document.body.appendChild(statusDropdown);

      window.blockProperties = [{ name: 'test', property: 'prop' }];
      window.tagAttribute = [{ tag: 'a', attribute: 'href' }];

      expect(() => {
        ui.populateDropdowns(searchInput);
      }).to.not.throw();

      document.body.removeChild(searchInput);
      document.body.removeChild(blockDropdown);
      document.body.removeChild(propertyDropdown);
      document.body.removeChild(tagDropdown);
      document.body.removeChild(attributeDropdown);
      document.body.removeChild(statusDropdown);
    });
  });

  describe('writeOutResults', () => {
    it('should handle empty results', () => {
      const resultsContainer = document.createElement('div');
      resultsContainer.classList.add('results-container');
      document.body.appendChild(resultsContainer);

      expect(() => {
        ui.writeOutResults([], 'test', { keyword: 'test' }, 0.5);
      }).to.not.throw();

      document.body.removeChild(resultsContainer);
    });

    it('should handle results with elements', () => {
      const resultsContainer = document.createElement('div');
      resultsContainer.classList.add('results-container');
      document.body.appendChild(resultsContainer);

      const element = document.createElement('div');
      element.textContent = 'test';

      const results = [
        {
          path: '/test/page',
          pagePath: '/test/page',
          elements: [element],
          classStyle: 'tag',
          publishStatus: {},
        },
      ];

      expect(() => {
        ui.writeOutResults(results, 'keyword', { keyword: 'keyword' }, 0.25);
      }).to.not.throw();

      document.body.removeChild(resultsContainer);
    });
  });

  describe('exportToCSV', () => {
    it('should handle CSV export', () => {
      window.searchResults = [];

      const exportForm = document.createElement('div');
      exportForm.id = 'export-form';
      document.body.appendChild(exportForm);

      const exportOptions = document.createElement('div');
      exportOptions.classList.add('export-options');
      document.body.appendChild(exportOptions);

      expect(() => {
        ui.exportToCSV('token');
      }).to.not.throw();

      document.body.removeChild(exportForm);
      document.body.removeChild(exportOptions);
    });
  });
});
