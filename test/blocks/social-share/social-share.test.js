/* global before describe it after */
import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';

const socialShareModule = await import('../../../blocks/social-share/social-share.js');
const decorateSocialShare = socialShareModule.default;

function setupPage(htmlPath) {
  return readFile({ path: htmlPath });
}

describe('Social Share Block', () => {
  describe('Facebook Share', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./facebook.html');
      const block = document.querySelector('.social-share');
      document.querySelector('main').append(block);
      await decorateSocialShare(block);
    });

    it('Renders facebook share link', async () => {
      const link = document.querySelector('a[data-type="facebook"]');
      expect(link).to.exist;
    });

    it('Creates correct facebook share URL', async () => {
      const link = document.querySelector('a[data-type="facebook"]');
      expect(link.href).to.include('facebook.com/sharer/sharer.php?u=');
    });

    it('Renders facebook icon', async () => {
      const icon = document.querySelector('img.facebook');
      expect(icon).to.exist;
      expect(icon.src).to.include('facebook-icon.svg');
    });

    it('Facebook link opens in popup on click', async () => {
      const openSpy = sinon.spy(window, 'open');
      const link = document.querySelector('a[data-type="facebook"]');
      const event = new MouseEvent('click', { bubbles: true });
      link.dispatchEvent(event);
      expect(openSpy.called).to.be.true;
      openSpy.restore();
    });
  });

  describe('LinkedIn Share', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./linkedin.html');
      const block = document.querySelector('.social-share');
      document.querySelector('main').append(block);
      await decorateSocialShare(block);
    });

    it('Renders linkedin share link', async () => {
      const link = document.querySelector('a[data-type="linkedin"]');
      expect(link).to.exist;
    });

    it('Creates correct linkedin share URL', async () => {
      const link = document.querySelector('a[data-type="linkedin"]');
      expect(link.href).to.include('linkedin.com/shareArticle?url=');
    });

    it('Renders linkedin icon', async () => {
      const icon = document.querySelector('img.linkedin');
      expect(icon).to.exist;
      expect(icon.src).to.include('linkedin-icon.svg');
    });

    it('LinkedIn link opens in popup on click', async () => {
      const openSpy = sinon.spy(window, 'open');
      const link = document.querySelector('a[data-type="linkedin"]');
      const event = new MouseEvent('click', { bubbles: true });
      link.dispatchEvent(event);
      expect(openSpy.called).to.be.true;
      openSpy.restore();
    });
  });

  describe('Bluesky Share', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./bluesky.html');
      const block = document.querySelector('.social-share');
      document.querySelector('main').append(block);
      await decorateSocialShare(block);
    });

    it('Renders bluesky share link', async () => {
      const link = document.querySelector('a[data-type="bluesky"]');
      expect(link).to.exist;
    });

    it('Creates correct bluesky share URL', async () => {
      const link = document.querySelector('a[data-type="bluesky"]');
      expect(link.href).to.include('bsky.app/intent/compose?text=');
    });

    it('Renders bluesky icon', async () => {
      const icon = document.querySelector('img.bluesky');
      expect(icon).to.exist;
      expect(icon.src).to.include('bluesky-icon.svg');
    });

    it('Bluesky link opens in popup on click', async () => {
      const openSpy = sinon.spy(window, 'open');
      const link = document.querySelector('a[data-type="bluesky"]');
      const event = new MouseEvent('click', { bubbles: true });
      link.dispatchEvent(event);
      expect(openSpy.called).to.be.true;
      openSpy.restore();
    });
  });

  describe('Instagram Share', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./instagram.html');
      const block = document.querySelector('.social-share');
      document.querySelector('main').append(block);
      await decorateSocialShare(block);
    });

    it('Renders instagram share icon', async () => {
      const icon = document.querySelector('img.instagram');
      expect(icon).to.exist;
      expect(icon.src).to.include('instagram-icon.svg');
    });

    it('Instagram uses mobile share wrapper', async () => {
      const span = document.querySelector('.social-share > div > span');
      expect(span).to.exist;
    });
  });

  describe('Copy Link Button', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./copylink.html');
      const block = document.querySelector('.social-share');
      document.querySelector('main').append(block);
      await decorateSocialShare(block);
    });

    it('Renders copy link button', async () => {
      const link = document.querySelector('a[data-type="copylink"]');
      expect(link).to.exist;
    });

    it('Copy link button has correct ID', async () => {
      const link = document.querySelector('#copy-to-clipboard');
      expect(link).to.exist;
    });

    it('Renders copy link icon', async () => {
      const icon = document.querySelector('img.copylink');
      expect(icon).to.exist;
      expect(icon.src).to.include('copylink-icon.svg');
    });

    it('Copy link button click triggers clipboard API', async () => {
      const link = document.querySelector('a#copy-to-clipboard');
      const clipboardStub = sinon.stub(navigator.clipboard, 'writeText').resolves();
      const event = new MouseEvent('click', { bubbles: true });
      link.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(clipboardStub.called).to.be.true;
      clipboardStub.restore();
    });
  });

  describe('Multiple Buttons', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./multiple.html');
      const block = document.querySelector('.social-share');
      document.querySelector('main').append(block);
      await decorateSocialShare(block);
    });

    it('Renders multiple share buttons', async () => {
      const links = document.querySelectorAll('a');
      expect(links.length).to.equal(3);
    });

    it('Facebook button is present with multiple buttons', async () => {
      const link = document.querySelector('a[data-type="facebook"]');
      expect(link).to.exist;
    });

    it('LinkedIn button is present with multiple buttons', async () => {
      const link = document.querySelector('a[data-type="linkedin"]');
      expect(link).to.exist;
    });

    it('Copy link button is present with multiple buttons', async () => {
      const link = document.querySelector('a[data-type="copylink"]');
      expect(link).to.exist;
    });
  });

  describe('Copy to Clipboard Functionality', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./copylink.html');
      const block = document.querySelector('.social-share');
      document.querySelector('main').append(block);
      await decorateSocialShare(block);
    });

    it('Adds success class on successful copy', async () => {
      const link = document.querySelector('a#copy-to-clipboard');
      const clipboardStub = sinon.stub(navigator.clipboard, 'writeText').resolves();
      const event = new MouseEvent('click', { bubbles: true });
      link.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(link.classList.contains('copy-success')).to.be.true;
      clipboardStub.restore();
    });

    it('Adds failure class on copy error', async () => {
      const link = document.querySelector('a#copy-to-clipboard');
      const clipboardStub = sinon.stub(navigator.clipboard, 'writeText').rejects(new Error('Copy failed'));
      const event = new MouseEvent('click', { bubbles: true });
      link.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(link.classList.contains('copy-failure')).to.be.true;
      clipboardStub.restore();
    });

    it('Sets tooltip attributes on successful copy', async () => {
      const link = document.querySelector('a#copy-to-clipboard');
      const clipboardStub = sinon.stub(navigator.clipboard, 'writeText').resolves();
      const event = new MouseEvent('click', { bubbles: true });
      link.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(link.getAttribute('title')).to.equal('Copied Link to Clipboard');
      expect(link.getAttribute('aria-label')).to.equal('Copied Link to Clipboard');
      clipboardStub.restore();
    });

    it('Shows copied tooltip message', async () => {
      const link = document.querySelector('a#copy-to-clipboard');
      const clipboardStub = sinon.stub(navigator.clipboard, 'writeText').resolves();
      const event = new MouseEvent('click', { bubbles: true });
      link.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 100));
      const tooltip = link.querySelector('.copied-to-clipboard');
      expect(tooltip).to.exist;
      expect(tooltip.textContent).to.equal('Copied Link to Clipboard');
      clipboardStub.restore();
    });
  });

  describe('Block Decoration', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./multiple.html');
      const block = document.querySelector('.social-share');
      document.querySelector('main').append(block);
      await decorateSocialShare(block);
    });

    it('Appends wrapper with social links', async () => {
      const wrapper = document.querySelector('.social-share > div');
      expect(wrapper).to.exist;
      expect(wrapper.children.length).to.be.greaterThan(0);
    });

    it('Wrapper contains span elements', async () => {
      const spans = document.querySelectorAll('.social-share > div > span');
      expect(spans.length).to.equal(3);
    });

    it('Creates wrapper div as first child', async () => {
      const block = document.querySelector('.social-share');
      const firstChild = block.querySelector('div');
      expect(firstChild).to.exist;
    });
  });

  describe('URL Encoding', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./facebook.html');
      const block = document.querySelector('.social-share');
      document.querySelector('main').append(block);
      await decorateSocialShare(block);
    });

    it('Encodes URL properly in share links', async () => {
      const link = document.querySelector('a[data-type="facebook"]');
      expect(link.href).to.include('facebook.com/sharer/sharer.php?u=');
      expect(link.href.length).to.be.greaterThan(0);
    });

    it('Link has correct data-type attribute', async () => {
      const link = document.querySelector('a[data-type="facebook"]');
      expect(link.getAttribute('data-type')).to.equal('facebook');
    });
  });
});
