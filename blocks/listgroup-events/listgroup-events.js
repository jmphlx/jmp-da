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

export function createDateTimeFromString(date, time) {
  const timeArray = time.split(' ');
  const numTime = timeArray[0];
  const timezone = timeArray[1];
  const offsetUTC = getTimezoneObjectFromAbbr(timezones, timezone).utc[0];
  const dateTimeValue = moment(`${date},${numTime}`, 'YYYY-MM-DD,hh:mmA').tz(offsetUTC).format();
  return dateTimeValue;
}

export default async function decorate(block) {
  await loadScript('/scripts/moment/moment.js');
  await loadScript('/scripts/moment/moment-timezone.min.js');

  // Get language index.
  const languageIndexUrl = getLanguageIndex();

  const { data: allPages, columns: propertyNames } = await getJsonFromUrl(languageIndexUrl);
  let pageSelection = allPages;

  const optionsObject = getBlockPropertiesList(block, 'options');
  const startingFolder = getBlockProperty(block, 'startingFolder');
  const emptyResultsMessage = getBlockProperty(block, 'emptyResultsMessage');
  const filterOptions = getListFilterOptions(block, propertyNames);

  // If startingFolder is not null, then apply location filter FIRST.
  if (startingFolder !== undefined) {
    pageSelection = pageFilterByFolder(pageSelection, startingFolder);
  }

  // Filter pages
  if (optionsObject.filterType !== undefined && optionsObject.filterType.toLowerCase() === 'and') {
    pageSelection = pageAndFilter(pageSelection, filterOptions);
  } else {
    pageSelection = pageOrFilter(pageSelection, filterOptions);
  }

  // Order filtered pages by event date and time.
  pageSelection.sort((a, b) => (moment(createDateTimeFromString(a.eventDate, a.eventTime))
    .isBefore(moment(createDateTimeFromString(b.eventDate, b.eventTime))) ? -1 : 1));

  // Cut results down to fit within specified limit.
  const limitObjects = optionsObject.limit;
  if (limitObjects !== undefined && pageSelection.length > limitObjects) {
    pageSelection = pageSelection.slice(0, limitObjects);
  }

  const wrapper = document.createElement('ul');
  const columns = optionsObject.columns !== undefined ? optionsObject.columns : 5;
  wrapper.classList = `listOfItems list-tile col-size-${columns}`;

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

  if (pageSelection.length === 0 && emptyResultsMessage !== undefined) {
    const emptyResultsDiv = document.createElement('div');
    emptyResultsDiv.classList = 'no-results';
    emptyResultsDiv.innerHTML = `<span>${emptyResultsMessage}</span>`;
    wrapper.append(emptyResultsDiv);
  }

  block.append(wrapper);
}
