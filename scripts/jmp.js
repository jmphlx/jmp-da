/**
 * Returns if a given 2 or 4 digit language is supported
 * by JMP. Support means that it should have it's own
 * directory, index, and nav.
 * @param {string} language
 * @returns {Boolean} true if the index should exist.
 */
function isLanguageSupported(language) {
  const languageIndexes = [
    'en', 'es', 'fr', 'zh', 'de', 'it', 'ko', 'ja', 'zh-hans', 'zh-hant',
  ];
  return languageIndexes.includes(language);
}
/* Set the html lang property based on the page path. Default to 'en'. */
const pageLanguage = window.location.pathname.split('/')[1];
const isLangSupported = isLanguageSupported(pageLanguage);
const lang = isLangSupported ? pageLanguage : 'en';
document.documentElement.lang = lang;

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

/**
 * Returns a list of properties listed in the block
 * @param {string} route get the Json data from the route
 * @returns {Object} the json data object
*/
async function getJsonFromUrl(route) {
  try {
    const response = await window.fetch(route);
    if (!response.ok) return null;
    const json = await response.json();
    return json;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getJsonFromUrl:', { error });
  }
  return null;
}

/**
 * Create an array of Json Object representing all world timezones.
 * This includes the offset, the name of the timezone, abbreviation, etc.
 * This is pulled from moment.js.
 * @returns array of json objects of global timezones
 */
async function getTimezones() {
  const timezones = await getJsonFromUrl('/scripts/moment/timezones.json');
  return timezones;
}

/**
 * Given an abbreviation of a timezone i.e. PST, return
 * the json object representing that timezone. Primarily used to get
 * the offset.
 * @returns single json object of the corresponding timezone
 */
function getTimezoneObjectFromAbbr(timezones, tzabbr) {
  // eslint-disable-next-line arrow-body-style
  const timezone = timezones.filter((item) => {
    return item.abbr === tzabbr;
  });
  return timezone[0];
}

/**
 * Returns the path of the appropriate nav based on page language.
 * Default to 'en' if language isn't found.
 * @returns {string} path to language nav
 */
function getLanguageNav() {
  return isLanguageSupported ? `/${lang}/nav` : '/en/nav';
}

/**
 * Returns the path of the appropriate footer based on page language.
 * Default to 'en' if language isn't found.
 * @returns {string} path to language footer
 */
function getLanguageFooter() {
  return isLanguageSupported ? `/${lang}/footer` : '/en/footer';
}

/**
 * Returns the path of the appropriate index based on page language.
 * Default to 'en' if language isn't found.
 * @returns {string} path to language index
 */
function getLanguageIndex() {
  return isLanguageSupported ? `/jmp-${lang}.json` : '/jmp-all.json';
}

/*
 * Apply all filters as an AND. All conditions must be true in order
 * to include the page in the results.
 */
