/* eslint-disable no-unused-expressions */
/* global describe before it beforeEach afterEach */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const scriptHelper = await import('../../scripts/scripts.js');
const aemHelper = await import('../../scripts/aem.js');

//document.body.innerHTML = await readFile({ path: './body.html' });
//document.head.innerHTML = await readFile({ path: './head.html' });

describe('Index ', () => {
  let languageIndexExists;
  let createElement;
  let getJsonFromUrl;

  before(async () => {
    languageIndexExists = aemHelper.languageIndexExists;
    createElement = scriptHelper.createElement;
    getJsonFromUrl = await aemHelper.getJsonFromUrl;
  });

  it('Language index should exist for certain languages', () => {
    expect(true, languageIndexExists('en'));
    expect(true, languageIndexExists('FR'))
    expect(true, languageIndexExists('zh_hans'));
    expect(false, languageIndexExists('en_us'));
  });

});
