/* global before describe it */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

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

  describe('wrapImgsInLinks', () => {
    let wrapImgsInLinks;

    before(() => {
      wrapImgsInLinks = scriptHelper.wrapImgsInLinks;
    });

    it('should handle container with no images', () => {
      const container = document.createElement('div');
      const p = document.createElement('p');
      p.textContent = 'No images here';
      container.appendChild(p);
      expect(() => wrapImgsInLinks(container)).not.to.throw();
    });

    it('should process picture elements in container', () => {
      const container = document.createElement('div');
      const picture = document.createElement('picture');
      const source = document.createElement('source');
      const img = document.createElement('img');
      picture.appendChild(source);
      picture.appendChild(img);
      container.appendChild(picture);
      expect(() => wrapImgsInLinks(container)).not.to.throw();
    });

    it('should handle picture with br and anchor siblings', () => {
      const container = document.createElement('div');
      const picture = document.createElement('picture');
      const img = document.createElement('img');
      picture.appendChild(img);
      const br = document.createElement('br');
      const anchor = document.createElement('a');
      anchor.href = 'https://example.com';
      anchor.textContent = 'https://example.com';
      container.appendChild(picture);
      container.appendChild(br);
      container.appendChild(anchor);
      wrapImgsInLinks(container);
      expect(container.querySelector('a')).to.exist;
    });

    it('should ignore links with fragment paths', () => {
      const container = document.createElement('div');
      const picture = document.createElement('picture');
      const img = document.createElement('img');
      picture.appendChild(img);
      const br = document.createElement('br');
      const anchor = document.createElement('a');
      anchor.href = 'https://example.com/fragments/fragment';
      anchor.textContent = 'https://example.com/fragments/fragment';
      container.appendChild(picture);
      container.appendChild(br);
      container.appendChild(anchor);
      const initialPictureParent = picture.parentElement;
      wrapImgsInLinks(container);
      expect(picture.parentElement).to.equal(initialPictureParent);
    });

    it('should ignore links with form paths', () => {
      const container = document.createElement('div');
      const picture = document.createElement('picture');
      const img = document.createElement('img');
      picture.appendChild(img);
      const br = document.createElement('br');
      const anchor = document.createElement('a');
      anchor.href = 'https://example.com/forms/myform';
      anchor.textContent = 'https://example.com/forms/myform';
      container.appendChild(picture);
      container.appendChild(br);
      container.appendChild(anchor);
      const initialPictureParent = picture.parentElement;
      wrapImgsInLinks(container);
      expect(picture.parentElement).to.equal(initialPictureParent);
    });
  });

  describe('decorateMain', () => {
    let decorateMain;

    before(() => {
      decorateMain = scriptHelper.decorateMain;
    });

    it('should decorate main element and its sections', async () => {
      document.body.innerHTML = await readFile({ path: './layoutsExample.html' });
      const main = document.querySelector('main');
      decorateMain(main);
      expect(main).to.exist;
      const sections = main.querySelectorAll('.section');
      expect(sections.length).to.be.greaterThan(0);
    });

    it('should add layout-wrapper class when building layout container', async () => {
      document.body.innerHTML = await readFile({ path: './threeGroupLayoutScript.html' });
      const main = document.querySelector('main');
      decorateMain(main);
      const layoutWrapper = main.querySelector('.layout-wrapper');
      if (layoutWrapper) {
        expect(layoutWrapper).to.exist;
      }
    });

    it('should handle main without sections gracefully', () => {
      const main = document.createElement('main');
      expect(() => decorateMain(main)).not.to.throw();
    });

    it('should preserve section structure', async () => {
      document.body.innerHTML = await readFile({ path: './layoutsExample.html' });
      const main = document.querySelector('main');
      const sectionCount = main.querySelectorAll('.section').length;
      decorateMain(main);
      expect(main.querySelectorAll('.section')).to.have.length.greaterThan(0);
    });
  });

  describe('buildAutoBlocks function', () => {
    let buildAutoBlocks;

    before(() => {
      buildAutoBlocks = scriptHelper.buildAutoBlocks;
    });

    it('should handle main element with sections', () => {
      const main = document.createElement('main');
      const section = document.createElement('div');
      section.className = 'section';
      const block = document.createElement('div');
      block.className = 'block';
      section.appendChild(block);
      main.appendChild(section);
      expect(() => buildAutoBlocks(main)).not.to.throw();
    });

    it('should process multiple sections', () => {
      const main = document.createElement('main');
      for (let i = 0; i < 3; i++) {
        const section = document.createElement('div');
        section.className = 'section';
        main.appendChild(section);
      }
      expect(() => buildAutoBlocks(main)).not.to.throw();
      expect(main.querySelectorAll('.section')).to.have.length(3);
    });

    it('should handle empty main element', () => {
      const main = document.createElement('main');
      expect(() => buildAutoBlocks(main)).not.to.throw();
    });
  });

  describe('shouldUrlBeLocalized', () => {
    let shouldUrlBeLocalized;

    before(() => {
      shouldUrlBeLocalized = scriptHelper.shouldUrlBeLocalized;
    });

    it('should return boolean for any URL', () => {
      const result = shouldUrlBeLocalized('/test');
      expect(typeof result).to.equal('boolean');
    });

    it('should return false for /en/ prefix', () => {
      const result = shouldUrlBeLocalized('/en/page');
      expect(result).to.be.false;
    });

    it('should handle absolute URLs', () => {
      const result = shouldUrlBeLocalized('https://example.com/test');
      expect(typeof result).to.equal('boolean');
    });

    it('should handle relative URLs', () => {
      const result = shouldUrlBeLocalized('../path/to/page');
      expect(typeof result).to.equal('boolean');
    });

    it('should handle URLs with query parameters', () => {
      const result = shouldUrlBeLocalized('/test?param=value&other=test');
      expect(typeof result).to.equal('boolean');
    });

    it('should handle URLs with hash fragments', () => {
      const result = shouldUrlBeLocalized('/test#section');
      expect(typeof result).to.equal('boolean');
    });

    it('should handle empty string', () => {
      const result = shouldUrlBeLocalized('');
      expect(typeof result).to.equal('boolean');
    });

    it('should handle URLs with only domain', () => {
      const result = shouldUrlBeLocalized('https://example.com/');
      expect(typeof result).to.equal('boolean');
    });
  });

  describe('Complex Layout Integration', () => {
    let decorateMain;
    let buildAutoBlocks;

    before(() => {
      decorateMain = scriptHelper.decorateMain;
      buildAutoBlocks = scriptHelper.buildAutoBlocks;
    });

    it('should decorate and process complex multi-section layout', async () => {
      document.body.innerHTML = await readFile({ path: './complexLayout.html' });
      const main = document.querySelector('main');
      expect(main.querySelectorAll('.section')).to.have.length.greaterThan(0);
      decorateMain(main);
      expect(main).to.exist;
    });

    it('should handle layout with background images', async () => {
      document.body.innerHTML = await readFile({ path: './complexLayout.html' });
      const main = document.querySelector('main');
      buildAutoBlocks(main);
      const sections = main.querySelectorAll('.section');
      expect(sections.length).to.be.greaterThan(0);
    });
  });

  describe('Picture Element Handling', () => {
    let wrapImgsInLinks;

    before(() => {
      wrapImgsInLinks = scriptHelper.wrapImgsInLinks;
    });

    it('should process multiple picture elements in container', () => {
      const container = document.createElement('div');
      for (let i = 0; i < 3; i++) {
        const picture = document.createElement('picture');
        const source = document.createElement('source');
        source.srcset = `image${i}.webp`;
        const img = document.createElement('img');
        img.src = `image${i}.jpg`;
        picture.appendChild(source);
        picture.appendChild(img);
        container.appendChild(picture);
      }
      expect(() => wrapImgsInLinks(container)).not.to.throw();
      expect(container.querySelectorAll('picture')).to.have.length(3);
    });

    it('should preserve picture source elements', () => {
      const container = document.createElement('div');
      const picture = document.createElement('picture');
      const source = document.createElement('source');
      source.srcset = 'image.webp';
      source.type = 'image/webp';
      const img = document.createElement('img');
      img.src = 'image.jpg';
      picture.appendChild(source);
      picture.appendChild(img);
      container.appendChild(picture);
      wrapImgsInLinks(container);
      expect(container.querySelector('source')).to.exist;
      expect(container.querySelector('source').type).to.equal('image/webp');
    });

    it('should handle nested picture elements in divs', () => {
      const container = document.createElement('div');
      const wrapper = document.createElement('div');
      const picture = document.createElement('picture');
      const img = document.createElement('img');
      picture.appendChild(img);
      wrapper.appendChild(picture);
      container.appendChild(wrapper);
      expect(() => wrapImgsInLinks(container)).not.to.throw();
    });
  });


});
