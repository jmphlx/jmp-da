// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import { formatVersions } from './formatter.js';
import { createTag } from '../../scripts/helper.js';

let context;
let actions;
let token;

function createCard(pagePath, versionList) {
  const body = createTag('div', { class: 'card-body'});
  const cardPath = createTag('span', { class: 'title'});
  cardPath.textContent = pagePath;
  body.append(cardPath);

  console.log(versionList);
  const versionContainer = createTag('div', { class: '.version-lists'});
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

      

      /* this should open a modal that has the html of the page at this exact moment on one side,
      next to the content of the version selected in the dropdown.
      may need to be scrollable
      At the bottom, there should be 2 buttons restore and cancel. 
      Restore should prompt the user.
      */
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


async function getVersionFromURL(pagePath, versionList) {
  console.log(versionList);

  for(let i = 0; i < versionList.length; i++) {
    const url = `https://admin.da.live${versionList[i].url}`;
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
}

export async function getVersionList(path, token) {
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
          console.log('result');
          console.log(jsonResult);
          const formattedList = formatVersions(jsonResult);
          //const versionList = getVersionFromURL(formattedList);

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
    resultContainer.innerHTML = '';

    let pagePaths = [
      '/en/sandbox/laurel/listgroups/resources',
      '/en/sandbox/laurel/listgroups/custom',
      '/en/sandbox/laurel/listgroups/loadmore',
      '/en/sandbox/laurel/listgroups/custom-dates',
      '/en/sandbox/laurel/listgroups/aem-190',
      '/en/sandbox/laurel/listgroups/fixed',
      '/en/sandbox/laurel/listgroups/loadmore-filter',
    ];

    for (let i = 0; i < pagePaths.length; i++) {
      const pagePath = pagePaths[i];
      const result = await getVersionList(pagePath, token);

      const pageCard = createCard(pagePath, result);
      resultContainer.append(pageCard);

    }
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