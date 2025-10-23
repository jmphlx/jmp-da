import { getDefaultMetaImage } from './scripts.js';

const knownObjectProperties = ['options', 'filters'];
const knownObjectCaseSensitiveProperties = ['tabs'];

const tagMap = {
  industry: 'industry',
  product: 'product',
  capability: 'capability',
  eventType: 'event-type',
  eventSeries: 'event-series',
  resourceType: 'resource-type',
  resourceOptions: 'resource-options',
  blogTopics: 'blog-topic',
  academic: 'academic',
  course: 'academic:course',
  application: 'academic:application',
  userLevel: 'user-level',
  bookType: 'book-type',
  funnelStage: 'funnel-stage',
  partnerType: 'partner-type',
  country: 'country',
};

/**
 * Returns if a given 2 or 4 digit language is supported
 * by JMP. Support means that it should have it's own
 * directory, index, and nav.
 * @param {string} language
 * @returns {Boolean} true if the index should exist.
 */
function isLanguageSupported(language) {
  const languageIndexes = [
    'en', 'es', 'fr', 'de', 'it', 'ko', 'ja', 'zh-hans', 'zh-hant',
  ];
  return languageIndexes.includes(language);
}
/* Set the html lang property based on the page path. Default to 'en'. */
const pagePath = window.location.pathname;
const pageLanguage = pagePath.split('/')[1];
const isLangSupported = isLanguageSupported(pageLanguage);
const lang = isLangSupported ? pageLanguage : 'en';
document.documentElement.lang = lang;

/**
 * Returns the page language
 * @returns {string} page language
 */
function getLanguage() {
  return lang;
}

/*
 * Check if an array includes all values of another array
Are all of the values in Array B included in Array A?
Is B contained within A?
 */
