// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
// eslint-disable-next-line import/no-unresolved
import { crawl } from 'https://da.live/nx/public/utils/tree.js';
import addAppAccessControl from '../access-control/access-control.js';
import {
  getPageStatus,
  getPublishStatus,
  createVersion,
  createRateLimiter,
  DA_CONSTANTS,
  toLowerCaseObject,
} from '../../scripts/helper.js';
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
  addCheckboxEventListeners,
  addLoadingAction,
  addLoadingSearch,
  clearResults,
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

/* Custom jquery selector for case insensitive search */
$.expr[':'].icontains = function (elem, i, match) {
  return $(elem).text().toLowerCase().includes(match[3].toLowerCase());
};

/**
 * https://admin.hlx.page/ only supports 10 requests per second, but need to space it out to 3 seconds.
*/
const rateLimit = createRateLimiter(10, 3000);

class SearchResult {
  constructor(item, elements, classStyle, dom, publishStatus) {
    this.path = item.path;
    // eslint-disable-next-line no-use-before-define
    this.pagePath = getPagePathFromFullUrl(item.path);
    this.elements = elements;
    this.dom = dom;
    this.original = dom.cloneNode(true);
    this.classStyle = classStyle;
    this.publishStatus = publishStatus;
  }
}

async function getPublishStatusObj(path) {
  return rateLimit(() => getPageStatus(path, token));
}

