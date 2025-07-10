/* global beforeEach describe it */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

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
      dropdownButton.click();

      const openDropdown = document.querySelector('li.is-open');
      expect(openDropdown.firstChild.textContent).to.equal('By Industry');
    });

    it('Clicking on an open dropdown should close it', async () => {
      const dropdownButton = document.querySelector('nav ul li');
      dropdownButton.click();
      let openDropdown = document.querySelector('li.is-open');

      dropdownButton.click();
      openDropdown = document.querySelector('li.is-open');
      expect(openDropdown).to.be.null;
    });

    // it('should apply the active class to a list item that matches the current page', () => {
    //   const dropdownItems = document.querySelector('ul');
    //   const dropdown = constructDropdown(dropdownItems, 'http://localhost:2000/en/sandbox/laurel/subnav/chemical');

    //   const listItems = dropdown.querySelectorAll('li');
    //   expect(9).to.equal(listItems.length);

    //   const activeListItems = dropdown.querySelectorAll('li.active');
    //   expect(1).to.equal(activeListItems.length);
    //   expect('Chemical').to.equal(activeListItems[0].textContent);
    // });
  });

  describe('SKP Header Subnav', () => {
    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './subnavSkpBlock.html' });
      const subnavBlock = document.querySelector('.subnav');
      document.querySelector('main').append(subnavBlock);
      decorateBlock(subnavBlock);
      await loadBlock(subnavBlock);
    });

    it('All top level dropdowns should have an anchor', async () => {
      const listOfDropdowns = document.querySelectorAll('nav.main > ul > li');
      expect(listOfDropdowns.length).to.equal(9);

      const topAnchors = document.querySelectorAll('nav.main > ul > li > a');
      expect(topAnchors.length).to.equal(9);
    });

    it('Should be 2 sub dropdowns with a total 6 children', async () => {
      const subDropdown = document.querySelectorAll('nav ul li.is-dropdown');
      expect(subDropdown.length).to.equal(2);

      const subDropdownItems = document.querySelectorAll('nav.main > ul > li > ul a');
      expect(subDropdownItems.length).to.equal(6);
    });
  });
});
