/* eslint no-undef: 0 */
/* eslint consistent-return: 0 */

import {
  containsOperator,
  convertCamelToKebabCase,
  getBlockConfig,
  getJsonFromUrl,
  getLanguageIndex,
  getLanguage,
  isTagProperty,
  sortPageList,
  filterOutRobotsNoIndexPages,
  writeImagePropertyInList,
} from '../../scripts/jmp.js';

import {
  buildSimplifiedFilter,
  checkForTagProperties,
  getEmptyResultsMessage,
  getTagTranslations,
  lowercaseObj,
  pageMatches,
} from '../../scripts/listgroup.js';

import { loadScript } from '../../scripts/aem.js';
import { createTag } from '../../scripts/helper.js';

const dateProperties = ['releaseDate'];

let useFilter = false;
let useTabs = false;

function isDateProperty(propertyName) {
  let isDate = -1;
  for (let i = 0; i < dateProperties.length; i++) {
    if (propertyName.startsWith(dateProperties[i])) {
      isDate = i;
      break;
    }
  }
  return isDate;
}

function processDate(dateProperty, prop, item) {
  let span;
  const dateFormatRegex = /(?<=\()(.*?)(?=\))/g;
  const dateFormatString = prop.match(dateFormatRegex);

  if (dateFormatString && dateFormatString.length > 0) {
    const adjustedPropName = dateProperties[dateProperty];
    if (item[adjustedPropName]) {
      const adjustedDate = dateFns.format(item[adjustedPropName], dateFormatString[0]);
      span = `<span class="${adjustedPropName}">${adjustedDate}</span>`;
    }
  } else {
    // Treat date like normal
    span = `<span class="${prop}">${item[prop]}</span>`;
  }
  return span;
}

function writeOutTagProperties(prop, item) {
  const tagsProperty = item.tags;
  if (!tagsProperty || tagsProperty.length < 1 || !window.tagtranslations) {
    // No tags or no translations so default to old method.
    return item[prop];
  }

  const convertedProp = convertCamelToKebabCase(prop);
  const tagsValue = Object.values(tagsProperty);
  const tagsArray = [];
  tagsValue.forEach((tag) => {
    if (tag.startsWith(convertedProp)) {
      // Found the prop string. Convert it to displayable format
      if (window.tagtranslations[tag]) {
        tagsArray.push(window.tagtranslations[tag]);
      } else {
        // Couldn't find translation of prop.
        tagsArray.push(item[prop]);
      }
    }
  });
  return tagsArray.join(', ');
}

function createCardHTML(prop, item) {
  let span;
  const dateProperty = isDateProperty(prop);
  if (isTagProperty(prop)) {
    span = `<span class="${prop}">${writeOutTagProperties(prop, item)}</span>`;
  } else if (prop === 'image' || prop === 'displayImage') {
    span = writeImagePropertyInList(prop, item);
  } else if (dateProperty >= 0) {
    span = processDate(dateProperty, prop, item);
  } else {
    span = `<span class="${prop}">${item[prop]}</span>`;
  }
  return span;
}

function checkForDateProperties(displayProperties) {
  let dateFound = false;
  for (let i = 0; i < displayProperties.length; i++) {
    if (isDateProperty(displayProperties[i])) {
      dateFound = true;
      break;
    }
  }
  return dateFound;
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
      const span = createCardHTML(prop, item);
      htmlOutput.push(span);
    });
    cardLink.innerHTML = htmlOutput.join('');

    listItem.append(cardLink);
    listElement.append(listItem);
  });
}

function loadMoreItems(matching, block, config) {
  const listElement = block.querySelector('ul');
  if (listElement) {
    let currDisplayNum = listElement.getAttribute('data-displaynum');
    const limit = config.limit;

    currDisplayNum = currDisplayNum ? parseInt(currDisplayNum, 10) : parseInt(limit, 10);
    const startingItem = currDisplayNum;
    const columns = config.columns ? config.columns : 5;
    const rows = 3;
    const numOfAddedItems = rows * columns;
    currDisplayNum += numOfAddedItems;
    console.log(`add items ${startingItem} to ${currDisplayNum}`);
    listElement.setAttribute('data-displaynum', currDisplayNum);
    const matchingItemsToAdd = matching.slice(startingItem, currDisplayNum);
    if (currDisplayNum > matching.length) {
      // no more results.
      block.querySelector('button').disabled = true;
    }
    writeItems(matchingItemsToAdd, config, listElement);
  }
}

