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
    const iframe = document.querySelector('iframe');
    expect(iframe).to.exist;

    const embedWrapper = iframe.closest('.embed.embed-ceros');
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

    const block = document.querySelector('#tabs-block');
    const newWrapper = document.createElement('div');
    const blockChild = document.createElement('div');
    blockChild.textContent = 'Block content';
    newWrapper.append(blockChild);
    block.append(newWrapper);

    await decorate(block, helpers);

    const newPanel = block.querySelectorAll('[role="tabpanel"]')[2];
    expect(newPanel.lastElementChild.innerHTML.trim()).to.not.match(/^<p>.*<\/p>$/);

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