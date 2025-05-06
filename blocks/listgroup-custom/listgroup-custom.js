/* eslint no-undef: 0 */

import {
  containsOperator,
  matchesOperator,
  startsWithOperator,
  getBlockConfig,
  getJsonFromUrl,
  getLanguageIndex,
  getLanguage,
  sortPageList,
  filterOutRobotsNoIndexPages,
  writeImagePropertyInList,
} from '../../scripts/jmp.js';

import { createTag } from '../../scripts/helper.js';

let useFilter = false;
let useTabs = false;

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

function writeItems(matching, config, listElement) {
  matching?.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.classList = `${item.resourceOptions}`;
    const cardLink = document.createElement('a');
    if (item.redirectTarget?.length > 0) {
      cardLink.href = item.redirectTarget;
      cardLink.target = '_blank';
    } else {
      cardLink.href = item.path;
      cardLink.target = '_self';
    }

    const htmlOutput = [];

    config.displayProperties.forEach((prop) => {
      let span;
      if (prop === 'image' || prop === 'displayImage') {
        span = writeImagePropertyInList(prop, item);
      } else {
        span = `<span class="${prop}">${item[prop]}</span>`;
      }
      htmlOutput.push(span);
    });
    cardLink.innerHTML = htmlOutput.join('');

    listItem.append(cardLink);
    listElement.append(listItem);
  });
}

