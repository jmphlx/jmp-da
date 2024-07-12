/* global afterEach beforeEach describe it */
import { readFile, sendMouse, resetMouse } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { getCenterOf } from '../../scripts/testutils.js';

const { decorateBlock, loadBlock } = await import('../../../scripts/aem.js');
const subnav = await import('../../../blocks/subnav/subnav.js');

describe('Subnav Block', () => {
  describe('Generic Block', () => {
    let constructDropdown;

    beforeEach(async () => {
      constructDropdown = subnav.constructDropdown;
      document.body.innerHTML = await readFile({ path: './subnavBlock.html' });
      const subnavBlock = document.querySelector('.subnav');
      document.querySelector('main').append(subnavBlock);
      decorateBlock(subnavBlock);
      await loadBlock(subnavBlock);
    });

    it('Should have 3 dropdowns with no active classes', async () => {
      const listOfDropdowns = document.querySelector('nav ul');
      expect(listOfDropdowns.children.length).to.equal(3);
      const activeDropdown = document.querySelector('.active');
      expect(activeDropdown).to.be.null;
    });

    it('Clicking on a dropdown should open it', async () => {
      const dropdownButton = document.querySelector('nav ul li');

      const coordinates = getCenterOf(dropdownButton);
      await sendMouse({ type: 'click', position: [coordinates.x, coordinates.y] });

      const openDropdown = document.querySelector('li.is-open');
      expect(openDropdown.firstChild.textContent).to.equal('By Industry');
    });

    it('Clicking on an open dropdown should close it', async () => {
      const dropdownButton = document.querySelector('nav ul li');
      const coordinates = getCenterOf(dropdownButton);

      await sendMouse({ type: 'click', position: [coordinates.x, coordinates.y] });
      let openDropdown = document.querySelector('li.is-open');

      await sendMouse({ type: 'click', position: [coordinates.x, coordinates.y] });
      openDropdown = document.querySelector('li.is-open');
      expect(openDropdown).to.be.null;
    });

    it('should apply the active class to a list item that matches the current page', () => {
      const dropdownItems = document.querySelector('ul');
      const dropdown = constructDropdown(dropdownItems, 'http://localhost:2000/en/sandbox/laurel/subnav/chemical');

      const listItems = dropdown.querySelectorAll('li');
      expect(9).to.equal(listItems.length);

      const activeListItems = dropdown.querySelectorAll('li.active');
      expect(1).to.equal(activeListItems.length);
      expect('Chemical').to.equal(activeListItems[0].textContent);
    });

    afterEach(async () => {
      await resetMouse();
    });
  });
});
