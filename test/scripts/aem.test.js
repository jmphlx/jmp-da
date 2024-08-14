/* global before describe it */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const aemHelper = await import('../../scripts/aem.js');

describe('aem.js tests', () => {
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
