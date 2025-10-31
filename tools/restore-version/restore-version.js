// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import { formatVersions } from './formatter.js';
import { createTag, saveToDa } from '../../scripts/helper.js';

let context;
let actions;
let token;

function addLoadingSearch(container, loadingText) {
  container.innerHTML = '';
  const loadingIcon = createTag('div', {
    class: 'loading-state',
  }, loadingText);
  container.append(loadingIcon);
}

function createCard(pagePath, versionList) {
  const body = createTag('div', { class: 'card-body'});

  const checkbox = createTag('input', {
    name: 'selectRestore',
    type: 'checkbox',
    value: pagePath,
  });

  const cardPath = createTag('span', { class: 'title'});
  cardPath.textContent = pagePath;
  body.append(checkbox, cardPath);

  console.log(versionList);
  const versionContainer = createTag('div', { class: 'version-lists'});
  if (versionList !== undefined) {
    const versionDropdown = createTag('select');

    versionList.data.forEach((version) => {
      const versionOpt = createTag('option', {
        value: version.url,
      });
      versionOpt.textContent = `${version.date} ${version.time}`;
      versionDropdown.append(versionOpt)
    });

    // Should be a dropdown list of version. Need a button to compare the versions. 
    // May need a button to create version of current state.
    // maybe needs to link to open the page in a new window.
    // may need a button to refresh version list OR have creating version prepend?
    // future, add checkbox to each card, and then add header to the top of results
    // header should have number selected, button to restore all selected version, button to select or unselect all.

    const openPageIcon = createTag('img', {
      src: `${window.location.origin}/icons/new-tab-icon.svg`,
      class: 'open-page',
    });

    openPageIcon.addEventListener('click', async () => {
      console.log(versionDropdown.value);
      document.getElementById('myModal').style.display = 'block';

      const leftPanel = document.getElementById('leftPanel');
      const rightPanel = document.getElementById('rightPanel');

      leftPanel.textContent = 'Loading...';
      rightPanel.textContent = 'Loading...';

      const pageSourceUrl = `https://admin.da.live/source/${context.org}/${context.repo}${pagePath}.html`;
      console.log(pageSourceUrl);
      
      // Fetch the doc & convert to DOM
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

async function getVersionFromList(versionUrl) {
  const url = `https://admin.da.live${versionUrl}`;
  console.log(url);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if (response.ok) {
      const result = await response.text();
      console.log(result);
      return result;
    } else {
      const errorText = await response.text();
      return { success: false, status: response.status, error: errorText };
    }
  } catch (e) {
    console.log('generic error');
    console.log(e);
    return { success: false, status: null, error: e };
  }
}

async function getVersionList(path, token) {
  const cleanPath = `${context.org}/${context.repo}${path}`;
  const url = `https://admin.da.live/versionlist/${cleanPath}.html`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const jsonResult = await response.json();
          const formattedList = formatVersions(jsonResult);
          return { success: true, status: response.status, data: formattedList};
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
    console.log('generic error');
    console.log(e);
    return { success: false, status: null, error: e };
  }
}

async function restoreVersion(pagePath, versionUrl) {
  const version = await getVersionFromList(versionUrl);
  console.log(version);
  const dom = new DOMParser().parseFromString(version, 'text/html');
  const htmlToUse = dom.querySelector('main');
  await saveToDa(htmlToUse.innerHTML, pagePath, token);
}

function createResultHeader() {
      const resultHeader = createTag('div', { class: 'results-header' });
    const resultHeaderText = createTag('h2', {}, 'Results');
    const buttonContainer = createTag('div', { class: 'btn-container'});
    const selectAllButton = createTag('button', {
      type: 'button',
      class: 'select-all-btn',
    }, 'Select All');

    selectAllButton.addEventListener('click', () => {
      const allCheckboxes = document.querySelectorAll('div.card-body input')
      allCheckboxes.forEach((checkbox) => {
        checkbox.checked = true;
      })
    });

    const deselectAllButton = createTag('button', {
      type: 'button',
      class: 'deselect-all-btn',
    }, 'Deselect All');

    deselectAllButton.addEventListener('click', () => {
      const allCheckboxes = document.querySelectorAll('div.card-body input')
      allCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
      })
    });

    const restorePagesButton = createTag('button', {
      type: 'button',
      class: 'restore-btn',
    }, 'Restore Page Versions');
    
    restorePagesButton.addEventListener('click', async function() {
      const selectedCards = document.querySelectorAll('div.card-body input[type="checkbox"]:checked');
      console.log(selectedCards.length);
      for (var i = 0; i < selectedCards.length; i++) {
        const card = selectedCards[i].parentElement;
        console.log(card);
        console.log(selectedCards[i].value);
        const versionUrl = card.querySelector('div.version-lists select')?.value;

        await restoreVersion(selectedCards[i].value, versionUrl);
        card.classList.add('modified');
      }
    });

    buttonContainer.append(selectAllButton, deselectAllButton, restorePagesButton);
    resultHeader.append(resultHeaderText, buttonContainer);
    return resultHeader;
}

async function init() {
  const sdk = await DA_SDK;
  context = sdk.context;
  actions = sdk.actions;
  token = sdk.token;

  // constructPageViewer();

  // const mybutton = document.querySelector('#mybutton');
  // mybutton.addEventListener('click', () => {
  //   document.querySelector('#modal').showModal();
  // });

  // await getConfigurations();
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

    let pagePaths = [
      '/en/sandbox/laurel/listgroups/resources',
      '/en/sandbox/laurel/listgroups/custom',
      '/en/sandbox/laurel/listgroups/loadmore',
      '/en/sandbox/laurel/listgroups/custom-dates',
      '/en/sandbox/laurel/listgroups/aem-190',
      '/en/sandbox/laurel/listgroups/fixed',
      '/en/sandbox/laurel/listgroups/loadmore-filter',
    ];

    const resultHeader = createResultHeader();

    const resultsList = createTag('div', {class: 'results-list'});
    for (let i = 0; i < pagePaths.length; i++) {
      const pagePath = pagePaths[i];
      const result = await getVersionList(pagePath, token);
      const pageCard = createCard(pagePath, result);
      resultsList.append(pageCard);
    }
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