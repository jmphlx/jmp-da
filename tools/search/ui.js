import {
  createTag,
  DA_CONSTANTS,
  getPublishStatus,
} from '../../scripts/helper.js';
import { escapeRegExp } from './replace.js';
import { getCurrentVersion } from '../restore-version/formatter.js';

const DEFAULT_PROP_LIST = ['style', 'options'];

// escape regex metacharacters in the variable
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// builds a lookbehind regex for e.g. "property", "block", etc.
function makeLookbehindRegex(keyword, flags = 'gi') {
  const esc = escapeRegex(keyword);
  // Note: lookbehind must be supported in your runtime
  return new RegExp(`(?<=${esc}:)\\S+`, flags);
}

function highlightKeyword(text, keyword) {
  const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
  return text.replaceAll(regex, '<mark>$1</mark>');
}

function updateSearchTerms(searchInputField, category, termValue) {
  const currentValue = searchInputField.value;
  const exp = makeLookbehindRegex(category);
  if (currentValue) {
    // Need to check if scope is already in field. If so,  change it.
    if (currentValue.match(exp)) {
      if (!termValue.length) {
        const adjustedField = currentValue.replace(exp, termValue);
        searchInputField.value = adjustedField.replace(`${category}:`, '');
      } else {
        searchInputField.value = currentValue.replace(exp, termValue);
      }
    } else {
      searchInputField.value += ` ${category}:${termValue}`;
    }
  } else {
    searchInputField.value = `${category}:${termValue}`;
  }
}

function addCheckboxEventListeners(searchInputField) {
  const emptyCheckbox = document.getElementById('emptyValue');
  const emptyRegex = /(\s?\$empty)/g;
  emptyCheckbox.addEventListener('change', () => {
    const currentValue = searchInputField.value;
    const emptyCheckboxVal = emptyCheckbox.checked;
    if (emptyCheckboxVal && !currentValue) {
      searchInputField.value = '$empty';
    } else if (emptyCheckboxVal && currentValue) {
      searchInputField.value += ' $empty';
    } else if (!emptyCheckboxVal && currentValue.match(emptyRegex)) {
      searchInputField.value = currentValue.replace(emptyRegex, '');
    }
  });
}

function buildParentDropdown(dropdown, jsonData, type) {
  const defaultElement = createTag('option', {
    value: '',
  }, 'Select');
  dropdown.append(defaultElement);
  jsonData.forEach((option) => {
    const optionValue = option[type].toLowerCase();
    if (optionValue !== 'default') {
      const optionElement = createTag('option', {
        value: optionValue,
      }, optionValue);
      dropdown.append(optionElement);
    }
  });
  dropdown.value = '';
}

function buildPropertiesDropdown(dropdown, nodeName) {
  // Remove any existing items
  const currOptions = dropdown.querySelectorAll('option');
  currOptions?.forEach((opt) => {
    opt.remove();
  });
  let propertyList;
  window.blockProperties.forEach((block) => {
    if (block.name.toLowerCase() === nodeName) {
      propertyList = block.property.split(',');
    }
  });
  if (!propertyList || !propertyList[0].length) {
    propertyList = DEFAULT_PROP_LIST;
  }
  const defaultElement = createTag('option', {
    value: '',
    class: 'prop-option',
  }, 'Select');
  dropdown.append(defaultElement);
  propertyList?.forEach((prop) => {
    const optionValue = prop.trim();
    const optionElement = createTag('option', {
      value: optionValue,
      class: 'prop-option',
    }, optionValue);
    dropdown.append(optionElement);
  });
}

