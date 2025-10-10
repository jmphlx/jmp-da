import { createTag } from '../../scripts/helper.js';
import {
  fetchIndex,
  getCommonsSheet,
  getSearchResults,
  getTopResults,
  getTranslationStringEnum,
} from '../../scripts/search.js';

function decorateCard(hit) {
  const {
    title, description,
  } = hit;
  let path;
  let displayUrl;
  if (hit.redirectTarget?.length > 0) {
    path = hit.redirectTarget;
    displayUrl = hit.redirectTarget;
  } else {
    path = hit.path.split('.')[0];
    displayUrl = path.startsWith('/') ? `${window.location.origin}${path}` : path;
  }
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

    const translationsEnum = getTranslationStringEnum();

    const topResults = getTopResults(searchTerms, topResultsKeywords);
    // Include topResults length. If topResults pages are found in the search results,
    // we want to remove them so there are no duplicates but still reach the limit.
    const adjustedLimit = topResults ? limit + topResults.length : limit;
    const searchResults = getSearchResults(terms, adjustedLimit);

    if (!topResults?.length && !searchResults?.length) {
      const noResultsText = !Object.keys(translations).length ? translationsEnum.NO_RESULTS_FOUND
        : translations[translationsEnum.NO_RESULTS_FOUND.toLowerCase()];
      const resultsMessage = createTag('p', { class: 'description' }, noResultsText);
      const resultBody = createTag('div', { class: 'results-body' });
      resultBody.append(resultsMessage);
      const resultListing = createTag('div', { class: 'result-listing' }, resultBody);
      resultsContainer.appendChild(resultListing);
    } else {
      let hits = [...new Set([...topResults, ...searchResults])];
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
