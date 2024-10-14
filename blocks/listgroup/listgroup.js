/* eslint no-undef: 0 */

import {
  getBlockPropertiesList,
  getBlockProperty,
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

  // If startingFolder is not null, then apply page location filter FIRST.
  if (startingFolder !== undefined) {
    pageSelection = pageFilterByFolder(pageSelection, startingFolder);
  }

  // Apply filters to pages (if there are any)
  if (Object.keys(filterOptions).length > 0) {
    if (optionsObject.filterType !== undefined && optionsObject.filterType.toLowerCase() === 'and') {
      pageSelection = pageAndFilter(pageSelection, filterOptions);
    } else {
      pageSelection = pageOrFilter(pageSelection, filterOptions);
    }
  }

  // Order pages by releaseDate or alphabetically
  const sortOrder = optionsObject.sortOrder;
  if (sortOrder !== undefined && sortOrder.toLowerCase() === 'alphabetical') {
    // Order filtered pages alphabetically by title
    pageSelection.sort((a, b) => (a.title < b.title ? -1 : 1));
  } else {
    // Order filtered pages by releaseDate
    pageSelection.sort((a, b) => ((new Date(a.releaseDate) - new Date(b.releaseDate)) < 0
      ? -1 : 1));
  }

  // Cut results down to fit within specified limit.
  const limitObjects = optionsObject.limit;
  if (limitObjects !== undefined && pageSelection.length > limitObjects) {
    pageSelection = pageSelection.slice(0, limitObjects);
  }

  const wrapper = document.createElement('ul');
  const columns = optionsObject.columns !== undefined ? optionsObject.columns : 5;
  wrapper.classList = `listOfItems image-list list-tile col-size-${columns}`;

  pageSelection.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.classList = `${item.resourceOptions}`;
    const cardLink = document.createElement('a');
    if (item.redirectTarget.length > 0) {
      cardLink.href = item.redirectTarget;
      cardLink.target = '_blank';
    } else {
      cardLink.href = item.path;
      cardLink.target = '_self';
    }

    let htmlOutput = `
    <span class="navigation-title">${item.resourceType}</span>
    <span class="title">${item.title}</span>`;
    if (optionsObject.images === undefined || optionsObject.images.toLowerCase() !== 'off') {
      htmlOutput += `<span class="cmp-image image"><img src="${item.image}"/></span>`;
    }
    htmlOutput += `<span class="abstract">${item.displayDescription}</span>`;
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
