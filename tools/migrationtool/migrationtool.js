// eslint-disable-next-line import/no-unresolved
import { setImsDetails } from 'https://da.live/nx/utils/daFetch.js';
import { crawl } from 'https://da.live/nx/public/utils/tree.js';
import { createTag } from '../../scripts/helper.js';

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
  console.log('in save To da');
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
    return { daHref, daStatus: daResp.status, daResp, ok: daResp.ok };
  } catch {
    console.log(`Couldn't save ${pathname}`);
    return null;
  }
}

function replaceTagText(line, replacements) {
  for (const [search, replace] of replacements) {
    line = line.replaceAll(search, replace);
  }
  return line;
}

function doApplicationTag() {
  const tagMap = [
    ['Business and Economics', 'business-and-economics'],
    ['Life Sciences', 'life-sciences'],
    ['Physical Sciences', 'physical-sciences'],
    ['Social Sciences', 'social-sciences']
  ];

}

function doIndustryTag(row) {
  const tagMap = [
    ['clean energy and conservation', 'clean-energy-and-conservation'],
    ['consumer products', 'consumer-products'],
    ['high-tech manufacturing', 'high-tech-manufacturing'],
    ['industrial manufacturing', 'industrial-manufacturing'],
    ['medical devices', 'medical-devices'],
    ['medical statistics', 'medical-statistics'],
  ];
  let updatedRowValue;
  const rowValue = row.children[1].textContent.trim().toLowerCase();
  if (rowValue.length > 0) {
    updatedRowValue = replaceTagText(rowValue, tagMap);
    let itemList = updatedRowValue.split(',');
    itemList = itemList.map(item => `industry:${item.trim()}`);
    updatedRowValue = itemList;
  }
  row.remove();
  return updatedRowValue;
}

function doProductTag(row) {
    const tagMap = [
    ['jmp pro', 'jmp-pro'],
    ['jmp live', 'jmp-live'],
    ['jmp clinical', 'jmp-clinical']
  ];
  let updatedRowValue;
  const rowValue = row.children[1].textContent.trim().toLowerCase();
  if (rowValue.length > 0) {
    updatedRowValue = replaceTagText(rowValue, tagMap);
    let itemList = updatedRowValue.split(',');
    itemList = itemList.map(item => `product:${item.trim()}`);
    updatedRowValue = itemList;
  }
  row.remove();
  return updatedRowValue;
}

function doResourceTypeTag(row) {
  const tagMap = [
    ['book chapter', 'book-chapter'],
    ['case study', 'case-study'],
    ['customer story', 'customer-story'],
    ['on-demand webinar', 'on-demand-webinar'],
    ['white paper', 'white-paper'],
  ];
  let updatedRowValue;
  const rowValue = row.children[1].textContent.trim().toLowerCase();
  if (rowValue.length > 0) {
    updatedRowValue = replaceTagText(rowValue, tagMap);
    let itemList = updatedRowValue.split(',');
    itemList = itemList.map(item => `resource-type:${item.trim()}`);
    updatedRowValue = itemList;
  }
  row.remove();
  return updatedRowValue;
}

function updateTagsRow(row, tagsList) {
  console.log('in update');
  const rowValue = row.children[1]?.children[0];
  console.log(rowValue);
  const currentValueText = rowValue.textContent;
  console.log(currentValueText);
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
  console.log(block);
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
        case 'industry':
          const industryRow = doIndustryTag(row);
          if (industryRow !== undefined) {
            tagsRowValue.push(industryRow);
          }
          break;
        case 'product':
          const productRow = doProductTag(row);
          if (productRow !== undefined) {
            tagsRowValue.push(productRow);
          }
          break;
        case 'resourcetype':
          const resourceTypeRow = doResourceTypeTag(row);
          if (resourceTypeRow !== undefined) {
            tagsRowValue.push(resourceTypeRow);
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

      const html = dom.body.querySelector('main');
      console.log('save to da');
      await saveToDa(html.innerHTML, item.path, authToken);
    } else {
      //console.log('no modification');
    }
  } else {
    // done here.
    //console.log('skip');
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
  console.log("Auth Token:", authToken);
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
