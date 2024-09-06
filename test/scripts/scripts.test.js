/* global before describe it */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const scriptHelper = await import('../../scripts/scripts.js');

describe('JMP Scripts JS Customizations ', () => {
  let buildLayoutContainer;

  describe('Group Layout Container', () => {
    before(async () => {
      buildLayoutContainer = scriptHelper.buildLayoutContainer;
      document.body.innerHTML = await readFile({ path: './threeGroupLayoutScript.html' });
      buildLayoutContainer(document.querySelector('main'));
    });

    it('Expect provided layout to be broken into 3 groups', () => {
      expect(document.querySelector('.layout-wrapper')).to.exist;
      expect(document.querySelector('.group-1')).to.exist;
      expect(document.querySelector('.group-2')).to.exist;
      expect(document.querySelector('.group-3')).to.exist;
      expect(document.querySelector('.group-4')).to.be.null;
    });

    it('Expect content to be divided between groups', () => {
      expect(document.querySelector('.group-1 .default-content-wrapper')).to.exist;
      expect(document.querySelector('.group-1 .embed-wrapper')).to.exist;
      expect(document.querySelector('.group-2 .listgroup-wrapper')).to.exist;
      expect(document.querySelector('.group-3 .default-content-wrapper')).to.exist;
    });

    it('Expect divider blocks to be removed from html', () => {
      expect(document.querySelector('.divider-wrapper')).to.be.null;
    });
  });

  describe('Section Metadata', () => {
    let buildAutoBlocks;

    before(async () => {
      buildAutoBlocks = scriptHelper.buildAutoBlocks;
      document.body.innerHTML = await readFile({ path: './sectionMetadata.html' });
    });

    it('Background image in the section metadata', () => {
      buildAutoBlocks(document.querySelector('main'));
      const backgroundImg = document.querySelector('.background-img');
      expect(backgroundImg).to.exist;
      expect(backgroundImg.querySelector('picture')).to.exist;
    });
  });
});