function buildAttributeDropdown(dropdown, nodeName) {
  // Remove any existing items
  const currOptions = dropdown.querySelectorAll('option');
  currOptions?.forEach((opt) => {
    opt.remove();
  });
  let attributeList;
  window.tagAttribute.forEach((tag) => {
    if (tag.tag === nodeName) {
      attributeList = tag.attribute.split(',');
    }
  });
  if (!attributeList || !attributeList[0].length) {
    attributeList = window.tagAttribute[0].attribute.split(',');
  }
  const defaultElement = createTag('option', {
    value: '',
    class: 'prop-option',
  }, 'Select');
  dropdown.append(defaultElement);
  attributeList?.forEach((attr) => {
    const optionValue = attr.trim();
    const optionElement = createTag('option', {
      value: optionValue,
      class: 'attr-option',
    }, optionValue);
    dropdown.append(optionElement);
  });
}

function populateDropdowns(searchInputField) {
  // Do Block
  const blockDropdown = document.querySelector('[name="block_scope"]');
  buildParentDropdown(blockDropdown, window.blockProperties, 'name');

  const propertyDrop = document.querySelector('[name="property_scope"]');
  buildPropertiesDropdown(propertyDrop, 'default');

  blockDropdown.addEventListener('change', () => {
    buildPropertiesDropdown(propertyDrop, blockDropdown.value);
    updateSearchTerms(searchInputField, 'block', blockDropdown.value);
  });

  propertyDrop.addEventListener('change', () => {
    updateSearchTerms(searchInputField, 'property', propertyDrop.value);
  });

  const tagDropdown = document.querySelector('[name="tag_scope"]');
  buildParentDropdown(tagDropdown, window.tagAttribute, 'tag');

  const attributeDropdown = document.querySelector('[name="attribute_scope"]');
  buildAttributeDropdown(attributeDropdown, 'default');

  tagDropdown.addEventListener('change', () => {
    buildAttributeDropdown(attributeDropdown, tagDropdown.value);
    updateSearchTerms(searchInputField, 'tag', tagDropdown.value);
  });

  attributeDropdown.addEventListener('change', () => {
    updateSearchTerms(searchInputField, 'attribute', attributeDropdown.value);
  });

  const statusDropdown = document.getElementById('publish_scope');
  statusDropdown.addEventListener('change', () => {
    updateSearchTerms(searchInputField, 'status', statusDropdown.value);
  });
}

function addLoadingAction(resultsContainer, message) {
  resultsContainer.querySelector('.action-results')?.remove();
  const actionMessage = createTag('div', {
    class: 'action-results loading-state',
  }, message);
  resultsContainer.prepend(actionMessage);
}

function updateActionMessage(resultsContainer, result) {
  resultsContainer.querySelector('.action-results')?.remove();
  const actionMessage = createTag('span', {
    class: `action-results ${result.status}`,
  });
  actionMessage.textContent = result.message;
  resultsContainer.prepend(actionMessage);
}

function createResultItem(item, highlightTerm) {
  const resultItem = createTag('div', { class: 'result-item' });
  const resultHeader = createTag('div', {
    class: 'result-header',
  });
  const pagePath = createTag('div', {
    class: 'page-path',
  }, `${item.path}`);

  const publishStatus = getPublishStatus(item.publishStatus);
  const publishIcon = createTag('div', {
    class: `statusCircle status-${publishStatus}`,
  });

  const link = createTag('a', {
    href: `${DA_CONSTANTS.editUrl}${item.path.replace('.html', '')}`,
    target: '_blank',
  });

  const openPageIcon = createTag('img', {
    src: `${window.location.origin}/icons/new-tab-icon.svg`,
    class: 'open-page',
  });
  link.append(openPageIcon);
  resultHeader.append(pagePath, publishIcon, link);

  resultItem.append(resultHeader);

  const resultDetails = createTag('div', {
    class: 'result-details',
  });
  const resultText = document.createElement('ul');
  const elements = item.elements;
  elements.forEach((el) => {
    const li = createTag('li', {
      class: `html-result ${item.classStyle}`,
    });
    const clone = el.cloneNode(true);
    clone.innerHTML = highlightKeyword(clone.innerHTML, highlightTerm);
    li.append(clone);
    resultText.append(li);
  });
  resultDetails.append(resultText);
  resultItem.append(resultDetails);

  resultItem.addEventListener('click', function (e) {
    e.stopPropagation();
    if (this.classList.contains('open')) {
      this.classList.remove('open');
    } else {
      this.classList.add('open');
    }
  });

  return resultItem;
}

