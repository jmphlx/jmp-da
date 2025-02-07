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

function buildEmailBody(successPages, failedPages) {
  const failedWorkflow = failedPages.length > 0;
  let emailHeader = '<h2>Results of Unpublish Page Workflow</h2>';
  let emailBody;
  if (failedWorkflow) {
    emailBody += '<div>';
    emailBody += '<div style="color:red;">These pages were not unpublished: </div>';
    emailBody += '<ul>';
    failedPages.forEach((page) => {
      emailBody += `<li><a href="https://da.live/edit#/jmphlx/jmp-da${page.path}">${page.path}</a></li>`;
    });
    emailBody += '</ul></div';

    if (successPages.length > 0) {
      emailBody += '<div>';
      emailBody += '<div style="color:green;">These pages were successfully unpublished: </div>';
      emailBody += '<ul>';
      successPages.forEach((page) => {
        emailBody += `<li><a href="https://da.live/edit#/jmphlx/jmp-da${page.path}">${page.path}</a></li>`;
      });
      emailBody += '</ul></div';
    }
  } else {
    emailBody += '<div>';
    emailBody += '<div style="color:green;">These pages were successfully unpublished: </div>';
    emailBody += '<ul>';
    successPages.forEach((page) => {
      emailBody += `<li><a href="https://da.live/edit#/jmphlx/jmp-da${page.path}">${page.path}</a></li>`;
    });
    emailBody += '</ul></div';
  }
  return `<div>${emailHeader}${emailBody}</div`;
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

  const response = {};
  response.numFailed = failedPages.length;
  response.numSuccess = successPages.length;
  response.subject = failedPages.length > 0 ? 'ERROR: Event Pages Failed to Unpublish' : 'Successfully Unpublished Past Events';
  response.body = buildEmailBody(successPages, failedPages);
  return response;
}