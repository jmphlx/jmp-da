// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import { crawl } from 'https://da.live/nx/public/utils/tree.js';
import { daFetch, saveToDa } from 'https://da.live/nx/utils/daFetch.js';

const defaultpath = '/jmphlx/jmp-da/en/sandbox/laurel/listgroups';
const editPagePath = 'https://da.live/edit#';
const org = 'jmphlx';
const repo = 'jmp-da';
const pathPrefix = `/${org}/${repo}`;

function highlightKeyword(text, keyword) {
  const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function replaceKeyword(text, keyword, replacement) {
  const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
  return text.replace(regex, replacement);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function adjustItemPathForPut(itemPath) {
  const splitItemPath = itemPath.split('/');
  splitItemPath.splice(1,2);
  let basicItemPath = splitItemPath.join('/');
  const htmlExtension = basicItemPath.indexOf('.html');
  if (htmlExtension) {
    basicItemPath = basicItemPath.substring(0, htmlExtension);
  }
  const urlObject = {
    org: org,
    repo: repo,
    pathname: basicItemPath,
  };
  return urlObject;
}

async function handleSearch(item, queryObject, matching, replaceFlag) {
  // Die if not a document
  if (!item.path.endsWith('.html')) return;

  const pageSourceUrl = `https://admin.da.live/source${item.path}`;

  // Fetch the doc & convert to DOM
  const resp = await daFetch(pageSourceUrl);
  if (!resp.ok) {
    console.log('Could not fetch item');
    return;
  }
  const text = await resp.text();
  const dom = new DOMParser().parseFromString(text, 'text/html');

  let elements = [];

  // Narrow search to blocks
  if (queryObject.scope.block) {
    const blockName = queryObject.scope.block;
    elements = dom.querySelectorAll(`div.${blockName}`);
  }

  if (elements.length) {
    if (queryObject.keyword) {
      const filtered = [];
      elements.forEach((el) => {
        console.log(el);
        if (el.textContent.toLowerCase().includes(queryObject.keyword.toLowerCase())) {
          // found an item
          filtered.push(el);
          console.log(el);
        }
      });
      if (filtered.length) {
        const matchingEntry = {
          path: item.path,
          elements: filtered,
          original: item
        };
        matching.push(matchingEntry);
        if(replaceFlag) {
          const urlObject = adjustItemPathForPut(item.path);
          doReplace(dom, filtered, urlObject, queryObject.keyword);
        }
      }
    } else {
      const matchingEntry = {
        path: item.path,
        elements: elements,
        original: item,
      };
      matching.push(matchingEntry);
    }
  }

  return null;
}

async function doSearch(queryObject, replaceFlag) {
  const matching = [];

  let path = defaultpath;

  if (queryObject.scope.path) {
    console.log('has a path');
    let providedPath = queryObject.scope.path;
    if (!providedPath.startsWith(pathPrefix)) {
      path = pathPrefix.concat(providedPath);
    } else {
      path = providedPath;
    }
  }

  // Crawl the tree of content
  const { results } = await crawl({ path,
    callback: (item) => handleSearch(item, queryObject, matching, replaceFlag),
    concurrent: 50
  });
  await results;

  return matching;

}

function writeOutResults(results, queryString, queryObject) {
  const resultsHeader = document.createElement('h2');
  resultsHeader.classList.add('results-header');
  resultsHeader.textContent = `Search Results for \"${queryString}\"`;
  document.body.append(resultsHeader);
  
  const resultsContainer = document.createElement('div');
  resultsContainer.classList.add('results-container');

  results.forEach((item) => {
    const resultItem = document.createElement('div');
    const resultLink = document.createElement('a');
    resultLink.href = `${editPagePath}${item.path.replace('.html', '')}`;
    resultLink.target = '_blank';
    resultLink.textContent = item.path;
    resultItem.classList.add('result-item');
    resultItem.append(resultLink);
    const resultDetails = document.createElement('div');
    resultDetails.classList.add('expandable');
    const resultText = document.createElement('ul');
    const elements = item.elements;
    elements.forEach((el) => {
      const li = document.createElement('li');
      const clone = el.cloneNode(true);
      clone.innerHTML = highlightKeyword(clone.innerHTML, queryObject.keyword);
      li.append(clone);
      resultText.append(li);
    })
    resultDetails.append(resultText);
    resultItem.append(resultDetails);
    resultsContainer.append(resultItem);
  });

  document.body.append(resultsContainer);
}

function getQuery() {
  const queryString = document.querySelector('[name="searchTerms"]').value;

  const scope = {};
  let keyword = "";

  const scopeRegex = /(\w+):([^\s]+)/g;
  let remaining = queryString;
  let match;

  while ((match = scopeRegex.exec(queryString)) !== null) {
    scope[match[1]] = match[2];
    remaining = remaining.replace(match[0], '').trim();
  }

  const phraseMatch = remaining.match(/"([^"]+)"|(.+)/);
  keyword = phraseMatch ? (phraseMatch[1] || phraseMatch[2]) : "";

  return { scope, keyword: keyword.trim() };
}

async function doReplace(dom, elements, pageSourceUrl, keyword) {
  console.log('do replace now');
  const replaceText = document.querySelector('[name="replaceText"]').value;

  elements.forEach((el) => {
    console.log(el);
    el.innerHTML = replaceKeyword(el.innerHTML, keyword, replaceText);
  });

  const html = dom.body.querySelector('main');
  console.log(html.innerHTML);
  console.log('try to save');
  const response = saveToDa(html.innerHTML, pageSourceUrl);
  console.log(response);
  console.log('done');

}

async function testCall(actions) {
  const fullpath = `https://admin.da.live/source/jmphlx/jmp-da/en/sandbox/laurel/custom-listgroup/with-filter.html`;
  const resp = await actions.daFetch(fullpath);
  console.log(resp)
}

async function tryCall(actions) {
  const fullpath = `https://admin.da.live/source/jmphlx/jmp-da/en/sandbox/laurel/custom-listgroup/with-filter.html`;
  const resp = await actions.daFetch(fullpath);
  console.log(resp)
}

(async function init() {
  // eslint-disable-next-line no-unused-vars
  //const { actions } = await DA_SDK;

  const { context, token } = await DA_SDK;
  console.log(context);
  console.log(token);

  
  //console.log(actions);
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

    //check if replace is checked.
    if (replaceCheckbox.checked) {
      if (!confirm('Are you sure you want to replace? This action cannot be undone.')) {
        console.log('action cancelled');
        return;
      } else {
        replaceFlag = true;
      }
    }

    // Get Search Terms.
    const queryObject = getQuery();
    console.log(queryObject);

    const queryString = document.querySelector('[name="searchTerms"]').value;

    // Do Search.
    console.log(replaceFlag);
    const results = await doSearch(queryObject, replaceFlag);
    window.searchResults = results;

    // Output results.
    writeOutResults(results, queryString, queryObject);
  });

}());