/* global before describe it */
import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';

const { decorateBlock, loadBlock } = await import('../../../scripts/aem.js');

const customerAPage = await readFile({ path: './customerA.html' });
const seminarBPage = await readFile({ path: './seminarB.html' });
const redirectPage = await readFile({ path: './redirectPage.html' });
const taggedPage = await readFile({ path: './taggedPage.html' });
const stub = sinon.stub(window, 'fetch');

function jsonOk(body) {
  const mockResponse = new Response(body, {
    ok: true,
  });

  return Promise.resolve(mockResponse);
}

describe('Fixed Listgroup', () => {
  describe('Generic', () => {
    before(async () => {
      // resourceType is a tag property — pre-seed tagtranslations so getTagTranslations()
      // short-circuits without consuming a fetch stub slot.
      window.tagtranslations = {};
      stub.onCall(0).returns(jsonOk(customerAPage));
      stub.onCall(1).returns(jsonOk(seminarBPage));
      document.body.innerHTML = await readFile({ path: './fixedList.html' });
      const listgroupBlock = document.querySelector('.listgroup-fixed');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('Expect only one list of items', async () => {
      const listofitems = document.querySelectorAll('ul.listOfItems');
      expect(listofitems.length).to.equal(1);
    });

    it('Verify list items are correct', async () => {
      const listItems = document.querySelectorAll('ul.listOfItems li a');
      expect(listItems.length).to.equal(2);
      expect(listItems[0].children.length).to.equal(3);
      expect(listItems[0].querySelector('span.title')?.textContent).to.equal('Customer A');
      expect(listItems[0].querySelector('img')?.src).to.equal(`${window.location.origin}/icons/jmp-com-share.jpg`);
      expect(listItems[0].querySelector('span.resourceType')?.textContent).to.equal('Customer Story');

      expect(listItems[1].querySelector('span.title')?.textContent).to.equal('Seminar B');
    });


    after(async () => {
      delete window.tagtranslations;
      stub.reset();
    });
  });

  describe('Redirect Target and Relative Image', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(redirectPage));
      document.body.innerHTML = await readFile({ path: './redirectFixedList.html' });
      const listgroupBlock = document.querySelector('.listgroup-fixed');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('Redirect target link opens in new tab', async () => {
      const link = document.querySelector('ul.listOfItems li a');
      expect(link).to.exist;
      expect(link.target).to.equal('_blank');
      expect(link.href).to.include('redirect.example.com');
    });

    it('Relative image falls back via catch branch', async () => {
      const img = document.querySelector('ul.listOfItems li a img');
      expect(img).to.exist;
      expect(img.src).to.include('relative-image.jpg');
    });

    after(async () => {
      stub.reset();
    });
  });

  describe('All Pages Not Found', () => {
    before(async () => {
      window.tagtranslations = {};
      stub.onCall(0).returns(Promise.resolve(new Response('', { status: 404 })));
      stub.onCall(1).returns(Promise.resolve(new Response('', { status: 404 })));
      document.body.innerHTML = await readFile({ path: './fixedList.html' });
      const listgroupBlock = document.querySelector('.listgroup-fixed');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('Shows empty results message when all pages fail to load', async () => {
      const noResults = document.querySelector('.no-results');
      expect(noResults).to.exist;
      expect(noResults.textContent).to.include('Sorry there are no resources at this time.');
    });

    it('No list items are shown', async () => {
      const items = document.querySelectorAll('ul.listOfItems li');
      expect(items.length).to.equal(0);
    });

    after(async () => {
      delete window.tagtranslations;
      stub.reset();
    });
  });

  describe('Tag Properties with Translations', () => {
    before(async () => {
      window.tagtranslations = { 'resource-type|customer-story': 'Customer Story Label' };
      stub.onCall(0).returns(jsonOk(taggedPage));
      document.body.innerHTML = await readFile({ path: './tagFixedList.html' });
      const listgroupBlock = document.querySelector('.listgroup-fixed');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('Renders translated tag property', async () => {
      const span = document.querySelector('span.resourceType');
      expect(span).to.exist;
      expect(span.textContent).to.include('Customer Story Label');
    });

    it('Falls back to propValue for tag with no translation', async () => {
      const span = document.querySelector('span.resourceType');
      expect(span.textContent).to.include('Customer Story');
    });

    after(async () => {
      delete window.tagtranslations;
      stub.reset();
    });
  });

});
