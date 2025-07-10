import { expect } from '@esm-bundle/chai';
import decorate from '../../../blocks/tabs-two-column/tabs-two-column.js'; // Adjust path as needed

describe('decorate()', () => {
  let block;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="tabs-block">
        <div><div>Tab 1</div><div>Content 1</div></div>
        <div><div>Tab 2</div><div>Content 2</div></div>
      </div>
    `;
    block = document.getElementById('tabs-block');
  });

  it('adds tablist and tabs correctly', async () => {
    await decorate(block);

    const tablist = block.querySelector('.tabs-list');
    expect(tablist).to.exist;
    const buttons = tablist.querySelectorAll('.tabs-tab');
    expect(buttons.length).to.equal(2);

    const tabpanels = block.querySelectorAll('.tabs-panel');
    expect(tabpanels.length).to.equal(2);

    // Check ARIA attributes
    expect(buttons[0].getAttribute('aria-selected')).to.equal('true');
    expect(tabpanels[0].getAttribute('aria-hidden')).to.equal('false');
    expect(buttons[1].getAttribute('aria-selected')).to.equal('false');
    expect(tabpanels[1].getAttribute('aria-hidden')).to.equal('true');
  });

  it('switches tab on button click', async () => {
    await decorate(block);
    const buttons = block.querySelectorAll('.tabs-tab');

    // Simulate click on second tab
    buttons[1].click();

    const tabpanels = block.querySelectorAll('.tabs-panel');
    expect(tabpanels[0].getAttribute('aria-hidden')).to.equal('true');
    expect(tabpanels[1].getAttribute('aria-hidden')).to.equal('false');
    expect(buttons[0].getAttribute('aria-selected')).to.equal('false');
    expect(buttons[1].getAttribute('aria-selected')).to.equal('true');
  });
});
