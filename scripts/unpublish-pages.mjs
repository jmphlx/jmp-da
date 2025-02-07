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

async function sendDeleteRequest(authToken, page, deindex) {
  //'https://admin.hlx.page/index/jmphlx/jmp-da/main/en/online-statistics-course/request-access-to-teaching-materials/download-teaching-materials' 

  console.log(authToken);
  console.log(page);
  let url;
  if (deindex) {
    url = `https://admin.hlx.page/index/jmphlx/jmp-da/main${page}`;
  } else {
    url = `https://admin.hlx.page/live/jmphlx/jmp-da/main${page}`;
  }

  try {
    const response = await fetch(url, {
      method: 'DELETE', 
      headers: {
        'Authorization': `token ${authToken}` ,
        'Accept': '*/*'
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function unpublishPastEvents(authToken) {
  console.log(authToken);
  const languageIndexes = getAllLanguageIndexes(true);

  let pagesToUnpublish = await getPastEventsPages(languageIndexes);
  let successPages = [];
  let failedPages = [];

  for(let i=0; i < pagesToUnpublish.length; i++) {
    //After every 5 requests, pause for 2 seconds, to avoid going over the rate limit.
    //Rate is 10 requests per second. Each page needs 2 requests.
    const page = pagesToUnpublish[i];
    const deindexResponse = await sendDeleteRequest(authToken, page.path, true); // Deindex.
    const unpublishResponse = await sendDeleteRequest(authToken, page.path, false); // Unpublish.
    if (deindexResponse === null || unpublishResponse === null) {
      failedPages.push(page.path);
    } else {
      successPages.push(page.path);
    }
    console.log(`Unpublished : ${page.path}`);
    if (i % 5 === 0) {
      sleep(2000);
    }
  }

  const textResponse = `${failedPages.length}.Successfully unpublished ${successPages} `
    + `Failed to unpublish  ${failedPages}`;
  return textResponse;
}