// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
// eslint-disable-next-line import/no-unresolved
import { crawl } from 'https://da.live/nx/public/utils/tree.js';
import { DA_CONSTANTS } from '../../scripts/helper.js';
import {
  ActionResult,
  addNewRow,
  deleteRow,
  doReplace,
  editRows,
  mergeRows,
  resetDocumentsToOriginalState,
} from './replace.js';
import {
  addActionEventListeners,
  constructPageViewer,
  populateDropdowns,
  updateActionMessage,
  writeOutResults,
} from './ui.js';

const daSourceUrl = 'https://admin.da.live/source';
const defaultpath = '/jmphlx/jmp-da/en';
const pathPrefix = `/${DA_CONSTANTS.org}/${DA_CONSTANTS.repo}`;
let actions;
let token;

class SearchResult {
  constructor(item, elements, classStyle, dom) {
    this.path = item.path;
    // eslint-disable-next-line no-use-before-define
    this.pagePath = getPagePathFromFullUrl(item.path);
    this.elements = elements;
    this.dom = dom;
    this.original = dom.cloneNode(true);
    this.classStyle = classStyle;
  }
}

function getPagePathFromFullUrl(itemPath) {
  const splitItemPath = itemPath.split('/');
  splitItemPath.splice(1, 2);
  let basicItemPath = splitItemPath.join('/');
  const htmlExtension = basicItemPath.indexOf('.html');
  if (htmlExtension) {
    basicItemPath = basicItemPath.substring(0, htmlExtension);
  }
  return basicItemPath;
}

async function handleSearch(item, queryObject, matching, replaceFlag) {
  // Die if not a document
  if (!item.path.endsWith('.html')) return;

  const pageSourceUrl = `${daSourceUrl}${item.path}`;

  // Fetch the doc & convert to DOM
  const resp = await actions.daFetch(pageSourceUrl);
  if (!resp.ok) {
    console.log('Could not fetch item');
    return;
  }
  const text = await resp.text();
  const dom = new DOMParser().parseFromString(text, 'text/html');

  let elements = [];
  let classStyle;

  if (queryObject.scope.block) {
    const blockName = queryObject.scope.block;
    classStyle = 'block';
    if (queryObject.scope.property) {
      const propertyName = queryObject.scope.property;
      classStyle = 'property';
      const foundProperties = Array.from(dom.querySelectorAll(`div.${blockName} p`)).filter((field) => field.children.length === 0 && field.textContent.trim() === propertyName);
      console.log(foundProperties);
      foundProperties.forEach((prop) => {
        elements.push(prop.parentElement.parentElement);
      });
    } else {
      elements = dom.querySelectorAll(`div.${blockName}`);
    }
  }

  if (elements.length === 0 && queryObject.scope.tag) {
    const tagName = queryObject.scope.tag;
    let queryString = tagName;
    classStyle = 'tag';

    if (queryObject.scope.attribute) {
      const attributeName = queryObject.scope.attribute;
      queryString += `[${attributeName}*=${queryObject.keyword}]`;
      classStyle = 'attribute';
    }
    elements = dom.querySelectorAll(`${queryString}`);
  }

  if (elements.length === 0 && !queryObject.scope.block && queryObject.scope.property) {
    const propertyName = queryObject.scope.property;
    classStyle = 'property';
    const foundProperties = Array.from(dom.querySelectorAll('p')).filter((ele) => ele.children.length === 0 && ele.textContent.trim() === propertyName);
    foundProperties.forEach((prop) => {
      elements.push(prop.parentElement.parentElement);
    });
  }

  if (elements.length) {
    if (queryObject.keyword) {
      const filtered = [];
      if (classStyle === 'attribute') {
        elements.forEach((el) => {
          filtered.push(el);
        });
      } else if (classStyle === 'tag') {
        elements.forEach((el) => {
          if (el.outerHTML.toLowerCase().includes(queryObject.keyword.toLowerCase())) {
            filtered.push(el);
          }
        });
      } else {
        elements.forEach((el) => {
          if (el.textContent.toLowerCase().includes(queryObject.keyword.toLowerCase())) {
            filtered.push(el);
          }
        });
      }
      if (filtered.length) {
        const matchingEntry = new SearchResult(item, filtered, classStyle, dom);
        matching.push(matchingEntry);
        if (replaceFlag) {
          doReplace(
            token,
            dom,
            filtered,
            getPagePathFromFullUrl(item.path),
            queryObject,
            classStyle,
          );
        }
      }
    } else {
      const matchingEntry = new SearchResult(item, elements, classStyle, dom);
      matching.push(matchingEntry);
    }
  } else if (!queryObject.scope.block && !queryObject.scope.property && queryObject.keyword) {
    // If the block and property scopes were null, then still try to do keyword search
    const $newDom = $(dom);

    $($newDom).find(`*:contains("${queryObject.keyword}")`).filter(function () {
      return $(this).children((`*:contains("${queryObject.keyword}")`)).length === 0;
    }).each(function () {
      elements.push($(this).get(0));
    });

    if (elements.length) {
      const matchingEntry = new SearchResult(item, elements, undefined, dom);
      matching.push(matchingEntry);
      if (replaceFlag) {
        doReplace(token, dom, elements, getPagePathFromFullUrl(item.path), queryObject, undefined);
      }
    }
  }
}

async function doSearch(queryObject, replaceFlag) {
  const matching = [];

  let path = defaultpath;

  if (queryObject.scope.path) {
    const providedPath = queryObject.scope.path;
    if (!providedPath.startsWith(pathPrefix)) {
      path = `${pathPrefix}${providedPath}`;
    } else {
      path = providedPath;
    }
  }

  // Crawl the tree of content
  const { results } = await crawl({
    path,
    callback: (item) => handleSearch(item, queryObject, matching, replaceFlag),
    concurrent: 50,
  });
  await results;

  return matching;
}

