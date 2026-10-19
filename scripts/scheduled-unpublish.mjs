/**
 * Given a list of pages, filter down to event pages where the date has passed
 * the current date time.
 * @returns array of pages with events on or before the current date time.
 */
async function getPagesToUnpublish(authToken) {
  let pagesToUnpublish = [];
  const url = 'https://admin.da.live/source/jmphlx/jmp-da/unpublish-schedule.json';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}` ,
        'Accept': '*/*'
      }
    });
    console.log(response);
    if (!response.ok) return null;
    const json = await response.json();
    console.log(json);
    pagesToUnpublish = json.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('here:', { error });
  }
  console.log(pagesToUnpublish);
  const pageList = [];
  for (let i = 0; i < pagesToUnpublish.length; i++) {
    const page = pagesToUnpublish[i];
    console.log(`Page: ${page.path}, Unpublish Date: ${page.date}`);
    if (new Date(page.date) <= new Date()) {
      console.log(`Page ${page.path} is ready to be unpublished.`);
      pageList.push(page.path);
    }
  }
  console.log(pageList);
  return pageList;
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
        'Authorization': `Bearer ${authToken}` ,
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

function buildEmailSubject(successPages, failedPages) {
  let subjectLine = '';
  const failedWorkflow = failedPages.length > 0;
  const successfulUnpublishing = successPages.length > 0;
  if (failedWorkflow) {
    subjectLine = `UNPUBLISH WORKFLOW ERROR: Failed to Unpublish Pages`;
  } else if (successfulUnpublishing) {
    subjectLine = `Unpublish workflow: Successfully Unpublished Past Events`;
  } else {
    subjectLine = `No events to unpublish`;
  }
  return subjectLine;
}

function buildEmailBody(successPages, failedPages) {
  const failedWorkflow = failedPages.length > 0;
  let emailHeader = `<h2>Results of Unpublish Page Workflow</h2>`;
  let emailBody = '';
  if (failedWorkflow) {
    emailBody += '<div>';
    emailBody += '<div style="color:red;">These pages were not unpublished: </div>';
    emailBody += '<ul>';
    failedPages.forEach((page) => {
      emailBody += `<li><a href="https://da.live/edit#/jmphlx/jmp-da${page}">${page}</a></li>`;
    });
    emailBody += '</ul></div>';

    if (successPages.length > 0) {
      emailBody += '<div>';
      emailBody += '<div style="color:green;">These pages were successfully unpublished: </div>';
      emailBody += '<ul>';
      successPages.forEach((page) => {
        emailBody += `<li><a href="https://da.live/edit#/jmphlx/jmp-da${page}">${page}</a></li>`;
      });
      emailBody += '</ul></div>';
    }
  } else if (successPages.length > 0) {
    emailBody += '<div>';
    emailBody += '<div style="color:green;">These pages were successfully unpublished: </div>';
    emailBody += '<ul>';
    successPages.forEach((page) => {
      emailBody += `<li><a href="https://da.live/edit#/jmphlx/jmp-da${page}">${page}</a></li>`;
    });
    emailBody += '</ul></div>';
  } else {
    emailBody += '<div>No pages to unpublish at this time.</div>';
  }
  return `<div>${emailHeader}${emailBody}</div>`;
}


async function getAccessToken(clientID, clientSecret) {
  //Get Auth Token
  try {
    const response = await fetch('https://ims-na1.adobelogin.com/ims/token/v3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientID,
        client_secret: clientSecret,
        scope: 'openid,AdobeID,additional_info.projectedProductContext,aem.frontend.all,read_organizations'
      }).toString()
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json.access_token;
  } catch(error) {
    console.log('could not get access token', error);
  }
  return null;
}

export default async function unpublishScheduledPages(clientID, clientSecret) {
  const authToken = await getAccessToken(clientID, clientSecret);
  let pagesToUnpublish = await getPagesToUnpublish(authToken);
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
  response.subject = buildEmailSubject(successPages, failedPages);
  response.body = buildEmailBody(successPages, failedPages);
  if (failedPages.length > 0) {
    response.sendEmail = 'true';
  } else {
    response.sendEmail = 'false';
  }
  return response;
}