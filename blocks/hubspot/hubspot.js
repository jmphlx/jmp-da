/*
 * Hubspot embed Block
 * Shows hubspot forms on a page
 */
/*  global hbspt  */

import { readBlockConfig } from "../../scripts/aem.js";

const embedHubspot = (config) => {
  // clean up hubspot url query paramaters
  const sfdcCampaignId = config['salesforce-campaign-id'];

  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = 'https://code.jquery.com/jquery-3.7.1.js';
  head.append(script);

  const scriptHubspot = document.createElement('script');
  scriptHubspot.setAttribute('type', 'text/javascript');
  scriptHubspot.src = 'https://js.hsforms.net/forms/embed/v2.js';

  // adds event listener to add embed code on load
  scriptHubspot.addEventListener('load', () => {
    hbspt.forms.create({
      region: config['region'],
      portalId: config['portal-id'],
      formId: config['form-id'],
      sfdcCampaignId,
      onFormReady($form) {
        

        var hiddenField2 = $form.find('input[name="last_action"]');
        var newValue2 = config['last-action']; // The value you want to append
        hiddenField2.val(newValue2).change(); 

        var hiddenField = $form.find('input[name="leadsource"]');
        var newValue = config['lead-source']; // The value you want to append
        hiddenField.val(newValue).change(); 

        const emailSFC = $form.find('input[name="salesforce_campaign_event_id"]');
        const newSFC = sfdcCampaignId;
        emailSFC.val(newSFC).change();
 }
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

  block.classList.add('form-is-loaded');
};

export default function decorate(block) {

  const config = readBlockConfig(block);

  console.log(config['last-action']);

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
