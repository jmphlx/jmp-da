// eslint-disable-next-line import/no-unresolved
import { setImsDetails } from 'https://da.live/nx/utils/daFetch.js';
import { crawl } from 'https://da.live/nx/public/utils/tree.js';
import { createTag } from '../../scripts/helper.js';


const applicationTagMap = [
  ['business and economics', 'business-and-economics'],
  ['life sciences', 'life-sciences'],
  ['physical sciences', 'physical-sciences'],
  ['social sciences', 'social-sciences']
];

const courseTagMap = [
  ['analytics & data science', 'analytics-and-data-science'],
  ['analytics and data science', 'analytics-and-data-science'],
  ['applied statistical methods', 'applied-statistical-methods'],
  ['biostatistics & life sciences', 'biostatistics-and-life-sciences'],
  ['biostatistics and life sciences', 'biostatistics-and-life-sciences'],
  ['business & economics', 'business-and-economics'],
  ['business and economics', 'business-and-economics'],
  ['design of experiments', 'design-of-experiments'],
  ['engineering statistics', 'engineering'],
  ['general introductory', 'general-introductory'],
  ['introductory engineering statistics', 'general-introductory'],
  ['multivariate statistics', 'multivariate-statistics'],
  ['regression & linear models', 'regression-and-linear-models'],
  ['regression and linear models', 'regression-and-linear-models'],
  ['reliability & survival', 'reliability-and-survival'],
  ['research methods', 'research-methods'],
  ['social & behavioral sciences', 'social-and-behavioral-sciences'],
  ['social and behavioral sciences', 'social-and-behavioral-sciences'],
  ['statistical quality control', 'statistical-quality-control'],
  ['time series & forecasting', 'time-series-and-forecasting'],
  ['time series and forecasting', 'time-series-and-forecasting']
];

const blogTopicsTagMap = [
  ['consumer products', 'consumer-products'],
  ['data prep', 'data-prep'],
  ['design of experiments', 'design-of-experiments'],
  ['health and life sciences', 'health-and-life-sciences'],
  ['predictive modeling', 'predictive-modeling']
];

const bookTypeTagMap = [
  ['jmp book', 'jmp-book'],
  ['reference book', 'reference-book']
];

const capabilityTagMap = [
  ['advanced statistical modeling', 'advanced-statistical-modeling'],
  ['automation and scripting', 'automation-and-scripting'],
  ['basic data analysis and modeling', 'basic-data-analysis-and-modeling'],
  ['consumer and market research', 'consumer-and-market-research'],
  ['content organization', 'content-organization'],
  ['data access', 'data-access'],
  ['data blending and cleanup', 'data-blending-and-cleanup'],
  ['data exploration and visualization', 'data-exploration-and-visualization'],
  ['data exploration', 'data-exploration-and-visualization'],
  ['design of experiments', 'design-of-experiments'],
  ['mass customization', 'mass-customization'],
  ['predictive modeling and machine learning', 'predictive-modeling-and-machine-learning'],
  ['quality and process engineering', 'quality-and-process-engineering'],
  ['reliability analysis', 'reliability-analysis'],
  ['sharing and communicating results', 'sharing-and-communicating-results']
];

const countryTagMap = [
  ['south africa', 'south-africa'],
  ['united kingdom', 'united-kingdom'],
  ['united states', 'united-states']
];

const eventSeriesTagMap = [
  ['data insight', 'data-insight'],
  ['statistically speaking', 'statistically-speaking'],
  ['techincally speaking', 'techincally-speaking'],
  ['time to innovate', 'time-to-innovate']
];

const eventTypeTagMap = [
  ['in-person', 'in-person-event'],
  ['live webinar', 'live-webinar']
];

const industryTagMap = [
  ['biotechnology', 'biotech'],
  ['clean energy and conservation', 'clean-energy-and-conservation'],
  ['clean energy', 'clean-energy-and-conservation'],
  ['consumer products', 'consumer-products'],
  ['high-tech manufacturing', 'high-tech-manufacturing'],
  ['industrial manufacturing', 'industrial-manufacturing'],
  ['medical devices', 'medical-devices'],
  ['medical statistics', 'medical-statistics'],
];