function getQuery() {
  const queryString = document.querySelector('[name="searchTerms"]').value;

  const scope = {};
  let keyword = '';

  const scopeRegex = /(\w+):([^\s]+)/g;
  let remaining = queryString;
  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = scopeRegex.exec(queryString)) !== null) {
    scope[match[1]] = match[2];
    remaining = remaining.replace(match[0], '').trim();
  }

  const phraseMatch = remaining.match(/"([^"]+)"|(.+)/);
  keyword = phraseMatch ? (phraseMatch[1] || phraseMatch[2]) : '';

  const pathField = document.querySelector('#page-path-input')?.value;
  scope.path = pathField;

  return { scope, keyword: keyword.trim() };
}

async function getConfigurations() {
  const blockProperties = `${pathPrefix}/docs/library/blocks.json`;
  const resp = await actions.daFetch(`${daSourceUrl}${blockProperties}`);
  if (!resp.ok) {
    console.log('Could not fetch item');
    window.blockProperties = null;
  }
  const { data: blockOptions } = await resp.json();
  blockOptions.forEach((block, index) => {
    blockOptions[index].name = block.name.replaceAll(' ', '-');
  });
  window.blockProperties = blockOptions;

  const tagAttribute = `${pathPrefix}/docs/library/tag-attribute.json`;
  const respTags = await actions.daFetch(`${daSourceUrl}${tagAttribute}`);
  if (!respTags.ok) {
    console.log('Could not fetch item');
    window.tagAttribute = null;
  }
  const { data: tagOptions } = await respTags.json();
  window.tagAttribute = tagOptions;
}

window.addEventListener('message', (event) => {
  if (event.origin === 'http://localhost:3000'
    || event.origin === 'https://www.jmp.com'
    || event.origin === 'https://main--jmp-da--jmphlx.aem.live') {
    const singleInput = document.getElementById('page-path-input');
    if (event.data.length) {
      singleInput.value = event.data;
    }
  }
  if (event.origin === 'https://da.live') {
    console.log('got message from DA');
    const iframe = document.querySelector('iframe');
    iframe.contentWindow.postMessage(event.data);
  }
  const mydialog = document.querySelector('#modal');
  mydialog.close();
});

function tryToPerformAction(queryObject) {
  const deleteRadio = document.querySelector('#deleteRow');
  if (deleteRadio.checked) {
    return deleteRow(queryObject, token);
  }

  const mergeRadio = document.querySelector('#mergeRows');
  if (mergeRadio.checked) {
    return mergeRows(token);
  }

  const editRadio = document.getElementById('editRow');
  if (editRadio.checked) {
    return editRows(queryObject, token);
  }

  const addRadio = document.getElementById('addNewRow');
  if (addRadio.checked) {
    return addNewRow(token);
  }

  return 'no option selected';
}

(async function init() {
  const sdk = await DA_SDK;
  actions = sdk.actions;
  token = sdk.token;

  constructPageViewer();

  const mybutton = document.querySelector('#mybutton');
  mybutton.addEventListener('click', () => {
    document.querySelector('#modal').showModal();
  });

  await getConfigurations();

  const searchInputField = document.querySelector('[name="searchTerms"]');
  populateDropdowns(searchInputField);

  const replaceCheckbox = document.querySelector('#replaceAction');
  const replaceTextbox = document.querySelector('[name="replaceText"]');
  replaceCheckbox.addEventListener('change', () => {
    if (replaceCheckbox.checked) {
      replaceTextbox.classList.remove('hidden');
    } else {
      replaceTextbox.classList.add('hidden');
      replaceTextbox.value = '';
    }
  });

  const submitButton = document.querySelector('[name="submitSearch"]');

  submitButton.addEventListener('click', async () => {
    let replaceFlag = false;

    // check if replace is checked.
    if (replaceCheckbox.checked) {
      if (!window.confirm('Are you sure you want to replace? This action cannot be undone.')) {
        console.log('action cancelled');
        return;
      }
      replaceFlag = true;
    }
    const startTime = performance.now();

    // Get Search Terms.
    const queryObject = getQuery();

    const queryString = document.querySelector('[name="searchTerms"]').value;

    // Do Search.
    const results = await doSearch(queryObject, replaceFlag);
    window.searchResults = results;
    const endTime = performance.now();
    const duration = (endTime - startTime) * 0.001;

    const resultsContainer = document.querySelector('.results-container');
    const advancedActionPrompt = document.getElementById('advanced-action-prompt');
    advancedActionPrompt?.classList.remove('hidden');
    advancedActionPrompt.querySelector('sl-button').addEventListener('click', () => {
      const advancedActions = document.querySelector('#action-form');
      advancedActions?.classList.remove('hidden');
      addActionEventListeners(queryObject);

      const advancedSubmitButton = document.querySelector('.advanced-submit');
      advancedSubmitButton.addEventListener('click', () => {
        const message = tryToPerformAction(queryObject);
        updateActionMessage(resultsContainer, message);
      });
    });

    const undoButton = document.querySelector('.undo');
    undoButton.addEventListener('click', () => {
      let resetResult;
      try {
        resetDocumentsToOriginalState(token);
        resetResult = new ActionResult('success', 'Successfully Undone');
      } catch (e) {
        resetResult = new ActionResult('error', e);
      }
      updateActionMessage(resultsContainer, resetResult);
    });

    // Output results.
    writeOutResults(results, queryString, queryObject, duration, replaceFlag);
  });
}());
