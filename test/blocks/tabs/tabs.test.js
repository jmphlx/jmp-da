/* global beforeEach describe it */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import decorate from '../../../blocks/tabs/tabs.js';

describe('Tabs Block', () => {
  let helpers;

  beforeEach(async () => {
    // Define test helpers (mock dependencies)
    helpers = {
      embedVidyard: () => '<iframe src="mock-video"></iframe>',
      toClassName: (text) => text.toLowerCase().replace(/\s+/g, '-'),
    };

    document.body.innerHTML = await readFile({ path: './tabs.html' });

    const block = document.querySelector('#tabs-block');
    await decorate(block, helpers);
  });

  it('Should embed Vidyard iframe and remove original link', () => {
    const player = document.querySelector('img.vidyard-player-embed');
    expect(player).to.exist;

    const embedWrapper = player.closest('.embed.embed-ceros');
    expect(embedWrapper).to.exist;

    const originalLink = document.querySelector('a[href*="vidyard"]');
    expect(originalLink).to.be.null;
  });

  it('Should create tablist with tab buttons and tabpanels', () => {
    const tablist = document.querySelector('.tabs-list');
    expect(tablist).to.exist;

    const tabs = tablist.querySelectorAll('button[role="tab"]');
    const panels = document.querySelectorAll('[role="tabpanel"]');

    expect(tabs.length).to.equal(2);
    expect(panels.length).to.equal(2);
  });

  it('Should set correct ARIA attributes', () => {
    const buttons = document.querySelectorAll('button[role="tab"]');
    const panels = document.querySelectorAll('[role="tabpanel"]');

    expect(buttons[0].getAttribute('aria-selected')).to.equal('true');
    expect(panels[0].getAttribute('aria-hidden')).to.equal('false');
    expect(buttons[1].getAttribute('aria-selected')).to.equal('false');
    expect(panels[1].getAttribute('aria-hidden')).to.equal('true');
  });

  it('Should wrap panel content in <p> if not block-displayed', () => {
    const panel = document.querySelector('[role="tabpanel"]');
    expect(panel.lastElementChild.innerHTML.trim()).to.match(/^<p>.*<\/p>$/);
  });

  it('Should NOT wrap panel content if block-displayed', async () => {
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = () => ({ display: 'block' });

    // Use a fresh single-tab block so re-decorating an already-processed
    // block does not destroy existing panels.
    document.body.innerHTML = `
      <div id="block-display-test">
        <div>
          <div>Tab Label</div>
          <div><div>Block level content</div></div>
        </div>
      </div>`;
    const freshBlock = document.querySelector('#block-display-test');
    await decorate(freshBlock);

    const panel = freshBlock.querySelector('[role="tabpanel"]');
    expect(panel.lastElementChild.innerHTML.trim()).to.not.match(/^<p>.*<\/p>$/);

    window.getComputedStyle = originalGetComputedStyle;
  });

  it('Should change tab state on click', () => {
    const buttons = document.querySelectorAll('button[role="tab"]');
    const panels = document.querySelectorAll('[role="tabpanel"]');

    buttons[1].click();

    expect(buttons[0].getAttribute('aria-selected')).to.equal('false');
    expect(panels[0].getAttribute('aria-hidden')).to.equal('true');

    expect(buttons[1].getAttribute('aria-selected')).to.equal('true');
    expect(panels[1].getAttribute('aria-hidden')).to.equal('false');
  });
});