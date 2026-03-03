/*
 * Hubspot embed Block
 * Shows hubspot forms on a page
 */

import {
  getBlockConfig,
  getLanguage,
} from '../../scripts/jmp.js';

import { createTag } from '../../scripts/helper.js';

function getWarningMessage() {
  const warningDiv = createTag('div', {
    class: 'hbspt-load-error',
  });

  const warningMessage = 'It appears that your browser settings may be preventing '
    + 'our form from displaying. You may be able to resolve this by making adjustments '
    + 'to your browser settings. The links below provide information specific to the '
    + 'browsers where this is likely to be an issue:';

  const firefoxItem = createTag('li');
  firefoxItem.innerHTML = '<a href="https://support.mozilla.org/en-US/kb/manage-enhanced-tracking-protection-exceptions?as=u&utm_source=inproduct">Firefox</a>';
  const edgeItem = createTag('li');
  edgeItem.innerHTML = '<a href="https://support.microsoft.com/en-us/microsoft-edge/learn-about-tracking-prevention-in-microsoft-edge-5ac125e8-9b90-8d59-fa2c-7f2e9a44d869">Microsoft Edge</a>';
  const browserList = createTag('ul');
  browserList.append(firefoxItem, edgeItem);

  warningDiv.innerHTML = warningMessage;
  warningDiv.append(browserList);
  return warningDiv;
}

const embedHubspot = (block, config) => {
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

  scriptHubspot.addEventListener('error', () => {
    if (config.errorMessage) {
      const errorMessageDiv = createTag('div', { class: 'hbspt-load-error' });
      errorMessageDiv.append(config.errorMessage);
      block.append(errorMessageDiv);
    } else {
      block.append(getWarningMessage());
    }
  });

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
  embedHubspot(block, config);
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
