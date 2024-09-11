/* global after before describe it */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { decorateBlock, loadBlock } = await import('../../../scripts/aem.js');
const data = await readFile({ path: './jmp-all.json' });

function jsonOk(body) {
  const mockResponse = new Response(JSON.stringify(body), {
    ok: true,
  });

  return Promise.resolve(mockResponse);
}

const stub = sinon.stub(window, 'fetch');

describe('Listgroup Block', () => {
  describe('Generic Or Filter Test', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(data)));
      document.body.innerHTML = await readFile({ path: './orListgroup.html' });
      const listgroupBlock = document.querySelector('.listgroup');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('Check that limit is applied', async () => {
      const listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(10);
    });

    it('When images is not specified, then images should be displayed.', async () => {
      const firstResult = document.querySelector('li');
      const image = firstResult.querySelector('.image');
      expect(image).to.exist;
    });

    it('When columns is not specified, then there are five columns displayed', async () => {
      const columnsList = document.querySelector('.col-size-5');
      expect(columnsList).to.exist;
    });

    after(async () => {
      stub.reset();
    });
  });

  describe('AND Filter Test', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(data)));
      document.body.innerHTML = await readFile({ path: './andListgroup.html' });
      const listgroupBlock = document.querySelector('.listgroup');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('Check that the right number of items is returned', async () => {
      const listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(2);
    });

    after(async () => {
      stub.reset();
    });
  });

  describe('Options Test', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(data)));
      document.body.innerHTML = await readFile({ path: './optionsListgroup.html' });
      const listgroupBlock = document.querySelector('.listgroup');
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('Check that the right number of items is returned', async () => {
      const listofitems = document.querySelector('ul.listOfItems');
      expect(6).to.equal(listofitems.children.length);
    });

    it('When images=off, there is no image tag in the card', async () => {
      const firstResult = document.querySelector('li');
      const image = firstResult.querySelector('.image');
      expect(image).to.not.exist;
    });

    it('When cols=3, then there are three columns displayed', async () => {
      const columnsList = document.querySelector('.col-size-3');
      expect(columnsList).to.exist;
    });

    after(async () => {
      stub.reset();
    });
  });
});
