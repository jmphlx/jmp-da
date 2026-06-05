/* eslint no-undef: 0 */
/*
 * Hubspot embed Block
 * Shows hubspot forms on a page
 */
import {
  getBlockConfig,
} from '../../scripts/jmp.js';

import { createTag } from '../../scripts/helper.js';

/**
 * Display an appropriate message if the hubspot script is blocked.
 */
function getWarningMessage() {
  const warningDiv = createTag('div', {
    class: 'hbspt-load-error',
  });

  const warningMessage = createTag('p');
  warningMessage.innerHTML = 'Your browser’s settings may be preventing this form from loading. '
    + 'To access the form, please adjust your browser settings or try a different browser.';
  const contactUs = createTag('p');
  contactUs.innerHTML = 'Still having issues? Contact us at <a href="mailto:info@jmp.com">info@jmp.com</a>.';
  warningDiv.append(warningMessage, contactUs);
  return warningDiv;
}

const embedHubspot = (block, config) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = 'https://js.hsforms.net/forms/embed/developer/20721161.js';
  script.defer = true;
  script.addEventListener('error', () => {
    if (config.errorMessage) {
      const errorMessageDiv = createTag('div', { class: 'hbspt-load-error' });
      errorMessageDiv.append(config.errorMessage);
      block.append(errorMessageDiv);
    } else {
      block.append(getWarningMessage());
    }
  });
  head.append(script);

  // Watch for HubSpot's style injection, then load our CSS after it
  const observer = new MutationObserver(() => {
    const hsStyle = document.querySelector('style[data-hsfc-id="BaseStyle"]');
    if (hsStyle) {
      observer.disconnect();
      // Load the CSS file after HubSpot's styles are injected
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `/blocks/hubspot-form/hubspot-form.css?v=${Date.now()}`;
      document.head.appendChild(link);
    }
  });

  observer.observe(document.head, { childList: true });

  const hubspotDiv = createTag('div', {
    class: 'hs-form-html',
    'data-region': 'na1',
    'data-form-id': `${config.formId}`,
    'data-portal-id': `${config.portalId}`,
  });

  block.append(hubspotDiv);

  window.addEventListener('hs-form-event:on-ready', (event) => {
    HubSpotFormsV4.getFormFromEvent(event).setFieldValue('0-1/last_action__c', config.lastAction);
    HubSpotFormsV4.getFormFromEvent(event).setFieldValue('0-1/leadsource', config.leadSource);
    HubSpotFormsV4.getFormFromEvent(event).setFieldValue('0-1/salesforce_campaign_event_id_event_registration_only', config.salesforceCampaignId);
  });

  return null;
};

const loadEmbed = (block, config) => {
  embedHubspot(block, config);
  block.classList = 'block embed embed-hubspot hubspot-form-builder';
  if (config.headline) {
    const headlineElement = typeof config.headline === 'string'
      ? createTag('p', { }, config.headline) : config.headline;
    const wrapDiv = createTag('div', { class: 'headline' }, headlineElement);
    block.prepend(wrapDiv);
  }
};

export default function decorate(block) {
  const config = getBlockConfig(block);

  block.textContent = '';
  loadEmbed(block, config);
}
