import { decorateBlock, loadBlock } from '../../scripts/aem.js';
import { getBlockConfig, getJsonFromUrl, getLanguage } from '../../scripts/jmp.js';
import { createTag } from '../../scripts/helper.js';

const translationsUrl = '/commons/trial-translations.json';

// Internal name of the hidden role field on the HubSpot form
const hubspotRoleFieldName = 'role';

const englishStrings = Object.freeze({
  Role: 'Role',
  'Select a role': 'Select a role',
  Student: 'Student',
  Professional: 'Professional',
  'Academic Educator or Researcher': 'Academic Educator or Researcher',
  Next: 'Next',
  'Please select a role': 'Please select a role',
});

/**
 * Fetches the translated strings for the current page language.
 * Falls back to English for any string that is missing.
 * @returns {object} translated strings keyed by English source text
 */
async function getTranslations() {
  const json = await getJsonFromUrl(translationsUrl);
  const langStrings = json?.[getLanguage()]?.data?.[0];
  return { ...englishStrings, ...langStrings };
}

async function buildBlock(block) {
  decorateBlock(block);
  return loadBlock(block);
}

function buildBlockRow(name, value) {
  const rowDiv = createTag('div');
  const rowName = createTag('div', {}, name);
  const rowValue = createTag('div', {}, value);
  rowDiv.append(rowName, rowValue);
  return rowDiv;
}

function buildHubspotForm(config, role) {
  const parent = createTag('div');
  const hubspotWrapper = createTag('div', {
    class: 'hubspot-form block',
  });
  const region = buildBlockRow('region', 'na1');
  const portalId = buildBlockRow('portalId', config.portalId);
  const formId = buildBlockRow('formId', config.formId);
  const salesforceCampaignId = buildBlockRow('salesforceCampaignId', config.salesforceCampaignId);
  const redirect = buildBlockRow('redirectTarget', '/en/sandbox/laurel/sprint-demos/thanks/thank-you-page');
  hubspotWrapper.append(region, portalId, formId, salesforceCampaignId, redirect);
  hubspotWrapper.dataset.roleField = hubspotRoleFieldName;
  hubspotWrapper.dataset.role = role;
  parent.append(hubspotWrapper);
  const preformComp = document.querySelector('.trial-process-form-wrapper');
  const section = preformComp.parentElement;
  section.append(parent);
  buildBlock(hubspotWrapper);
}

function buildPreform(block, config, t) {
  const preform = createTag('form');

  const roleDiv = createTag('div', {
    class: 'role-field',
  });

  const roleLabel = createTag('label', {
    for: 'role',
  }, t.Role);

  const roleSelect = createTag('select', {
    id: 'role',
    name: 'role',
    required: 'required',
  });

  const defaultOption = createTag('option', {
    value: '',
  }, t['Select a role']);
  roleSelect.append(defaultOption);

  const professionalOption = createTag('option', {
    value: 'Professional',
  }, t.Professional);
  roleSelect.append(professionalOption);

  const academicOption = createTag('option', {
    value: 'Academic Educator or Researcher',
  }, t['Academic Educator or Researcher']);
  roleSelect.append(academicOption);

  const studentOption = createTag('option', {
    value: 'Student',
  }, t.Student);
  roleSelect.append(studentOption);

  roleDiv.append(roleLabel, roleSelect);

  // Replace the browser's default required-field message with the translated one
  const updateRoleValidity = () => {
    roleSelect.setCustomValidity(roleSelect.value ? '' : t['Please select a role']);
  };
  updateRoleValidity();
  roleSelect.addEventListener('change', updateRoleValidity);

  const academicMessageDiv = createTag('div', {
    class: 'academic-message hidden',
  });
  academicMessageDiv.innerHTML = config.academicMessage || '';

  roleSelect.addEventListener('change', () => {
    const isAcademic = roleSelect.value === 'Academic Educator or Researcher';
    academicMessageDiv.classList.toggle('hidden', !isAcademic);
  });

  const submitBtn = createTag('input', {
    type: 'submit',
    value: t.Next,
  });

  preform.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const formData = new FormData(preform);
    const selectedRole = formData.get('role');

    if (selectedRole === 'Student') {
      const messageDiv = createTag('div', {
        class: 'student-message',
      });
      messageDiv.innerHTML = config.studentMessage || '';
      preform.parentElement.appendChild(messageDiv);
      preform.classList.add('hidden');
    } else if (selectedRole === 'Academic Educator or Researcher' || selectedRole === 'Professional') {
      buildHubspotForm(config, selectedRole);
      preform.parentElement.classList.add('hidden');
    }
  });
  preform.append(roleDiv, academicMessageDiv, submitBtn);
  block.append(preform);
}

export default async function decorate(block) {
  const config = getBlockConfig(block);
  const translations = await getTranslations();
  block.textContent = '';
  buildPreform(block, config, translations);
}