function clearEventListeners() {
  const actionButton = document.getElementById('advanced-action-button');
  let newEl = actionButton.cloneNode(true);
  actionButton.parentNode.replaceChild(newEl, actionButton);

  const actionSubmitButton = document.getElementById('advanced-submit-button');
  newEl = actionSubmitButton.cloneNode(true);
  actionSubmitButton.parentNode.replaceChild(newEl, actionSubmitButton);

  const createVersionButton = document.getElementById('create-version-button');
  newEl = createVersionButton.cloneNode(true);
  createVersionButton.parentNode.replaceChild(newEl, createVersionButton);

  const undoButton = document.getElementById('undo-button');
  newEl = undoButton.cloneNode(true);
  undoButton.parentNode.replaceChild(newEl, undoButton);

  const addNewRowButton = document.getElementById('addNewRow');
  newEl = addNewRowButton.cloneNode(true);
  addNewRowButton.parentNode.replaceChild(newEl, addNewRowButton);

  const deleteRowButton = document.getElementById('deleteRow');
  newEl = deleteRowButton.cloneNode(true);
  deleteRowButton.parentNode.replaceChild(newEl, deleteRowButton);
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
  const emptyRegex = /\$empty/i;
  let keywordFilterApplied = false;
  let scopeSearchAttempted = false;

  async function filterForKeyword(publishStatus) {
    const filteredMatches = [];
    if (classStyle === 'attribute') {
      elements.forEach((el) => {
        filteredMatches.push(el);
      });
    } else if (classStyle === 'tag') {
      elements.forEach((el) => {
        if (queryObject.caseSensitive && el.outerHTML.includes(queryObject.keyword)) {
          filteredMatches.push(el);
        } else if (el.outerHTML.toLowerCase().includes(queryObject.keyword.toLowerCase())) {
          filteredMatches.push(el);
        }
      });
    } else if (classStyle === 'property' && queryObject.keyword.match(emptyRegex)) {
      elements.forEach((el) => {
        const propVal = el.children[1];
        if (propVal.textContent.toLowerCase().trim().length === 0) {
          filteredMatches.push(el);
        }
      });
    } else {
      elements.forEach((el) => {
        if (queryObject.caseSensitive) {
          if (el.textContent.includes(queryObject.keyword)) {
            filteredMatches.push(el);
          }
        } else if (el.textContent.toLowerCase().includes(queryObject.keyword)) {
          filteredMatches.push(el);
        }
      });
    }
    if (filteredMatches.length) {
      const matchingEntry = new SearchResult(item, filteredMatches, classStyle, dom, publishStatus);
      matching.push(matchingEntry);
      if (replaceFlag) {
        doReplace(
          token,
          dom,
          filteredMatches,
          getPagePathFromFullUrl(item.path),
          queryObject,
          classStyle,
        );
      }
    }
  }

  /**
   * Assumption: If you are looking
   * for an html element with an attribute,
   * then the keyword must be present
   * and only applies to the attribute.
   *
   * Assumption: If case sensitivity is used,
   * it may not work right for all types of html elements.
   * For example, class values are always lowercased so case sensitive
   * would fail with any capitals.
   */
  function findHTMLElements() {
    const tagName = queryObject.scope.tag;
    let queryString = tagName;
    classStyle = 'tag';

    if (queryObject.scope.attribute) {
      const attributeName = queryObject.scope.attribute;
      queryString += `[${attributeName}*="${queryObject.keyword}"]`;
      classStyle = 'attribute';
      keywordFilterApplied = true;
    }
    elements = dom.querySelectorAll(`${queryString}`);
  }

  function findBlockPropertyElements() {
    // Block class names will always be lowercased so no case sensitivity needed.
    // Properties do need case sensitive check.
    const blockName = queryObject.scope.block;
    classStyle = 'block';
    if (queryObject.scope.property) {
      const propertyName = queryObject.scope.property;
      classStyle = 'property';
      const foundProperties = Array.from(dom.querySelectorAll(`div.${blockName} p`)).filter((field) => {
        if (queryObject.caseSensitive) {
          return field.children.length === 0 && field.textContent.trim() === propertyName;
        }
        return field.children.length === 0
          && field.textContent.trim().toLowerCase() === propertyName;
      });
      console.log(foundProperties);
      foundProperties.forEach((prop) => {
        elements.push(prop.parentElement.parentElement);
      });
    } else {
      elements = dom.querySelectorAll(`div.${blockName}`);
    }
  }

  async function runFilters() {
    if (queryObject.scope.block) {
      // If there is a block scope, try to find blocks & props.
      findBlockPropertyElements();
      scopeSearchAttempted = true;
    } else if (queryObject.scope.tag) {
      // If no block scope, then look for tag scope. If tag scope,
      // then try to find tags/attributes.
      findHTMLElements();
      scopeSearchAttempted = true;
    } else if (queryObject.keyword) {
      // Search whole page for keyword if no block or tag scope.
      keywordFilterApplied = true;
      scopeSearchAttempted = true;
      classStyle = 'keyword';
      // If the block and tag scopes were null, then still try to do keyword search
      const $newDom = $(dom);

      if (queryObject.caseSensitive) {
        $($newDom).find(`*:contains("${queryObject.keyword}")`).filter(function () {
          return $(this).children((`*:contains("${queryObject.keyword}")`)).length === 0;
        }).each(function () {
          elements.push($(this).get(0));
        });
      } else {
        $($newDom).find(`*:icontains("${queryObject.keyword}")`).filter(function () {
          return $(this).children((`*:icontains("${queryObject.keyword}")`)).length === 0;
        }).each(function () {
          elements.push($(this).get(0));
        });
      }
    }

    const filtered = [];
    // Now check if elements are found.
    if (elements.length) {
      /* found some matching elements.
      Now try to apply filters. Check for
      publish status filter. If it doesn't match, then
      the page is not a match. If it does, then
      check for keyword. */
      const pageStatusObj = await getPublishStatusObj(getPagePathFromFullUrl(item.path));
      const publishStatus = getPublishStatus(pageStatusObj);
      if (queryObject.scope.status) {
        if (publishStatus === queryObject.scope.status && queryObject.keyword) {
          // look for keyword.
          await filterForKeyword(pageStatusObj);
        } else if (publishStatus === queryObject.scope.status) {
          const matchingEntry = new SearchResult(item, elements, classStyle, dom, pageStatusObj);
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
      } else if (queryObject.keyword && !keywordFilterApplied) {
        elements.forEach((el) => {
          if (queryObject.keyword.match(emptyRegex) && classStyle === 'property') {
            const propVal = el.children[1];
            if (propVal.textContent.toLowerCase().trim().length === 0) {
              filtered.push(el);
            }
          } else if (queryObject.caseSensitive) {
            if (el.textContent.includes(queryObject.keyword)) {
              filtered.push(el);
            }
          } else if (el.textContent.toLowerCase().includes(queryObject.keyword)) {
            filtered.push(el);
          }
        });
        if (filtered.length) {
          const matchingEntry = new SearchResult(item, filtered, classStyle, dom, pageStatusObj);
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
        // No other filters to apply, add page to results.
        const matchingEntry = new SearchResult(item, elements, classStyle, dom, pageStatusObj);
        matching.push(matchingEntry);
        if (replaceFlag) {
          doReplace(
            token,
            dom,
            elements,
            getPagePathFromFullUrl(item.path),
            queryObject,
            classStyle,
          );
        }
      }
    } else if (!scopeSearchAttempted && queryObject.scope.status) {
      /* If no elements were found, see if publish filter is present. If it is,
      check the page status to see if it matches, then include it.
      */
      const pageStatusObj = await getPublishStatusObj(getPagePathFromFullUrl(item.path));
      const publishStatus = getPublishStatus(pageStatusObj);
      classStyle = 'status';
      if (publishStatus === queryObject.scope.status) {
        const matchingEntry = new SearchResult(item, elements, classStyle, dom, pageStatusObj);
        matching.push(matchingEntry);
      }
    }
    /* If there are no elements and there is no publish filter, then this page is not a match. */
  }

  await runFilters();
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

function getQuery(caseSensitiveFlag) {
  const queryString = document.querySelector('[name="searchTerms"]').value;

  let scope = {};
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

  if (!caseSensitiveFlag) {
    keyword = keyword.toLowerCase();
    scope = toLowerCaseObject(scope);
  }

  return { scope, keyword: keyword.trim(), caseSensitive: caseSensitiveFlag };
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

/**
 * Advanced action changes are ALWAYS case insensitive. We shouldn't
 * have more than one row with the same name.
 * @param {*} queryObject
 * @returns status object
 */
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

  return { status: 'error', message: 'no option selected' };
}

function tryToCreatePageVersions() {
  const uniqueDescription = `Search & Replace Version - ${crypto.randomUUID()}`;
  // eslint-disable-next-line no-restricted-syntax
  for (const result of window.searchResults) {
    // eslint-disable-next-line no-await-in-loop
    createVersion(result.pagePath, token, uniqueDescription);
  }
  return { status: 'success', message: 'versions created' };
}

async function init() {
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
  addCheckboxEventListeners(searchInputField);

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
    window.searchResults = null;
    clearResults();
    clearEventListeners();
    const resultsContainer = document.querySelector('.results-container');
    addLoadingSearch(resultsContainer, 'Searching');

    let caseSensitiveFlag = false;
    const caseSensitiveCheckbox = document.querySelector('#caseSensitiveSearch');
    if (caseSensitiveCheckbox.checked) {
      caseSensitiveFlag = true;
    }

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
    const queryObject = getQuery(caseSensitiveFlag);
    console.log(queryObject);

    // Need to validate query here. and error early.

    const queryString = document.querySelector('[name="searchTerms"]').value;

    // Do Search.
    const results = await doSearch(queryObject, replaceFlag);
    window.searchResults = results;
    const endTime = performance.now();
    const duration = (endTime - startTime) * 0.001;

    const advancedActionPrompt = document.getElementById('advanced-action-prompt');
    advancedActionPrompt?.classList.remove('hidden');
    document.getElementById('advanced-action-button').addEventListener('click', () => {
      const advancedActions = document.querySelector('#action-form');
      advancedActions?.classList.remove('hidden');
      addActionEventListeners(queryObject);

      const advancedSubmitButton = document.getElementById('advanced-submit-button');
      advancedSubmitButton.addEventListener('click', async () => {
        addLoadingAction(resultsContainer, 'Modifying Content');
        const message = tryToPerformAction(queryObject);
        updateActionMessage(resultsContainer, message);
      });
    });

    const createVersionButton = document.getElementById('create-version-button');
    createVersionButton.addEventListener('click', () => {
      const message = tryToCreatePageVersions();
      updateActionMessage(resultsContainer, message);
    });

    const undoButton = document.getElementById('undo-button');
    undoButton.addEventListener('click', () => {
      let resetResult;
      try {
        addLoadingAction(resultsContainer, 'Modifying Content');
        resetDocumentsToOriginalState(token);
        resetResult = new ActionResult('success', 'Successfully Undone');
        window.searchResults = null;
        clearResults();
      } catch (e) {
        resetResult = new ActionResult('error', e);
      }
      updateActionMessage(resultsContainer, resetResult);
    });

    // Output results.
    writeOutResults(results, queryString, queryObject, duration, replaceFlag);
  });
}

async function startApp() {
  const hasAccess = await addAppAccessControl();
  if (hasAccess) {
    await init();
  }
}
startApp();