async function copyToClipboard(button, clipboardTxt, copyTxt) {
  try {
    await navigator.clipboard.writeText(clipboardTxt);
    button.setAttribute('title', copyTxt);
    button.setAttribute('aria-label', copyTxt);

    const tooltip = createTag('div', { role: 'status', 'aria-live': 'polite', class: 'copied-to-clipboard' }, copyTxt);
    button.parentElement.append(tooltip);

    setTimeout(() => {
      /* c8 ignore next 1 */
      tooltip.remove();
    }, 3000);
    button.classList.remove('copy-failure');
    button.classList.add('copy-success');
  } catch (e) {
    console.log(e);
    button.classList.add('copy-failure');
    button.classList.remove('copy-success');
  }
}

function clearResults() {
  const resultsContainer = document.querySelector('.results-container');
  resultsContainer.innerHTML = '';
  const advancedActions = document.querySelector('#action-form');
  advancedActions?.classList.add('hidden');
  const advancedActionPrompt = document.getElementById('advanced-action-prompt');
  advancedActionPrompt?.classList.add('hidden');
  const createVersionPrompt = document.getElementById('create-version-prompt');
  createVersionPrompt?.classList.add('hidden');
  const exportForm = document.getElementById('export-form');
  exportForm?.classList.add('hidden');
}

function addLoadingSearch(container, loadingText) {
  container.innerHTML = '';
  const loadingIcon = createTag('div', {
    class: 'loading-state',
  }, loadingText);
  container.append(loadingIcon);
}

function writeOutResults(results, queryString, queryObject, duration, replaceFlag) {
  const highlightTerm = replaceFlag
    ? document.querySelector('[name="replaceText"]').value : queryObject.keyword;

  const resultsContainer = document.querySelector('.results-container');
  resultsContainer.innerHTML = '';

  const resultsHeader = document.createElement('h2');
  resultsHeader.classList.add('results-header');
  resultsHeader.textContent = `Search Results for "${queryString}"`;
  const resultsData = document.createElement('div');

  const urlList = [];
  const publishedUrlList = [];

  const resultsList = document.createElement('div');
  resultsList.classList.add('results-list');
  results.forEach((item) => {
    const resultItem = createResultItem(item, highlightTerm);
    resultsList.append(resultItem);
    urlList.push(`${DA_CONSTANTS.previewUrl}${item.pagePath}`);
    if (getPublishStatus(item.publishStatus) === 'published') {
      publishedUrlList.push(`${DA_CONSTANTS.previewUrl}${item.pagePath}`);
    }
  });

  const searchSummary = document.createElement('span');
  searchSummary.classList.add('summary');
  searchSummary.textContent = `${results.length} found for "${queryString}"`;

  const searchTime = document.createElement('span');
  searchTime.classList.add('search-time');
  searchTime.textContent = `Search completed in ${duration.toFixed(2)} seconds`;

  const copyContainer = createTag('span', {
    id: 'copy-to-clipboard',
  });

  const copyPublishedButton = createTag('p', {
    class: 'button-container',
  });
  copyPublishedButton.textContent = 'Copy Published Result URLs To Clipboard';
  copyPublishedButton.addEventListener('click', () => {
    copyToClipboard(copyPublishedButton, publishedUrlList.join('\n'), 'Copied');
  });
  copyContainer.append(copyPublishedButton);

  const copyAllButton = createTag('p', {
    class: 'button-container',
  });
  copyAllButton.textContent = 'Copy All Results';
  copyAllButton.addEventListener('click', () => {
    copyToClipboard(copyAllButton, urlList.join('\n'), 'Copied');
  });
  copyContainer.append(copyAllButton);

  const bulkEditorButton = createTag('a', {
    class: 'button',
    href: 'https://da.live/apps/bulk',
    target: '_blank',
  }, 'Open Bulk Operations Tool');
  copyContainer.append(bulkEditorButton);

  resultsData.append(searchSummary, searchTime, copyContainer);

  resultsContainer.append(resultsHeader, resultsData, resultsList);
  document.body.append(resultsContainer);
}

