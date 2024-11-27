/*
 * Hubspot embed Block
 * Shows hubspot forms on a page
 */
/*  global hbspt  */

import {
  getBlockConfig,
  getLanguage,
} from '../../scripts/jmp.js';

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
    hbspt.forms.create({
      region: config.region,
      portalId: config.portalId,
      formId: config.formId,
      redirectUrl: redirect,
      sfdcCampaignId,
      onFormReady($form) {
        const hiddenField2 = $form.find('input[name="last_action"]');
        const newValue2 = config.lastAction; // The value you want to append
        hiddenField2.val(newValue2).change();

        const hiddenField = $form.find('input[name="leadsource"]');
        const newValue = config.leadSource; // The value you want to append
        hiddenField.val(newValue).change();

        const emailSFC = $form.find('input[name="salesforce_campaign_event_id"]');
        const newSFC = sfdcCampaignId;
        emailSFC.val(newSFC).change();
      },
      // eslint-disable-next-line no-unused-vars, no-shadow
      onFormSubmitted(redirect, $form) {},
    });
  });

  document.head.append(scriptHubspot);

  const embedHTML = `
  <script>
    hbspt.forms.create({});
  </script>
`;
  return embedHTML;
};

const loadEmbed = (block, config) => {
  if (block.classList.contains('form-is-loaded')) {
    return;
  }

  block.innerHTML = embedHubspot(config);
  block.classList = 'block embed embed-hubspot';
  if (config.headline) {
    block.prepend(config.headline);
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
