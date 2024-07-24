/* global before describe it */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const aemHelper = await import('../../scripts/aem.js');

describe('aem.js tests', () => {
  describe('Language Index', () => {
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

  describe('Section Metadata', () => {
    let decorateSections;

    before(async () => {
      decorateSections = aemHelper.decorateSections;
      document.body.innerHTML = await readFile({ path: './sectionMetadata.html' });
    });

    it('Background image in the section metadata', () => {
      decorateSections(document.querySelector('main'));
      expect(document.querySelector('.section')).to.exist;
      const backgroundImg = document.querySelector('.background-img');
      expect(backgroundImg).to.exist;
      expect(backgroundImg.querySelector('img')).to.exist;
    });
  });
});
