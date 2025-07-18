/**
 * Determine if any list items in the unordered list have the
 * active class applied.
 * @param {Element} block
 * @returns true if an item has the active class
 */
function isDropdownActive(block) {
  return block.querySelectorAll('.active').length > 0;
}

function addHovers(ul) {
  const subLists = ul.querySelectorAll('ul.sub');
  subLists.forEach((list) => {
    const listItems = list.querySelectorAll('li.is-dropdown');
    listItems.forEach((li) => {
      li.addEventListener('mouseenter', () => {
        li.classList.add('is-open');
      });
      li.addEventListener('mouseleave', () => {
        li.classList.remove('is-open');
      });
    });
  });
}

/**
 * Close all dropdowns with the is-open class below this element.
 * @param {HTMLElement} element - current li element
 */
function closeAllNested(element) {
  element.classList.remove('is-open');
  const children = element.querySelectorAll('li.is-open');
  children.forEach((child) => child.classList.remove('is-open'));
}

/**
 * When another top level dropdown is clicked, all other top level dropdowns
 * should close.
 * @param {HTMLElement} clicked
 */
function closeOtherDropdowns(clicked) {
  const siblings = Array.from(clicked.parentElement.children);
  siblings.forEach((sibling) => {
    if (sibling !== clicked) {
      sibling.classList.remove('is-open');
      closeAllNested(sibling);
    }
  });
}

/**
 * Create a subdropdown.
 * @param {*} dropdownItems
 * @returns ul html element
 */
function createDropdown(dropdownItems) {
  const ul = document.createElement('ul');
  ul.classList.add('sub');
  const dropdownList = dropdownItems.querySelectorAll(':scope > li');
  dropdownList.forEach((item) => {
    const buttonLevel = item.children[0];
    const childItems = item.children[1];
    // eslint-disable-next-line no-use-before-define
    const li = createListItem(buttonLevel, childItems);
    ul.append(li);
  });
  return ul;
}

/**
 * Create an li within a ul.
 * @param {*} parentElement - the element with the name of the item on it.
 * @param {*} childElements - any child elements indicating it is a subdropdown.
 * @returns li element
 */
function createListItem(parentElement, childElements) {
  const li = document.createElement('li');
  let isDropdown = false;

  const parentLink = parentElement.tagName === 'A' ? parentElement : parentElement.querySelector('a');
  if (parentLink) {
    if (parentLink.classList.contains('button')) {
      parentLink.classList.remove('button');
    }
    li.append(parentLink);
  } else {
    li.textContent = parentElement.textContent;
  }
  if (childElements && childElements.children?.length > 0) {
    li.classList.add('is-dropdown');
    isDropdown = true;
    if (childElements.tagName !== 'UL') {
      li.append(createDropdown(childElements.querySelector('ul')));
    } else {
      li.append(createDropdown(childElements));
    }
    li.addEventListener('click', (e) => {
      e.stopPropagation();
      const clicked = e.target.closest('li');
      closeOtherDropdowns(clicked);
      if (li.classList.contains('is-open')) {
        li.classList.remove('is-open');
      } else {
        li.classList.add('is-open');
      }
    });
  }
  if (li.querySelector('a').href === window.location.href
      || (isDropdown && isDropdownActive(li))) {
    li.classList.add('active');
  }

  return li;
}

export default async function decorate(block) {
  const wrapper = document.createElement('nav');
  wrapper.classList = 'main';
  const listOfDropdowns = document.createElement('ul');
  listOfDropdowns.classList.add('topLevel');

  // Iterate over table rows
  while (block.firstElementChild) {
    const row = block.firstElementChild;
    block.firstElementChild.remove();

    // Look for second column.
    const buttonLevel = row?.children?.item(0);
    const dropdownItems = row?.children?.item(1);

    const li = createListItem(buttonLevel, dropdownItems);
    listOfDropdowns.append(li);
  }
  if (block.classList.contains('dropdown-flyout')) {
    addHovers(listOfDropdowns);
  }
  wrapper.append(listOfDropdowns);
  block.append(wrapper);
}
