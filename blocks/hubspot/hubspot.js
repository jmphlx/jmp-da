/*
 * Hubspot embed Block
 * Shows hubspot forms on a page
 */

import {
  getBlockConfig,
  getLanguage,
} from '../../scripts/jmp.js';

import { createTag } from '../../scripts/helper.js';

const embedHubspot = (config) => {
  // clean up hubspot url query paramaters
  const sfdcCampaignId = config.salesforceCampaignId;

  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = 'https://code.jquery.com/jquery-3.7.1.js';
  head.append(script);

  const scriptHubspot = document.createElement('script');
  scriptHubspot.setAttribute('type', 'text/javascript');
  scriptHubspot.src = 'https://js.hsforms.net/forms/embed/v2.js';

  let redirect = config.redirectTarget;
  const regex = /^(\/)*\.\//i;
  if (redirect.match(regex)) {
    redirect = redirect.replace(regex, `/${getLanguage()}/`);
  }

  // adds event listener to add embed code on load
  scriptHubspot.addEventListener('load', () => {
    const hubspotBlock = document.querySelector('[data-block-name="hubspot"]');
    const scriptCreateHubspotForm = document.createElement('script');
    scriptCreateHubspotForm.textContent = `
      hbspt.forms.create({
        region: '${config.region}',
        portalId: '${config.portalId}',
        formId: '${config.formId}',
        redirectUrl: '${redirect}',
        sfdcCampaignId: '${sfdcCampaignId}',
        onFormReady($form) {
          const hiddenField2 = $form.find('input[name="last_action__c"]');
          const newValue2 = "${config.lastAction}"; // The value you want to append
          hiddenField2.val(newValue2).change();
  
          const hiddenField = $form.find('input[name="leadsource"]');
          const newValue = "${config.leadSource}"; // The value you want to append
          hiddenField.val(newValue).change();
  
          const emailSFC = $form.find('input[name="salesforce_campaign_event_id"]');
          const newSFC = "${sfdcCampaignId}";
          emailSFC.val(newSFC).change();

          document.querySelector("[type='submit']").addEventListener("click", function(event) {
            const checkboxes = document.querySelectorAll('.legal-consent-container .hs-dependent-field');
            let flag = false;
            if (checkboxes?.length > 1) {
              for(let i=0; i < checkboxes.length; i++) {
                if (checkboxes[i].querySelector('input')?.checked) {
                  flag = true;
                  break;
                }
              }
              const msg = $("div.hs-richtext:nth-last-child(2)");
              if (!flag) {
                event.preventDefault();
                msg.show();
              } else {
                msg.hide();
              }
            }
          });
        },
      });`;
    hubspotBlock.append(scriptCreateHubspotForm);
  });

  document.head.append(scriptHubspot);
  return null;
};

const loadEmbed = (block, config) => {
  if (block.classList.contains('form-is-loaded')) {
    return;
  }

  embedHubspot(config);
  block.classList = 'block embed embed-hubspot';
  if (config.headline) {
    const headlineElement = typeof config.headline === 'string'
      ? createTag('p', { }, config.headline) : config.headline;
    const wrapDiv = createTag('div', { class: 'headline' }, headlineElement);
    block.prepend(wrapDiv);
  }

  block.classList.add('form-is-loaded');
};

export default function decorate(block) {
  const config = getBlockConfig(block);

  block.textContent = '';

  const observer = new IntersectionObserver((entries) => {
    // calling embed function
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadEmbed(block, config);
    }
  });
  observer.observe(block);
}
