/* eslint no-undef: 0 */

import {
  getBlockConfig,
  getJsonFromUrl,
  getLanguageIndex,
  externalGETRequest,
  getLanguage,
  sortAssetList,
} from '../../scripts/jmp.js';

function writeAsOneGroup(matching, config) {
  const wrapper = document.createElement('ul');
  const columns = config.columns ? config.columns : 5;
  wrapper.classList = `assetList col-size-${columns}`;
  matching?.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.classList = `${item.resourceOptions}`;
    const cardLink = document.createElement('a');
    cardLink.href = item.path;
    cardLink.target = '_self';

    const htmlOutput = [];

    config.displayProperties.forEach((prop) => {
      let span = `<span class="${prop}">${item[prop]}</span>`;
      htmlOutput.push(span);
    });
    cardLink.innerHTML = htmlOutput.join('');

    listItem.append(cardLink);
    wrapper.append(listItem);
  });

  return wrapper;
}

function buildAssetItems(block, matching, config) {
  let pageSelection = matching;

  const limit = config.limit;
  if (limit !== undefined && pageSelection?.length > limit) {
    pageSelection = pageSelection.slice(0, limit);
  }

  const emptyResultsMessage = config.emptyResultsMessage;
  if ((pageSelection === undefined || pageSelection.length === 0)
      && emptyResultsMessage !== undefined) {
    const emptyResultsDiv = document.createElement('div');
    emptyResultsDiv.classList = 'listOfItems no-results';
    emptyResultsDiv.innerHTML = `<span>${emptyResultsMessage}</span>`;
    return emptyResultsDiv;
  }

  return writeAsOneGroup(pageSelection, config);
}

export default async function decorate(block) {
  const config = getBlockConfig(block);
  block.textContent = '';
  const folderPath = config.folderPath;
  const assetServiceURL = 'https://edge-www.jmp.com/services/damservlet';
  console.log(folderPath);


  const allAssets = await getJsonFromUrl(`${assetServiceURL}?path=${folderPath}`);
  //const allAssets = await externalGETRequest(`${assetServiceURL}?path=${folderPath}`);
  console.log(allAssets);
  const sortBy = config.sortBy;
  const sortOrder = config.sortOrder?.toLowerCase();

  let wrapper;
  let matching = [];
  matching = sortAssetList(allAssets, sortBy, sortOrder);


  // Build initial list.
  wrapper = buildAssetItems(block, matching, config);
  block.append(wrapper);
}