const productTagMap = [
  ['jmp pro', 'jmp-pro'],
  ['jmp live', 'jmp-live'],
  ['jmp clinical', 'jmp-clinical']
];

const resourceTypeTagMap = [
  ['book chapter', 'book-chapter'],
  ['case study', 'case-study'],
  ['customer story', 'customer-story'],
  ['on-demand webinar', 'on-demand-webinar'],
  ['white paper', 'white-paper'],
];


function replaceHtml(text) {
  let inner = text;
  const fromOrigin = 'https://main--jmp-da--jmphlx.aem.live';
  inner = text
    .replaceAll('./media', `${fromOrigin}/media`)
    .replaceAll('href="/', `href="${fromOrigin}/`);

  return `
    <body>
      <header></header>
      <main>${inner}</main>
      <footer></footer>
    </body>
  `;
}


async function saveToDa(text, pathname, token) {
  const body = replaceHtml(text);

  const blob = new Blob([body], { type: 'text/html' });
  const formData = new FormData();
  formData.append('data', blob);
  const opts = {
    method: 'PUT',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const putURL = `https://admin.da.live/source'${pathname}`;
  try {
    const daResp = await fetch(`${putURL}`, opts);
    return { putURL, daStatus: daResp.status, daResp, ok: daResp.ok };
  } catch (e) {
    console.log(`Couldn't save ${pathname} - ${e}`);
    return null;
  }
}

function replaceTagText(line, replacements) {
  for (const [search, replace] of replacements) {
    line = line.replaceAll(search, replace);
  }
  return line;
}

function convertToTagList(row, tagMap, prefix) {
  let updatedRowValue;
  let rowValue;

  if (row.children[1].children.length > 1) {
    rowValue = Array.from(row.children[1].children)
      .map(el => el.textContent.trim().toLowerCase())
      .join(', ');
  } else {
    rowValue = row.children[1].textContent.trim().toLowerCase();
  }
  console.log(rowValue);
  if (rowValue.length > 0) {
    updatedRowValue = replaceTagText(rowValue, tagMap);
    console.log(updatedRowValue);
    let itemList = updatedRowValue.split(',');
    itemList = itemList.map(item => `${prefix}:${item.trim()}`);
    updatedRowValue = itemList;
  }
  row.remove();
  return updatedRowValue;

}

function convertToFilter(row) {
  let updatedRowValue;
  const rowValue = row.children[1].textContent.trim().toLowerCase();
  // Only convert if there is an = sign. Don't touch lists filters.
  if (rowValue.indexOf(',') == -1 && rowValue.indexOf('=') >= 0) {
    const splitFilter = rowValue.split('=');
    switch (splitFilter[0]) {
      case 'application':
        updatedRowValue = `tags=acaedmic:application:${replaceTagText(splitFilter[1], applicationTagMap)}`;
        break;
      case 'blogtopics':
        updatedRowValue = `tags=blog-topic:${replaceTagText(splitFilter[1], blogTopicsTagMap)}`;
        break;
      case 'booktype':
        updatedRowValue = `tags=book-type:${replaceTagText(splitFilter[1], bookTypeTagMap)}`;
        break;
      case 'capability':
        updatedRowValue = `tags=capability:${replaceTagText(splitFilter[1], capabilityTagMap)}`;
        break;
      case 'country':
        updatedRowValue = `tags=country:${replaceTagText(splitFilter[1], countryTagMap)}`;
        break;
      case 'course':
        updatedRowValue = `tags=academic:course:${replaceTagText(splitFilter[1], courseTagMap)}`;
        break;
      case 'eventseries':
        updatedRowValue = `tags=event-series:${replaceTagText(splitFilter[1], eventSeriesTagMap)}`;
        break;
      case 'eventtype':
        updatedRowValue = `tags=event-type:${replaceTagText(splitFilter[1], eventTypeTagMap)}`;
        break;
      case 'funnelstage':
        updatedRowValue = `tags=funnel-stage:${splitFilter[1]}`;
        break;
      case 'industry':
        updatedRowValue = `tags=industry:${replaceTagText(splitFilter[1], industryTagMap)}`;
        break;
      case 'partnertype':
        updatedRowValue = `tags=partner-type:${splitFilter[1]}`;
        break;
      case 'product':
        updatedRowValue = `tags=product:${replaceTagText(splitFilter[1], productTagMap)}`;
        break;
      case 'resourceoptions':
        updatedRowValue = `tags=resource-options:${splitFilter[1]}`;
        break;
      case 'resourcetype':
        updatedRowValue = `tags=resource-type:${replaceTagText(splitFilter[1], resourceTypeTagMap)}`;
        break;
      case 'userlevel':
        updatedRowValue = `tags=user-level:${splitFilter[1]}`;
        break;
      default:
        break;
    }
  }
  if (updatedRowValue !== undefined) {
    const actualRowVal = row.children[1]?.children[0];
    actualRowVal.textContent = updatedRowValue;
  }
  return updatedRowValue;
}

function updateTagsRow(row, tagsList) {
  const rowValue = row.children[1]?.children[0];
  const currentValueText = rowValue.textContent;
  const updatedValue = `${currentValueText}, ${tagsList.join(', ')}`;
  rowValue.textContent = updatedValue;
}

function addTagsRow(block, rowName, rowContent) {
  const rowDiv = createTag('div');
  const leftCellDiv = createTag('div');
  const leftCellContent = createTag('p', undefined, rowName);
  leftCellDiv.append(leftCellContent);
  const rightCellDiv = createTag('div');
  const rightCellContent = createTag('p', undefined, rowContent);
  rightCellDiv.append(rightCellContent);
  rowDiv.append(leftCellDiv, rightCellDiv);
  block.append(rowDiv);
}

async function doSearch(item, authToken, matching) {
  // Die if not a document
  if (!item.path.endsWith('.html')) return;

  // Fetch the doc & convert to DOM
  const url = `https://admin.da.live/source${item.path}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!resp.ok) {
    console.log('Could not fetch item');
    return;
  }
  let flag = false;
  const text = await resp.text();
  const dom = new DOMParser().parseFromString(text, 'text/html');
  const metadataBlock = dom.querySelector('div.metadata');

  if (metadataBlock) {
    let tagsRowValue = [];
    let tagRow;
    const rows = metadataBlock.children;
    // Iterate backwards so elements can be deleted safely.
    for (let i = rows.length - 1; i >= 0; i--) {
      const row = rows[i];
      const rowName = row.firstChild.textContent.toLowerCase();
      switch (rowName) {
        case 'application':
          const applicationRow = convertToTagList(row, applicationTagMap, 'academic:application');
          if (applicationRow !== undefined) {
            tagsRowValue.push(applicationRow);
          }
          break;
        case 'blogtopics':
          const blogTopicsRow = convertToTagList(row, blogTopicsTagMap, 'blog-topic');
          if (blogTopicsRow !== undefined) {
            tagsRowValue.push(blogTopicsRow);
          }
          break;
        case 'booktype':
          const bookTypeRow = convertToTagList(row, bookTypeTagMap, 'book-type');
          if (bookTypeRow !== undefined) {
            tagsRowValue.push(bookTypeRow);
          }
          break;
        case 'capability':
          const capabilityRow = convertToTagList(row, capabilityTagMap, 'capability');
          if (capabilityRow !== undefined) {
            tagsRowValue.push(capabilityRow);
          }
          break;
        case 'country':
          const countryRow = convertToTagList(row, countryTagMap, 'country');
          if (countryRow !== undefined) {
            tagsRowValue.push(countryRow);
          }
          break;
        case 'course':
          const courseRow = convertToTagList(row, courseTagMap, 'academic:course');
          if (courseRow !== undefined) {
            tagsRowValue.push(courseRow);
          }
          break;
        case 'eventseries':
          const eventSeriesRow = convertToTagList(row, eventSeriesTagMap, 'event-series');
          if (eventSeriesRow !== undefined) {
            tagsRowValue.push(eventSeriesRow);
          }
          break;
        case 'eventtype':
          const eventTypeRow = convertToTagList(row, eventTypeTagMap, 'event-type');
          if (eventTypeRow !== undefined) {
            tagsRowValue.push(eventTypeRow);
          }
          break;
        case 'funnelstage':
          const funnelStageRow = convertToTagList(row, [], 'funnel-stage');
          if (funnelStageRow !== undefined) {
            tagsRowValue.push(funnelStageRow);
          }
          break;
        case 'industry':
          const industryRow = convertToTagList(row, industryTagMap, 'industry');
          if (industryRow !== undefined) {
            tagsRowValue.push(industryRow);
          }
          break;
        case 'partnertype':
          const partnerRow = convertToTagList(row, [], 'partner-type');
          if (partnerRow !== undefined) {
            tagsRowValue.push(partnerRow);
          }
          break;
        case 'product':
          const productRow = convertToTagList(row, productTagMap, 'product');
          if (productRow !== undefined) {
            tagsRowValue.push(productRow);
          }
          break;
        case 'resourcetype':
          const resourceTypeRow = convertToTagList(row, resourceTypeTagMap, 'resource-type');
          if (resourceTypeRow !== undefined) {
            tagsRowValue.push(resourceTypeRow);
          }
          break;
        case 'resourceoptions':
          const resourceOptionsRow = convertToTagList(row, [], 'resource-options');
          if (resourceOptionsRow !== undefined) {
            tagsRowValue.push(resourceOptionsRow);
          }
          break;
        case 'userlevel':
          const userLevelRow = convertToTagList(row, [], 'user-level');
          if (userLevelRow !== undefined) {
            tagsRowValue.push(userLevelRow);
          }
          break;
        case 'tags':
          tagRow = row;
          break;
      }
    }
    console.log(tagsRowValue);
    if (tagsRowValue.length) {
      //check if tag row exists.
      if (tagRow !== undefined) {
        // add to the existing tag row value.
        updateTagsRow(tagRow, tagsRowValue);
      } else {
        // create a tags row.
        addTagsRow(metadataBlock, 'tags', tagsRowValue.join(', '));
      }
      matching.push(item.path);
      flag =  true;

      const html = dom.body.querySelector('main');
      await saveToDa(html.innerHTML, item.path, authToken);
    } else {
      // no modification.
    }
  } else {
    // done here.
  }

  // Now update custom listgroups.
  const foundProperties = Array.from(dom.querySelectorAll('div.listgroup-custom p')).filter((field) => {
    return field.children.length === 0
      && field.textContent.trim().toLowerCase() === 'filter';
  });
  let updated = false;
  foundProperties.forEach((prop) => {
    const updatedRow = convertToFilter(prop.parentElement.parentElement);
    if (updatedRow !== undefined) {
      updated = true;
      if (!flag) {
        matching.push(item.path);
      }
    }
  });
  if (updated) {
    const html = dom.body.querySelector('main');
    await saveToDa(html.innerHTML, item.path, authToken);
  }
}

function addOutput(matching) {
  const resultDiv = createTag('div');
  const resultHeader = createTag('p');
  resultHeader.textContent = "Modified the following pages:";
  const resultList = createTag('ul');
  for (let result of matching) {
    const resultItem = createTag('li');
    const anchor = createTag('a', {
      href: `https://da.live/edit#${result}`
    });
    anchor.textContent = result;
    resultItem.append(anchor);
    resultList.append(resultItem);
  }
  resultDiv.append(resultHeader, resultList);
  document.querySelector('body').append(resultDiv);
}

async function handleFormSubmit(authToken, folderPath) {
  console.log("Folder Path:", folderPath);

  setImsDetails(authToken);

  const matching = [];

  let path = folderPath;

  // Crawl the tree of content
  const { results } = await crawl({
    path,
    callback: (item) => doSearch(item, authToken, matching),
    concurrent: 50,
  });
  await results;

  addOutput(matching);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("dataForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevents page reload

    const authToken = document.getElementById("authToken").value.trim();
    const folderPath = document.getElementById("folderPath").value.trim();

    // Call your external function
    handleFormSubmit(authToken, folderPath);
  });
});
