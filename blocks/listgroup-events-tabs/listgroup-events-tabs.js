/* eslint no-undef: 0 */

import { loadScript } from '../../scripts/aem.js';
import {
  getBlockProperty,
  getBlockPropertiesList,
  getJsonFromUrl,
  getLanguageIndex,
  getListFilterOptions,
  getTimezoneObjectFromAbbr,
  getTimezones,
  pageAndFilter,
  pageFilterByFolder,
  pageOrFilter,
} from '../../scripts/jmp.js';

const timezones = await getTimezones();

/*
 * Apply where a property is not empty.
 */
function pageAnyFilter(pageSelection, tabProperty) {
  return pageSelection.filter((item) => {
    const pageValue = item[tabProperty].toLowerCase();
    return pageValue !== undefined && pageValue.length > 0;
  });
}

export function createDateTimeFromString(date, time) {
  const timeArray = time.split(' ');
  const numTime = timeArray[0];
  const timezone = timeArray[1];
  const offsetUTC = getTimezoneObjectFromAbbr(timezones, timezone).utc[0];
  const dateTimeValue = moment(`${date},${numTime}`, 'YYYY-MM-DD,hh:mmA').tz(offsetUTC).format();
  return dateTimeValue;
}

function createEmptyTabPanel(emptyResultsMessage, tabPanel) {
  const emptyResultsDiv = document.createElement('div');
  emptyResultsDiv.classList = 'no-results';
  emptyResultsDiv.innerHTML = `<span>${emptyResultsMessage}</span>`;
  tabPanel.append(emptyResultsDiv);
}

function createTabPanel(pageSelection, tabPanel) {
  const wrapper = document.createElement('ul');
  wrapper.classList = 'listOfItems list-tile';

  pageSelection.forEach((item) => {
    const listItem = document.createElement('li');
    const cardLink = document.createElement('a');
    if (item.redirectUrl.length > 0) {
      cardLink.href = item.redirectUrl;
      cardLink.target = '_blank';
    } else {
      cardLink.href = item.path;
      cardLink.target = '_self';
    }
    const htmlOutput = `
    <span class="tag-category">${item.resourceType}</span>
    <span class="title">${item.title}</span>
    <span class="subtitle">${item.eventDate} | ${item.eventTime}</span>`;
    cardLink.innerHTML = htmlOutput;

    listItem.append(cardLink);
    wrapper.append(listItem);
  });
  tabPanel.append(wrapper);
}

export default async function decorate(block) {
  // Load moment for date comparisons.
  await loadScript('/scripts/moment/moment.js');
  await loadScript('/scripts/moment/moment-timezone.min.js');

  // Get language index.
  const languageIndexUrl = getLanguageIndex();
  const { data: allPages, columns: propertyNames } = await getJsonFromUrl(languageIndexUrl);
  let prefilteredPages = allPages;

  // Get options, tabs, filters.
  const optionsObject = getBlockPropertiesList(block, 'options');
  const tabs = getBlockPropertiesList(block, 'tabs');
  const startingFolder = getBlockProperty(block, 'startingFolder');
  const emptyResultsMessage = getBlockProperty(block, 'emptyResultsMessage');
  const filterOptions = getListFilterOptions(block, propertyNames);

  // If startingFolder is not null, then apply page location filter FIRST.
  if (startingFolder !== undefined) {
    prefilteredPages = pageFilterByFolder(prefilteredPages, startingFolder);
  }

  // Apply filters if applicable.
  if (Object.keys(filterOptions).length > 0) {
    if (optionsObject.filterType !== undefined && optionsObject.filterType.toLowerCase() === 'and') {
      prefilteredPages = pageAndFilter(prefilteredPages, filterOptions);
    } else {
      prefilteredPages = pageOrFilter(prefilteredPages, filterOptions);
    }
  }

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
    let pageSelection = prefilteredPages;

    const filterObject = {};

    // Handle All differently than a filter.
    if (tab.toLowerCase() === 'all') {
      // where the tabProperty has any value.
      pageSelection = pageAnyFilter(pageSelection, optionsObject.tabProperty);
    } else {
      filterObject[optionsObject.tabProperty] = tab.toLowerCase();
      pageSelection = pageOrFilter(pageSelection, filterObject);
    }

    // Order filtered pages by event date and time.
    pageSelection.sort((a, b) => (moment(createDateTimeFromString(a.eventDate, a.eventTime))
      .isBefore(moment(createDateTimeFromString(b.eventDate, b.eventTime))) ? -1 : 1));

    // Cut results down to fit within specified limit.
    const limitObjects = optionsObject.limit;
    if (limitObjects !== undefined && pageSelection.length > limitObjects) {
      pageSelection = pageSelection.slice(0, limitObjects);
    }

    // if there are no results found and there is an empty results message, display it.
    if (pageSelection.length === 0 && emptyResultsMessage !== undefined) {
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