function constructPageViewer() {
  const input = document.getElementById('page-path-input');
  const toggleBtn = document.getElementById('toggle-edit');
  const lockIcon = document.getElementById('icon-lock');

  let editable = false;

  function updateLockIcon() {
    if (editable) {
      // unlocked
      lockIcon.setAttribute('stroke', '#ff5000');
      lockIcon.innerHTML = `
        <path d="M16 11V7a4 4 0 1 0-8 0"></path>
        <rect x="5" y="11" width="14" height="10" rx="2" ry="2"></rect>
      `;
      toggleBtn.setAttribute('aria-label', 'Disable editing');
      toggleBtn.setAttribute('aria-pressed', 'true');
      toggleBtn.title = 'Disable editing';
    } else {
      // locked
      lockIcon.setAttribute('stroke', 'currentcolor');
      lockIcon.innerHTML = `
        <path d="M8 11V7a4 4 0 1 1 8 0v4"></path>
        <rect x="5" y="11" width="14" height="10" rx="2" ry="2"></rect>
      `;
      toggleBtn.setAttribute('aria-label', 'Enable editing');
      toggleBtn.setAttribute('aria-pressed', 'false');
      toggleBtn.title = 'Enable editing';
    }
  }

  toggleBtn.addEventListener('click', () => {
    editable = !editable;
    input.disabled = !editable;
    if (editable) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
    updateLockIcon();
  });

  // Optional: Enter toggles off editing if empty blur behavior
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      input.blur();
      editable = false;
      input.disabled = true;
      updateLockIcon();
    }
  });
}

function closeAdvancedSections() {
  document.querySelectorAll('.advanced-section.open').forEach((section) => {
    section.classList.remove('open');
    section.querySelectorAll('input[type="checkbox"]').forEach((box) => {
      box.checked = false;
    });
  });
}

function addActionEventListeners(queryObject) {
  const deleteRowButton = document.getElementById('deleteRow');
  const editRowsButton = document.getElementById('editRow');
  const editSection = document.getElementById('edit-section');
  const mergeRowsButton = document.getElementById('mergeRows');

  const addNewRowButton = document.getElementById('addNewRow');
  addNewRowButton.addEventListener('click', () => {
    closeAdvancedSections();
    document.getElementById('add-section').classList.add('open');
  });

  deleteRowButton.addEventListener('click', () => {
    closeAdvancedSections();
    const deleteSection = document.getElementById('delete-section');
    deleteSection.classList.add('open');
    if (queryObject.scope.property) {
      // if we know there is a property, set and disable the input
      deleteSection.querySelector('input').value = queryObject.scope.property;
      // deleteSection.querySelector('input').disabled = true;
    }
  });

  mergeRowsButton.addEventListener('click', () => {
    // need to hide any other sections
    closeAdvancedSections();
    document.getElementById('merge-section').classList.add('open');
  });

  editRowsButton.addEventListener('click', () => {
    closeAdvancedSections();
    editSection.classList.add('open');
  });
  const changeRowNameBox = document.querySelector('#changeRowName');
  changeRowNameBox?.addEventListener('click', () => {
    if (changeRowNameBox.checked) {
      editSection.querySelector('#newRowName').classList.add('open');
    } else {
      editSection.querySelector('#newRowName').classList.remove('open');
    }
  });
  const changeRowValueBox = document.querySelector('#changeRowValue');
  changeRowValueBox?.addEventListener('click', () => {
    if (changeRowValueBox.checked) {
      editSection.querySelector('.sub-section').classList.add('open');
    } else {
      editSection.querySelector('.sub-section').classList.remove('open');
    }
  });
}

function getStatus(publishStatus = {}) {
  if (publishStatus.live === 200) return 'Published';
  if (publishStatus.preview === 200) return 'Previewed';
  return 'Unpublished';
}

