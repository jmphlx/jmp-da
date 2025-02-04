const languageIndexes = [
  'en', 'es', 'fr', 'de', 'it', 'ko', 'ja', 'zh-hans', 'zh-hant',
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

async function getFilteredJSON(route) {
  try {
    const response = await fetch(route);
    if (!response.ok) return null;
    const json = await response.json();
    const filteredPages = json.data.filter((item) => {
      if (item.offDateTime) {
        return new Date(item.offDateTime) <= new Date();
      }
      return false;
    });
    return filteredPages;
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
async function getPastEventsPages(languageIndexes) {
  let pagesToUnpublish = [];
  for(let i = 0; i < languageIndexes.length; i++) {
    const index = languageIndexes[i];
    const foundPages = await getFilteredJSON(index);
    pagesToUnpublish = pagesToUnpublish.concat(foundPages);
  }
  console.log(pagesToUnpublish);
  return pagesToUnpublish;
}

async function sendDeleteRequest(authToken, page) {
  //'https://admin.hlx.page/index/jmphlx/jmp-da/main/en/online-statistics-course/request-access-to-teaching-materials/download-teaching-materials' 

  console.log(page);
  const url = `https://admin.hlx.page/index/jmphlx/jmp-da/main${page}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE', 
      headers: {
        'Authorization': `Bearer ${authToken}` 
      }
    });
    console.log(response);
    if (!response.ok) return null;
    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('sendDeleteRequest:', { error });
  }
  return null;
}

export default async function printStuff(printVar) {
  console.log('stuff');
  console.log(printVar);
  const languageIndexes = getAllLanguageIndexes(true);

  let pagesToUnpublish = await getPastEventsPages(languageIndexes);
  console.log('test delete from index');
  await sendDeleteRequest(printVar, pagesToUnpublish[0].path);
  console.log(`deleted page: ${pagesToUnpublish[0]}`);

  // pagesToUnpublish.forEach((page) => {
  //   sendDeleteRequest(printVar, page.path);
  //   console.log(`deleted page: ${page.path}`);
  // });
}