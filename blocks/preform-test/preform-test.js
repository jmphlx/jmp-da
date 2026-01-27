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

function buildHubspotForm(config, formData) {
  const parent = createTag('div');
  const hubspotWrapper = createTag('div', {
    class: 'hubspot block',
  });
  let formID;
  let formTitle;
  if (formData.portalId === config.prodPortalID) {
    formID = config.prodFormID;
    formTitle = 'Production';
  } else {
    formID = config.sandboxFormID;
    formTitle = 'Main Sandbox';
  }
  const formHeadline = `<h3>${formTitle} Form</h3>
  <h4>Campaign ID: ${formData.salesforceCampaignId}</h4`;

  const headline = buildBlockRow('headline', formHeadline);
  const region = buildBlockRow('region', 'na1');
  const portalId = buildBlockRow('portalId', formData.portalId);
  const formId = buildBlockRow('formId', formID);
  const salesforceCampaignId = buildBlockRow('salesforceCampaignId', formData.salesforceCampaignId);
  const redirect = buildBlockRow('redirectTarget', '/en/sandbox/laurel/sprint-demos/thanks/thank-you-page');
  hubspotWrapper.append(headline, region, portalId, formId, salesforceCampaignId, redirect);
  parent.append(hubspotWrapper);
  const preformComp = document.querySelector('.preform-test-wrapper');
  const section = preformComp.parentElement;
  section.append(parent);
  buildBlock(hubspotWrapper);
}

function buildPreform(block, config) {
  const preform = createTag('form');
  const environmentDiv = createTag('div', {
    class: 'environment',
  });
  const prodDiv = createTag('div', {
    class: 'prod-env',
  });
  const prodEnv = createTag('input', {
    type: 'radio',
    id: 'prodId',
    name: 'portalId',
    value: config.prodPortalID,
    class: 'radio-option',
  });
  const prodLabel = createTag('label', {
    for: 'prodId',
  }, 'Production');
  prodDiv.append(prodLabel, prodEnv);

  const sandboxDiv = createTag('div', {
    class: 'sandbox-env',
  });
  const sandboxEnv = createTag('input', {
    type: 'radio',
    id: 'sandboxId',
    name: 'portalId',
    value: config.sandboxPortalID,
    class: 'radio-option',
    required: 'required',
  });
  const sandboxLabel = createTag('label', {
    for: 'sandboxId',
  }, 'Main Sandbox');
  sandboxDiv.append(sandboxLabel, sandboxEnv);

  environmentDiv.append(prodDiv, sandboxDiv);

  const salesforceDiv = createTag('div', {
    class: 'salesforce-fields',
  });

  const salesforceField = createTag('input', {
    id: 'salesforceCampaignId',
    name: 'salesforceCampaignId',
    required: 'required',
  });
  const salesforceLabel = createTag('label', {
    for: 'salesforceCampaignId',
  }, 'Salesforce Campaign ID');
  salesforceDiv.append(salesforceLabel, salesforceField);

  const submitBtn = createTag('input', {
    type: 'submit',
    value: 'Submit',
  });

  preform.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const formData = new FormData(preform);
    buildHubspotForm(config, Object.fromEntries(formData));
    preform.parentElement.classList.add('hidden');
  });
  preform.append(environmentDiv, salesforceDiv, submitBtn);
  block.append(preform);
}

export default function decorate(block) {
  const config = getBlockConfig(block);
  block.textContent = '';
  buildPreform(block, config);
}
