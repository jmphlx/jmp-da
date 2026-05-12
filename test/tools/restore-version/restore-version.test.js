/* eslint no-unused-vars: 0 */
/* global describe it beforeEach afterEach */
import { expect } from '@esm-bundle/chai';
import { html, fixture } from '@open-wc/testing';
import sinon from 'sinon';

const {
  createInvalidCard,
  createCard,
  addLoadingSearch,
  createResultHeader,
} = await import('../../../tools/restore-version/restore-version.js');

describe('Restore Version Functions', () => {
  let container;
  let sandbox;

  beforeEach(async () => {
    container = await fixture(html`<div></div>`);
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createInvalidCard', () => {
    it('creates invalid card with error message for given path', () => {
      const pagePath = '/test/page.html';
      const card = createInvalidCard(pagePath);

      expect(card.className).to.include('card-body');
      expect(card.className).to.include('invalid');
      expect(card.querySelector('.invalid-msg')).to.exist;
      expect(card.querySelector('.invalid-msg').textContent).to.equal(
        `No Versions Exist for ${pagePath}`
      );
    });

    it('displays different page paths in error message', () => {
      const paths = ['/products/software.html', '/content/index.html', '/page.html'];
      paths.forEach((path) => {
        const card = createInvalidCard(path);
        expect(card.textContent).to.include(path);
        expect(card.querySelector('.invalid-msg').textContent).to.include(path);
      });
    });
  });

  describe('createCard', () => {
    it('creates card with checkbox and title span', () => {
      const pagePath = '/test/page.html';
      const card = createCard(pagePath, { data: [] });

      const checkbox = card.querySelector('input[type="checkbox"]');
      expect(checkbox).to.exist;
      expect(checkbox.name).to.equal('selectRestore');
      expect(checkbox.value).to.equal(pagePath);

      const titleSpan = card.querySelector('.title');
      expect(titleSpan).to.exist;
      expect(titleSpan.textContent).to.equal(pagePath);
    });

    it('toggles selected class on checkbox change', () => {
      const card = createCard('/page.html', { data: [] });
      const checkbox = card.querySelector('input[type="checkbox"]');

      expect(card.classList.contains('selected')).to.be.false;

      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      expect(card.classList.contains('selected')).to.be.true;

      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      expect(card.classList.contains('selected')).to.be.false;
    });

    it('creates version dropdown with options and icon when versions exist', () => {
      const versionList = {
        data: [
          { url: '/v1', date: 'Jan 1', time: '12:00 AM' },
          { url: '/v2', date: 'Jan 2', time: '1:00 PM' },
        ],
      };
      const card = createCard('/page.html', versionList);

      const select = card.querySelector('select');
      expect(select).to.exist;
      expect(select.options.length).to.equal(2);
      expect(select.options[0].value).to.equal('/v1');
      expect(select.options[0].textContent).to.equal('Jan 1 12:00 AM');
      expect(select.options[1].value).to.equal('/v2');
      expect(select.options[1].textContent).to.equal('Jan 2 1:00 PM');

      const icon = card.querySelector('img.open-page');
      expect(icon).to.exist;
      expect(icon.src).to.include('new-tab-icon.svg');
    });

    it('does not create dropdown when version list is empty or undefined', () => {
      const cardEmpty = createCard('/page.html', { data: [] });
      expect(cardEmpty.querySelector('select')).to.not.exist;

      const cardUndefined = createCard('/page.html', undefined);
      expect(cardUndefined.querySelector('select')).to.not.exist;
    });
  });

  describe('addLoadingSearch', () => {
    it('clears container and adds loading state with text', () => {
      const testContainer = document.createElement('div');
      testContainer.innerHTML = '<p>Old content</p>';
      const loadingText = 'Loading versions...';

      addLoadingSearch(testContainer, loadingText);

      expect(testContainer.innerHTML).to.not.include('<p>Old content</p>');
      const loadingDiv = testContainer.querySelector('.loading-state');
      expect(loadingDiv).to.exist;
      expect(loadingDiv.textContent).to.equal(loadingText);
    });

    it('handles different loading messages', () => {
      const messages = ['Loading...', 'Searching...', 'Processing...'];
      messages.forEach((msg) => {
        const container = document.createElement('div');
        addLoadingSearch(container, msg);
        expect(container.querySelector('.loading-state').textContent).to.equal(msg);
      });
    });
  });

  describe('createResultHeader', () => {
    it('creates header with title and three buttons', () => {
      const header = createResultHeader();

      expect(header.className).to.equal('results-header');
      expect(header.querySelector('h2')).to.exist;
      expect(header.querySelector('h2').textContent).to.equal('Results');

      const btnContainer = header.querySelector('.btn-container');
      expect(btnContainer).to.exist;

      const buttons = btnContainer.querySelectorAll('button');
      expect(buttons).to.have.lengthOf(3);
      expect(buttons[0].className).to.include('select-all-btn');
      expect(buttons[0].textContent).to.equal('Select All');
      expect(buttons[1].className).to.include('deselect-all-btn');
      expect(buttons[1].textContent).to.equal('Deselect All');
      expect(buttons[2].className).to.include('restore-btn');
      expect(buttons[2].textContent).to.equal('Restore Page Versions');
    });
  });
});
