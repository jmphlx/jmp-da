/* global before describe it */
import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';

const { decorateBlock, loadBlock } = await import('../../../scripts/aem.js');

const pagedata = await readFile({ path: './test-index.json' });
const querydata = await readFile({ path: './custom-query.json' });
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
      console.log(listgroupBlock);
      document.querySelector('main').append(listgroupBlock);
      decorateBlock(listgroupBlock);
      await loadBlock(listgroupBlock);
    });

    it('Verify list items are correct after running query', async () => {
      const listofitems = document.querySelector('ul.listOfItems');
      expect(listofitems.children.length).to.equal(5);
    });
  });

});