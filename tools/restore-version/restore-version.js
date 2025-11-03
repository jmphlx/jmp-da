// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
// eslint-disable-next-line import/no-unresolved
import { crawl } from 'https://da.live/nx/public/utils/tree.js';
import { formatVersions } from './formatter.js';
import { createTag, saveToDa } from '../../scripts/helper.js';
import { constructPageViewer } from '../search/ui.js';

let context;
let actions;
let token;

async function getVersionFromList(versionUrl) {
  const url = `https://admin.da.live${versionUrl}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const result = await response.text();
      return result;
    }
    const errorText = await response.text();
    return { success: false, status: response.status, error: errorText };
  } catch (e) {
    console.log(e);
    return { success: false, status: null, error: e };
  }
}

function addLoadingSearch(container, loadingText) {
  container.innerHTML = '';
  const loadingIcon = createTag('div', {
    class: 'loading-state',
  }, loadingText);
  container.append(loadingIcon);
}

function createInvalidCard(pagePath) {
  const body = createTag('div', { class: 'card-body invalid' });
  const emptyMessage = createTag('span', {
    class: 'invalid-msg',
  }, `No Versions Exist for ${pagePath}`);
  body.append(emptyMessage);
  return body;
}

function createCard(pagePath, versionList) {
  const body = createTag('div', { class: 'card-body' });

  const checkbox = createTag('input', {
    name: 'selectRestore',
    type: 'checkbox',
    value: pagePath,
  });

  checkbox.addEventListener('change', (e) => {
    if (e.target.checked) {
      body.classList.add('selected');
    } else {
      body.classList.remove('selected');
    }
  });

  const cardPath = createTag('span', { class: 'title' });
  cardPath.textContent = pagePath;
  body.append(checkbox, cardPath);

  const versionContainer = createTag('div', { class: 'version-lists' });
  if (versionList !== undefined && versionList.data.length > 0) {
    const versionDropdown = createTag('select');

    versionList.data.forEach((version) => {
      const versionOpt = createTag('option', {
        value: version.url,
      });
      versionOpt.textContent = `${version.date} ${version.time}`;
      versionDropdown.append(versionOpt);
    });

    const openPageIcon = createTag('img', {
      src: `${window.location.origin}/icons/new-tab-icon.svg`,
      class: 'open-page',
    });

    openPageIcon.addEventListener('click', async () => {
      document.getElementById('myModal').style.display = 'block';

      const leftPanel = document.getElementById('leftPanel');
      const rightPanel = document.getElementById('rightPanel');

      leftPanel.textContent = 'Loading...';
      rightPanel.textContent = 'Loading...';

      const pageSourceUrl = `https://admin.da.live/source${pagePath}`;
      const resp = await actions.daFetch(pageSourceUrl);
      if (!resp.ok) {
        console.log('Could not fetch item');
        return;
      }
      const text = await resp.text();
      const dom = new DOMParser().parseFromString(text, 'text/html');
      leftPanel.innerHTML = dom.querySelector('main').innerHTML;
      rightPanel.innerHTML = await getVersionFromList(versionDropdown.value);
    });

    versionContainer.append(versionDropdown, openPageIcon);
    body.append(versionContainer);
  }

  return body;
}

