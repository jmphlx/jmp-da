import {
  getLanguage,
  getJsonFromUrl,
  isTagProperty,
  containsOperator,
  matchesOperator,
  startsWithOperator,
} from './jmp.js';

//const tagTranslationsBaseURL = 'https://www.jmp.com/services/tagsservlet';
const tagTranslationsBaseURL = 'https://edge-www-dev.jmp.com/services/tagsservlet';

async function getTagTranslations() {
  const pageLanguage = getLanguage();
  window.tagtranslations = window.tagtranslations || await getJsonFromUrl(`${tagTranslationsBaseURL}.${pageLanguage}`);
}

async function getEmptyResultsMessage(emptyResultString) {
  if (!emptyResultString) {
    return undefined;
  }

  if (typeof emptyResultString === 'object') {
    return emptyResultString.outerHTML;
  }

  if (emptyResultString.includes('.json')) {
    const pageLanguage = getLanguage();
    const data = await getJsonFromUrl(emptyResultString);
    const { data: translations } = data[pageLanguage];
    return `<span>${translations[0].emptyResultsMessage}</span>`;
  }
  // otherwise use the string as the empty results message. It won't translate.
  return `<span>${emptyResultString}</span>`;
}

function checkForTagProperties(displayProperties) {
  let tagFound = false;
  for (let i = 0; i < displayProperties.length; i++) {
    if (isTagProperty(displayProperties[i])) {
      tagFound = true;
      break;
    }
  }
  return tagFound;
}

function lowercaseObj(obj) {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    newObj[key.toLowerCase()] = obj[key];
  });
  return newObj;
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

export {
  buildSimplifiedFilter,
  checkForTagProperties,
  getEmptyResultsMessage,
  getTagTranslations,
  lowercaseObj,
  pageMatches,
};
