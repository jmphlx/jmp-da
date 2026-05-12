/* global before after describe it */
import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';

const { decorateBlock, loadBlock } = await import('../../../scripts/aem.js');

const pagedata = await readFile({ path: './test-events.json' });
const stub = sinon.stub(window, 'fetch');

function jsonOk(body) {
  const mockResponse = new Response(JSON.stringify(body), { ok: true });
  return Promise.resolve(mockResponse);
}

async function setupBlock(htmlPath) {
  document.body.innerHTML = await readFile({ path: htmlPath });
  const block = document.querySelector('.listgroup-events');
  document.querySelector('main').append(block);
  decorateBlock(block);
  await loadBlock(block);
}

describe('Listgroup Events', () => {
  describe('Generic', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      await setupBlock('./eventsBlock.html');
    });

    it('renders a single list of items', () => {
      const lists = document.querySelectorAll('ul.listOfItems');
      expect(lists.length).to.equal(1);
    });

    it('excludes past events and noindex pages, showing 3 items', () => {
      const items = document.querySelectorAll('ul.listOfItems li');
      expect(items.length).to.equal(3);
    });

    it('sorts items by eventDateTime ascending', () => {
      const titles = [...document.querySelectorAll('ul.listOfItems li .title')].map((el) => el.textContent);
      expect(titles[0]).to.equal('Conference A');
      expect(titles[1]).to.equal('Webinar B');
      expect(titles[2]).to.equal('Redirect Event');
    });

    it('applies default col-size-5 class to the list', () => {
      const list = document.querySelector('ul.listOfItems');
      expect(list.classList.contains('col-size-5')).to.be.true;
      expect(list.classList.contains('list-tile')).to.be.true;
    });

    it('excludes past events', () => {
      const titles = [...document.querySelectorAll('ul.listOfItems li .title')].map((el) => el.textContent);
      expect(titles).to.not.include('Past Event');
    });

    it('excludes noindex pages', () => {
      const titles = [...document.querySelectorAll('ul.listOfItems li .title')].map((el) => el.textContent);
      expect(titles).to.not.include('NoIndex Event');
    });

    after(() => { stub.reset(); });
  });

  describe('Card Structure', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      await setupBlock('./eventsBlock.html');
    });

    it('renders tag-category, title, and subtitle spans on each card', () => {
      const firstItem = document.querySelector('ul.listOfItems li');
      expect(firstItem.querySelector('.tag-category')).to.not.be.null;
      expect(firstItem.querySelector('.title')).to.not.be.null;
      expect(firstItem.querySelector('.subtitle')).to.not.be.null;
    });

    it('renders correct eventDisplayLabel and eventDisplayTime', () => {
      const firstLink = document.querySelector('ul.listOfItems li a');
      expect(firstLink.querySelector('.tag-category').textContent).to.equal('Conference');
      expect(firstLink.querySelector('.title').textContent).to.equal('Conference A');
      expect(firstLink.querySelector('.subtitle').textContent).to.equal('April 5, 2099 | 9:00 AM ET');
    });

    it('non-redirect card links to item path with target _self', () => {
      const firstLink = document.querySelector('ul.listOfItems li a');
      expect(firstLink.href).to.include('/en/events/conference-a');
      expect(firstLink.target).to.equal('_self');
    });

    after(() => { stub.reset(); });
  });

  describe('Redirect Target', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      await setupBlock('./eventsBlock.html');
    });

    it('redirect event link opens in a new tab', () => {
      const links = [...document.querySelectorAll('ul.listOfItems li a')];
      const redirectLink = links.find((a) => a.querySelector('.title')?.textContent === 'Redirect Event');
      expect(redirectLink).to.exist;
      expect(redirectLink.target).to.equal('_blank');
      expect(redirectLink.href).to.include('external-event.example.com');
    });

    after(() => { stub.reset(); });
  });

  describe('Limit and Columns', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      await setupBlock('./limitedEventsBlock.html');
    });

    it('respects the limit option and shows only 2 items', () => {
      const items = document.querySelectorAll('ul.listOfItems li');
      expect(items.length).to.equal(2);
    });

    it('applies the columns option as a class on the list', () => {
      const list = document.querySelector('ul.listOfItems');
      expect(list.classList.contains('col-size-3')).to.be.true;
    });

    it('limited list shows the earliest events first', () => {
      const titles = [...document.querySelectorAll('ul.listOfItems li .title')].map((el) => el.textContent);
      expect(titles[0]).to.equal('Conference A');
      expect(titles[1]).to.equal('Webinar B');
    });

    after(() => { stub.reset(); });
  });

  describe('Empty Results', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      await setupBlock('./emptyEventsBlock.html');
    });

    it('shows no-results div when no pages match the filter', () => {
      const noResults = document.querySelector('.no-results');
      expect(noResults).to.exist;
    });

    it('no-results div contains the configured message', () => {
      const noResults = document.querySelector('.no-results');
      expect(noResults.textContent).to.include('Sorry, no events are scheduled at this time.');
    });

    it('shows no list items when no pages match', () => {
      const items = document.querySelectorAll('ul.listOfItems li');
      expect(items.length).to.equal(0);
    });

    after(() => { stub.reset(); });
  });
});
