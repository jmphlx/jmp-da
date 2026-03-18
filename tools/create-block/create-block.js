// eslint-disable-next-line import/no-unresolved
import { setImsDetails } from 'https://da.live/nx/utils/daFetch.js';
// eslint-disable-next-line import/no-unresolved
import { crawl } from 'https://da.live/nx/public/utils/tree.js';
import { createTag } from '../../scripts/helper.js';

const BLOCKNAME = 'metadata';

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
    return {
      putURL,
      daStatus: daResp.status,
      daResp,
      ok: daResp.ok,
    };
  } catch (e) {
    console.log(`Couldn't save ${pathname} - ${e}`);
    return null;
  }
}

function createBlock() {
  const blockDiv = createTag('div', { class: `${BLOCKNAME}` });
  const rowDiv = createTag('div');
  const nameDiv = createTag('div');
  const valueDiv = createTag('div');

  nameDiv.innerHTML = '<p>robots</p>';
  valueDiv.innerHTML = '<p>noindex, nofollow</p>';
  rowDiv.append(nameDiv, valueDiv);
  blockDiv.append(rowDiv);
  return blockDiv;
}

function addRowToBlock(block, rowName, rowContent) {
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

  const text = await resp.text();
  const dom = new DOMParser().parseFromString(text, 'text/html');
  const metadataBlock = dom.querySelector('div.metadata');

  if (metadataBlock) {
    // check if row exists.
    const rows = metadataBlock.children;
    let foundRowFlag = false;
    for (let i = rows.length - 1; i >= 0; i--) {
      const row = rows[i];
      const rowName = row.firstChild.textContent.toLowerCase();
      if (rowName === 'robots') {
        foundRowFlag = true;
      }
    }

    if (!foundRowFlag) {
      addRowToBlock(metadataBlock, 'robots', 'noindex, nofollow');
      matching.push(item.path);
      const html = dom.body.querySelector('main');
      await saveToDa(html.innerHTML, item.path, authToken);
    }
  } else {
    const mainDiv = dom.body.querySelector('main div');
    mainDiv.append(createBlock());
    matching.push(item.path);
    const html = dom.body.querySelector('main');
    await saveToDa(html.innerHTML, item.path, authToken);
  }
}

function addOutput(matching) {
  const resultDiv = createTag('div');
  const resultHeader = createTag('p');
  resultHeader.textContent = 'Modified the following pages:';
  const resultList = createTag('ul');
  // eslint-disable-next-line no-restricted-syntax
  for (const result of matching) {
    const resultItem = createTag('li');
    const anchor = createTag('a', {
      href: `https://da.live/edit#${result}`,
    });
    anchor.textContent = result;
    resultItem.append(anchor);
    resultList.append(resultItem);
  }
  resultDiv.append(resultHeader, resultList);
  document.querySelector('body').append(resultDiv);
}

async function handleFormSubmit(authToken, folderPath) {
  console.log('Folder Path:', folderPath);

  setImsDetails(authToken);

  const matching = [];

  const path = folderPath;

  // Crawl the tree of content
  const { results } = await crawl({
    path,
    callback: (item) => doSearch(item, authToken, matching),
    concurrent: 50,
  });
  await results;

  addOutput(matching);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('dataForm');

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents page reload

    const authToken = document.getElementById('authToken').value.trim();
    const folderPath = document.getElementById('folderPath').value.trim();

    // Call your external function
    handleFormSubmit(authToken, folderPath);
  });
});
