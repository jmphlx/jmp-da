import { decorateBlock, loadBlock } from '../../scripts/aem.js';
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

function buildHubspotForm(block, formData) {
  const parent = createTag('div');
  const hubspotWrapper = createTag('div', {
    class: 'hubspot block',
  });
  const region = buildBlockRow('region', 'na1');
  const portalId = buildBlockRow('portalId', formData.portalId);
  const formId = buildBlockRow('formId', '8491072f-9bcf-46a2-9b94-c37d4bb0ff48');
  const salesforceCampaignId = buildBlockRow('salesforceCampaignId', formData.salesforceCampaignId);
  const redirect = buildBlockRow('redirectTarget', '/en/sandbox/laurel/sprint-demos/thanks/thank-you-page');
  hubspotWrapper.append(region, portalId, formId, salesforceCampaignId, redirect);
  parent.append(hubspotWrapper);
  const preformComp = document.querySelector('.preform-test-wrapper');
  const section = preformComp.parentElement;
  section.append(parent);
  buildBlock(hubspotWrapper);
}

function buildPreform(block) {
   const preform = createTag('form');
  const prodEnv = createTag('input', {
    'type': 'radio',
    'id': 'prodId',
    'name': 'portalId',
    'value': '20721161'
  });
  const prodLabel = createTag('label', {
    'for': 'prodId',
  }, 'Production');

    const sandboxEnv = createTag('input', {
    'type': 'radio',
    'id': 'sandboxId',
    'name': 'portalId',
    'value': '20721161'
  });
  const sandboxLabel = createTag('label', {
    'for': 'sandboxId',
  }, 'Sandbox');

  const salesforceField = createTag('input', {
    'id':'salesforceCampaignId',
    'name':'salesforceCampaignId',
    'value': '701Ki000000EazbIAC',
  });
  const salesforceLabel = createTag('label', {
    'for': 'salesforceCampaignId'
  }, 'Salesforce Campaign ID');

  const submitBtn = createTag('input', {
    'type': 'submit',
    'value': 'Submit',
  });

  preform.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const formData = new FormData(preform);
    buildHubspotForm(block, Object.fromEntries(formData));
  });
  preform.append(prodEnv, prodLabel, sandboxEnv, sandboxLabel, salesforceLabel, salesforceField, submitBtn);
  block.append(preform);
}

export default function decorate(block) {
  block.textContent = '';
  buildPreform(block);

}