function addLoadMoreButton(block, config, matching) {
  const loadMoreDiv = document.createElement('div');
  loadMoreDiv.className = 'load-more-container';
  const loadMoreButton = document.createElement('button');
  loadMoreButton.className = 'load-more-button';
  loadMoreButton.innerHTML = 'Load More';
  loadMoreButton.addEventListener('click', () => {
    loadMoreItems(matching, block, config);
  });
  // Disable button if already at the limit
  if (config.limit && matching && matching.length <= config.limit) {
    loadMoreButton.disabled = true;
  }
  loadMoreDiv.append(loadMoreButton);
  block.append(loadMoreDiv);
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
      const span = createCardHTML(prop, item);
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
    const filterValue = lcPage[filterBy.toLowerCase()];
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

  let sortedList = Object.keys(dictionary).sort();
  let useTranslation;
  if (translateFilter !== undefined) {
    const pageLanguage = getLanguage();
    const data = await getJsonFromUrl(translateFilter);
    const { data: translations } = data[pageLanguage];
    useTranslation = translations[0];
    sortedList = Object.keys(dictionary)
      .sort((a, b) => (useTranslation[a] < useTranslation[b] ? -1 : 1));
  }

  sortedList.forEach((filterValue) => {
    if (filterValue.length > 0) {
      const dropdownItem = createTag('option', { value: `${filterValue}` });
      if (useTranslation) {
        if (useTranslation[filterValue]) {
          dropdownItem.innerText = useTranslation[filterValue];
        } else {
          dropdownItem.innerText = filterValue;
        }
      } else {
        dropdownItem.innerText = filterValue;
      }
      filterDropdown.append(dropdownItem);
    }
  });

  return filterDropdown;
}

function applyFilter(matching, filterBy, filterValue) {
  const filteredData = matching.filter((item) => {
    const lcPage = lowercaseObj(item);
    // Need to check if it is an array and contains
    const conditionObject = {
      property: filterBy,
      value: filterValue,
    };
    return containsOperator(lcPage, conditionObject);
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

  const filterDropdown = block.querySelector('select');

  if (filterDropdown) {
    if (filterDropdown.value) {
      pageSelection = applyFilter(pageSelection, filterDropdown.id, filterDropdown.value);
    }
  }

  const filteredPages = pageSelection;

  const limit = config.limit;
  if (limit !== undefined && pageSelection?.length > limit) {
    pageSelection = pageSelection.slice(0, limit);
  }

  const emptyResultsMessage = config.emptyResultsMessage;
  if ((pageSelection === undefined || pageSelection.length === 0)
      && emptyResultsMessage !== undefined) {
    const emptyResultsDiv = document.createElement('div');
    emptyResultsDiv.classList = 'listOfItems no-results';
    emptyResultsDiv.innerHTML = `${emptyResultsMessage}`;
    block.append(emptyResultsDiv);
    return;
  }

  const listItems = writeAsOneGroup(pageSelection, config);
  block.append(listItems);

  // Add Load More Button
  // Load More needs the pageSelection before limit is applied.
  if (config.loadMore) {
    addLoadMoreButton(block, config, filteredPages);
  }
}

function reBuildList(matching, block, tabDictionary, config) {
  block.querySelector('.listOfItems').remove();
  if (config.loadMore) {
    // Also remove load more button so it can be rebuilt with
    // proper matching list for assigned filter.
    block.querySelector('.load-more-container').remove();
  }
  buildListItems(block, matching, tabDictionary, config);
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

export default async function decorate(block) {
  const config = getBlockConfig(block);
  block.textContent = '';

  const includesDateProperty = checkForDateProperties(config.displayProperties);
  if (includesDateProperty) {
    await loadScript('https://cdn.jsdelivr.net/npm/date-fns@4.1.0/cdn.min.js');
  }

  const includesTagProperty = checkForTagProperties(config.displayProperties);
  if (includesTagProperty) {
    await getTagTranslations();
  }

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
  config.emptyResultsMessage = await getEmptyResultsMessage(config.emptyResultsMessage);

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
    block.append(writeAsAZGroups(matching, groupBy, sortBy, config));
  } else {
    buildListItems(block, matching, tabDictionary, config);
  }
}
