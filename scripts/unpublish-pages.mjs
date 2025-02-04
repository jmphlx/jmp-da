const languageIndexes = [
  'en', 'es', 'fr', 'zh', 'de', 'it', 'ko', 'ja', 'zh-hans', 'zh-hant',
];
const baseURL = 'https://main--jmp-da--jmphlx.hlx.live';

function getAllLanguageIndexes(includeFullURL) {
  const indexPaths = [];
  languageIndexes.forEach((currLang) => {
    if (includeFullURL) {
      indexPaths.push(`${baseURL}/jmp-${currLang}.json`);
    } else {
      indexPaths.push(`/jmp-${currLang}.json`);
    }
  });
  return indexPaths;
}

/**
 * Returns a list of properties listed in the block
 * @param {string} route get the Json data from the route
 * @returns {Object} the json data object
*/
async function getJsonFromUrl(route) {
  try {
    const response = await fetch(route);
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
 * Given a list of pages, filter down to event pages where the date has passed
 * the current date time.
 * @param {array} pageSelection array of pages that may match the filter
 * @returns array of pages with events on or before the current date time.
 */
async function getPastEventsPages(languageIndexUrl) {
  console.log(`index ${languageIndexUrl}`);
  const { data: allPages } = await getJsonFromUrl(languageIndexUrl);
  const filteredPages = allPages.filter((item) => {
    if (item.offDateTime) {
      return new Date(item.offDateTime) <= new Date();
    }
    return false;
  });
  console.log(filteredPages);
  return filteredPages;
}

export default async function printStuff(printVar) {
  console.log('stuff');
  console.log(printVar);
  //const pagesToUnpublish = [];
  const languageIndexes = getAllLanguageIndexes(true);
  console.log(languageIndexes);

  const foundPages = getPastEventsPages('https://main--jmp-da--jmphlx.hlx.live/jmp-en.json');
  console.log(foundPages);


  // languageIndexes.forEach((index) => {
  //   const foundPages = getPastEventsPages(index);
  // })
  
}