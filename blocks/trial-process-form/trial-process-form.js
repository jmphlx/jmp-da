import { decorateBlock, loadBlock } from '../../scripts/aem.js';
import { getBlockConfig } from '../../scripts/jmp.js';
import { createTag } from '../../scripts/helper.js';

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

function buildHubspotForm(config) {
  const parent = createTag('div');
  const hubspotWrapper = createTag('div', {
    class: 'hubspot block',
  });
  const region = buildBlockRow('region', 'na1');
  const portalId = buildBlockRow('portalId', config.portalId);
  const formId = buildBlockRow('formId', config.formId);
  const salesforceCampaignId = buildBlockRow('salesforceCampaignId', config.salesforceCampaignId);
  const redirect = buildBlockRow('redirectTarget', '/en/sandbox/laurel/sprint-demos/thanks/thank-you-page');
  hubspotWrapper.append(region, portalId, formId, salesforceCampaignId, redirect);
  parent.append(hubspotWrapper);
  const preformComp = document.querySelector('.trial-process-form-wrapper');
  const section = preformComp.parentElement;
  section.append(parent);
  buildBlock(hubspotWrapper);
}

function buildPreform(block, config) {
  const preform = createTag('form');

  const roleDiv = createTag('div', {
    class: 'role-field',
  });

  const roleLabel = createTag('label', {
    for: 'role',
  }, 'Role');

  const roleSelect = createTag('select', {
    id: 'role',
    name: 'role',
    required: 'required',
  });

  const defaultOption = createTag('option', {
    value: '',
  }, 'Select a role');
  roleSelect.append(defaultOption);

  const studentOption = createTag('option', {
    value: 'Student',
  }, 'Student');
  roleSelect.append(studentOption);

  const academicOption = createTag('option', {
    value: 'Academic Educator or Researcher',
  }, 'Academic Educator or Researcher');
  roleSelect.append(academicOption);

  const professionalOption = createTag('option', {
    value: 'Professional',
  }, 'Professional');
  roleSelect.append(professionalOption);

  roleDiv.append(roleLabel, roleSelect);

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
    value: 'Next',
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
      console.log(config.studentMessage);
      messageDiv.innerHTML = config.studentMessage || '';
      preform.parentElement.appendChild(messageDiv);
      preform.classList.add('hidden');
    } else if (selectedRole === 'Academic Educator or Researcher' || selectedRole === 'Professional') {
      buildHubspotForm(config, Object.fromEntries(formData));
      preform.parentElement.classList.add('hidden');
    }
  });
  preform.append(roleDiv, academicMessageDiv, submitBtn);
  block.append(preform);
}

export default function decorate(block) {
  const config = getBlockConfig(block);
  block.textContent = '';
  buildPreform(block, config);
}
