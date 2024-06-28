import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { buildBlock, decorateBlock, loadBlock } = await import('../../../scripts/aem.js');
const listgroup = await import('../../../blocks/listgroup/listgroup.js');

document.body.innerHTML = await readFile({ path: './main.html' });
const data = await readFile({ path: './jmp-all.json' });

// const sleep = async (time = 1000) => new Promise((resolve) => {
//   setTimeout(() => {
//     resolve(true);
//   }, time);
// });

function jsonOk (body) {
  var mockResponse = new Response(JSON.stringify(body), {
    ok: true
  });

  return Promise.resolve(mockResponse);
}

let stub = sinon.stub(window, 'fetch'); //add stub
stub.onCall(0).returns(jsonOk(JSON.parse(data)));

const listgroupBlock = document.querySelector('.listgroup');
document.querySelector('main').append(listgroupBlock);
decorateBlock(listgroupBlock);
await loadBlock(listgroupBlock);
// await sleep();

describe('listgroup block', () => {
  let andFilter;
  let arrayIncludesAllValues;
  let getFilterOptions;

  before(async () => {
    andFilter = listgroup.andFilter;
    arrayIncludesAllValues = listgroup.arrayIncludesAllValues;
    getFilterOptions = listgroup.getFilterOptions;
  });

  // it('Displays footer content', async () => {
  //   const a = document.querySelector('li');
  //   expect(a).to.exist;
  //   // expect(andFilter(data, {})).to.not.be.null;
  //   expect(arrayIncludesAllValues(['1', '2'], ['1', '2'])).to.be.true;
  // });

  it('Test fetch', async () => {
    const a = document.querySelector('li');
    expect(a).to.exist;
    const listofitems = document.querySelector('ul.listOfItems');
    expect(listofitems.children.length).to.equal(10);
    expect(arrayIncludesAllValues(['1', '2'], ['1', '2'])).to.be.true;
  });

});
