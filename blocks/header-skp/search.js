import { createTag } from '../../scripts/helper.js';
import {
  decorateCard,
  fetchIndex,
  getCommonsSheet,
  getSearchResults,
  getTranslationStringEnum,
} from '../../scripts/search.js';

async function populateSearchResults(searchTerms, resultsContainer) {
  const limit = 25;
  const terms = searchTerms.toLowerCase().split(' ').map((e) => e.trim()).filter((e) => !!e);
  resultsContainer.innerHTML = '';

  if (terms.length) {
    await fetchIndex(true);

    await getCommonsSheet(true);
    const translations = window.commonsSheet.translations;
    const translationsEnum = getTranslationStringEnum();

    const searchResults = getSearchResults(terms, limit);
    if (!searchResults?.length) {
      const noResultsText = !Object.keys(translations).length ? translationsEnum.NO_RESULTS_FOUND
        : translations[translationsEnum.NO_RESULTS_FOUND.toLowerCase()];
      const resultsMessage = createTag('p', { class: 'description' }, noResultsText);
      const resultBody = createTag('div', { class: 'results-body' });
      resultBody.append(resultsMessage);
      const resultListing = createTag('div', { class: 'result-listing' }, resultBody);
      resultsContainer.appendChild(resultListing);
    } else {
      let hits = searchResults;
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
