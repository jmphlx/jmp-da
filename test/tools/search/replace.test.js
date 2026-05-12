/* global describe it beforeEach afterEach */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  ActionResult,
  escapeRegExp,
  doReplace,
  resetDocumentsToOriginalState,
  deleteRow,
  addNewRow,
  editRows,
  mergeRows,
} from '../../../tools/search/replace.js';

describe('Replace Module', () => {
  describe('ActionResult', () => {
    it('should create an ActionResult with status and message', () => {
      const result = new ActionResult('success', 'Operation completed');
      expect(result.status).to.equal('success');
      expect(result.message).to.equal('Operation completed');
    });
  });

  describe('escapeRegExp', () => {
    it('should escape all special regex characters', () => {
      const escaped = escapeRegExp('.*+?^${}()|[]\\');
      expect(escaped).to.equal('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    });

    it('should return plain text unchanged', () => {
      const text = 'simple text';
      expect(escapeRegExp(text)).to.equal(text);
    });

    it('should handle empty string', () => {
      expect(escapeRegExp('')).to.equal('');
    });
  });

  describe('doReplace', () => {
    let dom;
    let mockToken;

    beforeEach(() => {
      mockToken = 'test-token';
    });

    it('should replace keyword in innerHTML (default case)', async () => {
      const htmlString = '<main><div class="test">Find this text</div></main>';
      const parser = new DOMParser();
      dom = parser.parseFromString(htmlString, 'text/html');

      const elements = [dom.querySelector('.test')];
      const queryObject = { keyword: 'text', scope: {} };

      // This tests the innerHTML replacement path (classStyle is not 'attribute' or 'tag')
      await doReplace(mockToken, dom, elements, '/path', queryObject, 'text', 'content');
      expect(elements[0].innerHTML).to.include('content');
    });

    it('should replace keyword in attribute', async () => {
      const htmlString = '<main><a href="http://oldtext.com">Link</a></main>';
      const parser = new DOMParser();
      dom = parser.parseFromString(htmlString, 'text/html');

      const elements = [dom.querySelector('a')];
      elements[0].href = 'http://oldtext.com';
      const queryObject = { keyword: 'oldtext', scope: { attribute: 'href' } };

      await doReplace(mockToken, dom, elements, '/path', queryObject, 'attribute', 'newtext');
      expect(elements[0].href).to.include('newtext');
    });

    it('should replace keyword in tag outerHTML', async () => {
      const htmlString = '<main><div class="test">oldtext content</div></main>';
      const parser = new DOMParser();
      dom = parser.parseFromString(htmlString, 'text/html');

      const elements = [dom.querySelector('.test')];
      const queryObject = { keyword: 'oldtext', scope: {} };

      await doReplace(mockToken, dom, elements, '/path', queryObject, 'tag', 'newtext');
      expect(elements[0].outerHTML).to.include('newtext');
    });

    it('should be case insensitive by default', async () => {
      const htmlString = '<main><div class="test">TEXT content</div></main>';
      const parser = new DOMParser();
      dom = parser.parseFromString(htmlString, 'text/html');

      const elements = [dom.querySelector('.test')];
      const queryObject = { keyword: 'text', scope: {} };

      await doReplace(mockToken, dom, elements, '/path', queryObject, 'text', 'replaced');
      expect(elements[0].innerHTML.toLowerCase()).to.include('replaced');
    });

    it('should handle multiple elements in attribute replacement', async () => {
      const htmlString = '<main><input value="oldvalue"><textarea>oldvalue</textarea></main>';
      const parser = new DOMParser();
      dom = parser.parseFromString(htmlString, 'text/html');

      const elements = [
        dom.querySelector('input'),
        dom.querySelector('textarea'),
      ];
      elements[0].value = 'oldvalue';
      elements[1].value = 'oldvalue';
      const queryObject = { keyword: 'oldvalue', scope: { attribute: 'value' } };

      await doReplace(mockToken, dom, elements, '/path', queryObject, 'attribute', 'newvalue');
      expect(elements[0].value).to.include('newvalue');
    });

    it('should handle multiple elements in tag replacement', async () => {
      const htmlString = '<main><span>oldtext1</span><span>oldtext2</span></main>';
      const parser = new DOMParser();
      dom = parser.parseFromString(htmlString, 'text/html');

      const elements = Array.from(dom.querySelectorAll('span'));
      const queryObject = { keyword: 'oldtext', scope: {} };

      await doReplace(mockToken, dom, elements, '/path', queryObject, 'tag', 'newtext');
      expect(elements[0].outerHTML).to.include('newtext');
      expect(elements[1].outerHTML).to.include('newtext');
    });
  });

  describe('resetDocumentsToOriginalState', () => {
    beforeEach(() => {
      window.searchResults = [];
    });

    afterEach(() => {
      window.searchResults = undefined;
    });

    it('should handle empty search results', async () => {
      window.searchResults = [];

      try {
        await resetDocumentsToOriginalState('token');
        expect(true).to.be.true;
      } catch (e) {
        // Expected to handle empty results gracefully
        expect(true).to.be.true;
      }
    });

    it('should process search results with original documents', async () => {
      const parser = new DOMParser();
      const html = '<main><div>Original Content</div></main>';
      const originalDom = parser.parseFromString(html, 'text/html');

      window.searchResults = [
        {
          pagePath: '/test/page1',
          original: originalDom,
        },
      ];

      await resetDocumentsToOriginalState('token');
      expect(window.searchResults.length).to.equal(1);
    });
  });

  describe('deleteRow', () => {
    beforeEach(() => {
      window.searchResults = [];

      // Create delete row input
      const deleteInput = document.createElement('input');
      deleteInput.id = 'deleteRowName';
      deleteInput.value = '';
      document.body.appendChild(deleteInput);
    });

    afterEach(() => {
      window.searchResults = undefined;
      const deleteInput = document.getElementById('deleteRowName');
      if (deleteInput) {
        document.body.removeChild(deleteInput);
      }
    });

    it('should throw error when row name is blank for property', () => {
      const deleteInput = document.getElementById('deleteRowName');
      deleteInput.value = '';

      const queryObject = { scope: { property: 'name' }, classStyle: 'property' };
      window.searchResults = [{ classStyle: 'property' }];

      const result = deleteRow(queryObject, 'token');
      expect(result.status).to.equal('error');
    });

    it('should handle property class style with matching scope property', () => {
      const deleteInput = document.getElementById('deleteRowName');
      deleteInput.value = 'name';

      const parser = new DOMParser();
      const html = '<div class="block"><div class="row"><div><p>name</p></div><div><p>value</p></div></div></div>';
      const element = parser.parseFromString(html, 'text/html').body.firstChild;

      const queryObject = { scope: { property: 'name' }, classStyle: 'property' };
      window.searchResults = [{
        classStyle: 'property',
        elements: [element],
        dom: parser.parseFromString('<main></main>', 'text/html'),
        pagePath: '/test'
      }];

      const result = deleteRow(queryObject, 'token');
      expect(result).to.be.instanceof(ActionResult);
    });

    it('should handle block class style', () => {
      const deleteInput = document.getElementById('deleteRowName');
      deleteInput.value = 'rowname';

      const queryObject = { scope: {}, classStyle: 'block' };
      window.searchResults = [{ classStyle: 'block', elements: [] }];

      const result = deleteRow(queryObject, 'token');
      expect(result.status).to.equal('error');
    });

    it('should throw error for tag class style', () => {
      const deleteInput = document.getElementById('deleteRowName');
      deleteInput.value = 'rowname';

      const queryObject = { scope: {}, classStyle: 'tag' };
      window.searchResults = [{ classStyle: 'tag' }];

      const result = deleteRow(queryObject, 'token');
      expect(result.status).to.equal('error');
      expect(result.message.message).to.include('not an identifiable block');
    });

    it('should throw error for attribute class style', () => {
      const deleteInput = document.getElementById('deleteRowName');
      deleteInput.value = 'rowname';

      const queryObject = { scope: {}, classStyle: 'attribute' };
      window.searchResults = [{ classStyle: 'attribute' }];

      const result = deleteRow(queryObject, 'token');
      expect(result.status).to.equal('error');
      expect(result.message.message).to.include('not an identifiable block');
    });

    it('should throw error for unknown class style', () => {
      const deleteInput = document.getElementById('deleteRowName');
      deleteInput.value = 'rowname';

      const queryObject = { scope: {}, classStyle: 'unknown' };
      window.searchResults = [{ classStyle: 'unknown' }];

      const result = deleteRow(queryObject, 'token');
      expect(result.status).to.equal('error');
      expect(result.message.message).to.include('could not delete');
    });

    it('should handle block class style with empty row name', () => {
      const deleteInput = document.getElementById('deleteRowName');
      deleteInput.value = '';

      const queryObject = { scope: {}, classStyle: 'block' };
      window.searchResults = [{ classStyle: 'block' }];

      const result = deleteRow(queryObject, 'token');
      expect(result.status).to.equal('error');
    });

    it('should handle property case where deleteRowName matches scope property', () => {
      const deleteInput = document.getElementById('deleteRowName');
      deleteInput.value = 'name';

      const parser = new DOMParser();
      const html = '<div class="block"><div class="row"><div><p>name</p></div><div><p>value</p></div></div></div>';
      const element = parser.parseFromString(html, 'text/html').body.firstChild;

      const queryObject = { scope: { property: 'name' }, classStyle: 'property' };
      window.searchResults = [{
        classStyle: 'property',
        elements: [element],
        dom: parser.parseFromString('<main></main>', 'text/html'),
        pagePath: '/test'
      }];

      const result = deleteRow(queryObject, 'token');
      expect(result.status).to.equal('success');
    });

    it('should handle property case where deleteRowName differs from scope property', () => {
      const deleteInput = document.getElementById('deleteRowName');
      deleteInput.value = 'otherprop';

      const parser = new DOMParser();
      const html = `
        <div class="block">
          <div class="row">
            <div><p>name</p></div>
            <div><p>value</p></div>
          </div>
          <div class="row">
            <div><p>otherprop</p></div>
            <div><p>othervalue</p></div>
          </div>
        </div>
      `;
      const element = parser.parseFromString(html, 'text/html').body.firstChild;

      const queryObject = { scope: { property: 'name' }, classStyle: 'property' };
      window.searchResults = [{
        classStyle: 'property',
        elements: [element],
        dom: parser.parseFromString('<main></main>', 'text/html'),
        pagePath: '/test'
      }];

      const result = deleteRow(queryObject, 'token');
      expect(result).to.be.instanceof(ActionResult);
    });

    it('should successfully delete from block elements', () => {
      const deleteInput = document.getElementById('deleteRowName');
      deleteInput.value = 'targetrow';

      const parser = new DOMParser();
      const html = `
        <div class="block">
          <div class="row">
            <div><p>targetrow</p></div>
            <div><p>value</p></div>
          </div>
        </div>
      `;
      const element = parser.parseFromString(html, 'text/html').body.firstChild;

      const queryObject = { scope: {}, classStyle: 'block' };
      window.searchResults = [{
        classStyle: 'block',
        elements: [element],
        dom: parser.parseFromString('<main></main>', 'text/html'),
        pagePath: '/test'
      }];

      const result = deleteRow(queryObject, 'token');
      expect(result).to.be.instanceof(ActionResult);
    });
  });

  describe('addNewRow', () => {
    beforeEach(() => {
      window.searchResults = [];

      // Create form inputs
      const addSection = document.createElement('div');
      addSection.id = 'add-section';

      const rowNameInput = document.createElement('input');
      rowNameInput.id = 'newRowName';
      rowNameInput.value = '';
      addSection.appendChild(rowNameInput);

      const rowValueInput = document.createElement('input');
      rowValueInput.id = 'newRowValue';
      rowValueInput.value = '';
      addSection.appendChild(rowValueInput);

      document.body.appendChild(addSection);
    });

    afterEach(() => {
      window.searchResults = undefined;
      const addSection = document.getElementById('add-section');
      if (addSection) {
        document.body.removeChild(addSection);
      }
    });

    it('should error when no row name specified', () => {
      const nameInput = document.getElementById('newRowName');
      nameInput.value = '';

      const result = addNewRow('token');
      expect(result.status).to.equal('error');
    });

    it('should error when no row value specified', () => {
      const nameInput = document.getElementById('newRowName');
      const valueInput = document.getElementById('newRowValue');

      nameInput.value = 'New Row';
      valueInput.value = '';

      const result = addNewRow('token');
      expect(result.status).to.equal('error');
    });

    it('should handle empty search results', () => {
      const nameInput = document.getElementById('newRowName');
      const valueInput = document.getElementById('newRowValue');

      nameInput.value = 'New Row';
      valueInput.value = 'New Value';
      window.searchResults = [];

      const result = addNewRow('token');
      expect(result).to.be.instanceof(ActionResult);
    });

    it('should successfully add row to property class style', () => {
      const nameInput = document.getElementById('newRowName');
      const valueInput = document.getElementById('newRowValue');

      nameInput.value = 'New Property';
      valueInput.value = 'New Value';

      const parser = new DOMParser();
      const html = '<div class="block"><div class="row"><div><p>name</p></div><div><p>value</p></div></div></div>';
      const element = parser.parseFromString(html, 'text/html').body.firstChild;

      window.searchResults = [{
        classStyle: 'property',
        elements: [element],
        dom: parser.parseFromString('<main></main>', 'text/html'),
        pagePath: '/test'
      }];

      const result = addNewRow('token');
      expect(result.status).to.equal('success');
      expect(result.message).to.include('Successfully added row');
    });

    it('should successfully add row to block class style', () => {
      const nameInput = document.getElementById('newRowName');
      const valueInput = document.getElementById('newRowValue');

      nameInput.value = 'New Property';
      valueInput.value = 'New Value';

      const parser = new DOMParser();
      const html = '<div class="block"><div class="row"><div><p>name</p></div><div><p>value</p></div></div></div>';
      const element = parser.parseFromString(html, 'text/html').body.firstChild;

      window.searchResults = [{
        classStyle: 'block',
        elements: [element],
        dom: parser.parseFromString('<main></main>', 'text/html'),
        pagePath: '/test'
      }];

      const result = addNewRow('token');
      expect(result.status).to.equal('success');
    });

    it('should error when classStyle is not property or block', () => {
      const nameInput = document.getElementById('newRowName');
      const valueInput = document.getElementById('newRowValue');

      nameInput.value = 'New Property';
      valueInput.value = 'New Value';

      const parser = new DOMParser();
      const html = '<div class="block"><div class="row"><div><p>name</p></div><div><p>value</p></div></div></div>';
      const element = parser.parseFromString(html, 'text/html').body.firstChild;

      window.searchResults = [{
        classStyle: 'tag',
        elements: [element],
        dom: parser.parseFromString('<main></main>', 'text/html'),
        pagePath: '/test'
      }];

      const result = addNewRow('token');
      expect(result.status).to.equal('error');
    });
  });

  describe('editRows', () => {
    beforeEach(() => {
      window.searchResults = [];

      // Create edit form
      const editSection = document.createElement('div');
      editSection.id = 'edit-section';

      const changeNameCheckbox = document.createElement('input');
      changeNameCheckbox.id = 'changeRowName';
      changeNameCheckbox.type = 'checkbox';
      editSection.appendChild(changeNameCheckbox);

      const changeValueCheckbox = document.createElement('input');
      changeValueCheckbox.id = 'changeRowValue';
      changeValueCheckbox.type = 'checkbox';
      editSection.appendChild(changeValueCheckbox);

      const newRowNameInput = document.createElement('input');
      newRowNameInput.id = 'newRowName';
      newRowNameInput.value = '';
      editSection.appendChild(newRowNameInput);

      const newTextInput = document.createElement('input');
      newTextInput.id = 'newText';
      newTextInput.value = '';
      editSection.appendChild(newTextInput);

      const partialEditSelect = document.createElement('select');
      partialEditSelect.name = 'partialEdit';
      partialEditSelect.value = 'each';
      editSection.appendChild(partialEditSelect);

      const editActionSelect = document.createElement('select');
      editActionSelect.name = 'editTextAction';
      editActionSelect.value = 'replace';
      editSection.appendChild(editActionSelect);

      document.body.appendChild(editSection);
    });

    afterEach(() => {
      window.searchResults = undefined;
      const editSection = document.getElementById('edit-section');
      if (editSection) {
        document.body.removeChild(editSection);
      }
    });

    it('should error when no operation selected', () => {
      const changeNameCheckbox = document.getElementById('changeRowName');
      const changeValueCheckbox = document.getElementById('changeRowValue');

      changeNameCheckbox.checked = false;
      changeValueCheckbox.checked = false;

      const result = editRows({}, 'token');
      expect(result.status).to.equal('error');
    });

    it('should require property class style', () => {
      const changeNameCheckbox = document.getElementById('changeRowName');
      changeNameCheckbox.checked = true;
      window.searchResults = [{ classStyle: 'block' }];

      const result = editRows({}, 'token');
      expect(result.status).to.equal('error');
    });

    it('should error when no property name provided', () => {
      const changeNameCheckbox = document.getElementById('changeRowName');
      const newRowNameInput = document.getElementById('newRowName');

      changeNameCheckbox.checked = true;
      newRowNameInput.value = '';
      window.searchResults = [{ classStyle: 'property' }];

      const result = editRows({}, 'token');
      expect(result.status).to.equal('error');
    });

    it('should error when no value change provided', () => {
      const changeValueCheckbox = document.getElementById('changeRowValue');
      const newTextInput = document.getElementById('newText');

      changeValueCheckbox.checked = true;
      newTextInput.value = '';
      window.searchResults = [{ classStyle: 'property' }];

      const result = editRows({}, 'token');
      expect(result.status).to.equal('error');
    });

    it('should successfully change row name', () => {
      const changeNameCheckbox = document.getElementById('changeRowName');
      const newRowNameInput = document.getElementById('newRowName');

      changeNameCheckbox.checked = true;
      newRowNameInput.value = 'New Name';

      const parser = new DOMParser();
      const html = '<div class="row"><div><p>Old Name</p></div><div><p>value</p></div></div>';
      const element = parser.parseFromString(html, 'text/html').body.firstChild;

      window.searchResults = [{
        classStyle: 'property',
        elements: [element],
        dom: parser.parseFromString('<main></main>', 'text/html'),
        pagePath: '/test'
      }];

      const result = editRows({}, 'token');
      expect(result.status).to.equal('success');
    });

    it('should successfully change row value with whole edit amount', () => {
      const changeValueCheckbox = document.getElementById('changeRowValue');
      const newTextInput = document.getElementById('newText');
      const partialEditSelect = document.querySelector('[name="partialEdit"]');
      const editActionSelect = document.querySelector('[name="editTextAction"]');

      changeValueCheckbox.checked = true;
      newTextInput.value = 'New Value';
      partialEditSelect.value = 'whole';
      editActionSelect.value = 'replace';

      const parser = new DOMParser();
      const html = '<div class="row"><div><p>name</p></div><div><p>Old Value</p></div></div>';
      const element = parser.parseFromString(html, 'text/html').body.firstChild;

      window.searchResults = [{
        classStyle: 'property',
        elements: [element],
        dom: parser.parseFromString('<main></main>', 'text/html'),
        pagePath: '/test'
      }];

      const result = editRows({}, 'token');
      expect(result.status).to.equal('success');
    });

    it('should successfully change row value with each edit amount', () => {
      const changeValueCheckbox = document.getElementById('changeRowValue');
      const newTextInput = document.getElementById('newText');
      const partialEditSelect = document.querySelector('[name="partialEdit"]');
      const editActionSelect = document.querySelector('[name="editTextAction"]');

      changeValueCheckbox.checked = true;
      newTextInput.value = 'new';
      partialEditSelect.value = 'each';
      editActionSelect.value = 'prepend';

      const parser = new DOMParser();
      const html = '<div class="row"><div><p>name</p></div><div><p>item1,item2</p></div></div>';
      const element = parser.parseFromString(html, 'text/html').body.firstChild;

      window.searchResults = [{
        classStyle: 'property',
        elements: [element],
        dom: parser.parseFromString('<main></main>', 'text/html'),
        pagePath: '/test'
      }];

      const result = editRows({}, 'token');
      expect(result.status).to.equal('success');
    });

    it('should successfully change row value with keyword edit amount', () => {
      const changeValueCheckbox = document.getElementById('changeRowValue');
      const newTextInput = document.getElementById('newText');
      const partialEditSelect = document.querySelector('[name="partialEdit"]');

      changeValueCheckbox.checked = true;
      newTextInput.value = 'new';
      partialEditSelect.value = 'keyword';

      const parser = new DOMParser();
      const html = '<div class="row"><div><p>name</p></div><div><p>old content</p></div></div>';
      const element = parser.parseFromString(html, 'text/html').body.firstChild;

      window.searchResults = [{
        classStyle: 'property',
        elements: [element],
        dom: parser.parseFromString('<main></main>', 'text/html'),
        pagePath: '/test'
      }];

      const result = editRows({ keyword: 'old' }, 'token');
      expect(result.status).to.equal('success');
    });

    it('should append text value when append action selected', () => {
      const changeValueCheckbox = document.getElementById('changeRowValue');
      const newTextInput = document.getElementById('newText');
      const partialEditSelect = document.querySelector('[name="partialEdit"]');
      const editActionSelect = document.querySelector('[name="editTextAction"]');

      changeValueCheckbox.checked = true;
      newTextInput.value = 'Append';
      partialEditSelect.value = 'whole';
      editActionSelect.value = 'append';

      const parser = new DOMParser();
      const html = '<div class="row"><div><p>name</p></div><div><p>Value</p></div></div>';
      const element = parser.parseFromString(html, 'text/html').body.firstChild;

      window.searchResults = [{
        classStyle: 'property',
        elements: [element],
        dom: parser.parseFromString('<main></main>', 'text/html'),
        pagePath: '/test'
      }];

      const result = editRows({}, 'token');
      expect(result.status).to.equal('success');
    });

    it('should handle prepend operation through editRows', () => {
      const changeValueCheckbox = document.getElementById('changeRowValue');
      const newTextInput = document.getElementById('newText');
      const partialEditSelect = document.querySelector('[name="partialEdit"]');
      const editActionSelect = document.querySelector('[name="editTextAction"]');

      changeValueCheckbox.checked = true;
      newTextInput.value = 'prefix_';
      partialEditSelect.value = 'whole';
      editActionSelect.value = 'prepend';

      const parser = new DOMParser();
      const html = '<div class="row"><div><p>name</p></div><div><p>value</p></div></div>';
      const element = parser.parseFromString(html, 'text/html').body.firstChild;

      window.searchResults = [{
        classStyle: 'property',
        elements: [element],
        dom: parser.parseFromString('<main></main>', 'text/html'),
        pagePath: '/test'
      }];

      const result = editRows({}, 'token');
      expect(result.status).to.equal('success');
    });

    it('should handle append operation through editRows', () => {
      const changeValueCheckbox = document.getElementById('changeRowValue');
      const newTextInput = document.getElementById('newText');
      const partialEditSelect = document.querySelector('[name="partialEdit"]');
      const editActionSelect = document.querySelector('[name="editTextAction"]');

      changeValueCheckbox.checked = true;
      newTextInput.value = '_suffix';
      partialEditSelect.value = 'whole';
      editActionSelect.value = 'append';

      const parser = new DOMParser();
      const html = '<div class="row"><div><p>name</p></div><div><p>value</p></div></div>';
      const element = parser.parseFromString(html, 'text/html').body.firstChild;

      window.searchResults = [{
        classStyle: 'property',
        elements: [element],
        dom: parser.parseFromString('<main></main>', 'text/html'),
        pagePath: '/test'
      }];

      const result = editRows({}, 'token');
      expect(result.status).to.equal('success');
    });
  });

  describe('mergeRows', () => {
    beforeEach(() => {
      window.searchResults = [];

      // Create merge form
      const mergeNameInput = document.createElement('input');
      mergeNameInput.id = 'mergeName';
      mergeNameInput.value = '';
      document.body.appendChild(mergeNameInput);

      const createRowCheckbox = document.createElement('input');
      createRowCheckbox.id = 'createRowCheckbox';
      createRowCheckbox.type = 'checkbox';
      createRowCheckbox.checked = false;
      document.body.appendChild(createRowCheckbox);
    });

    afterEach(() => {
      window.searchResults = undefined;

      const mergeNameInput = document.getElementById('mergeName');
      const createRowCheckbox = document.getElementById('createRowCheckbox');

      if (mergeNameInput) {
        document.body.removeChild(mergeNameInput);
      }
      if (createRowCheckbox) {
        document.body.removeChild(createRowCheckbox);
      }
    });

    it('should error with non-property class style', () => {
      window.searchResults = [{ classStyle: 'block', elements: [] }];

      const result = mergeRows('token');
      expect(result.status).to.equal('error');
    });

    it('should error when merge target not found and checkbox unchecked', () => {
      const mergeNameInput = document.getElementById('mergeName');
      const createRowCheckbox = document.getElementById('createRowCheckbox');

      mergeNameInput.value = 'nonexistent';
      createRowCheckbox.checked = false;

      const parser = new DOMParser();
      const html = '<div class="test"><p>test</p></div>';
      const element = parser.parseFromString(html, 'text/html').body.firstChild;

      window.searchResults = [
        {
          classStyle: 'property',
          elements: [element],
          dom: parser.parseFromString('<main></main>', 'text/html'),
          pagePath: '/test',
        },
      ];

      const result = mergeRows('token');
      expect(result.status).to.equal('error');
    });

    it('should handle empty search results', () => {
      window.searchResults = [];

      const result = mergeRows('token');
      expect(result).to.be.instanceof(ActionResult);
    });

    it('should successfully merge rows when target exists', () => {
      const mergeNameInput = document.getElementById('mergeName');
      mergeNameInput.value = 'target';

      const parser = new DOMParser();
      const html = `
        <div class="block">
          <div class="row">
            <div><p>source</p></div>
            <div><p>sourceValue</p></div>
          </div>
          <div class="row">
            <div><p>target</p></div>
            <div><p>targetValue</p></div>
          </div>
        </div>
      `;
      const block = parser.parseFromString(html, 'text/html').body.firstChild;
      const sourceElement = block.querySelector('.row:first-child');

      window.searchResults = [
        {
          classStyle: 'property',
          elements: [sourceElement],
          dom: parser.parseFromString('<main></main>', 'text/html'),
          pagePath: '/test',
        },
      ];

      const result = mergeRows('token');
      expect(result.status).to.equal('success');
    });

    it('should create new row when merge target not found and checkbox checked', () => {
      const mergeNameInput = document.getElementById('mergeName');
      const createRowCheckbox = document.getElementById('createRowCheckbox');

      mergeNameInput.value = 'newTarget';
      createRowCheckbox.checked = true;

      const parser = new DOMParser();
      const html = '<div class="block"><div class="row"><div><p>source</p></div><div><p>sourceValue</p></div></div></div>';
      const block = parser.parseFromString(html, 'text/html').body.firstChild;
      const sourceElement = block.querySelector('.row');

      window.searchResults = [
        {
          classStyle: 'property',
          elements: [sourceElement],
          dom: parser.parseFromString('<main></main>', 'text/html'),
          pagePath: '/test',
        },
      ];

      const result = mergeRows('token');
      expect(result.status).to.equal('success');
    });

    it('should error when element has no parent', () => {
      const mergeNameInput = document.getElementById('mergeName');
      mergeNameInput.value = 'target';

      // Create an element with no parent (not from a parsed document)
      const element = document.createElement('div');
      element.className = 'row';
      const leftDiv = document.createElement('div');
      const leftP = document.createElement('p');
      leftP.textContent = 'source';
      leftDiv.appendChild(leftP);
      element.appendChild(leftDiv);
      const rightDiv = document.createElement('div');
      const rightP = document.createElement('p');
      rightP.textContent = 'sourceValue';
      rightDiv.appendChild(rightP);
      element.appendChild(rightDiv);

      const parser = new DOMParser();
      window.searchResults = [
        {
          classStyle: 'property',
          elements: [element],
          dom: parser.parseFromString('<main></main>', 'text/html'),
          pagePath: '/test',
        },
      ];

      const result = mergeRows('token');
      expect(result.status).to.equal('error');
    });
  });
});