function arrayIncludesAllValues(arrayA, arrayB) {
  return arrayB.every((val) => arrayA.includes(val));
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
 * This is to be used only for when testing with a
 * local AEM instance. Used for testing /services/*
 * @param {*} route
 * @returns json response
 */
async function getJsonFromLocalhostUrl(route) {
  try {
    const response = await window.fetch(route, {
      credentials: 'include',
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getJsonFromLocalhostUrl:', { error });
  }
  return null;
}

/**
 * Returns the path of the appropriate nav based on page language.
 * Default to 'en' if language isn't found.
 * @param {boolean} true if the SKP index is needed.
 * @returns {string} path to language nav
 */
function getLanguageNav(isSKP = null) {
  if (isSKP) {
    return isLanguageSupported ? `/${lang}/statistics-knowledge-portal/nav` : '/en/statistics-knowledge-portal/nav';
  }
  return isLanguageSupported ? `/${lang}/navigation/header` : '/en/navigation/header';
}

/**
 * Returns the path of the appropriate footer based on page language.
 * Default to 'en' if language isn't found.
 * @returns {string} path to language footer
 */
function getLanguageFooter(isSKP = null) {
  if (isSKP) {
    return isLanguageSupported ? `/${lang}/statistics-knowledge-portal/footer` : '/en/statistics-knowledge-portal/footer';
  }
  return isLanguageSupported ? `/${lang}/navigation/footer` : '/en/navigation/footer';
}

/**
 * Returns the path of the appropriate index based on page language.
 * Default to 'en' if language isn't found.
 * @returns {string} path to language index
 */
function getLanguageIndex(overwriteLanguage = null) {
  if (overwriteLanguage) {
    return isLanguageSupported(overwriteLanguage) ? `/jmp-${overwriteLanguage}.json` : '/jmp-en.json';
  }
  return isLanguageSupported ? `/jmp-${lang}.json` : '/jmp-en.json';
}

/**
 * Returns the path of the appropriate index for SKP based on page language.
 * Default to 'en' if language isn't found.
 * @returns {string} path to language index
 */
function getSKPLanguageIndex() {
  return isLanguageSupported ? `/skp-${lang}.json` : '/skp-en.json';
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
 * Given a list of event pages, filter out any whose eventDateTime
 * is before the current date at 11:59PM EST (23:59).
 * @param {array} pageSelection array of pages that may match the filter
 * @returns array of pages with events on or after the current date.
 */
function filterOutPastEvents(pageSelection) {
  const filteredData = pageSelection.filter((item) => {
    if (!item.offDateTime) {
      return true;
    }
    return new Date(item.offDateTime) >= new Date();
  });
  return filteredData;
}

/**
 * Given a list of pages, filter out any that have a nonempty Robots property.
 * @param {array} pageSelection array of pages that may match the filter
 * @returns array of pages that should be indexed and included in lists/search.
 */
function filterOutRobotsNoIndexPages(pageSelection) {
  const filteredData = pageSelection.filter((item) => {
    if (!item.robots) {
      return true;
    }
    return item.robots.length === 0;
  });
  return filteredData;
}

/**
 * Given a page path, determine if the curernt page exists in that language
 * @param {string} languagePage page to check in another language
 * @returns pagePath if the page exists in another language
 */
async function getLangMenuPageUrl(languagePage) {
  const languageDirectory = languagePage.split('/')[1];
  const currPage = pagePath.replace(/\/(.*?)(?:\/)/, '/');
  const languageCurrPage = `/${languageDirectory}${currPage}`;

  try {
    const response = await fetch(languageCurrPage);
    if (!response.ok || response.redirected === true) {
      return null;
    }
    return languageCurrPage;
  } catch (error) {
    return null;
  }
}

function convertStringToJSONObject(stringValue, caseSensitive = false) {
  const jsonObj = {};
  const stringList = stringValue.split(',');
  stringList.forEach((item) => {
    if (item.includes('=')) {
      const optionsString = item.split('=', 2);
      if (caseSensitive) {
        jsonObj[optionsString[0].trim()] = optionsString[1].trim();
      } else {
        jsonObj[optionsString[0].trim().toLowerCase()] = optionsString[1].trim().toLowerCase();
      }
    } else if (caseSensitive) {
      jsonObj[item.trim()] = true;
    } else {
      jsonObj[item.trim().toLowerCase()] = true;
    }
  });
  return jsonObj;
}

/**
 * Customized version of readBlockConfig from aem.js
 * Adds options for ordered and unordered lists and
 * preserves html elements if no match found.
 */
function getBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const col = cols[1];
        const name = cols[0].textContent;
        let value = '';
        if (col.querySelector('ul')) {
          const listItems = [...col.querySelectorAll('li')];
          value = listItems.map((item) => item.textContent);
        } else if (col.querySelector('ol')) {
          const listItems = [...col.querySelectorAll('li')];
          value = listItems.map((item) => item.textContent);
        } else if (knownObjectCaseSensitiveProperties.includes(name.toLowerCase())) {
          const stringValue = col.textContent;
          value = convertStringToJSONObject(stringValue, true);
        } else if (knownObjectProperties.includes(name.toLowerCase())) {
          const stringValue = col.textContent;
          value = convertStringToJSONObject(stringValue);
        } else if (col.querySelector('a')) {
          const as = [...col.querySelectorAll('a')];
          if (as.length === 1) {
            value = col;
          } else {
            value = as.map((a) => a.href);
          }
        } else if (col.querySelector('img')) {
          const imgs = [...col.querySelectorAll('img')];
          if (imgs.length === 1) {
            value = imgs[0].src;
          } else {
            value = imgs.map((img) => img.src);
          }
        } else if (col.querySelector('p')) {
          const ps = [...col.querySelectorAll('p')];
          if (ps.length === 1) {
            value = ps[0].textContent;
          } else {
            value = ps.map((p) => p.textContent);
          }
        } else value = row.children[1];
        config[name] = value;
      }
    }
  });
  return config;
}

function doStringContains(pageValue, filterValue) {
  let flag = true;

  try {
    // filterValue is an array
    if (filterValue.indexOf(',') > 0) {
      const filterValueArray = filterValue.split(',');
      const trimmedFilter = filterValueArray.map((str) => str.trim().toLowerCase());
      // filterValue is an array and pageValue is an array
      // in a comma-delimited filter value, the conditions should be OR.
      if (pageValue !== undefined && pageValue.indexOf(',') > -1) {
        const list = pageValue.split(',');
        const trimmedList = list.map((str) => str.trim().toLowerCase());
        if (!arrayIncludesSomeValues(trimmedList, trimmedFilter)) {
          throw new Error('condition not met');
        }
      } else if (!trimmedFilter.includes(pageValue.toLowerCase())) {
        throw new Error('condition not met');
      }
    // filterValue is a single string but pageValue is array
    } else if (pageValue !== undefined && pageValue.indexOf(',') > -1) {
      const list = pageValue.split(',');
      const trimmedList = list.map((str) => str.trim().toLowerCase());
      if (!trimmedList.includes(filterValue)) {
        throw new Error('condition not met');
      }
    // both pageValue and filterValue are strings so test ===
    } else if (filterValue !== pageValue?.toLowerCase()) {
      throw new Error('condition not met');
    }
  } catch (e) {
    flag = false;
  }
  return flag;
}

