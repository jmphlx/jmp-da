// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';

import {
  getJsonFromUrl,
  // getJsonFromLocalhostUrl,
} from '../../scripts/jmp.js';

//const tagURL = 'https://www.jmp.com/services/tagsservlet';
const tagURL = 'https://edge-www-dev.jmp.com/services/tagsservlet';

const selectedTagDisplay = document.getElementById('selected-tag');
const addedTagsList = document.getElementById('tags-list');

let openTag = [];
const savedTags = [];

function closeDescendants(element) {
  const openElements = element.querySelectorAll('.open');
  openElements.forEach((el) => el.classList.remove('open'));
}

function updateBreadcrumb() {
  if (openTag.length) {
    selectedTagDisplay.textContent = openTag.join('|');
    selectedTagDisplay.classList.add('tag-added');
  } else {
    selectedTagDisplay.textContent = '(none)';
    selectedTagDisplay.classList.remove('tag-added');
  }
}

function createMenu(items, path = []) {
  const ul = document.createElement('ul');

  items.forEach((item) => {
    const tagValName = item['jcr:title'].toLowerCase().replaceAll(' ', '-');
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = item['jcr:title'];
    span.classList.add('item-name');

    const currentTag = [...path, tagValName];

    if (item.children && item.children.length > 0) {
      li.classList.add('toggle');
      li.appendChild(span);

      const childMenu = createMenu(item.children, currentTag);
      childMenu.classList.add('children');
      li.appendChild(childMenu);

      span.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = li.classList.toggle('open');

        // Collapse children if closing
        if (!isOpen) {
          closeDescendants(li);
          openTag = currentTag.slice(0, -1);
        } else {
          openTag = currentTag;
        }

        updateBreadcrumb();
      });
    } else {
      li.appendChild(span);
      span.addEventListener('click', (e) => {
        e.stopPropagation();
        openTag = currentTag;
        updateBreadcrumb();
      });
    }

    ul.appendChild(li);
  });

  return ul;
}

function saveCurrentTag() {
  if (openTag.length === 0) return;

  savedTags.push([...openTag]);
  const li = document.createElement('li');
  li.textContent = openTag.join('|');
  li.addEventListener('click', () => {
    // if clicked remove.
    li.remove();
  });
  addedTagsList.appendChild(li);
}

function resetSelection() {
  openTag = [];
  updateBreadcrumb();

  // Collapse all open menu items
  const openElements = document.querySelectorAll('.open');
  openElements.forEach((el) => el.classList.remove('open'));
}

function convertSavedTagsToString() {
  const tagArray = [];
  const tagList = addedTagsList.children;
  for (let i = 0; i < tagList.length; i++) {
    tagArray.push(tagList[i].textContent);
  }
  console.log(tagArray);
  return tagArray.join(',\n');
}

function submitTags(e, actions) {
  e.stopPropagation();
  actions.sendText(convertSavedTagsToString());
  actions.closeLibrary();
}

async function init() {
  const { actions } = await DA_SDK;

  const tagData = await getJsonFromUrl(tagURL);

  const menu = createMenu(tagData);

  const buttonContainer = document.getElementById('button-container');
  const saveCurr = document.createElement('button');
  saveCurr.addEventListener('click', saveCurrentTag);
  saveCurr.textContent = 'Add Current Tag';
  const reset = document.createElement('button');
  reset.addEventListener('click', resetSelection);
  reset.textContent = 'Reset';
  buttonContainer.append(saveCurr, reset);
  document.getElementById('menu-container').appendChild(menu);

  const saveTagsButton = document.getElementById('saveTags');
  saveTagsButton.addEventListener('click', (e) => {
    submitTags(e, actions);
  });
}

init();
