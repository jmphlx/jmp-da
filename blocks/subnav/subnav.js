/**
 * Convert the element from the block into the
 * dropdown list. Apply active class to list item
 * if the link url matches the current page.
 * @param {Element} dropdownItems
 * @returns {Element} unordered list with all list items.
 */
function constructDropdown(dropdownItems) {
  const wrapper = document.createElement('ul');
  wrapper.classList = 'sub';
  const activePage = window.location.href;
  dropdownItems.querySelectorAll('li').forEach((item) => {
    if (activePage === item.children[0].href) {
      item.classList.add('active');
    }
    wrapper.append(item);
  });

  return wrapper;
}

/**
 * Closes all nav sections
 * @param {Element} nav The nav element
 */
function closeAllNavSections(nav) {
  nav.querySelectorAll('.is-open').forEach((sections) => {
    sections.classList.remove('is-open');
  });
}

/**
 * Determine if any list items in the unordered list have the
 * active class applied.
 * @param {Element} block
 * @returns true if an item has the active class
 */
function isDropdownActive(block) {
  return block.querySelectorAll('.active').length > 0;
}

export default async function decorate(block) {
  const wrapper = document.createElement('nav');
  wrapper.classList = 'main';
  const listOfDropdowns = document.createElement('ul');

  while (block.firstElementChild !== undefined && block.firstElementChild !== null) {
    const dropdownName = block.firstElementChild?.children.item(0).textContent;
    const dropdownItems = block.firstElementChild?.children.item(1);
    block.firstElementChild.remove();

    const listItem = document.createElement('li');
    listItem.classList = 'is-dropdown';
    listItem.innerHTML = `${dropdownName}`;

    listItem.addEventListener('click', () => {
      let closeDropdown = false;
      if (listItem.classList.contains('is-open')) {
        // The dropdown is already open. Close it again.
        closeDropdown = true;
      }
      closeAllNavSections(block);
      if (!closeDropdown) {
        listItem.classList.add('is-open');
      }
    });

    const dropdownListItems = constructDropdown(dropdownItems);
    listItem.append(dropdownListItems);
    if (isDropdownActive(listItem)) {
      listItem.classList.add('active');
    }
    listOfDropdowns.append(listItem);
  }

  wrapper.append(listOfDropdowns);
  block.append(wrapper);
}
