/* eslint no-undef: 0 */

import {
  getBlockConfig,
  getJsonFromUrl,
} from '../../scripts/jmp.js';

import { getEmptyResultsMessage } from '../../scripts/listgroup.js';

/**
 * Assume sort by title alphabetically.
 * Assume ascending order (A-Z) unless otherwise specified.
 */
function sortAssetList(assetList, sortOrder) {
  const sortedList = assetList;
  sortedList?.sort((a, b) => {
    if (sortOrder !== undefined && sortOrder === 'descending') {
      return (a.title < b.title ? 1 : -1);
    }
    return (a.title < b.title ? -1 : 1);
  });
  return sortedList;
}

function buildAssetItems(matching, config) {
  let pageSelection = matching;

  const limit = config.limit;
  if (limit !== undefined && pageSelection?.length > limit) {
    pageSelection = pageSelection.slice(0, limit);
  }

  const emptyResultsMessage = config.emptyResultsMessage;
  if ((pageSelection === null || pageSelection === undefined || pageSelection.length === 0)
      && emptyResultsMessage !== undefined) {
    const emptyResultsDiv = document.createElement('div');
    emptyResultsDiv.classList = 'no-results';
    emptyResultsDiv.innerHTML = `${emptyResultsMessage}`;
    return emptyResultsDiv;
  }

  const wrapper = document.createElement('ul');
  wrapper.classList = 'assetList';
  pageSelection?.forEach((item) => {
    const listItem = document.createElement('li');
    const cardLink = document.createElement('a');
    cardLink.href = item.path;
    cardLink.target = '_self';

    const htmlOutput = [];

    config.displayProperties.forEach((prop) => {
      const span = `<span class="${prop}">${item[prop]}</span>`;
      htmlOutput.push(span);
    });
    cardLink.innerHTML = htmlOutput.join('');

    listItem.append(cardLink);
    wrapper.append(listItem);
  });

  return wrapper;
}

export default async function decorate(block) {
  const config = getBlockConfig(block);
  block.textContent = '';
  config.emptyResultsMessage = await getEmptyResultsMessage(config.emptyResultsMessage);
  const folderPath = config.folderPath;
  const assetServiceURL = 'https://www.jmp.com/services/damservlet';

  const allAssets = await getJsonFromUrl(`${assetServiceURL}?path=${folderPath}`);
  const sortOrder = config.sortOrder?.toLowerCase();

  const matching = sortAssetList(allAssets, sortOrder);
  const wrapper = buildAssetItems(matching, config);
  block.append(wrapper);
}