async function getPageMetadata(path, token) {
  const url = `https://admin.da.live/source${path}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const text = await response.text();
      const dom = new DOMParser().parseFromString(text, 'text/html');
      const metadataBlock = dom.querySelector('div.metadata');
      const metaObj = {};

      [...metadataBlock.children].forEach((row) => {
        const cells = row.querySelectorAll(':scope > div');
        const key = cells[0]?.textContent.trim().toLowerCase() || '';
        const value = cells[1]?.textContent.trim() || '';
        if (key) metaObj[key] = value;
      });
      return { success: true, data: metaObj };
    }
    const errorText = await response.text();
    return { success: false, status: response.status, error: errorText };
  } catch (e) {
    console.log(e);
    return { success: false, status: null, error: e };
  }
}

async function getLatestVersion(path, token) {
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
          const formattedList = getCurrentVersion(jsonResult);
          return { success: true, status: response.status, data: formattedList };
        } catch (jsonError) {
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
    return { success: false, status: null, error: e };
  }
}

async function enrichResults(arr, token) {
  const enriched = await Promise.all(
    arr.map(async (obj) => {
      try {
        const versionRes = await getLatestVersion(obj.path, token);
        obj.lastModifiedBy = versionRes?.data?.users[0]?.email;
        obj.lastModified = versionRes?.data?.date;

        const pageRes = await getPageMetadata(obj.path, token);
        const metadata = pageRes?.data;
        obj.title = metadata?.title;
        obj.description = metadata?.description;
        obj.tags = metadata?.tags;
      } catch (err) {
        console.error(`Error fetching for ${obj.path}:`, err);
      }
      return obj;
    }),
  );

  return enriched;
}

const fieldResolvers = {
  path: (obj) => obj.path ?? '',
  title: (obj) => obj.title ?? '',
  description: (obj) => obj.description ?? '',
  tags: (obj) => {
    if (Array.isArray(obj.tags)) {
      return obj.tags.join(';');
    }
    return obj.tags ?? '';
  },
  publishStatus: (obj) => getStatus(obj.publishStatus),
  lastPublished: (obj) => obj.publishStatus?.lastPublished ?? '',
  lastModified: (obj) => obj.lastModified ?? '',
  lastModifiedBy: (obj) => obj.lastModifiedBy ?? '',
};

async function convertResultsToCSV(token, headers) {
  const arr = window.searchResults;
  const detailedArray = await enrichResults(arr, token);

  const rows = detailedArray.map((obj) => headers.map((h) => {
    const value = fieldResolvers[h]?.(obj) ?? '';
    return JSON.stringify(value); // protects commas, quotes, etc.
  }).join(','));

  return [headers.join(','), ...rows].join('\n');
}

function getExportFields() {
  const checked = Array.from(
    document.querySelectorAll('#export-form input[type="checkbox"]:checked'),
  ).map((cb) => cb.name);
  return checked;
}

function addExportLoading(container, loadingText) {
  container.innerHTML = '';
  const loadingIcon = createTag('div', {
    class: 'loading-state',
  }, loadingText);
  container.append(loadingIcon);
}

async function exportToCSV(token) {
  const exportSection = document.querySelector('.export-options');
  const exportLoading = createTag('div', { class: 'export-loader' });
  exportSection.append(exportLoading);
  addExportLoading(exportLoading, 'Exporting...');
  const exportForm = document.getElementById('export-form');
  exportForm.classList.add('hidden');

  const fields = getExportFields();
  const csvContent = await convertResultsToCSV(token, fields);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'searchData.csv';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  exportForm.classList.remove('hidden');
  exportLoading.remove();
}

export {
  addActionEventListeners,
  addLoadingAction,
  addLoadingSearch,
  addCheckboxEventListeners,
  clearResults,
  closeAdvancedSections,
  constructPageViewer,
  exportToCSV,
  populateDropdowns,
  updateActionMessage,
  writeOutResults,
};
