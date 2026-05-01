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

    it('Verify redirect target opens in new tab', async () => {
      const links = document.querySelectorAll('ul.listOfItems li a');
      const blankLinks = [...links].filter(a => a.target === '_blank');
      expect(blankLinks.length).to.equal(1);
      expect(blankLinks[0].href).to.include('external.example.com');
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
      // industry is a tag property — pre-seed tagtranslations so getTagTranslations()
      // short-circuits without consuming a fetch stub slot.
      window.tagtranslations = {
        'industry|chemistry': 'Chemistry',
        'industry|industrial-manufacturing': 'Industrial Manufacturing',
      };
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

      dropdown.value = 'industry|chemistry';
      dropdown.dispatchEvent(new Event('change'));

      listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(2);
    });

    after(async () => {
      delete window.tagtranslations;
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

  describe('Load More Button', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      stub.onCall(1).returns(jsonOk(JSON.parse(querydata)));
      document.body.innerHTML = await readFile({ path: './loadMoreListgroup.html' });
      const listgroupBlock = document.querySelector('.listgroup-custom');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('Initially shows only limit items', async () => {
      const listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(3);
    });

    it('Load more button exists and is enabled', async () => {
      const btn = document.querySelector('.load-more-container button');
      expect(btn).to.exist;
      expect(btn.disabled).to.be.false;
    });

    it('Clicking load more adds remaining items and disables button', async () => {
      const btn = document.querySelector('.load-more-container button');
      btn.click();
      const listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(5);
      expect(btn.disabled).to.be.true;
    });

    it('Load more items include redirect target link', async () => {
      const links = document.querySelectorAll('ul.listOfItems li a');
      const blankLinks = [...links].filter(a => a.target === '_blank');
      expect(blankLinks.length).to.equal(1);
      expect(blankLinks[0].href).to.include('external.example.com');
    });

    after(async () => {
      stub.reset();
    });
  });

  describe('Load More Button Disabled Initially', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      stub.onCall(1).returns(jsonOk(JSON.parse(querydata)));
      document.body.innerHTML = await readFile({ path: './loadMoreSmallListgroup.html' });
      const listgroupBlock = document.querySelector('.listgroup-custom');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('Shows all items when count equals limit', async () => {
      const listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(5);
    });

    it('Load more button is disabled when matching count does not exceed limit', async () => {
      const btn = document.querySelector('.load-more-container button');
      expect(btn).to.exist;
      expect(btn.disabled).to.be.true;
    });

    after(async () => {
      stub.reset();
    });
  });

  describe('Tag Display Properties', () => {
    before(async () => {
      window.tagtranslations = { 'industry|chemistry': 'Chemistry' };
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      stub.onCall(1).returns(jsonOk(JSON.parse(querydata)));
      document.body.innerHTML = await readFile({ path: './tagDisplayListgroup.html' });
      const listgroupBlock = document.querySelector('.listgroup-custom');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('Renders 5 items with tag display properties', async () => {
      const listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(5);
    });

    it('Translates tag property using tagtranslations', async () => {
      const spans = document.querySelectorAll('span.industry');
      const chemistrySpan = [...spans].find(s => s.textContent === 'Chemistry');
      expect(chemistrySpan).to.exist;
    });

    it('Falls back to raw value when tag has no translation', async () => {
      const spans = document.querySelectorAll('span.industry');
      const fallbackSpan = [...spans].find(s => s.textContent.includes('industrial-manufacturing'));
      expect(fallbackSpan).to.exist;
    });

    after(async () => {
      delete window.tagtranslations;
      stub.reset();
    });
  });

  describe('Simple Date Display', () => {
    before(async () => {
      window.dateFns = { format: (date, fmt) => `formatted:${date}` };
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      stub.onCall(1).returns(jsonOk(JSON.parse(querydata)));
      document.body.innerHTML = await readFile({ path: './simpleDateListgroup.html' });
      const listgroupBlock = document.querySelector('.listgroup-custom');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('Renders 5 items with date display properties', async () => {
      const listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(5);
    });

    it('Renders releaseDate span without format string', async () => {
      const spans = document.querySelectorAll('span.releaseDate');
      expect(spans.length).to.equal(5);
      const filledSpan = [...spans].find(s => s.textContent === '2024-06-19');
      expect(filledSpan).to.exist;
    });

    after(async () => {
      delete window.dateFns;
      stub.reset();
    });
  });

  describe('Formatted Date Display', () => {
    before(async () => {
      window.dateFns = { format: (date, fmt) => `formatted:${date}` };
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      stub.onCall(1).returns(jsonOk(JSON.parse(querydata)));
      document.body.innerHTML = await readFile({ path: './dateFormatListgroup.html' });
      const listgroupBlock = document.querySelector('.listgroup-custom');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('Renders 5 items with formatted date display', async () => {
      const listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(5);
    });

    it('Calls dateFns.format for items with non-empty releaseDate', async () => {
      const spans = document.querySelectorAll('span.releaseDate');
      const formattedSpan = [...spans].find(s => s.textContent.startsWith('formatted:'));
      expect(formattedSpan).to.exist;
      expect(formattedSpan.textContent).to.equal('formatted:2024-06-19');
    });

    after(async () => {
      delete window.dateFns;
      stub.reset();
    });
  });

  describe('Filter With Load More', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      stub.onCall(1).returns(jsonOk(JSON.parse(querydata)));
      document.body.innerHTML = await readFile({ path: './filterLoadMoreListgroup.html' });
      const listgroupBlock = document.querySelector('.listgroup-custom');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('Initially shows limit items with load more button and dropdown', async () => {
      const listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(3);
      const btn = document.querySelector('.load-more-container button');
      expect(btn).to.exist;
      expect(btn.disabled).to.be.false;
    });

    it('Dropdown has options from comma-split author values', async () => {
      const dropdown = document.querySelector('select.filterDropdown');
      expect(dropdown).to.exist;
      const options = dropdown.querySelectorAll('option');
      expect(options.length).to.equal(4);
    });

    it('Changing dropdown triggers reBuildList removing load-more-container', async () => {
      const dropdown = document.querySelector('select.filterDropdown');
      dropdown.value = 'Alice';
      dropdown.dispatchEvent(new Event('change'));

      const listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(1);

      const btn = document.querySelector('.load-more-container button');
      expect(btn).to.exist;
      expect(btn.disabled).to.be.true;
    });

    after(async () => {
      stub.reset();
    });
  });

});