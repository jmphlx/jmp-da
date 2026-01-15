/* eslint no-undef: 0 */

import {
  filterOutPastEvents,
  filterOutRobotsNoIndexPages,
  getBlockConfig,
  getBlockPropertiesList,
  getJsonFromUrl,
  getLanguageIndex,
} from '../../scripts/jmp.js';

import {
  buildSimplifiedFilter,
  getEmptyResultsMessage,
  pageMatches,
} from '../../scripts/listgroup.js';

/*
 * Apply where a property is not empty.
 */
function pageAnyFilter(pageSelection, tabProperty) {
  if (tabProperty.includes('tags|')) {
    return pageSelection.filter((item) => {
      const tagsString = tabProperty.replace(/^tags\|/, '');
      const pageValue = item.tags;
      return pageValue !== undefined && pageValue.length > 0
        && pageValue.toString().includes(tagsString);
    });
  }
  return pageSelection.filter((item) => {
    const pageValue = item[tabProperty]?.toLowerCase();
    return pageValue !== undefined && pageValue.length > 0;
  });
}

/*
 * Apply all filters as an OR. If any condition is true, include the page in the results.
 */
function pageOrFilter(pageSelection, filterObject) {
  const filteredData = pageSelection.filter((item) => {
    let flag = false;
    Object.keys(filterObject).forEach((key) => {
      const pageValue = item[key]?.toLowerCase();
      const filterValue = filterObject[key];
      if (typeof filterValue === 'object') {
        // if filterValue is an array of values
        // is pageValue also an array of values?
        if (pageValue !== undefined && pageValue.indexOf(',') > -1) {
          const list = pageValue.split(',');
          const trimmedList = list.map((str) => str.trim().toLowerCase());
          flag = arrayIncludesSomeValues(filterValue, trimmedList);
        } else {
          // if filterValue is an array of values
          // but pageValue is a singular value
          flag = filterValue.includes(pageValue);
        }
      } else if (pageValue !== undefined && pageValue.indexOf(',') > -1) {
        // if filterValue is a single string.
        // but pageValue is an array.
        // Check if pageValue contains filter.
        const list = pageValue.split(',');
        const trimmedList = list.map((str) => str.trim().toLowerCase());
        flag = trimmedList.includes(filterValue);
      } else {
        // both pageValue and filterValue are strings so test ===
        flag = filterValue === pageValue;
      }
    });
    return flag;
  });
  return filteredData;
}

function createEmptyTabPanel(emptyResultsMessage, tabPanel) {
  const emptyResultsDiv = document.createElement('div');
  emptyResultsDiv.classList = 'no-results';
  emptyResultsDiv.innerHTML = `${emptyResultsMessage}`;
  tabPanel.append(emptyResultsDiv);
}

function createTabPanel(pageSelection, tabPanel) {
  const wrapper = document.createElement('ul');
  wrapper.classList = 'listOfItems list-tile';

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
  tabPanel.append(wrapper);
}

export default async function decorate(block) {
  const optionsObject = getBlockPropertiesList(block, 'options');
  const config = getBlockConfig(block);
  block.textContent = '';

  const overwriteLanguageIndex = config.overwriteIndexLanguage;

  // Get language index.
  const languageIndexUrl = getLanguageIndex(overwriteLanguageIndex);
  const { data: allPages } = await getJsonFromUrl(languageIndexUrl);

  const tabs = config.tabs;
  const startingFolder = config.startingFolder;
  const emptyResultsMessage = await getEmptyResultsMessage(config.emptyResultsMessage);
  const filterField = config.filter;
  const filters = filterField?.includes('.json') ? await getJsonFromUrl(filterField) : buildSimplifiedFilter(filterField, startingFolder);

  const matching = [];
  allPages.forEach((page) => {
    if (pageMatches(page, filters)) {
      matching.push(page);
    }
  });

  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  Object.keys(tabs).forEach((tab, i) => {
    // create and decorate tabpanel
    const tabpanel = document.createElement('div');
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${i}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${i}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // Add filtered data to tabpanel (reset for each tab)
    let pageSelection = matching;

    const filterObject = {};

    // Handle All differently than a filter.
    if (tab.toLowerCase() === 'all') {
      // where the tabProperty has any value.
      pageSelection = pageAnyFilter(pageSelection, optionsObject.tabProperty);
    } else if (optionsObject.tabProperty.includes('tags|')) {
      const filterCondition = {};
      filterCondition.Property = 'tags';
      filterCondition.Value = tab;
      filterCondition.Operator = 'contains';

      const filterArray = [];
      filterArray.push(filterCondition);
      filterObject.data = filterArray;
      const filtered = [];
      pageSelection.forEach((page) => {
        if (pageMatches(page, filterObject)) {
          filtered.push(page);
        }
      });
      pageSelection = filtered;
    } else {
      filterObject[optionsObject.tabProperty] = tab.toLowerCase();
      pageSelection = pageOrFilter(pageSelection, filterObject);
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
    if (limitObjects !== undefined && pageSelection?.length > limitObjects) {
      pageSelection = pageSelection.slice(0, limitObjects);
    }

    // if there are no results found and there is an empty results message, display it.
    if (pageSelection?.length === 0 && emptyResultsMessage !== undefined) {
      createEmptyTabPanel(emptyResultsMessage, tabpanel);
    } else {
      createTabPanel(pageSelection, tabpanel);
    }
    block.append(tabpanel);

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${i}`;
    button.innerHTML = tabs[tab];
    button.setAttribute('aria-controls', `tabpanel-${i}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
  });

  block.prepend(tablist);
}
