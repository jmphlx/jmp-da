// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import { crawl } from 'https://da.live/nx/public/utils/tree.js';
import { daFetch } from 'https://da.live/nx/utils/daFetch.js';

const path = '/jmphlx/jmp-da/en/sandbox/laurel/listgroups';


async function handleSearch(item, queryObject, matching) {
  // Die if not a document
  if (!item.path.endsWith('.html')) return;

  console.log(queryObject);

  // Fetch the doc & convert to DOM
  const resp = await daFetch(`https://admin.da.live/source${item.path}`);
  if (!resp.ok) {
    console.log('Could not fetch item');
    return;
  }
  const text = await resp.text();
  const dom = new DOMParser().parseFromString(text, 'text/html');

  let currentElement;
  let flag = true;

  // Narrow search to blocks
  if(queryObject.scope.block) {
    console.log('found a block!!!');
    const blockName = queryObject.scope.block;
    const blocksFound = dom.querySelectorAll(`div.${blockName}`);
    if (blocksFound.length) {
      matching.push(item);
    }
    return null;
  }
  return null;
}

async function doSearch(queryObject) {
  const matching = [];
  // Crawl the tree of content
  const { results } = await crawl({ path,
    callback: (item) => handleSearch(item, queryObject, matching),
    concurrent: 50
  });
  const foundItems = await results;
  console.log(foundItems);

  return matching;

}

function writeOutResults(results, queryString) {
  const resultsHeader = document.createElement('h2');
  resultsHeader.classList.add('results-header');
  resultsHeader.textContent = `Search Results for \"${queryString}\"`;
  document.body.append(resultsHeader);
  
  const resultsContainer = document.createElement('div');
  resultsContainer.classList.add('results-container');

  results.forEach((item) => {
    const resultItem = document.createElement('div'); 
    resultItem.classList.add('result-item');
    resultItem.textContent = item.path;
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

(async function init() {
  // eslint-disable-next-line no-unused-vars
  const { context, token, actions } = await DA_SDK;

  const submitButton = document.querySelector('[name="submitSearch"]');

  submitButton.addEventListener('click', async () => {
    // Get Search Terms.
    const queryObject = getQuery();
    console.log(queryObject);

    const queryString = document.querySelector('[name="searchTerms"]').value;

    // Do Search.
    const results = await doSearch(queryObject);

    // Output results.
    writeOutResults(results, queryString);

  });
}());