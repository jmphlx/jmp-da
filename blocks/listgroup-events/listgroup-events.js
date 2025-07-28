/* eslint no-undef: 0 */

import {
  filterOutPastEvents,
  filterOutRobotsNoIndexPages,
  getBlockProperty,
  getBlockPropertiesList,
  getJsonFromUrl,
  getLanguageIndex,
  getListFilterOptions,
  pageAndFilter,
  pageFilterByFolder,
  pageOrFilter,
} from '../../scripts/jmp.js';

import { getEmptyResultsMessage } from '../../scripts/listgroup.js';

export default async function decorate(block) {
  const overwriteLanguageIndex = getBlockProperty(block, 'overwriteIndexLanguage');

  // Get language index.
  const languageIndexUrl = getLanguageIndex(overwriteLanguageIndex);

  const { data: allPages, columns: propertyNames } = await getJsonFromUrl(languageIndexUrl);
  let pageSelection = allPages;

  const optionsObject = getBlockPropertiesList(block, 'options');
  const startingFolder = getBlockProperty(block, 'startingFolder');
  const emptyResultsMessageConfig = getBlockProperty(block, 'emptyResultsMessage');
  const emptyResultsMessage = await getEmptyResultsMessage(emptyResultsMessageConfig);
  const filterOptions = getListFilterOptions(block, propertyNames);

  // If startingFolder is not null, then apply location filter FIRST.
  if (startingFolder !== undefined) {
    pageSelection = pageFilterByFolder(pageSelection, startingFolder);
  }

  // Apply filters if applicable.
  if (Object.keys(filterOptions).length > 0) {
    if (optionsObject.filterType !== undefined && optionsObject.filterType.toLowerCase() === 'and') {
      pageSelection = pageAndFilter(pageSelection, filterOptions);
    } else {
      pageSelection = pageOrFilter(pageSelection, filterOptions);
    }
  }

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
    emptyResultsDiv.innerHTML = `<span>${emptyResultsMessage}</span>`;
    wrapper.append(emptyResultsDiv);
  }

  block.append(wrapper);
}
