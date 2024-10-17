/* eslint no-undef: 0 */

import {
  containsOperator,
  matchesOperator,
  startsWithOperator,
  getBlockConfig,
  getJsonFromUrl,
  getLanguageIndex,
  sortPageList,
} from '../../scripts/jmp.js';

const propertyNames = {
  filter: 'filter',
  displayProperties: 'displayproperties',
  limit: 'limit',
  sortBy: 'sort-by',
  sortOrder: 'sort-order',
  emptyResultsMessage: 'empty-results-message',
  columns: 'columns',
};

function lowercaseObj(obj) {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    newObj[key.toLowerCase()] = obj[key];
  });
  return newObj;
}

function conditionMatches(page, condition) {
  const lcPage = lowercaseObj(page);
  const lcCond = lowercaseObj(condition);

  switch (lcCond.operator) {
    // Use quote 'equals' sign here because the = character has special
    // meaning in the spreadsheet and cannot be entered on its own.
    case '\'=\'':
      return lcPage[lcCond.property?.toLowerCase()] === lcCond.value;
    case '<':
      return Number(lcPage[lcCond.property?.toLowerCase()]) < Number(lcCond.value);
    case '>':
      return Number(lcPage[lcCond.property?.toLowerCase()]) > Number(lcCond.value);
    case 'contains':
      return containsOperator(lcPage, lcCond);
    case 'matches':
      return matchesOperator(lcPage, lcCond);
    case 'startswith':
      return startsWithOperator(lcPage, lcCond);
    default:
      return false;
  }
}

function conditionsMatch(page, conditions) {
  if (!conditions) return false;

  // eslint-disable-next-line no-restricted-syntax
  for (const condition of conditions) {
    if (!conditionMatches(page, condition)) return false;
  }
  return true;
}

function pageMatches(page, filters) {
  // Is there more than one sheet? OR the sheets together.
  if (filters[':names']) {
    // eslint-disable-next-line no-restricted-syntax
    for (const filter of filters[':names']) {
      if (conditionsMatch(page, filters[filter]?.data)) return true;
    }
  } else if (conditionsMatch(page, filters.data)) {
    // only one page.
    return true;
  }
  return false;
}

export default async function decorate(block) {
  const blockObj = getBlockConfig(block);
  block.textContent = '';

  // Get language index.
  const languageIndexUrl = getLanguageIndex();

  const { data: allPages } = await getJsonFromUrl(languageIndexUrl);
  const filters = await getJsonFromUrl(blockObj[propertyNames.filter]);
  const limit = blockObj[propertyNames.limit];
  const sortBy = blockObj[propertyNames.sortBy]?.toLowerCase();
  const sortOrder = blockObj[propertyNames.sortOrder]?.toLowerCase();
  const emptyResultsMessage = blockObj[propertyNames.emptyResultsMessage];
  const columns = blockObj[propertyNames.columns] ? blockObj[propertyNames.columns] : 5;

  let matching = [];
  allPages.forEach((page) => {
    if (pageMatches(page, filters)) {
      matching.push(page);
    }
  });

  matching = sortPageList(matching, sortBy, sortOrder);

  // Apply limit to results.
  if (limit !== undefined && matching.length > limit) {
    matching = matching.slice(0, limit);
  }

  const wrapper = document.createElement('ul');
  wrapper.classList = `listOfItems image-list list-tile col-size-${columns}`;

  matching.forEach((item) => {
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

    const htmlOutput = [];

    blockObj[propertyNames.displayProperties].forEach((prop) => {
      let span;
      if (prop === 'image') {
        span = `<span class="image"><img src="${item[prop]}"/></span>`;
      } else {
        span = `<span class="${prop}">${item[prop]}</span>`;
      }
      htmlOutput.push(span);
    });
    cardLink.innerHTML = htmlOutput.join('');

    listItem.append(cardLink);
    wrapper.append(listItem);
  });

  if (matching.length === 0 && emptyResultsMessage !== undefined) {
    const emptyResultsDiv = document.createElement('div');
    emptyResultsDiv.classList = 'no-results';
    emptyResultsDiv.innerHTML = `<span>${emptyResultsMessage}</span>`;
    wrapper.append(emptyResultsDiv);
  }
  block.append(wrapper);
}
