import { decorateBlock, loadBlock } from '../../scripts/aem.js';
import { createTag } from '../../scripts/helper.js';

async function buildBlock(block) {
  decorateBlock(block);
  return loadBlock(block);
}

function buildBlockRow(name, value) {
  const rowDiv = createTag('div');
  const rowName = createTag('div',{}, name);
  const rowValue = createTag('div', {}, value);
  rowDiv.append(rowName, rowValue);
  return rowDiv;
}

function buildHubspotForm(block, formData) {
  const parent = createTag('div');
  const hubspotWrapper = createTag('div', {
    class: 'hubspot block',
  });
  const contentWrapper = createTag('div');
  const region = buildBlockRow('region', 'na1');
  contentWrapper.append(region);
  console.log(contentWrapper);
  hubspotWrapper.append(contentWrapper);
  parent.append(hubspotWrapper);

  // hubspotWrapper.innerHTML = `
  //   <div>
  //     <div>
  //       <div>region</div>
  //       <div>na1</div>
  //     </div>
  //     <div>
  //       <div>portalId</div>
  //       <div>${formData.portalId}</div>
  //     </div>
  //     <div>
  //       <div>formId</div>
  //       <div>8491072f-9bcf-46a2-9b94-c37d4bb0ff48</div>
  //     </div>
  //     <div>
  //       <div>salesforceCampaignId</div>
  //       <div>${formData.salesforceCampaignId}</div>
  //     </div>
  //     <div>
  //       <div>redirectTarget</div>
  //       <div>/en/sandbox/laurel/sprint-demos/thanks/thank-you-page</div>
  //     </div>
  //   </div>
  // `;
  console.log(hubspotWrapper);
  console.log('predecorate');
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
  console.log(block);

  block.textContent = '';
  buildPreform(block);

}