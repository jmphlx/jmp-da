import {
  getJsonFromUrl,
  languageIndexExists,
  parseBlockOptions,
} from '../../scripts/aem.js';

/*
 * Check if an array includes all values of another array
 */
function arrayIncludesAllValues(filterValues, pageValues) {
  return pageValues.every((val) => filterValues.includes(val));
}

/*
 * Check if an array contains any of the values of another array.
 */
function arrayIncludesSomeValues(filterValues, pageValues) {
  return pageValues.some((val) => filterValues.includes(val));
}

/*
 * Apply all filters as an OR. If any condition is true, include the page in the results.
 */
function orFilter(pageSelection, filterObject) {
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
        flag = trimmedList.includes(pageValue);
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
function andFilter(pageSelection, filterObject) {
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
          if (!trimmedList.includes(pageValue)) {
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
    const optionName = block.firstElementChild?.children.item(0).textContent.toLowerCase();
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

  let pageSelection = allPages;
  if (optionsObject.filterType !== undefined && optionsObject.filterType.toLowerCase() === 'and') {
    pageSelection = andFilter(pageSelection, filterOptions);
  } else {
    pageSelection = orFilter(pageSelection, filterOptions);
  }

  const wrapper = document.createElement('ul');
  wrapper.classList = 'listOfItems image-list list-tile';

  const limitObjects = optionsObject.limit;
  if (limitObjects !== undefined && pageSelection.length > limitObjects) {
    pageSelection = pageSelection.slice(0, limitObjects);
  }

  pageSelection.forEach((item) => {
    const listItem = document.createElement('li');
    const cardLink = document.createElement('a');
    cardLink.href = item.path;
    cardLink.target = '_self';
    cardLink.innerHTML = `
    <span class="navigation-title">${item.resourceType}</span>
    <span class="title">${item.title}</span>
    <span class="cmp-image image"><img src="${item.image}"/></span>
    <span class="abstract">${item.description}</span>
  `;
    listItem.append(cardLink);
    wrapper.append(listItem);
  });

  block.append(wrapper);
}
