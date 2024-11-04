/* global before describe it */
import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';

const { decorateBlock, loadBlock } = await import('../../../scripts/aem.js');

const customerAPage = await readFile({ path: './customerA.html' });
const seminarBPage = await readFile({ path: './seminarB.html' });
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
      expect(listItems[0].querySelector('img')?.src).to.equal('http://localhost:3000/icons/jmp-com-share.jpg');
      expect(listItems[0].querySelector('span.resourceType')?.textContent).to.equal('Customer Story');

      expect(listItems[1].querySelector('span.title')?.textContent).to.equal('Seminar B');
    });

    
    after(async () => {
      stub.reset();
    });
  });

});