function pageAndFilter(pageSelection, filterObject) {
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

/*
 * Apply all filters as an OR. If any condition is true, include the page in the results.
 */
function pageOrFilter(pageSelection, filterObject) {
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

/**
 * Given a block and an options row, create a JSON object representing
 * the options to be used in the block.
 * @param {Object} block - html of the table from document representing block
 * @param {string} rowName - name of the options row, by default it is options
 * @returns a JSON object representing the options/properties specified by
 * the author for the block
 */
function parseBlockOptions(block, rowName) {
  const optionsObject = {};
  const row = rowName === undefined ? 'options' : rowName;

  const optionName = block.firstElementChild?.children.item(0).textContent;
  if (optionName.toLowerCase() === row) {
    const optionVal = block.firstElementChild?.children.item(1).textContent;
    const tempOptionsArray = optionVal.length > 1 ? optionVal.split(',') : {};

    tempOptionsArray.forEach((item) => {
      if (item.includes('=')) {
        const optionsString = item.split('=', 2);
        optionsObject[optionsString[0]] = optionsString[1];
      } else {
        optionsObject[item] = true;
      }
    });
  }
  if (Object.keys(optionsObject).length > 0) {
    block.firstElementChild.remove();
  }
  return optionsObject;
}

/**
 * Given a block and the name of a property row, create a JSON object representing
 * the options to be used in the block if it is found.
 * Does not require this to be the top row in the table.
 * Assumes that the row is a list of properties to be
 * combined into a single object.
 * @param {Object} block - html of the table from document representing block
 * @param {string} rowName - name of the properties row
 * @returns a JSON object representing the options/properties specified by
 * the author for the block
 */
function getBlockPropertiesList(block, rowName) {
  const rowObject = {};
  const foundItem = Array.from(block.querySelectorAll('div'))
    .find((el) => el.textContent.toLowerCase() === rowName.toLowerCase());

  const parent = foundItem !== undefined ? foundItem.parentElement : undefined;
  if (parent !== undefined) {
    const optionVal = parent.children.item(1).textContent;
    const tempOptionsArray = optionVal.length > 1 ? optionVal.split(',') : {};

    tempOptionsArray.forEach((item) => {
      if (item.includes('=')) {
        const optionsString = item.split('=', 2);
        rowObject[optionsString[0]] = optionsString[1];
      } else {
        rowObject[item] = true;
      }
    });
  }
  if (Object.keys(rowObject).length > 0) {
    parent.remove();
  }
  return rowObject;
}

/**
 * Given a block and the name of a property row, return the single value.
 * Does not require this to be the top row in the table.
 * Assumes that the row is a single value.
 * @param {Object} block - html of the table from document representing block
 * @param {string} rowName - name of the properties row
 * @returns string value of the property if found in the block, undefined if not found.
 */
function getBlockProperty(block, rowName) {
  let rowValue;
  const foundItem = Array.from(block.querySelectorAll('div'))
    .find((el) => el.textContent.toLowerCase() === rowName.toLowerCase());

  const parent = foundItem !== undefined ? foundItem.parentElement : undefined;
  if (parent !== undefined) {
    rowValue = parent.children.item(1).textContent;
    if (rowValue.length > 0) {
      parent.remove();
    }
  }
  return rowValue;
}

/**
 * From the remaining rows in the block, create an object to represent the filters.
 * With this method, filter name becomes case insensitive by using the columns property
 * from the index.
 * @param {Object} block - html of the table from document representing block
 * @param {array} propertyNames - names of the properties as they appear in the index
 * @returns json object representing filters to apply to listgroup.
 */
function getListFilterOptions(block, propertyNames) {
  const lowerCaseProperties = propertyNames.map((str) => str.toLowerCase());
  const filterOptions = {};
  while (block.firstElementChild !== undefined && block.firstElementChild !== null) {
    let optionName = block.firstElementChild?.children.item(0).textContent;
    const correctIndex = lowerCaseProperties.indexOf(optionName.toLowerCase());
    optionName = correctIndex !== -1 ? propertyNames[correctIndex] : optionName;
    let optionValue = block.firstElementChild?.children.item(1).textContent.toLowerCase();
    if (optionValue.indexOf(',') > -1) {
      optionValue = optionValue.split(',').map((str) => str.trim().toLowerCase());
    }
    filterOptions[optionName] = optionValue;
    block.firstElementChild.remove();
  }
  return filterOptions;
}

/**
 * Given a folderPath, filter the pages down to those inside that folder
 * including nested pages.
 * @param {array} pageSelection array of pages that may match the filter
 * @param {string} folderPath string path of the folder we are narrowing results to.
 * @returns array of pages within the provided folder
 */
function pageFilterByFolder(pageSelection, folderPath) {
  const filteredData = pageSelection.filter((item) => item.path.startsWith(folderPath));
  return filteredData;
}

export {
  arrayIncludesAllValues,
  arrayIncludesSomeValues,
  getBlockPropertiesList,
  getBlockProperty,
  getJsonFromUrl,
  getLanguageIndex,
  getLanguageFooter,
  getLanguageNav,
  getListFilterOptions,
  getTimezoneObjectFromAbbr,
  getTimezones,
  isLanguageSupported,
  pageAndFilter,
  pageFilterByFolder,
  pageOrFilter,
  parseBlockOptions,
};
