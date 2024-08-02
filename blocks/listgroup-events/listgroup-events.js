import {
  getJsonFromUrl,
  languageIndexExists,
  loadScript,
  parseBlockOptions,
} from '../../scripts/aem.js';

import {
  getTimezoneObjectFromAbbr,
  getTimezones,
} from '../../scripts/jmp.js';

const timezones = await getTimezones();

export function createDateTimeFromString(date, time) {
  let timeArray = time.split(' ');
  let numTime = timeArray[0];
  let timezone = timeArray[1];
  console.log(timezone);
  let offsetUTC = getTimezoneObjectFromAbbr(timezones, timezone).utc[0];
  console.log(offsetUTC);

  let dateTimeValue = moment(date + ',' + numTime, 'YYYY-MM-DD,hh:mmA').tz(offsetUTC).format();
  console.log(dateTimeValue);
  return dateTimeValue;
}

/*
 * Check if an array includes all values of another array
 */
export function arrayIncludesAllValues(filterValues, pageValues) {
  return pageValues.every((val) => filterValues.includes(val));
}

/*
 * Check if an array contains any of the values of another array.
 */
export function arrayIncludesSomeValues(filterValues, pageValues) {
  return pageValues.some((val) => filterValues.includes(val));
}

/*
 * Apply all filters as an OR. If any condition is true, include the page in the results.
 */
export function orFilter(pageSelection, filterObject) {
  const filteredData = pageSelection.filter((item) => {
    let flag = false;
    Object.keys(filterObject).forEach((key) => {
      const pageValue = item[key].toLowerCase();
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

/*
 * Apply all filters as an AND. All conditions must be true in order
 * to include the page in the results.
 */
export function andFilter(pageSelection, filterObject) {
  const filteredData = pageSelection.filter((item) => {
    let flag = true;
    try {
      Object.keys(filterObject).forEach((key) => {
        const pageValue = item[key].toLowerCase();
        const filterValue = filterObject[key];
        if (typeof filterValue === 'object') {
          // if filterValue is an array of values
          // is pageValue also an array of values?
          if (pageValue !== undefined && pageValue.indexOf(',') > -1) {
            const list = pageValue.split(',');
            const trimmedList = list.map((str) => str.trim().toLowerCase());
            if (!arrayIncludesAllValues(filterValue, trimmedList)) {
              throw new Error('condition not met');
            }
          } else {
            // if pageValue is not also an array of values then it can't possibly match.
            throw new Error('condition not met');
          }
        } else if (pageValue !== undefined && pageValue.indexOf(',') > -1) {
          /* if filterValue is a single string.
           * but pageValue is an array.
           * Check if pageValue contains filter. */
          const list = pageValue.split(',');
          const trimmedList = list.map((str) => str.trim().toLowerCase());
          if (!trimmedList.includes(filterValue)) {
            throw new Error('condition not met');
          }
        // both pageValue and filterValue are strings so test ===
        } else if (filterValue !== pageValue) {
          throw new Error('condition not met');
        }
      });
    } catch (e) {
      flag = false;
    }
    return flag;
  });
  return filteredData;
}

function getFilterOptions(block) {
  const filterOptions = {};
  while (block.firstElementChild !== undefined && block.firstElementChild !== null) {
    const optionName = block.firstElementChild?.children.item(0).textContent;
    let optionValue = block.firstElementChild?.children.item(1).textContent.toLowerCase();
    if (optionValue.indexOf(',') > -1) {
      optionValue = optionValue.split(',').map((str) => str.trim().toLowerCase());
    }
    filterOptions[optionName] = optionValue;
    block.firstElementChild.remove();
  }
  return filterOptions;
}

export default async function decorate(block) {
  await loadScript('/scripts/moment/moment.js');
  await loadScript('/scripts/moment/moment-timezone.min.js');
  const optionsObject = parseBlockOptions(block);
  block.firstElementChild.remove();

  const filterOptions = getFilterOptions(block);

  // Get Index based on language directory of current page.
  const pageLanguage = window.location.pathname.split('/')[1];
  let url = '/jmp-all.json';
  if (languageIndexExists(pageLanguage)) {
    url = `/jmp-${pageLanguage}.json`;
  }

  const { data: allPages } = await getJsonFromUrl(url);

  //Filter pages
  let pageSelection = allPages;
  if (optionsObject.filterType !== undefined && optionsObject.filterType.toLowerCase() === 'and') {
    pageSelection = andFilter(pageSelection, filterOptions);
  } else {
    pageSelection = orFilter(pageSelection, filterOptions);
  }

  //Order filtered pages by event date and time.
  pageSelection.sort((a, b) => (moment(createDateTimeFromString(a.eventDate, a.eventTime)).isBefore(moment(createDateTimeFromString(b.eventDate, b.eventTime))) ? -1 : 1));

  //Cut results down to fit within specified limit.
  const limitObjects = optionsObject.limit;
  if (limitObjects !== undefined && pageSelection.length > limitObjects) {
    pageSelection = pageSelection.slice(0, limitObjects);
  }

  const wrapper = document.createElement('ul');
  const columns = optionsObject.columns !== undefined ? optionsObject.columns : 5;
  wrapper.classList = `listOfItems image-list list-tile col-size-${columns}`;


  pageSelection.forEach((item) => {
    const listItem = document.createElement('li');
    const cardLink = document.createElement('a');
    cardLink.href = item.path;
    cardLink.target = '_self';
    let htmlOutput = `
    <span class="tag-category">${item.resourceType}</span>
    <span class="title">${item.title}</span>
    <span class="subtitle">${item.eventDate} | ${item.eventTime}</span>`;
    cardLink.innerHTML = htmlOutput;

    listItem.append(cardLink);
    wrapper.append(listItem);
  });

  block.append(wrapper);
}
