/* eslint no-undef: 0 */

import {
  arrayIncludesSomeValues,
  containsOperator,
  matchesOperator,
  startsWithOperator,
  getBlockConfig,
  getJsonFromUrl,
  getLanguageIndex,
  pageAndFilter,
  pageFilterByFolder,
  pageOrFilter,
  sortPageList,
} from '../../scripts/jmp.js';

const propertyNames = {
  filter: 'filter',
  displayProperties: 'displayproperties',
  limit: 'limit',
  sortBy: 'sort by',
  sortOrder: 'sort order',
};

function lowercaseObj(obj) {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    newObj[key.toLowerCase()] = obj[key];
  });
  return newObj;
}

function conditionMatches(doc, condition) {
  const lcDoc = lowercaseObj(doc);
  const lcCond = lowercaseObj(condition);
  console.log(lcCond);

  switch (lcCond.operator) {
    // Use quote 'equals' sign here because the = character has special
    // meaning in the spreadsheet and cannot be entered on its own.
    case '\'=\'':
      return lcDoc[lcCond.property?.toLowerCase()] === lcCond.value;
    case '<':
      return Number(lcDoc[lcCond.property?.toLowerCase()]) < Number(lcCond.value);
    case '>':
      return Number(lcDoc[lcCond.property?.toLowerCase()]) > Number(lcCond.value);
    case 'contains':
      return containsOperator(lcDoc, lcCond);
    case 'matches':
       return matchesOperator(lcDoc, lcCond);
    case 'startswith':
      return startsWithOperator(lcDoc, lcCond);
    default:
      return false;
  }
}

function conditionsMatch(doc, conditions) {
  if (!conditions) return false;

  // eslint-disable-next-line no-restricted-syntax
  for (const condition of conditions) {
    //console.log(condition);
    if (!conditionMatches(doc, condition)) return false;
  }
  return true;
}

function docMatches(doc, filters) {
  // Is there more than one sheet? OR the sheets together.
  if (filters[':names']) {
    // eslint-disable-next-line no-restricted-syntax
    for (const filter of filters[':names']) {
      if (conditionsMatch(doc, filters[filter]?.data)) return true;
    }
  } else {
    //only one page.
    if (conditionsMatch(doc, filters.data)) return true;
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

  let matching = [];
  allPages.forEach((doc) => {
    if (docMatches(doc, filters)) {
      matching.push(doc);
    }
  });


  matching = sortPageList(matching, sortBy, sortOrder);

  // Apply limit to results.
  if (limit !== undefined  && matching.length > limit) {
    matching = matching.slice(0, limit);
  }



  const wrapper = document.createElement('ul');
  wrapper.classList = `listOfItems image-list list-tile col-size-5`;

  matching.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.classList = `${item.resourceOptions}`;
    const cardLink = document.createElement('a');
    if (item.redirectUrl.length > 0) {
      cardLink.href = item.redirectUrl;
      cardLink.target = '_blank';
    } else {
      cardLink.href = item.path;
      cardLink.target = '_self';
    }

    let htmlOutput = [];

    blockObj[propertyNames.displayProperties].forEach((prop) => {
      let span;
      if (prop === 'image') {
        span =`<span class="cmp-image image"><img src="${item[prop]}"/></span>`;
      } else {
        span = `<span class="${prop}">${item[prop]}</span>`;
      }
      htmlOutput.push(span);
    });
    cardLink.innerHTML = htmlOutput.join('');

    listItem.append(cardLink);
    wrapper.append(listItem);
  });
  block.append(wrapper);
}