function writeAsOneGroup(matching, config) {
  const wrapper = document.createElement('ul');
  const columns = config.columns ? config.columns : 5;
  wrapper.classList = `listOfItems image-list list-tile col-size-${columns}`;
  if (useTabs) {
    wrapper.setAttribute('role', 'tabpanel');
  }
  matching?.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.classList = `${item.resourceOptions}`;
    const cardLink = document.createElement('a');
    if (item.redirectTarget?.length > 0) {
      cardLink.href = item.redirectTarget;
      cardLink.target = '_blank';
    } else {
      cardLink.href = item.path;
      cardLink.target = '_self';
    }

    const htmlOutput = [];

    config.displayProperties.forEach((prop) => {
      let span;
      if (prop === 'image' || prop === 'displayImage') {
        span = writeImagePropertyInList(prop, item);
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

function writeAsAZGroups(matching, groupBy, groupProperty, blockObj) {
  const wrapper = createTag('ul', { class: 'groupList' });
  const dictionary = matching.reduce((groups, page) => {
    const startingLetter = page[groupProperty][0]?.toLowerCase();
    // either push to an existing letter entry or create one
    if (startingLetter !== undefined) {
      if (groups[startingLetter]) groups[startingLetter].push(page);
      else groups[startingLetter] = [page];
    }

    return groups;
  }, {});

  Object.keys(dictionary).forEach((letter) => {
    const letterGroup = document.createElement('li');
    const heading = document.createElement('h3');
    heading.id = letter;
    heading.textContent = letter.toUpperCase();
    const groupWrapper = writeAsOneGroup(dictionary[letter], blockObj);
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

  return wrapper;
}

function constructDictionary(matching, filterBy) {
  const dictionary = matching.reduce((filterGroups, page) => {
    const lcPage = lowercaseObj(page);
    const filterValue = lcPage[filterBy];
    // is filterValue a list of values.
    if (filterValue && filterValue.indexOf(',') > 0) {
      const filterValueArray = filterValue.split(',');
      filterValueArray.forEach((val) => {
        // either push to an existing entry or create one
        if (filterGroups[val.trim()]) filterGroups[val.trim()].push(page);
        else filterGroups[val.trim()] = [page];
      });
    } else {
      // either push to an existing entry or create one
      // eslint-disable-next-line no-lonely-if
      if (filterGroups[filterValue]) filterGroups[filterValue].push(page);
      else filterGroups[filterValue] = [page];
    }

    return filterGroups;
  }, {});
  return dictionary;
}

async function constructDropdown(dictionary, filterBy, defaultFilterOption, translateFilter) {
  const filterDropdown = createTag('select', {
    class: 'filterDropdown',
    id: `${filterBy}`,
  });

  const allDropdownItem = createTag('option', { value: '' });
  allDropdownItem.textContent = defaultFilterOption || 'Select';
  filterDropdown.append(allDropdownItem);

  let useTranslation;
  if (translateFilter !== undefined) {
    const pageLanguage = getLanguage();
    const data = await getJsonFromUrl(translateFilter);
    const { data: translations } = data[pageLanguage];
    useTranslation = translations[0];
  }

  Object.keys(dictionary).sort().forEach((filterValue) => {
    if (filterValue.length > 0) {
      const dropdownItem = createTag('option', { value: `${filterValue}` });
      dropdownItem.innerText = useTranslation !== undefined ? useTranslation[filterValue]
        : filterValue;
      filterDropdown.append(dropdownItem);
    }
  });

  return filterDropdown;
}

function applyFilter(matching, filterBy, filterValue) {
  const filteredData = matching.filter((item) => {
    // Need to check if it is an array and contains
    const conditionObject = {
      property: filterBy,
      value: filterValue,
    };
    return containsOperator(item, conditionObject);
  });
  return filteredData;
}

function buildListItems(block, matching, tabDictionary, config) {
  let pageSelection = matching;
  if (useTabs) {
    const selectedTab = block.querySelector('button[aria-selected="true"].tabs-tab');
    if (selectedTab.id !== 'all') {
      pageSelection = tabDictionary[selectedTab.id];
    }
  }

  if (useFilter) {
    const filterDropdown = block.querySelector('select');
    if (filterDropdown.value) {
      pageSelection = applyFilter(pageSelection, filterDropdown.id, filterDropdown.value);
    }
  }

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

function reBuildList(matching, block, tabDictionary, config) {
  block.querySelector('.listOfItems').remove();
  block.append(buildListItems(block, matching, tabDictionary, config));
}

function constructTabsObject(tabsArray) {
  const tabObj = {};

  tabsArray.forEach((item) => {
    if (item.includes('=')) {
      const optionsString = item.split('=', 2);
      tabObj[optionsString[0]] = optionsString[1];
    }
  });
  return tabObj;
}

function constructTabs(matching, dictionary, tabs, block, config) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  Object.keys(tabs).forEach((tab, i) => {
    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `${tabs[tab]}`;
    button.innerHTML = tab;
    button.setAttribute('aria-controls', `tabpanel-${i}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      button.setAttribute('aria-selected', true);
      reBuildList(matching, block, dictionary, config);
    });
    tablist.append(button);
  });

  return tablist;
}

function readFilterStatement(filterString) {
  const filterObj = {};
  const splitFilter = filterString.split('=');
  filterObj.Property = splitFilter[0].trim();
  filterObj.Value = splitFilter[1].trim();
  filterObj.Operator = 'contains';
  return filterObj;
}

function buildSimplifiedFilter(filterString, startingFolder) {
  const filterObj = {};
  const dataArray = [];

  if (startingFolder) {
    const folderFilter = {};
    folderFilter.Property = 'path';
    folderFilter.Operator = 'matches';
    folderFilter.Value = startingFolder.trim();
    dataArray.push(folderFilter);
  }

  // DOES NOT SUPPORT OR statments.
  if (filterString?.indexOf('AND')) {
    const filters = filterString.split('AND');
    filters.forEach((filter) => {
      dataArray.push(readFilterStatement(filter));
    });
    filterObj.data = dataArray;
  } else if (filterString) {
    dataArray.push(readFilterStatement(filterString));
  }
  filterObj.data = dataArray;
  return filterObj;
}

function loadMoreItems(matching, block, config) {
  console.log('load more');
  const listElement = block.querySelector('ul');
  if (listElement) {
    let currDisplayNum = listElement.getAttribute('data-displaynum');
    const limit = config.limit;
    currDisplayNum = currDisplayNum | limit;
    const startingItem = currDisplayNum;
    const columns = config.columns ? config.columns : 5;
    const rows = 3;
    const numOfAddedItems = rows * columns;
    currDisplayNum = currDisplayNum + numOfAddedItems;
    console.log(`${numOfAddedItems}`);
    console.log(`add items ${startingItem} to ${currDisplayNum}`);
    listElement.setAttribute('data-displaynum', currDisplayNum);
    const matchingItemsToAdd = matching.slice(startingItem, currDisplayNum);
    if (currDisplayNum > matching.length) {
      // no more results.
      block.querySelector('button').disabled = true;
    } 
    console.log(matchingItemsToAdd);
    console.log(listElement);
    writeItems(matchingItemsToAdd, config, listElement);
  }
}

export default async function decorate(block) {
  const config = getBlockConfig(block);
  block.textContent = '';

  // Get language index.
  const languageIndexUrl = getLanguageIndex(config.overwriteIndexLanguage);

  const { data: allPages } = await getJsonFromUrl(languageIndexUrl);

  const filterField = config.filter;
  // Ignored if filter is a json file.
  const startingFolder = config.startingFolder;
  const filters = filterField?.includes('.json') ? await getJsonFromUrl(filterField) : buildSimplifiedFilter(filterField, startingFolder);
  const sortBy = config.sortBy;
  const sortOrder = config.sortOrder?.toLowerCase();
  const groupBy = config.groupBy;
  const filterBy = config.filterBy;
  const translateFilter = config.translateFilter;
  const tabProperty = config.tabProperty?.toLowerCase();
  const tabsArray = config.tabs;
  useTabs = tabProperty && tabsArray;
  useFilter = filterBy;

  let wrapper;
  let matching = [];
  allPages.forEach((page) => {
    if (pageMatches(page, filters)) {
      matching.push(page);
    }
  });

  console.log(`Found items ${matching.length}`);

  // Do not include Robots noindex pages.
  matching = filterOutRobotsNoIndexPages(matching);

  matching = sortPageList(matching, sortBy, sortOrder);

  const tabDictionary = useTabs ? constructDictionary(matching, tabProperty) : undefined;
  const filterDictionary = useFilter ? constructDictionary(matching, filterBy) : undefined;

  // Create Filter Dropdown
  if (filterDictionary) {
    const defaultFilterOption = config.defaultFilterOption;

    const filterDropdown = await constructDropdown(
      filterDictionary,
      filterBy,
      defaultFilterOption,
      translateFilter,
    );

    // When value changes, clear out results and add matching values.
    filterDropdown.addEventListener('change', () => {
      reBuildList(matching, block, tabDictionary, config);
    });

    block.append(filterDropdown);
  }

  //  Create tab group
  if (tabDictionary) {
    const tabsObject = constructTabsObject(tabsArray);
    const tabs = constructTabs(matching, tabDictionary, tabsObject, block, config);
    block.append(tabs);
  }

  // Build initial list.
  // Group by does not work with filter or tabs.
  if (groupBy && matching.length > 0) {
    wrapper = writeAsAZGroups(matching, groupBy, sortBy, config);
  } else {
    wrapper = buildListItems(block, matching, tabDictionary, config);
  }

  block.append(wrapper);


  // Add Load More Button
  if (config.loadMore) {
    if (config.limit && matching && matching.length > config.limit) {
      const loadMoreDiv = document.createElement('div');
      loadMoreDiv.className = "load-more-container";
      const loadMoreButton = document.createElement('button');
      loadMoreButton.className = 'load-more-button';
      loadMoreButton.innerHTML = "Load More";
      loadMoreButton.addEventListener('click', () => {
        loadMoreItems(matching, block, config);
      });
      loadMoreDiv.append(loadMoreButton);
      block.append(loadMoreDiv);
    }
  }
}
