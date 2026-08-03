import { JSDOM } from "jsdom";

// Create a virtual window and extract DOMParser
const { window } = new JSDOM("");
const parser = new window.DOMParser();

const languagesAPAC = ['ko', 'ja', 'zh-hans', 'zh-hant'];
const languagesAMER = ['en', 'es', 'fr', 'de', 'it'];
const baseURL = 'https://main--jmp-da--jmphlx.aem.live';

function getRegionalLanguageIndexes(includeFullURL, regionalIndexes) {
  const indexPaths = [];
  regionalIndexes.forEach((currLang) => {
    if (includeFullURL) {
      indexPaths.push(`${baseURL}/${currLang}/query-index.json`);
    } else {
      indexPaths.push(`/${currLang}/query-index.json`);
    }
  });
  return indexPaths;
}

/**
 * Check if a page has an offDateTime AND if the offDateTime has passed.
 * Don't need to check if the page is published because we are using query-index.json
 * Don't need to check query index for "missing" robots property because if it is in
 * the index, then it doesn't have it. 
 * Don't need to include redirectTarget in check, because if it's in the index, then it needs updating anyways.
 * 
 * @param {*} route 
 * @returns list of filtered pages
 */
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
 * @returns array of pages with events on or before the current date time and need additional processing
 */
async function getPastEventsPages(languageIndexes) {
  let pagesToProcess = [];
  for(let i = 0; i < languageIndexes.length; i++) {
    const index = languageIndexes[i];
    const foundPages = await getFilteredJSON(index);
    pagesToProcess = pagesToProcess.concat(foundPages);
  }
  console.log(pagesToProcess);
  return pagesToProcess;
}

async function updatePastEventPage(authToken, page) {
  //Get source content
  const url = `https://admin.da.live/source/jmphlx/jmp-da${page}.html`;
  console.log(url);
  try {
    const response = await fetch(url, {
      method: 'GET', 
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log(response);
    if (!response.ok) return null;
    const text = await response.text();
    console.log(`Response text length: ${text.length}`);
    console.log(`First 500 chars: ${text.substring(0, 500)}`);
    const dom = parser.parseFromString(text, 'text/html');
    const metadataBlock = dom.querySelector('div.metadata');
    console.log(metadataBlock);
    console.log(metadataBlock.textContent);
    const sectionMetadata = dom.querySelectorAll('div.section-metadata');
    console.log(sectionMetadata);
  } catch (error) {
    console.log('could not get source content');
    console.log(error);
  }

  //Then look for redirectTarget

  //Then look for robots

  //Then saveToDa
}

//TODO change this to publish request and add content update
async function sendDeleteRequest(authToken, page, deindex) {
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
    if (error instanceof SyntaxError) {
      return "still worked as expected";
    }
  }
  return null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildEmailSubject(successPages, failedPages, region) {
  let subjectLine = '';
  const failedWorkflow = failedPages.length > 0;
  const successfulUnpublishing = successPages.length > 0;
  if (failedWorkflow) {
    subjectLine = `${region} EVENTS WORKFLOW ERROR: Failed to Update Past Event Pages`;
  } else if (successfulUnpublishing) {
    subjectLine = `${region} events workflow: Successfully Updated Past Events`;
  } else {
    subjectLine = `No past events to update for ${region}`;
  }
  return subjectLine;
}

function buildEmailBody(successPages, failedPages, region) {
  const failedWorkflow = failedPages.length > 0;
  let emailHeader = `<h2>${region} Results of Post Event Processing Workflow</h2>`;
  let emailBody = '';
  if (failedWorkflow) {
    emailBody += '<div>';
    emailBody += '<div style="color:red;">These pages were unable to be updated: </div>';
    emailBody += '<ul>';
    failedPages.forEach((page) => {
      emailBody += `<li><a href="https://da.live/edit#/jmphlx/jmp-da${page}">${page}</a></li>`;
    });
    emailBody += '</ul></div>';

    if (successPages.length > 0) {
      emailBody += '<div>';
      emailBody += '<div style="color:green;">These pages were successfully updated: </div>';
      emailBody += '<ul>';
      successPages.forEach((page) => {
        emailBody += `<li><a href="https://da.live/edit#/jmphlx/jmp-da${page}">${page}</a></li>`;
      });
      emailBody += '</ul></div>';
    }
  } else if (successPages.length > 0) {
    emailBody += '<div>';
    emailBody += '<div style="color:green;">These pages were successfully updated: </div>';
    emailBody += '<ul>';
    successPages.forEach((page) => {
      emailBody += `<li><a href="https://da.live/edit#/jmphlx/jmp-da${page}">${page}</a></li>`;
    });
    emailBody += '</ul></div>';
  } else {
    emailBody += '<div>No pages to unpublish at this time for the given region.</div>';
  }
  return `<div>${emailHeader}${emailBody}</div>`;
}

export default async function processPastEvents(authToken, region) {
  console.log(authToken);
  let languageIndexes;

  if (region === "APAC") {
    languageIndexes = getRegionalLanguageIndexes(true, languagesAPAC);
  } else {
    languageIndexes = getRegionalLanguageIndexes(true, languagesAMER);
  }

  let pagesToProcess = await getPastEventsPages(languageIndexes);
  let successPages = [];
  let failedPages = [];

  for(let i=0; i < pagesToProcess.length; i++) {
    //After every 5 requests, pause for 2 seconds, to avoid going over the rate limit.
    //Rate is 10 requests per second. Each page needs 2 requests.
    const page = pagesToProcess[i];
    console.log(page);
    await updatePastEventPage(authToken, page.path);
    // const publishResponse = 
    // const deindexResponse = await sendDeleteRequest(authToken, page.path, true); // Deindex.
    // const unpublishResponse = await sendDeleteRequest(authToken, page.path, false); // Unpublish.
    // if (deindexResponse === null || unpublishResponse === null) {
    //   failedPages.push(page.path);
    // } else {
    //   successPages.push(page.path);
    // }
    console.log(`Handled : ${page.path}`);
    if (i % 5 === 0) {
      sleep(2000);
    }
  }

  const response = {};
  response.numFailed = failedPages.length;
  response.numSuccess = successPages.length;
  response.subject = buildEmailSubject(successPages, failedPages, region);
  response.body = buildEmailBody(successPages, failedPages, region);
  if (failedPages.length > 0) {
    response.sendEmail = 'true';
  } else {
    response.sendEmail = 'false';
  }
  return response;
}