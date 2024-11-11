/* global before describe it */
import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';

const { decorateBlock, loadBlock } = await import('../../../scripts/aem.js');

const pagedata = await readFile({ path: './test-index.json' });
const querydata = await readFile({ path: './custom-query.json' });
const multipageQueryData = await readFile({ path: './multiple-sheet-query.json' });
const stub = sinon.stub(window, 'fetch');

function jsonOk(body) {
  const mockResponse = new Response(JSON.stringify(body), {
    ok: true,
  });

  return Promise.resolve(mockResponse);
}

describe('Custom Listgroup', () => {
  describe('Generic', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      stub.onCall(1).returns(jsonOk(JSON.parse(querydata)));
      document.body.innerHTML = await readFile({ path: './customListgroup.html' });
      const listgroupBlock = document.querySelector('.listgroup-custom');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('Expect only one list of items', async () => {
      const listofitems = document.querySelectorAll('ul.listOfItems');
      expect(listofitems.length).to.equal(1);
    });

    it('Verify list items are correct after running query', async () => {
      const listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(5);
    });

    
    after(async () => {
      stub.reset();
    });
  });

  describe('Multiple Sheet Query', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      stub.onCall(1).returns(jsonOk(JSON.parse(multipageQueryData)));
      document.body.innerHTML = await readFile({ path: './customListgroup.html' });
      const listgroupBlock = document.querySelector('.listgroup-custom');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('Verify list items are correct after running query', async () => {
      const listofitems = document.querySelectorAll('ul.listOfItems');
      expect(listofitems.length).to.equal(1);
      expect(listofitems[0].children.length).to.equal(5);
    });

    after(async () => {
      stub.reset();
    });
  });

  describe('Group By', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      stub.onCall(1).returns(jsonOk(JSON.parse(multipageQueryData)));
      document.body.innerHTML = await readFile({ path: './azListgroup.html' });
      const listgroupBlock = document.querySelector('.listgroup-custom');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('When using Group By, expect multiple lists of items', async () => {
      const listofitems = document.querySelectorAll('ul.listOfItems');
      expect(listofitems.length).to.equal(4);
    });

    it('When using Group By, expect header to be created with appropriate items', async () => {
      const headerList = document.querySelector('ul.group-header');
      expect(headerList).to.not.be.undefined;
      const headerItems = headerList.querySelectorAll('li');
      expect(headerItems.length).to.equal(4);
      expect(headerItems[0].textContent).to.equal('D');
      expect(headerItems[1].textContent).to.equal('H');
      expect(headerItems[2].textContent).to.equal('P');
      expect(headerItems[3].textContent).to.equal('W');
    });

    it('Verify list items are correct after running query', async () => {
      const listOfLists = document.querySelectorAll('ul.listOfItems');
      expect(listOfLists.length).to.equal(4);
      expect(listOfLists[0].children.length).to.equal(2);
      expect(listOfLists[1].children.length).to.equal(1);
      expect(listOfLists[2].children.length).to.equal(1);
      expect(listOfLists[3].children.length).to.equal(1);
    });

    after(async () => {
      stub.reset();
    });
  });
  
  describe('Filter By Dropdown', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      stub.onCall(1).returns(jsonOk(JSON.parse(multipageQueryData)));
      document.body.innerHTML = await readFile({ path: './filterListgroup.html' });
      const listgroupBlock = document.querySelector('.listgroup-custom');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('When using Filter By, expect one list of items and dropdown', async () => {
      const listOfLists = document.querySelectorAll('ul.listOfItems');
      expect(listOfLists.length).to.equal(1);
      expect(listOfLists[0].children.length).to.equal(5);

      const dropdown = document.querySelectorAll('select.filterDropdown');
      expect(dropdown.length).to.equal(1);
      expect(dropdown[0].id).to.equal('industry');
    });

    it('Verify clicking dropdown changes things', async () => {
      let listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(5);
      const dropdown = document.querySelector('select.filterDropdown');
      expect(dropdown.value).to.equal('');
      const dropdownItems = dropdown.querySelectorAll('option');
      expect(dropdownItems.length).to.equal(3);

      dropdown.value = 'chemistry';
      dropdown.dispatchEvent(new Event('change'));

      listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(2);
    });

    after(async () => {
      stub.reset();
    });
  });

  describe('Tabs', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      stub.onCall(1).returns(jsonOk(JSON.parse(multipageQueryData)));
      document.body.innerHTML = await readFile({ path: './tabsListgroup.html' });
      const listgroupBlock = document.querySelector('.listgroup-custom');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('When using tabs, tab list is created using Tabs property', async () => {
      const tablist = document.querySelector('.tabs-list');
      expect(tablist).to.not.be.null;
      const tabs = tablist.querySelectorAll('button');
      expect(tabs.length).to.equal(4);
      expect(tabs[0].id).to.equal('all');
      expect(tabs[0].textContent).to.equal('All Resources');
      expect(tabs[1].id).to.equal('Product');
      expect(tabs[1].textContent).to.equal('JMP Products');
      expect(tabs[2].id).to.equal('Interview');
      expect(tabs[2].textContent).to.equal('Interviews');
      expect(tabs[3].id).to.equal('Customer Story');
      expect(tabs[3].textContent).to.equal('Customer Stories');
    });

    it('When using tabs, expect default tab to be all', async () => {
      const selectedTab = document.querySelector('button[aria-selected="true"');
      expect(selectedTab.id).to.equal('all');
      let listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(5);
    });

    it('When using tabs, changing the tab changes the list items', async () => {
      const selectedTab = document.querySelector('button[aria-selected="true"');
      expect(selectedTab.id).to.equal('all');
      document.querySelector('button[id="Product"').click();
      let listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(2);

      document.querySelector('button[id="all"').click();
      listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(5);
    });

    it('When using tabs, changing the tab changes the list items', async () => {
      const selectedTab = document.querySelector('button[aria-selected="true"');
      expect(selectedTab.id).to.equal('all');
      document.querySelector('button[id="Customer Story"').click();
      let listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems).to.be.null;
      listofitems = document.querySelector('div.no-results');
      expect(listofitems.textContent).to.equal('No results found.');
    });



    after(async () => {
      stub.reset();
    });
  });

  describe('Simple On-page Query', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      document.body.innerHTML = await readFile({ path: './simpleCustom.html' });
      const listgroupBlock = document.querySelector('.listgroup-custom');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('When providing a filter instead of a json file, evaluate the filter', async () => {
      const listOfLists = document.querySelectorAll('ul.listOfItems');
      expect(listOfLists.length).to.equal(1);
      expect(listOfLists[0].children.length).to.equal(2);
    });

    after(async () => {
      stub.reset();
    });
  });

  describe('On-page Query with starting Folder and multiple tag checks', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      document.body.innerHTML = await readFile({ path: './startingFolderSimpleCustom.html' });
      const listgroupBlock = document.querySelector('.listgroup-custom');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('When providing a filter and startingFolder instead of a json file, evaluate the filter', async () => {
      const listOfLists = document.querySelectorAll('ul.listOfItems');
      expect(listOfLists.length).to.equal(1);
      expect(listOfLists[0].children.length).to.equal(1);
    });

    after(async () => {
      stub.reset();
    });
  });

});