/* global before after describe it */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { default: decorate, embedYoutube, embedVidyard } = await import('../../../blocks/embed/embed.js');

describe('Embed Block', () => {
  describe('embedYoutube', () => {
    it('embeds youtube.com URL with v parameter', () => {
      const url = new URL('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      const html = embedYoutube(url, false);
      expect(html).to.include('youtube.com/embed/dQw4w9WgXcQ');
      expect(html).to.include('rel=0');
      expect(html).to.include('<iframe');
    });

    it('embeds youtu.be shortened URL by extracting video ID', () => {
      const url = new URL('https://youtu.be/dQw4w9WgXcQ');
      const html = embedYoutube(url, false);
      expect(html).to.include('youtube.com/embed/dQw4w9WgXcQ');
    });

    it('adds autoplay and muted parameters when autoplay is true', () => {
      const url = new URL('https://www.youtube.com/watch?v=test123');
      const html = embedYoutube(url, true);
      expect(html).to.include('autoplay=1');
      expect(html).to.include('muted=1');
    });

    it('omits autoplay parameters when autoplay is false', () => {
      const url = new URL('https://www.youtube.com/watch?v=test123');
      const html = embedYoutube(url, false);
      expect(html).to.not.include('autoplay=1');
      expect(html).to.not.include('muted=1');
    });

    it('sets allow attribute with autoplay, fullscreen, and other permissions', () => {
      const url = new URL('https://www.youtube.com/watch?v=test');
      const html = embedYoutube(url, false);
      expect(html).to.include('allow="autoplay');
      expect(html).to.include('fullscreen');
      expect(html).to.include('picture-in-picture');
    });

    it('sets responsive iframe style with padding-bottom 56.25%', () => {
      const url = new URL('https://www.youtube.com/watch?v=test');
      const html = embedYoutube(url, false);
      expect(html).to.include('padding-bottom: 56.25%');
      expect(html).to.include('position: absolute');
    });

    it('handles youtu.be URLs without query parameters', () => {
      const url = new URL('https://youtu.be/abc123');
      const html = embedYoutube(url, false);
      expect(html).to.include('youtube.com/embed/abc123');
    });
  });

  describe('embedVidyard', () => {
    it('extracts video UUID from vidyard URL', () => {
      const url = new URL('https://play.vidyard.com/uuid-1234-5678-9012');
      const html = embedVidyard(url);
      expect(html).to.include('uuid-1234-5678-9012');
    });

    it('returns embed HTML with img element outside modal', () => {
      const url = new URL('https://play.vidyard.com/uuid-1234-5678-9012');
      const html = embedVidyard(url);
      expect(html).to.include('vidyard-player-embed');
      expect(html).to.not.be.null;
    });

    it('includes data-uuid attribute with video ID', () => {
      const url = new URL('https://play.vidyard.com/uuid-1234-5678-9012');
      const html = embedVidyard(url);
      expect(html).to.include('data-uuid="uuid-1234-5678-9012"');
    });

    it('includes data-v attribute set to 4', () => {
      const url = new URL('https://play.vidyard.com/uuid-1234-5678-9012');
      const html = embedVidyard(url);
      expect(html).to.include('data-v="4"');
    });

    it('extracts caption language code from cc query parameter', () => {
      const url = new URL('https://play.vidyard.com/uuid-1234?cc=en');
      const html = embedVidyard(url);
      expect(html).to.include('data-cc="en"');
    });

    it('extracts 2-char language code when cc query parameter is present', () => {
      const url = new URL('https://play.vidyard.com/uuid?cc=es');
      const html = embedVidyard(url);
      expect(html).to.include('data-cc="es"');
    });

    it('sets empty cc when no query parameter', () => {
      const url = new URL('https://play.vidyard.com/uuid');
      const html = embedVidyard(url);
      expect(html).to.include('data-cc=""');
    });

    it('sets thumbnail image source with .jpg extension', () => {
      const url = new URL('https://play.vidyard.com/uuid-1234-5678-9012');
      const html = embedVidyard(url);
      expect(html).to.include('src="https://play.vidyard.com/uuid-1234-5678-9012.jpg"');
    });

    it('returns null when modal block exists', () => {
      document.body.innerHTML = '<div class="modal block"></div>';
      const url = new URL('https://play.vidyard.com/uuid');
      const result = embedVidyard(url);
      expect(result).to.be.null;
    });

    it('sets onVidyardAPI callback when in modal', () => {
      document.body.innerHTML = '<div class="modal block"><div class="embed-vidyard"></div></div>';
      const url = new URL('https://play.vidyard.com/uuid');
      embedVidyard(url);
      expect(window.onVidyardAPI).to.be.a('function');
      delete window.onVidyardAPI;
    });

    it('sets autoplay to 1 in modal callback config', () => {
      document.body.innerHTML = '<div class="modal block"><div class="embed-vidyard"></div></div>';
      const url = new URL('https://play.vidyard.com/uuid');
      const spy = sinon.spy();
      const originalAPI = window.onVidyardAPI;
      embedVidyard(url);
      const mockEmbed = { api: { renderPlayer: spy } };
      window.onVidyardAPI(mockEmbed);
      const callArgs = spy.firstCall.args[0];
      expect(callArgs.autoplay).to.equal(1);
      delete window.onVidyardAPI;
    });
  });

  describe('decorate Function', () => {
    it('extracts link href and clears block content', () => {
      document.body.innerHTML = `
        <div class="embed">
          <a href="https://www.youtube.com/watch?v=test">Link text</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      expect(block.textContent).to.not.include('Link text');
    });

    it('creates embed-placeholder wrapper when picture element exists', () => {
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://www.youtube.com/watch?v=test">Link</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      expect(block.querySelector('.embed-placeholder')).to.exist;
    });

    it('preserves picture element in placeholder', () => {
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://www.youtube.com/watch?v=test">Link</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      const picture = block.querySelector('picture');
      expect(picture).to.exist;
      expect(picture.querySelector('img')).to.exist;
    });

    it('adds play button with correct structure', () => {
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://www.youtube.com/watch?v=test">Link</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      const playBtn = block.querySelector('.embed-placeholder-play button');
      expect(playBtn).to.exist;
      expect(playBtn.getAttribute('type')).to.equal('button');
      expect(playBtn.getAttribute('title')).to.equal('Play');
    });

    it('loads embed on placeholder click', () => {
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://www.youtube.com/watch?v=test">Link</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      const playBtn = block.querySelector('button');
      playBtn.click();
      expect(block.querySelector('iframe')).to.exist;
    });

    it('adds type-specific class after click', () => {
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://www.youtube.com/watch?v=test">Link</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      const playBtn = block.querySelector('button');
      playBtn.click();
      expect(block.classList.contains('embed-youtube')).to.be.true;
    });

    it('marks block as embed-is-loaded after click', () => {
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://www.youtube.com/watch?v=test">Link</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      const playBtn = block.querySelector('button');
      playBtn.click();
      expect(block.classList.contains('embed-is-loaded')).to.be.true;
    });

    it('sets up intersection observer when no placeholder', () => {
      const observerStub = sinon.stub(window, 'IntersectionObserver').returns({
        observe: sinon.stub(),
        disconnect: sinon.stub(),
      });
      document.body.innerHTML = `
        <div class="embed">
          <a href="https://www.youtube.com/watch?v=test">Link</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      expect(observerStub.called).to.be.true;
      observerStub.restore();
    });


    it('loads youtube embed correctly', () => {
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">YouTube</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      const playBtn = block.querySelector('button');
      playBtn.click();
      const iframe = block.querySelector('iframe');
      expect(iframe.src).to.include('youtube.com/embed/dQw4w9WgXcQ');
    });

    it('loads vimeo embed correctly', () => {
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://vimeo.com/123456789">Vimeo</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      const playBtn = block.querySelector('button');
      playBtn.click();
      const iframe = block.querySelector('iframe');
      expect(iframe.src).to.include('player.vimeo.com/video/123456789');
    });

    it('loads twitter embed correctly', () => {
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://twitter.com/user/status/123">Twitter</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      const playBtn = block.querySelector('button');
      playBtn.click();
      expect(block.querySelector('.twitter-tweet')).to.exist;
    });

    it('loads default embed for unknown URL', () => {
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://example.com/video">Example</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      const playBtn = block.querySelector('button');
      playBtn.click();
      const iframe = block.querySelector('iframe');
      expect(iframe).to.exist;
      expect(iframe.src).to.include('example.com/video');
    });

    it('calls loadScript for twitter embeds', () => {
      const headAppendStub = sinon.stub(document.querySelector('head'), 'append');
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://twitter.com/user/status/123">Twitter</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      const playBtn = block.querySelector('button');
      playBtn.click();
      expect(headAppendStub.called).to.be.true;
      headAppendStub.restore();
    });

    it('calls loadScript for vidyard embeds', () => {
      const headAppendStub = sinon.stub(document.querySelector('head'), 'append');
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://play.vidyard.com/uuid">Vidyard</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      const playBtn = block.querySelector('button');
      playBtn.click();
      expect(headAppendStub.called).to.be.true;
      headAppendStub.restore();
    });
  });

  describe('Intersection Observer Lazy Loading', () => {
    it('loads embed when block enters viewport', () => {
      let observeCallback;
      const mockObserver = {
        observe: sinon.stub(),
        disconnect: sinon.stub(),
      };
      sinon.stub(window, 'IntersectionObserver').callsFake((callback) => {
        observeCallback = callback;
        return mockObserver;
      });

      document.body.innerHTML = `
        <div class="embed">
          <a href="https://www.youtube.com/watch?v=test">YouTube</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);

      // Simulate intersection
      observeCallback([{ isIntersecting: true }]);

      expect(block.querySelector('iframe')).to.exist;
      expect(mockObserver.disconnect.called).to.be.true;

      window.IntersectionObserver.restore();
    });

    it('does not load embed when block is not intersecting', () => {
      let observeCallback;
      const mockObserver = {
        observe: sinon.stub(),
        disconnect: sinon.stub(),
      };
      sinon.stub(window, 'IntersectionObserver').callsFake((callback) => {
        observeCallback = callback;
        return mockObserver;
      });

      document.body.innerHTML = `
        <div class="embed">
          <a href="https://www.youtube.com/watch?v=test">YouTube</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);

      // Simulate no intersection
      observeCallback([{ isIntersecting: false }]);

      expect(block.querySelector('iframe')).to.not.exist;
      expect(mockObserver.disconnect.called).to.be.false;

      window.IntersectionObserver.restore();
    });

    it('disconnects observer after first intersection', () => {
      let observeCallback;
      const mockObserver = {
        observe: sinon.stub(),
        disconnect: sinon.stub(),
      };
      sinon.stub(window, 'IntersectionObserver').callsFake((callback) => {
        observeCallback = callback;
        return mockObserver;
      });

      document.body.innerHTML = `
        <div class="embed">
          <a href="https://www.youtube.com/watch?v=test">YouTube</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);

      observeCallback([{ isIntersecting: true }]);

      expect(mockObserver.disconnect.called).to.be.true;

      window.IntersectionObserver.restore();
    });
  });

  describe('Title Attribute', () => {
    it('sets iframe title for youtube', () => {
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://www.youtube.com/watch?v=test">YouTube</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      const playBtn = block.querySelector('button');
      playBtn.click();
      const iframe = block.querySelector('iframe');
      expect(iframe.getAttribute('title')).to.include('Youtube');
    });

    it('sets iframe title for vimeo', () => {
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://vimeo.com/123456">Vimeo</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      const playBtn = block.querySelector('button');
      playBtn.click();
      const iframe = block.querySelector('iframe');
      expect(iframe.getAttribute('title')).to.include('Vimeo');
    });

    it('sets iframe title for default embed using hostname', () => {
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://example.com/video">Example</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      const playBtn = block.querySelector('button');
      playBtn.click();
      const iframe = block.querySelector('iframe');
      expect(iframe.getAttribute('title')).to.include('example.com');
    });
  });

  describe('Embed Attributes', () => {
    it('youtube iframe has allow attribute with required permissions', () => {
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://www.youtube.com/watch?v=test">YouTube</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      const playBtn = block.querySelector('button');
      playBtn.click();
      const iframe = block.querySelector('iframe');
      expect(iframe.getAttribute('allow')).to.include('autoplay');
    });

    it('all iframes have loading="lazy" attribute', () => {
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://www.youtube.com/watch?v=test">YouTube</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      const playBtn = block.querySelector('button');
      playBtn.click();
      const iframe = block.querySelector('iframe');
      expect(iframe.getAttribute('loading')).to.equal('lazy');
    });

    it('vimeo iframe has frameborder=0', () => {
      document.body.innerHTML = `
        <div class="embed">
          <picture><img src="test.jpg" alt=""></picture>
          <a href="https://vimeo.com/123456">Vimeo</a>
        </div>
      `;
      const block = document.querySelector('.embed');
      decorate(block);
      const playBtn = block.querySelector('button');
      playBtn.click();
      const iframe = block.querySelector('iframe');
      expect(iframe.getAttribute('frameborder')).to.equal('0');
    });
  });
});
