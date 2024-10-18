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

import { createTag } from '../../scripts/helper.js';

const propertyNames = {
  filter: 'filter',
  displayProperties: 'displayproperties',
  limit: 'limit',
  sortBy: 'sort-by',
  sortOrder: 'sort-order',
  emptyResultsMessage: 'empty-results-message',
  columns: 'columns',
  groupBy: 'group-by',
  filterBy: 'filter-by',
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

function writeAsOneGroup(wrapper, matching, config) {
  const columns = config[propertyNames.columns] ? config[propertyNames.columns] : 5;
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

    config[propertyNames.displayProperties].forEach((prop) => {
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

  return wrapper;
}

function writeAsAZGroups(wrapper, matching, groupBy, groupProperty, blockObj) {
  const dictionary = matching.reduce((groups, page) => {
    const startingLetter = page[groupProperty][0].toLowerCase();
    // either push to an existing letter entry or create one
    if (groups[startingLetter]) groups[startingLetter].push(page);
    else groups[startingLetter] = [page];

    return groups;
  }, {});

  Object.keys(dictionary).forEach((letter) => {
    const letterGroup = document.createElement('li');
    const heading = document.createElement('h3');
    heading.id = letter;
    heading.textContent = letter.toUpperCase();
    const groupWrapper = document.createElement('ul');
    writeAsOneGroup(groupWrapper, dictionary[letter], blockObj);
    letterGroup.append(heading, groupWrapper);
    wrapper.append(letterGroup);
  });

  const groupHeader = document.createElement('ul');
  groupHeader.classList = 'group-header';
  Object.keys(dictionary).forEach((letter) => {
    const letterLink = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = `#${letter}`;
    anchor.textContent = letter.toUpperCase();
    letterLink.append(anchor);
    groupHeader.append(letterLink);
  });
  wrapper.prepend(groupHeader);
}

function constructDictionary(matching, filterBy) {
  const dictionary = matching.reduce((filterGroups, page) => {
    const filterValue = page[filterBy];
    if (filterValue.indexOf(',') > 0) {
      const filterValueArray = filterValue.split(',');
      filterValueArray.forEach((val) => {
        // either push to an existing entry or create one
        if (filterGroups[val.trim()]) filterGroups[val.trim()].push(page);
        else filterGroups[val.trim()] = [page];
      });
    } else {
      // either push to an existing entry or create one
      if (filterGroups[filterValue]) filterGroups[filterValue].push(page);
      else filterGroups[filterValue] = [page];
    }

    return filterGroups;
  }, {});
  return dictionary;
}

function constructDropdown(dictionary) {
  const filterDropdown = createTag('select', { class: 'filterDropdown'});

  const allDropdownItem = createTag('option', { value: ''});
  allDropdownItem.textContent = 'All';
  filterDropdown.append(allDropdownItem);

  Object.keys(dictionary).forEach((filterValue) => {
    if (filterValue.length > 0) {
      const dropdownItem = createTag('option', { value: `${filterValue}` });
      dropdownItem.innerText = filterValue;
      filterDropdown.append(dropdownItem);
    }
  });

  return filterDropdown;
}

export default async function decorate(block) {
  const config = getBlockConfig(block);
  block.textContent = '';

  // Get language index.
  const languageIndexUrl = getLanguageIndex();

  const { data: allPages } = await getJsonFromUrl(languageIndexUrl);
  const filters = await getJsonFromUrl(config[propertyNames.filter]);
  const limit = config[propertyNames.limit];
  const sortBy = config[propertyNames.sortBy]?.toLowerCase();
  const sortOrder = config[propertyNames.sortOrder]?.toLowerCase();
  const emptyResultsMessage = config[propertyNames.emptyResultsMessage];
  const groupBy = config[propertyNames.groupBy]?.toLowerCase();
  const filterBy = config[propertyNames.filterBy]?.toLowerCase();

  let matching = [];
  allPages.forEach((page) => {
    if (pageMatches(page, filters)) {
      matching.push(page);
    }
  });

  matching = sortPageList(matching, sortBy, sortOrder);

  // Apply limit to results.
  // TO-DO: May need to move this to write methods
  if (limit !== undefined && matching.length > limit) {
    matching = matching.slice(0, limit);
  }

  const wrapper = document.createElement('ul');

  if (filterBy) {
    const dictionary = constructDictionary(matching, filterBy);
    const filterDropdown = constructDropdown(dictionary);

      // When value changes, clear out results and add matching values.
    filterDropdown.addEventListener('change', (e) => {
      wrapper.querySelectorAll('li').forEach(e => e.remove());
      if (filterDropdown.value) {
        writeAsOneGroup(wrapper, dictionary[filterDropdown.value], config);
      } else {
        writeAsOneGroup(wrapper, matching, config);
      }
    });
    block.append(filterDropdown);
  }

  if (matching.length > 0) {
    if (groupBy) {
      wrapper.classList = 'groupList';
      writeAsAZGroups(wrapper, matching, groupBy, sortBy, config);
    } else {
      writeAsOneGroup(wrapper, matching, config);
    }
  }

  if (matching.length === 0 && emptyResultsMessage !== undefined) {
    const emptyResultsDiv = document.createElement('div');
    emptyResultsDiv.classList = 'no-results';
    emptyResultsDiv.innerHTML = `<span>${emptyResultsMessage}</span>`;
    wrapper.append(emptyResultsDiv);
  }
  block.append(wrapper);
}
