import {
  getAllLanguageIndexes,
  getJsonFromUrl,
} from '../jmp.js';

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