function containsOperator(pageObj, condObj) {
  let flag = true;
  const propertyName = condObj.property.toLowerCase();
  const filterValue = condObj.value.toLowerCase();
  const pageValue = pageObj[propertyName];

  if (typeof pageValue === 'object') {
    // Still need to check if filterValue
    // is a string that should be an array.
    if (filterValue.indexOf(',') > 0) {
      const filterValueArray = filterValue.split(',');
      const trimmedFilter = filterValueArray.map((str) => str.trim().toLowerCase());
      flag = arrayIncludesAllValues(pageValue, trimmedFilter);
    } else {
      flag = pageValue.includes(filterValue);
    }
  } else {
    flag = doStringContains(pageValue, filterValue);
  }
  return flag;
}

function matchesOperator(pageObj, condObj) {
  return pageObj[condObj.property].match(condObj.value);
}

function startsWithOperator(pageObj, condObj) {
  return pageObj[condObj.property].startsWith(condObj.value);
}

function sortPageList(pageList, sortBy, sortOrder) {
  const sortedList = pageList;
  switch (sortBy) {
    case 'title':
      sortedList.sort((a, b) => {
        if (sortOrder !== undefined && sortOrder === 'descending') {
          return (a.title < b.title ? 1 : -1);
        }
        return (a.title < b.title ? -1 : 1);
      });
      break;
    case 'releaseDate':
      sortedList.sort((a, b) => {
        if (sortOrder !== undefined && sortOrder === 'descending') {
          return ((new Date(a.releaseDate) - new Date(b.releaseDate)) < 0
            ? 1 : -1);
        }
        return ((new Date(a.releaseDate) - new Date(b.releaseDate)) < 0
          ? -1 : 1);
      });
      break;
    case '':
      sortedList.sort((a, b) => {
        if (sortOrder !== undefined && sortOrder === 'descending') {
          return ((new Date(a.releaseDate) - new Date(b.releaseDate)) < 0
            ? 1 : -1);
        }
        return ((new Date(a.releaseDate) - new Date(b.releaseDate)) < 0
          ? -1 : 1);
      });
      break;
    default:
      sortedList.sort((a, b) => {
        if (sortOrder !== undefined && sortOrder === 'descending') {
          return (a[sortBy]).localeCompare(b[sortBy], undefined, { numeric: true }) * -1;
        }
        return (a[sortBy]).localeCompare(b[sortBy], undefined, { numeric: true });
      });
  }
  return sortedList;
}

function debounce(func, delay) {
  let timeoutId;
  return function debouncedFunction(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function updateBodyClassOnWindowResize(isDesktop, isSKP = false) {
  if (isSKP) {
    if (isDesktop) {
      document.body.classList.remove('skp-header-mobile');
      document.body.classList.add('skp-header');
    } else {
      document.body.classList.remove('skp-header');
      document.body.classList.add('skp-header-mobile');
    }
  } else if (isDesktop) {
    document.body.classList.remove('basic-mobile');
    document.body.classList.add('basic');
  } else {
    document.body.classList.remove('basic');
    document.body.classList.add('basic-mobile');
  }
}

/**
 * Utility for including an image in listgroup card.
 * First check for displayImage.
 * If no displayImage, look for og:image or image property.
 * If no og:image, then use the default meta image..
 * @param {*} propertyName
 * @param {*} item
 * @returns html string output of image card
 */
function writeImagePropertyInList(propertyName, item) {
  let imageSrc;
  if (item.displayImage) {
    imageSrc = item.displayImage;
  } else if (item.image) {
    imageSrc = item.image;
  } else {
    imageSrc = getDefaultMetaImage();
  }
  return `<span class="${propertyName}"><img src="${imageSrc}"/></span>`;
}

function isTagProperty(propertyName) {
  return Object.keys(tagMap).includes(propertyName);
}

function convertCamelToKebabCase(str) {
  return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
}

export {
  arrayIncludesAllValues,
  arrayIncludesSomeValues,
  containsOperator,
  convertCamelToKebabCase,
  debounce,
  matchesOperator,
  startsWithOperator,
  filterOutPastEvents,
  filterOutRobotsNoIndexPages,
  getBlockConfig,
  getBlockPropertiesList,
  getJsonFromLocalhostUrl,
  getJsonFromUrl,
  getLangMenuPageUrl,
  getLanguage,
  getLanguageIndex,
  getLanguageFooter,
  getLanguageNav,
  getSKPLanguageIndex,
  isLanguageSupported,
  isTagProperty,
  parseBlockOptions,
  sortPageList,
  updateBodyClassOnWindowResize,
  writeImagePropertyInList,
};
