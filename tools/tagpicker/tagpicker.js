// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';

import {
  getJsonFromUrl,
  // getJsonFromLocalhostUrl,
} from '../../scripts/jmp.js';

import { saveToDa } from '../../scripts/helper.js';

const tagURL = 'https://www.jmp.com/services/tagsservlet';
// const tagURL = 'https://edge-www-dev.jmp.com/services/tagsservlet';

const selectedTagDisplay = document.getElementById('selected-tag');
const addedTagsList = document.getElementById('tags-list');

let openTag = [];
const savedTags = [];

function getMetadata(metadataEl) {
  if (!metadataEl) return {};
  return [...metadataEl.childNodes].reduce((rdx, row) => {
    if (row.children) {
      const key = row.children[0]?.textContent?.trim().toLowerCase();
      const content = row.children[1];
      if (key && content) rdx[key] = content.textContent.trim();
    }
    return rdx;
  }, {});
}

function loadExistingTags(metadata) {
  const tagKeys = Object.keys(metadata).filter((key) => {
    return key.startsWith('tags');
  });

  tagKeys.forEach((key) => {
    const tagString = metadata[key];
    if (tagString && tagString.trim().length > 0) {
      const tags = tagString.split(',').map((t) => t.trim());
      tags.forEach((tag) => {
        if (tag) {
          savedTags.push([tag]);
          const li = document.createElement('li');
          li.textContent = tag;
          li.addEventListener('click', () => {
            li.remove();
          });
          addedTagsList.appendChild(li);
        }
      });
    }
  });
}

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
    const tagValName = item['jcr:title']
      .toLowerCase()
      .replaceAll('&', 'and')
      .replaceAll(' ', '-')
      .replace('(intro-stats)-', '');
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
  return tagArray.join(',\n');
}

function createTagsRow() {
  const row = document.createElement('div');
  row.innerHTML = '<div><p>tags</p></div><div><p></p></div>';
  return row;
}

async function submitTags(e, actions, context, token) {
  e.stopPropagation();

  try {
    // Fetch the source document
    const pageSourceUrl = `https://admin.da.live/source/${context.org}/${context.repo}${context.path}.html?nocache=${Date.now()}`;
    const resp = await actions.daFetch(pageSourceUrl);
    if (!resp.ok) {
      console.error('Failed to fetch source document');
      actions.closeLibrary();
      return;
    }

    const text = await resp.text();
    const dom = new DOMParser().parseFromString(text, 'text/html');
    let metadataEl = dom.querySelector('.metadata');

    // Throw error if metadata block doesn't exist
    if (!metadataEl) {
      console.error('Metadata block not found on page. Please add a metadata block before using the tag picker.');
      return;
    }

    // Find or create the tags row
    let tagsRow = null;
    [...metadataEl.childNodes].forEach((row) => {
      if (row.children) {
        const key = row.children[0]?.textContent?.trim().toLowerCase();
        if (key && key.startsWith('tags')) {
          tagsRow = row;
        }
      }
    });

    if (!tagsRow) {
      tagsRow = createTagsRow();
      metadataEl.appendChild(tagsRow);
    }

    // Update the tags value
    if (tagsRow && tagsRow.children[1]) {
      const valueCell = tagsRow.children[1];
      const pElement = valueCell.querySelector('p') || (() => {
        const p = document.createElement('p');
        valueCell.appendChild(p);
        return p;
      })();
      pElement.textContent = convertSavedTagsToString();
    }

    // Get the main content and save back to document
    const main = dom.querySelector('main');
    if (main) {
      await saveToDa(main.innerHTML, context.path, token);
    }
  } catch (error) {
    console.error('Failed to update tags:', error);
  }

  actions.closeLibrary();
}

async function init() {
  const { actions, context, token } = await DA_SDK;

  const tagData = await getJsonFromUrl(tagURL);
  const menu = createMenu(tagData);

  // Fetch and load existing tags from source document
  try {
    const pageSourceUrl = `https://admin.da.live/source/${context.org}/${context.repo}${context.path}.html?nocache=${Date.now()}`;
    const resp = await actions.daFetch(pageSourceUrl);
    if (resp.ok) {
      const text = await resp.text();
      const dom = new DOMParser().parseFromString(text, 'text/html');
      const metadata = getMetadata(dom.querySelector('.metadata'));
      loadExistingTags(metadata);
    }
  } catch (error) {
    console.error('Failed to load existing tags:', error);
  }

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
    submitTags(e, actions, context, token);
  });
}

init();
