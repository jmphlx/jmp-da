/* eslint no-undef: 0 */

import {
  filterOutPastEvents,
  filterOutRobotsNoIndexPages,
  getBlockConfig,
  getJsonFromUrl,
  getLanguageIndex,
} from '../../scripts/jmp.js';

import {
  buildSimplifiedFilter,
  getEmptyResultsMessage,
  pageMatches,
} from '../../scripts/listgroup.js';

export default async function decorate(block) {
  const config = getBlockConfig(block);
  block.textContent = '';

  const overwriteLanguageIndex = config.overwriteIndexLanguage;

  // Get language index.
  const languageIndexUrl = getLanguageIndex(overwriteLanguageIndex);

  const { data: allPages } = await getJsonFromUrl(languageIndexUrl);
  let pageSelection = allPages;

  const optionsObject = config.options;
  const startingFolder = config.startingFolder;
  const filterField = config.filter;
  const filters = filterField?.includes('.json') ? await getJsonFromUrl(filterField) : buildSimplifiedFilter(filterField, startingFolder);
  const emptyResultsMessage = await getEmptyResultsMessage(config.emptyResultsMessage);

  const matching = [];
  allPages.forEach((page) => {
    if (pageMatches(page, filters)) {
      matching.push(page);
    }
  });
  pageSelection = matching;

  // Do not include Robots noindex pages.
  pageSelection = filterOutRobotsNoIndexPages(pageSelection);
  // Do not include events whose date has passed.
  pageSelection = filterOutPastEvents(pageSelection);

  // Order filtered pages by event date and time.
  pageSelection.sort((a, b) => ((new Date(a.eventDateTime) - new Date(b.eventDateTime)) < 0
    ? -1 : 1));

  // Cut results down to fit within specified limit.
  const limitObjects = optionsObject.limit;
  if (limitObjects !== undefined && pageSelection.length > limitObjects) {
    pageSelection = pageSelection.slice(0, limitObjects);
  }

  const wrapper = document.createElement('ul');
  const columns = optionsObject.columns !== undefined ? optionsObject.columns : 5;
  wrapper.classList = `listOfItems list-tile col-size-${columns}`;

  pageSelection.forEach((item) => {
    const listItem = document.createElement('li');
    const cardLink = document.createElement('a');
    if (item.redirectTarget?.length > 0) {
      cardLink.href = item.redirectTarget;
      cardLink.target = '_blank';
    } else {
      cardLink.href = item.path;
      cardLink.target = '_self';
    }
    const htmlOutput = `
    <span class="tag-category">${item.eventDisplayLabel}</span>
    <span class="title">${item.title}</span>
    <span class="subtitle">${item.eventDisplayTime}</span>`;
    cardLink.innerHTML = htmlOutput;

    listItem.append(cardLink);
    wrapper.append(listItem);
  });

  if (pageSelection.length === 0 && emptyResultsMessage !== undefined) {
    const emptyResultsDiv = document.createElement('div');
    emptyResultsDiv.classList = 'no-results';
    emptyResultsDiv.innerHTML = `${emptyResultsMessage}`;
    wrapper.append(emptyResultsDiv);
  }

  block.append(wrapper);
}
