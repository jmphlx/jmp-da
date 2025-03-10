import {
  getJsonFromUrl,
  getLanguage,
  getLanguageIndex,
  getSKPLanguageIndex,
  filterOutRobotsNoIndexPages,
} from './jmp.js';

const searchSheetFolder = '/commons/search';

const translationStrings = Object.freeze({
  NO_RESULTS_FOUND: 'No Results Found',
  SEARCH: 'Search',
});

function getTranslationStringEnum() {
  return translationStrings;
}

/**
 * Fetches language index with parameters
 * if SKP page, return skp index
 * @param {boolean} isSKP - true if the SKP index should be used
 * @returns {object} index with data and path lookup
 */
async function fetchIndex(isSKP = false) {
  window.searchIndex = window.searchIndex || {
    data: [],
    complete: false,
  };
  if (window.searchIndex.complete) return (window.searchIndex);
  const index = window.searchIndex;
  const languageIndexUrl = isSKP ? getSKPLanguageIndex() : getLanguageIndex();
  const resp = await fetch(`${languageIndexUrl}`);
  const json = await resp.json();
  const filteredData = filterOutRobotsNoIndexPages(json.data);
  filteredData.forEach((post) => {
    index.data.push(post);
  });
  index.complete = true;
  return (index);
}

function convertKeysToLowerCase(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertKeysToLowerCase);
  }

  return Object.keys(obj).reduce((acc, key) => {
    acc[key.toLowerCase()] = convertKeysToLowerCase(obj[key]);
    return acc;
  }, {});
}

/**
 * Fetches the appropriate sheet from DA
 * that contains translations and top results pages
 * if SKP page, return skp commons page for language
 * @param {boolean} isSKP - true if the SKP commons page should be used
 * @returns {object} commons sheet as json data
 */
async function getCommonsSheet(isSKP = false) {
  window.commonsSheet = window.commonsSheet || {
    keywords: {},
    translations: {},
    complete: false,
  };
  if (window.commonsSheet.complete) return (window.commonsSheet);
  const commons = window.commonsSheet;
  const pageLanguage = getLanguage();
  const commonsUrl = isSKP ? `${searchSheetFolder}/skp-${pageLanguage}.json` : `${searchSheetFolder}/${pageLanguage}.json`;
  let jsonData = await getJsonFromUrl(commonsUrl);
  jsonData = convertKeysToLowerCase(jsonData);
  if (jsonData) {
    commons.keywords = jsonData.keywords.data[0];
    commons.translations = jsonData.translations.data[0];
  }
  commons.complete = true;
  return (commons);
}

/**
 * Perform the search query using the index.
 * Check the title for the search terms before checking
 * the description. Return a list of pages that contain the search terms.
 * @param {Array} terms - array of the search terms
 * @param {number} limit - the maximum number of search results to display at a time.
 * @returns {Array} a list of pages and their metadata that match the search terms
 */
function getSearchResults(terms, limit) {
  const pages = window.searchIndex.data;
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

/**
 * Get the results that should appear at the top of a specific search.
 * The search terms and pages to display are defined in the
 * commons sheet.
 * @param {*} searchTerms - search string entered by the user
 * @param {*} topResultsKeywords - a list of the keywords to look for from a user
 * @returns {Array} a list of pages to display at the top of the search results
 */
function getTopResults(searchTerms, topResultsKeywords) {
  const searchString = searchTerms.toLowerCase();
  const keys = Object.keys(topResultsKeywords);

  if (keys?.includes(searchString)) {
    const pages = window.searchIndex.data;
    const topPages = [];
    const topPaths = topResultsKeywords[searchString].replaceAll('*', getLanguage()).split(',');
    topPaths.forEach((path) => {
      const found = pages.find((page) => page.path === path);
      if (found) {
        topPages.push(found);
      }
    });
    return topPages.length > 0 ? topPages : [];
  }
  return [];
}

export {
  fetchIndex,
  getCommonsSheet,
  getSearchResults,
  getTopResults,
  getTranslationStringEnum,
};
