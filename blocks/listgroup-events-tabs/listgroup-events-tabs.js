import { loadScript } from '../../scripts/aem.js';
import {
  getJsonFromUrl,
  getListFilterOptions,
  getTimezoneObjectFromAbbr,
  getTimezones,
  languageIndexExists,
  pageAndFilter,
  pageOrFilter,
  parseBlockOptions,
} from '../../scripts/jmp.js';

const timezones = await getTimezones();

export function createDateTimeFromString(date, time) {
  const timeArray = time.split(' ');
  const numTime = timeArray[0];
  const timezone = timeArray[1];
  const offsetUTC = getTimezoneObjectFromAbbr(timezones, timezone).utc[0];
  const dateTimeValue = moment(`${date},${numTime}`, 'YYYY-MM-DD,hh:mmA').tz(offsetUTC).format();
  return dateTimeValue;
}

function getStartingFolder(block) {
  let startingFolder;
  const currentRowElement = block.firstElementChild?.children;
  if (currentRowElement !== undefined
    && currentRowElement.item(0).textContent.toLowerCase() === 'startingfolder') {
      startingFolder = currentRowElement.item(1).textContent;
      block.firstElementChild.remove();
  }
  return startingFolder;
}

function pageFilterByFolder(pageSelection, folderPath) {
  const filteredData = pageSelection.filter((item) => {
    return item.path.startsWith(folderPath);
  });
  return filteredData;
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
  // Get options, tabs, filters.
  const optionsObject = parseBlockOptions(block);
  block.firstElementChild.remove();

  //const startingFolder = getStartingFolder(block);
  const tabs = parseBlockOptions(block, 'tabs');
  block.firstElementChild.remove();
  console.log(tabs);

  //const filterOptions = getListFilterOptions(block);

  // Get Index based on language directory of current page.
  const pageLanguage = window.location.pathname.split('/')[1];
  let url = '/jmp-all.json';
  if (languageIndexExists(pageLanguage)) {
    url = `/jmp-${pageLanguage}.json`;
  }
  const { data: allPages } = await getJsonFromUrl(url);

  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  Object.keys(tabs).forEach((tab, i) => {
    // decorate tabpanel
    const tabpanel = document.createElement('div');
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${i}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${i}`);
    tabpanel.setAttribute('role', 'tabpanel');

    //Add filtered data to tabpanel
    let pageSelection = allPages;
    console.log(pageSelection);
    const filterObject = {};
    console.log(optionsObject.tabProperty);
    console.log(tabs[tab]);
    filterObject[optionsObject.tabProperty] = tab.toLowerCase();
    console.log(filterObject);
    pageSelection = pageOrFilter(pageSelection, filterObject);
    console.log(pageSelection);
    createTabPanel(pageSelection, tabpanel);
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
    //tab.remove();
  });

  block.prepend(tablist);
}
