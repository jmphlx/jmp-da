/* global before describe it */
import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';

const { decorateBlock, loadBlock } = await import('../../../scripts/aem.js');

const assetData = await readFile({ path: './assetData.json' });
const stub = sinon.stub(window, 'fetch');

function jsonOk(body) {
  const mockResponse = new Response(typeof body === 'string' ? body : JSON.stringify(body), {
    ok: true,
  });

  return Promise.resolve(mockResponse);
}

describe('Listgroup Asset', () => {
  describe('Ascending Sort (Default)', () => {
    before(async () => {
      stub.returns(jsonOk(JSON.parse(assetData)));
      document.body.innerHTML = await readFile({ path: './assetBlock.html' });
      const assetBlock = document.querySelector('.listgroup-asset');
      document.querySelector('main').append(assetBlock);
      decorateBlock(assetBlock);
      await loadBlock(assetBlock);
    });

    it('Renders asset list with correct number of items', async () => {
      const assetList = document.querySelector('ul.assetList');
      expect(assetList).to.exist;
      const items = assetList.querySelectorAll('li');
      expect(items.length).to.equal(5);
    });

    it('Sorts assets alphabetically in ascending order', async () => {
      const links = document.querySelectorAll('ul.assetList li a');
      expect(links[0].querySelector('span.title')?.textContent).to.equal('Apple Asset');
      expect(links[1].querySelector('span.title')?.textContent).to.equal('Banana Asset');
      expect(links[2].querySelector('span.title')?.textContent).to.equal('Cherry Asset');
      expect(links[3].querySelector('span.title')?.textContent).to.equal('Mango Asset');
      expect(links[4].querySelector('span.title')?.textContent).to.equal('Orange Asset');
    });

    it('Respects the limit configuration', async () => {
      const items = document.querySelectorAll('ul.assetList li');
      expect(items.length).to.equal(5);
    });

    it('Renders correct display properties for each asset', async () => {
      const firstLink = document.querySelector('ul.assetList li a');
      const titleSpan = firstLink.querySelector('span.title');
      const descSpan = firstLink.querySelector('span.description');
      expect(titleSpan).to.exist;
      expect(descSpan).to.exist;
      expect(titleSpan.textContent).to.equal('Apple Asset');
      expect(descSpan.textContent).to.equal('Asset starting with A');
    });

    it('Sets correct href and target for asset links', async () => {
      const links = document.querySelectorAll('ul.assetList li a');
      expect(links[0].href).to.include('/assets/apple');
      expect(links[0].target).to.equal('_self');
      expect(links[1].href).to.include('/assets/banana');
      expect(links[1].target).to.equal('_self');
    });

    after(async () => {
      stub.resetHistory();
    });
  });

  describe('Descending Sort', () => {
    before(async () => {
      stub.resetHistory();
      stub.returns(jsonOk(JSON.parse(assetData)));
      document.body.innerHTML = await readFile({ path: './assetBlockDescending.html' });
      const assetBlock = document.querySelector('.listgroup-asset');
      document.querySelector('main').append(assetBlock);
      decorateBlock(assetBlock);
      await loadBlock(assetBlock);
    });

    it('Sorts assets alphabetically in descending order', async () => {
      const links = document.querySelectorAll('ul.assetList li a');
      expect(links[0].querySelector('span.title')?.textContent).to.equal('Zebra Asset');
      expect(links[1].querySelector('span.title')?.textContent).to.equal('Orange Asset');
      expect(links[2].querySelector('span.title')?.textContent).to.equal('Mango Asset');
      expect(links[3].querySelector('span.title')?.textContent).to.equal('Cherry Asset');
      expect(links[4].querySelector('span.title')?.textContent).to.equal('Banana Asset');
      expect(links[5].querySelector('span.title')?.textContent).to.equal('Apple Asset');
    });

    it('Renders all items when no limit is specified', async () => {
      const items = document.querySelectorAll('ul.assetList li');
      expect(items.length).to.equal(6);
    });

    after(async () => {
      stub.resetHistory();
    });
  });

  describe('Empty Results', () => {
    before(async () => {
      stub.resetHistory();
      stub.returns(jsonOk([]));
      document.body.innerHTML = await readFile({ path: './assetBlockEmpty.html' });
      const assetBlock = document.querySelector('.listgroup-asset');
      document.querySelector('main').append(assetBlock);
      decorateBlock(assetBlock);
      await loadBlock(assetBlock);
    });

    it('Shows empty results message when no assets are found', async () => {
      const noResults = document.querySelector('.no-results');
      expect(noResults).to.exist;
      expect(noResults.textContent).to.equal('No assets found in this folder.');
    });

    it('Does not render asset list when empty', async () => {
      const assetList = document.querySelector('ul.assetList');
      expect(assetList).to.not.exist;
    });

    after(async () => {
      stub.resetHistory();
    });
  });

  describe('Limit Behavior', () => {
    before(async () => {
      stub.resetHistory();
      stub.returns(jsonOk(JSON.parse(assetData)));
      document.body.innerHTML = await readFile({ path: './assetBlockDescending.html' });
      const assetBlock = document.querySelector('.listgroup-asset');
      document.querySelector('main').append(assetBlock);
      decorateBlock(assetBlock);
      await loadBlock(assetBlock);
    });

    it('Shows all items when limit is not specified', async () => {
      const items = document.querySelectorAll('ul.assetList li');
      expect(items.length).to.equal(6);
    });

    after(async () => {
      stub.resetHistory();
    });
  });

  describe('Null Asset List', () => {
    before(async () => {
      stub.resetHistory();
      stub.returns(jsonOk(null));
      document.body.innerHTML = await readFile({ path: './assetBlockEmpty.html' });
      const assetBlock = document.querySelector('.listgroup-asset');
      document.querySelector('main').append(assetBlock);
      decorateBlock(assetBlock);
      await loadBlock(assetBlock);
    });

    it('Shows empty results message for null asset list', async () => {
      const noResults = document.querySelector('.no-results');
      expect(noResults).to.exist;
    });

    after(async () => {
      stub.resetHistory();
    });
  });

});
