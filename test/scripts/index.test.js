import {
  before,
  describe,
  expect,
  it,
} from '@esm-bundle/chai';

const aemHelper = await import('../../scripts/aem.js');

describe('Index ', () => {
  let languageIndexExists;

  before(async () => {
    languageIndexExists = aemHelper.languageIndexExists;
  });

  it('Language index should exist for certain languages', () => {
    expect(true, languageIndexExists('en'));
    expect(true, languageIndexExists('FR'));
    expect(true, languageIndexExists('zh_hans'));
    expect(false, languageIndexExists('en_us'));
  });
});
