/* eslint no-undef: 0 */

import {
  getBlockProperty,
  getBlockPropertiesList,
  getJsonFromUrl,
  getLanguageIndex,
  getListFilterOptions,
  pageAndFilter,
  pageFilterByFolder,
  pageOrFilter,
} from '../../scripts/jmp.js';

export default async function decorate(block) {
  // Get language index.
  const languageIndexUrl = getLanguageIndex();

  const { data: allPages, columns: propertyNames } = await getJsonFromUrl(languageIndexUrl);
  let pageSelection = allPages;

  const optionsObject = getBlockPropertiesList(block, 'options');
  const startingFolder = getBlockProperty(block, 'startingFolder');
  const emptyResultsMessage = getBlockProperty(block, 'emptyResultsMessage');
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
    if (item.redirectTarget.length > 0) {
      cardLink.href = item.redirectTarget;
      cardLink.target = '_blank';
    } else {
      cardLink.href = item.path;
      cardLink.target = '_self';
    }
    const htmlOutput = `
    <span class="tag-category">${item.resourceType}</span>
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
