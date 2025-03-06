import { createTag } from '../../scripts/helper.js';
import {
  getJsonFromUrl,
  getLanguage,
  getLanguageIndex,
  filterOutRobotsNoIndexPages,
} from '../../scripts/jmp.js';

const searchSheetFolder = '/commons/search';

/**
 * Fetches language index with parameters
 * @returns {object} index with data and path lookup
 */
export async function fetchIndex() {
  window.blogIndex = window.blogIndex || {
    data: [],
    complete: false,
  };
  if (window.blogIndex.complete) return (window.blogIndex);
  const index = window.blogIndex;
  const languageIndexUrl = getLanguageIndex();
  const resp = await fetch(`${languageIndexUrl}`);
  const json = await resp.json();
  const filteredData = filterOutRobotsNoIndexPages(json.data);
  filteredData.forEach((post) => {
    index.data.push(post);
  });
  index.complete = true;
  return (index);
}

async function getCommonsSheet() {
  window.commonsSheet = window.commonsSheet || {
    keywords: [],
    translations: [],
    complete: false,
  }
  if (window.commonsSheet.complete) return (window.commonsSheet);
  const commons = window.commonsSheet;
  const pageLanguage = getLanguage();
  const jsonData = await getJsonFromUrl(`${searchSheetFolder}/${pageLanguage}.json`);
  if (jsonData) {
    commons.keywords = jsonData.keywords.data[0];
    commons.translations = jsonData.translations.data[0];
  }
  commons.complete = true;
  return (commons);
}

function getTopResults(searchTerms, topResultsKeywords) {
  const searchString = searchTerms.toLowerCase();
  const keys = Object.keys(topResultsKeywords);

  if (keys.includes(searchString)) {
    const pages = window.blogIndex.data;
    const topPages = [];
    const topPaths = topResultsKeywords[searchString].replaceAll('*', getLanguage()).split(',');
    topPaths.forEach((path) => {
      const found = pages.find(page => page.path === path);
      if (found) {
        topPages.push(found);
      }
    });
    return topPages.length > 0 ? topPages : null;
  }
  return [];
}

function getSearchResults(terms, limit) {
  const pages = window.blogIndex.data;
  const titleHits = [];
  const descriptionHits = [];
  let i = 0;
  for (; i < pages.length; i += 1) {
    let alreadyIncludedFlag = false;
    const e = pages[i];

    // Check the title first, as it is higher priority in the results list.
    if (terms.every((term) => e.title.toLowerCase().includes(term.toLowerCase()))) {
      if (titleHits.length === limit) {
        break;
      }
      titleHits.push(e);
      alreadyIncludedFlag = true;
    }

    // Check the description for the search terms.
    if (terms.every((term) => e.description.toLowerCase().includes(term.toLowerCase()))) {
      if (!alreadyIncludedFlag) {
        descriptionHits.push(e);
      }
    }
  }

  let hits = titleHits;
  if (hits.length < limit) {
    const numDescriptionItems = limit - hits.length;
    hits = hits.concat(descriptionHits.slice(0, numDescriptionItems));
  }

  return hits;
}

function decorateCard(hit) {
  const {
    title, description,
  } = hit;
  const path = hit.path.split('.')[0];
  const displayUrl = path.startsWith('/') ? `${window.location.origin}${path}` : path;
  const titleLink = createTag('a', { class: 'title', href: path }, `${title}`);
  const desc = createTag('p', { class: 'description' }, `${description}`);
  const displayLink = createTag('a', { class: 'displayUrl', href: path }, `${displayUrl}`);
  const resultBody = createTag('div', { class: 'results-body' }, titleLink);
  resultBody.append(desc);
  resultBody.append(displayLink);
  return createTag('div', { class: 'result-listing' }, resultBody);
}

async function populateSearchResults(searchTerms, resultsContainer) {
  const limit = 25;
  const terms = searchTerms.toLowerCase().split(' ').map((e) => e.trim()).filter((e) => !!e);
  resultsContainer.innerHTML = '';

  if (terms.length) {
    await fetchIndex();

    await getCommonsSheet();
    const topResultsKeywords = window.commonsSheet.keywords;
    const translations = window.commonsSheet.translations;

    const topResults = getTopResults(searchTerms, topResultsKeywords);
    const searchResults = getSearchResults(terms, limit);

    if (!topResults?.length && !searchResults?.length) {
      const noResultsText = !translations ? 'No Results Found' : translations['No Results Found'];
      const resultsMessage = createTag('p', { class: 'description' }, noResultsText);
      const resultBody = createTag('div', { class: 'results-body' });
      resultBody.append(resultsMessage);
      const resultListing = createTag('div', { class: 'result-listing' }, resultBody);
      resultsContainer.appendChild(resultListing);
    } else {
      let hits = topResults.concat(searchResults);
      if (hits?.length > limit) {
        hits = hits.slice(0, limit);
      }
      hits.forEach((hit) => {
        const card = decorateCard(hit);
        resultsContainer.appendChild(card);
      });
    }
  }
}

export function onSearchInput(value, resultsContainer) {
  populateSearchResults(value, resultsContainer);
}