async function getVersionList(path) {
  const url = `https://admin.da.live/versionlist${path}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const jsonResult = await response.json();
          const formattedList = formatVersions(jsonResult);
          return { success: true, status: response.status, data: formattedList };
        } catch (jsonError) {
          console.log(jsonError);
          return { success: false, status: response.status, error: jsonError };
        }
      } else {
        return { success: true, status: response.status };
      }
    } else {
      const errorText = await response.text();
      return { success: false, status: response.status, error: errorText };
    }
  } catch (e) {
    console.log(e);
    return { success: false, status: null, error: e };
  }
}

async function restoreVersion(pagePath, versionUrl) {
  const version = await getVersionFromList(versionUrl);
  const dom = new DOMParser().parseFromString(version, 'text/html');
  const htmlToUse = dom.querySelector('main');
  await saveToDa(htmlToUse.innerHTML, pagePath, token);
}

function createResultHeader() {
  const resultHeader = createTag('div', { class: 'results-header' });
  const resultHeaderText = createTag('h2', {}, 'Results');
  const buttonContainer = createTag('div', { class: 'btn-container' });

  const selectAllButton = createTag('button', {
    type: 'button',
    class: 'select-all-btn',
  }, 'Select All');
  selectAllButton.addEventListener('click', () => {
    const allCheckboxes = document.querySelectorAll('div.card-body input');
    allCheckboxes.forEach((checkbox) => {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  const deselectAllButton = createTag('button', {
    type: 'button',
    class: 'deselect-all-btn',
  }, 'Deselect All');
  deselectAllButton.addEventListener('click', () => {
    const allCheckboxes = document.querySelectorAll('div.card-body input');
    allCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  const restorePagesButton = createTag('button', {
    type: 'button',
    class: 'restore-btn',
  }, 'Restore Page Versions');
  restorePagesButton.addEventListener('click', async () => {
    const selectedCards = document.querySelectorAll('div.card-body input[type="checkbox"]:checked');
    const restorePromises = Array.from(selectedCards).map(async (input) => {
      const card = input.closest('.card-body');
      const versionUrl = card.querySelector('div.version-lists select')?.value;
      await restoreVersion(input.value, versionUrl);
      card.classList.add('modified');
    });
    await Promise.all(restorePromises);
  });
  buttonContainer.append(selectAllButton, deselectAllButton, restorePagesButton);
  resultHeader.append(resultHeaderText, buttonContainer);
  return resultHeader;
}

window.addEventListener('message', (event) => {
  if (event.origin === 'http://localhost:3000'
    || event.origin === 'https://www.jmp.com'
    || event.origin === 'https://main--jmp-da--jmphlx.aem.live') {
    const singleInput = document.getElementById('page-path-input');
    if (event.data.length) {
      singleInput.value = event.data;
    }
  }
  if (event.origin === 'https://da.live') {
    const iframe = document.querySelector('iframe');
    iframe.contentWindow.postMessage(event.data);
  }
  const mydialog = document.querySelector('#modal');
  mydialog.close();
});

const callback = async (item, pagePaths) => {
  // Skip if not a document
  if (!item.path.endsWith('.html')) return;
  pagePaths.push(item.path);
};

async function init() {
  const sdk = await DA_SDK;
  context = sdk.context;
  actions = sdk.actions;
  token = sdk.token;

  constructPageViewer();

  const openExplorerBtn = document.getElementById('openPageExplorer');
  openExplorerBtn.addEventListener('click', () => {
    document.querySelector('#modal').showModal();
  });

  const modal = document.getElementById('myModal');

  const closeBtn = document.getElementById('closeBtn');
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal if user clicks outside of the content
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  const submitButton = document.querySelector('[name="submitRestore"]');

  submitButton.addEventListener('click', async () => {
    const resultContainer = document.querySelector('.results-container');
    addLoadingSearch(resultContainer, 'Loading');

    const pagePaths = [];
    const inputValue = document.getElementById('page-path-input').value;
    const path = `/${context.org}/${context.repo}${inputValue}`;
    const { results } = crawl({
      path,
      callback: (item) => callback(item, pagePaths),
      concurrent: 50,
    });
    await results;

    const resultHeader = createResultHeader();

    const resultsList = createTag('div', { class: 'results-list' });

    // Create an array of promises that each return a card
    const cardPromises = pagePaths.map(async (pagePath) => {
      const result = await getVersionList(pagePath);
      if (!result || !result.data.length) {
        return createInvalidCard(pagePath);
      }
      return createCard(pagePath, result);
    });

    // Wait for all to resolve then append
    const cards = await Promise.all(cardPromises);
    cards.forEach((card) => resultsList.append(card));

    resultContainer.innerHTML = '';
    resultContainer.append(resultHeader, resultsList);
  });
}

async function startApp() {
  // const hasAccess = await addAppAccessControl();
  // if (hasAccess) {
  //   await init();
  // }
  await init();
}
startApp();
