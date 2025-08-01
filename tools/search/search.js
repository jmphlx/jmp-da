// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
// eslint-disable-next-line import/no-unresolved
import { crawl } from 'https://da.live/nx/public/utils/tree.js';
import { createTag, saveToDa, DA_CONSTANTS } from '../../scripts/helper.js';

const daSourceUrl = 'https://admin.da.live/source';
const defaultpath = '/jmphlx/jmp-da/en/sandbox/laurel/listgroups';
const pathPrefix = `/${DA_CONSTANTS.org}/${DA_CONSTANTS.repo}`;
let actions;
let token;

class SearchResult {
  constructor(item, elements, classStyle) {
    this.path = item.path;
    // eslint-disable-next-line no-use-before-define
    this.pagePath = getPagePathFromFullUrl(item.path);
    this.elements = elements;
    this.original = item;
    this.classStyle = classStyle;
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightKeyword(text, keyword) {
  const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
  return text.replaceAll(regex, '<mark>$1</mark>');
}

function replaceKeyword(text, keyword, replacement) {
  const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
  return text.replaceAll(regex, replacement);
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

async function doReplace(dom, elements, pageSourceUrl, queryObject, classStyle) {
  console.log('doReplace');
  const keyword = queryObject.keyword;
  const replaceText = document.querySelector('[name="replaceText"]').value;

  if (classStyle === 'attribute') {
    // Replace only the attribute.
    elements.forEach((el) => {
      el[queryObject.scope.attribute] = replaceKeyword(el[queryObject.scope.attribute], keyword, replaceText);
    })
  } else if (classStyle === 'tag') {
    // Replace all instances of the keyword in the html element and all
    // it's children (including textContent).
    elements.forEach((el, index) => {
      const newHTML = replaceKeyword(el.outerHTML, keyword, replaceText);
      const newDomEl = new DOMParser().parseFromString(newHTML, 'text/html');
      //Apparently need to update the array reference and the element itself.
      elements[index] = newDomEl.body.firstChild;
      el.outerHTML = newHTML;
    });
  } else {
    elements.forEach((el) => {
      //Replace all intances of the keyword in the text. 
      el.innerHTML = replaceKeyword(el.innerHTML, keyword, replaceText);
    });
  }

  const html = dom.body.querySelector('main');
  console.log(html.innerHTML);
  console.log('try to save');
  console.log(pageSourceUrl);
  saveToDa(html.innerHTML, pageSourceUrl, token);
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

  if (elements.length === 0 && queryObject.scope.property) {
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
        const matchingEntry = new SearchResult(item, filtered, classStyle);
        matching.push(matchingEntry);
        if (replaceFlag) {
          doReplace(dom, filtered, getPagePathFromFullUrl(item.path), queryObject, classStyle);
        }
      }
    } else {
      const matchingEntry = new SearchResult(item, elements, classStyle);
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
      const matchingEntry = new SearchResult(item, elements, undefined);
      matching.push(matchingEntry);
      if (replaceFlag) {
        doReplace(dom, elements, getPagePathFromFullUrl(item.path), queryObject, undefined);
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

function createResultItem(item, highlightTerm) {
  const resultItem = createTag('div', { class: 'result-item' });
  const resultHeader = createTag('div', {
    class: 'result-header',
  });
  const pagePath = createTag('div', {
    class: 'page-path',
  }, `${item.path}`);

  const link = createTag('a', {
    href: `${DA_CONSTANTS.editUrl}${item.path.replace('.html', '')}`,
    target: '_blank',
  });

  const openPageIcon = createTag('img', {
    src: `${window.location.origin}/icons/new-tab-icon.svg`,
    class: 'open-page',
  });
  link.append(openPageIcon);
  resultHeader.append(pagePath, link);

  resultItem.append(resultHeader);

  const resultDetails = createTag('div', {
    class: 'result-details',
  });
  const resultText = document.createElement('ul');
  const elements = item.elements;
  elements.forEach((el) => {
    const li = createTag('li', {
      class: `html-result ${item.classStyle}`,
    });
    const clone = el.cloneNode(true);
    clone.innerHTML = highlightKeyword(clone.innerHTML, highlightTerm);
    li.append(clone);
    resultText.append(li);
  });
  resultDetails.append(resultText);
  resultItem.append(resultDetails);

  resultItem.addEventListener('click', function (e) {
    e.stopPropagation();
    if (this.classList.contains('open')) {
      this.classList.remove('open');
    } else {
      this.classList.add('open');
    }
  });

  return resultItem;
}

async function copyToClipboard(button, clipboardTxt, copyTxt) {
  try {
    await navigator.clipboard.writeText(clipboardTxt);
    button.setAttribute('title', copyTxt);
    button.setAttribute('aria-label', copyTxt);

    const tooltip = createTag('div', { role: 'status', 'aria-live': 'polite', class: 'copied-to-clipboard' }, copyTxt);
    button.parentElement.append(tooltip);

    setTimeout(() => {
      /* c8 ignore next 1 */
      tooltip.remove();
    }, 3000);
    button.classList.remove('copy-failure');
    button.classList.add('copy-success');
  } catch (e) {
    console.log(e);
    button.classList.add('copy-failure');
    button.classList.remove('copy-success');
  }
}

function writeOutResults(results, queryString, queryObject, duration, replaceFlag) {
  const highlightTerm = replaceFlag
    ? document.querySelector('[name="replaceText"]').value : queryObject.keyword;

  const resultsContainer = document.querySelector('.results-container');
  resultsContainer.innerHTML = '';

  const resultsHeader = document.createElement('h2');
  resultsHeader.classList.add('results-header');
  resultsHeader.textContent = `Search Results for "${queryString}"`;
  const resultsData = document.createElement('div');

  const urlList = [];

  const resultsList = document.createElement('div');
  resultsList.classList.add('results-list');
  results.forEach((item) => {
    const resultItem = createResultItem(item, highlightTerm);
    resultsList.append(resultItem);
    urlList.push(`${DA_CONSTANTS.previewUrl}${item.pagePath}`);
  });

  const searchSummary = document.createElement('span');
  searchSummary.classList.add('summary');
  searchSummary.textContent = `${results.length} found for "${queryString}"`;

  const searchTime = document.createElement('span');
  searchTime.classList.add('search-time');
  searchTime.textContent = `Search completed in ${duration.toFixed(2)} seconds`;

  const copyContainer = createTag('span', {
    id: 'copy-to-clipboard',
  });

  const copyButton = createTag('p', {
    class: 'button-container',
  });
  copyButton.textContent = 'Copy Result URLs To Clipboard';
  copyContainer.append(copyButton);
  copyContainer.addEventListener('click', () => {
    copyToClipboard(copyButton, urlList.join('\n'), 'Copied');
  });

  const bulkEditorButton = createTag('a', {
    class: 'button',
    href: 'https://da.live/apps/bulk',
    target: '_blank',
  }, 'Open Bulk Operations Tool');
  copyContainer.append(bulkEditorButton);

  resultsData.append(searchSummary, searchTime, copyContainer);

  resultsContainer.append(resultsHeader, resultsData, resultsList);
  document.body.append(resultsContainer);
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

  return { scope, keyword: keyword.trim() };
}

function buildParentDropdown(dropdown, jsonData, type) {
  jsonData.forEach((option) => {
    const optionValue = option[type].toLowerCase();
    if (optionValue !== 'default') {
      const optionElement = createTag('option', {
        value: optionValue,
      }, optionValue);
      dropdown.append(optionElement);
    }
  });
}

function buildPropertiesDropdown(dropdown, nodeName) {
  // Remove any existing items
  const shadowRoot = dropdown.shadowRoot;
  const currOptions = shadowRoot.querySelectorAll('option');
  currOptions?.forEach((opt) => {
    if (opt.value) {
      opt.remove();
    }
  })
  let propertiesList;
  window.blockProperties.forEach((block) => {
    if (block.block === nodeName) {
      propertiesList = block.properties.split(',');
      return;
    }
  });
  propertiesList?.forEach((prop) => {
      const optionValue = prop.trim();
      const optionElement = createTag('option', {
        value: optionValue,
        class: 'prop-option',
      }, optionValue);
      dropdown.append(optionElement);
  });
}

function buildAttributeDropdown(dropdown, nodeName) {
  // Remove any existing items
  const shadowRoot = dropdown.shadowRoot;
  const currOptions = shadowRoot.querySelectorAll('option');
  currOptions?.forEach((opt) => {
    if (opt.value) {
      opt.remove();
    }
  })
  let attributeList;
  window.tagAttribute.forEach((tag) => {
    if (tag.tag === nodeName) {
      attributeList = tag.attribute.split(',');
      return;
    }
  });
  attributeList?.forEach((attr) => {
      const optionValue = attr.trim();
      const optionElement = createTag('option', {
        value: optionValue,
        class: 'attr-option',
      }, optionValue);
      dropdown.append(optionElement);
  });
}

async function populateDropdowns(searchInputField) {
  // Do Block
  const blockDropdown = document.querySelector('[name="block_scope"]');
  buildParentDropdown(blockDropdown, window.blockProperties, 'block');

  const propertyDrop = document.querySelector('[name="property_scope"]');
  buildPropertiesDropdown(propertyDrop, 'default');

  blockDropdown.addEventListener('change', () => {
    buildPropertiesDropdown(propertyDrop, blockDropdown.value);
    const currentValue = searchInputField.value;
    if (currentValue) {
      // Need to check if scope is already in field. If so,  change it.
      const regex = new RegExp(/(?<=block:)[^\s]+/, 'gi');
      if (currentValue.match(regex)) {
        searchInputField.value = currentValue.replace(regex, blockDropdown.value);
      } else {
        searchInputField.value += ` block:${blockDropdown.value}`;
      }
    } else {
      searchInputField.value = `block:${blockDropdown.value}`;
    }
  });

  propertyDrop.addEventListener('change', () => {
    const currentValue = searchInputField.value;
    if (currentValue) {
      // Need to check if scope is already in field. If so,  change it.
      const regex = new RegExp(/(?<=property:)[^\s]+/, 'gi');
      if (currentValue.match(regex)) {
        searchInputField.value = currentValue.replace(regex, propertyDrop.value);
      } else {
        searchInputField.value += ` property:${propertyDrop.value}`;
      }
    } else {
      searchInputField.value = `property:${propertyDrop.value}`;
    }
  });

  const tagDropdown = document.querySelector('[name="tag_scope"]');
  buildParentDropdown(tagDropdown, window.tagAttribute, 'tag');

  const attributeDropdown = document.querySelector('[name="attribute_scope"]');
  buildAttributeDropdown(attributeDropdown, 'default');

  tagDropdown.addEventListener('change', () => {
    buildAttributeDropdown(attributeDropdown, tagDropdown.value);
    const currentValue = searchInputField.value;
    if (currentValue) {
      // Need to check if scope is already in field. If so,  change it.
      const regex = new RegExp(/(?<=tag:)[^\s]+/, 'gi');
      if (currentValue.match(regex)) {
        searchInputField.value = currentValue.replace(regex, tagDropdown.value);
      } else {
        searchInputField.value += ` tag:${tagDropdown.value}`;
      }
    } else {
      searchInputField.value = `tag:${tagDropdown.value}`;
    }
  });

  attributeDropdown.addEventListener('change', () => {
    const currentValue = searchInputField.value;
    if (currentValue) {
      // Need to check if scope is already in field. If so,  change it.
      const regex = new RegExp(/(?<=attribute:)[^\s]+/, 'gi');
      if (currentValue.match(regex)) {
        searchInputField.value = currentValue.replace(regex, attributeDropdown.value);
      } else {
        searchInputField.value += ` attribute:${attributeDropdown.value}`;
      }
    } else {
      searchInputField.value = `attribute:${attributeDropdown.value}`;
    }
  });
}

async function getConfigurations() {
  const blockProperties = `${pathPrefix}/docs/library/block-property.json`;
  const resp = await actions.daFetch(`${daSourceUrl}${blockProperties}`);
  if (!resp.ok) {
    console.log('Could not fetch item');
    window.blockProperties = null;
  }
  const { data: blockOptions } = await resp.json();
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

window.addEventListener('message', function(event) {
  if (event.origin === 'http://localhost:3000' || event.origin === 'https://www.jmp.com') {
    console.log('got my message');
    console.log(event.origin);
  }
  console.log(typeof event.data);
  console.log(event.data);
  if (event.origin === 'https://da.live') {
    console.log('got message from DA');
    const iframe = document.querySelector('iframe');
    console.log(iframe);
    iframe.contentWindow.postMessage(event.data);
  }
  const mydialog = document.querySelector('#modal');
  mydialog.close();
});

(async function init() {
  console.log('in init');
  const sdk = await DA_SDK;
  actions = sdk.actions;
  token = sdk.token;

  //const openModalButton = document.querySelector('#openModal');
  const mydialog = document.querySelector('#modal');
  const mybutton = document.querySelector('#mybutton');
  mybutton.addEventListener('click', () => {
    console.log('clicked');
    // const iframe = mydialog.querySelector('iframe');
    // console.log(iframe);
    // iframe.contentWindow.postMessage(token);
    document.querySelector('#modal').showModal();
  });
  const closeDialog = document.querySelector('#submit');
  closeDialog.addEventListener('click', () => {
    mydialog.close();
    console.log(window.pagePath);
  });
  console.log(closeDialog);

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
    console.log(queryObject);

    const queryString = document.querySelector('[name="searchTerms"]').value;

    // Do Search.
    console.log(replaceFlag);
    const results = await doSearch(queryObject, replaceFlag);
    window.searchResults = results;
    const endTime = performance.now();
    const duration = (endTime - startTime) * 0.001;

    // Output results.
    writeOutResults(results, queryString, queryObject, duration, replaceFlag);
  });
}());
