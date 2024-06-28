/* eslint-disable no-unused-expressions */
/* global describe before it beforeEach afterEach */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const aemHelper = await import('../../scripts/aem.js');

describe('Index ', () => {
  let languageIndexExists;
  let getJsonFromUrl;

  before(async () => {
    languageIndexExists = aemHelper.languageIndexExists;
    getJsonFromUrl = await aemHelper.getJsonFromUrl;
  });

  it('Language index should exist for certain languages', () => {
    expect(true, languageIndexExists('en'));
    expect(true, languageIndexExists('FR'))
    expect(true, languageIndexExists('zh_hans'));
    expect(false, languageIndexExists('en_us'));
  });

});
