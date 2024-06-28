import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { buildBlock, decorateBlock, loadBlock } = await import('../../../scripts/aem.js');
const listgroup = await import('../../../blocks/listgroup/listgroup.js');
console.log(listgroup);

document.body.innerHTML = await readFile({ path: './body.html' });
const data = await readFile({ path: './testdata.json' });

const sleep = async (time = 1000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time);
});

const listgroupBlock = buildBlock('listgroup', [['Listgroup', '/test/blocks/listgroup/listgroup']]);
document.querySelector('main').append(listgroupBlock);
decorateBlock(listgroupBlock);
await loadBlock(listgroupBlock);
await sleep();

describe('listgroup block', () => {
  let andFilter;
  let arrayIncludesAllValues;

  before(async () => {
    andFilter = listgroup.andFilter;
    arrayIncludesAllValues = listgroup.arrayIncludesAllValues;
  });

  it('Displays footer content', async () => {
    const a = document.querySelector('li');
    expect(a).to.exist;
    // expect(andFilter(data, {})).to.not.be.null;
    expect(arrayIncludesAllValues(['1', '2'], ['1', '2'])).to.be.true;
  });
});
