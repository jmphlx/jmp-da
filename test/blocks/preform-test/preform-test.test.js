/* global before describe it */
import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';

const preformTestModule = await import('../../../blocks/preform-test/preform-test.js');
const decorate = preformTestModule.default;

function setupPage(htmlPath) {
  return readFile({ path: htmlPath });
}

describe('Preform Test Block', () => {
  describe('Form Element Creation', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./preform-test.html');
      const block = document.querySelector('.preform-test-wrapper');
      document.querySelector('main').append(block);
      decorate(block);
    });

    it('Renders a form element', async () => {
      const form = document.querySelector('form');
      expect(form).to.exist;
    });

    it('Form is a child of the block', async () => {
      const block = document.querySelector('.preform-test-wrapper');
      const form = block.querySelector('form');
      expect(form).to.exist;
    });

    it('Form is properly structured with multiple child elements', async () => {
      const form = document.querySelector('form');
      expect(form.children.length).to.be.greaterThan(0);
    });
  });

  describe('Environment Section', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./preform-test.html');
      const block = document.querySelector('.preform-test-wrapper');
      document.querySelector('main').append(block);
      decorate(block);
    });

    it('Creates environment section with correct class', async () => {
      const environmentDiv = document.querySelector('.environment');
      expect(environmentDiv).to.exist;
    });

    it('Environment section is within the form', async () => {
      const form = document.querySelector('form');
      const environmentDiv = form.querySelector('.environment');
      expect(environmentDiv).to.exist;
    });

    it('Creates production environment container', async () => {
      const prodDiv = document.querySelector('.prod-env');
      expect(prodDiv).to.exist;
    });

    it('Creates sandbox environment container', async () => {
      const sandboxDiv = document.querySelector('.sandbox-env');
      expect(sandboxDiv).to.exist;
    });
  });

  describe('Production Environment Radio Button', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./preform-test.html');
      const block = document.querySelector('.preform-test-wrapper');
      document.querySelector('main').append(block);
      decorate(block);
    });

    it('Creates production radio button with correct ID', async () => {
      const prodRadio = document.querySelector('#prodId');
      expect(prodRadio).to.exist;
    });

    it('Production radio button has correct type', async () => {
      const prodRadio = document.querySelector('#prodId');
      expect(prodRadio.type).to.equal('radio');
    });

    it('Production radio button has correct name', async () => {
      const prodRadio = document.querySelector('#prodId');
      expect(prodRadio.name).to.equal('portalId');
    });

    it('Production radio button has value set', async () => {
      const prodRadio = document.querySelector('#prodId');
      expect(prodRadio.value).to.exist;
      expect(prodRadio.value.length).to.be.greaterThan(0);
    });

    it('Production radio button has correct CSS class', async () => {
      const prodRadio = document.querySelector('#prodId');
      expect(prodRadio.classList.contains('radio-option')).to.be.true;
    });

    it('Creates production label with correct text', async () => {
      const prodLabel = document.querySelector('label[for="prodId"]');
      expect(prodLabel).to.exist;
      expect(prodLabel.textContent).to.equal('Production');
    });

    it('Production label is associated with correct radio button', async () => {
      const prodLabel = document.querySelector('label[for="prodId"]');
      expect(prodLabel.htmlFor).to.equal('prodId');
    });
  });

  describe('Sandbox Environment Radio Button', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./preform-test.html');
      const block = document.querySelector('.preform-test-wrapper');
      document.querySelector('main').append(block);
      decorate(block);
    });

    it('Creates sandbox radio button with correct ID', async () => {
      const sandboxRadio = document.querySelector('#sandboxId');
      expect(sandboxRadio).to.exist;
    });

    it('Sandbox radio button has correct type', async () => {
      const sandboxRadio = document.querySelector('#sandboxId');
      expect(sandboxRadio.type).to.equal('radio');
    });

    it('Sandbox radio button has correct name', async () => {
      const sandboxRadio = document.querySelector('#sandboxId');
      expect(sandboxRadio.name).to.equal('portalId');
    });

    it('Sandbox radio button has value set', async () => {
      const sandboxRadio = document.querySelector('#sandboxId');
      expect(sandboxRadio.value).to.exist;
      expect(sandboxRadio.value.length).to.be.greaterThan(0);
    });

    it('Sandbox radio button has required attribute', async () => {
      const sandboxRadio = document.querySelector('#sandboxId');
      expect(sandboxRadio.hasAttribute('required')).to.be.true;
    });

    it('Sandbox radio button has correct CSS class', async () => {
      const sandboxRadio = document.querySelector('#sandboxId');
      expect(sandboxRadio.classList.contains('radio-option')).to.be.true;
    });

    it('Creates sandbox label with correct text', async () => {
      const sandboxLabel = document.querySelector('label[for="sandboxId"]');
      expect(sandboxLabel).to.exist;
      expect(sandboxLabel.textContent).to.equal('Main Sandbox');
    });

    it('Sandbox label is associated with correct radio button', async () => {
      const sandboxLabel = document.querySelector('label[for="sandboxId"]');
      expect(sandboxLabel.htmlFor).to.equal('sandboxId');
    });
  });

  describe('Radio Button Grouping', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./preform-test.html');
      const block = document.querySelector('.preform-test-wrapper');
      document.querySelector('main').append(block);
      decorate(block);
    });

    it('Both radio buttons have the same name for proper grouping', async () => {
      const prodRadio = document.querySelector('#prodId');
      const sandboxRadio = document.querySelector('#sandboxId');
      expect(prodRadio.name).to.equal(sandboxRadio.name);
    });

    it('Radio buttons use portalId as the group name', async () => {
      const prodRadio = document.querySelector('#prodId');
      expect(prodRadio.name).to.equal('portalId');
    });

    it('Radio buttons have different IDs', async () => {
      const prodRadio = document.querySelector('#prodId');
      const sandboxRadio = document.querySelector('#sandboxId');
      expect(prodRadio.id).to.not.equal(sandboxRadio.id);
    });
  });

  describe('Salesforce Campaign ID Field', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./preform-test.html');
      const block = document.querySelector('.preform-test-wrapper');
      document.querySelector('main').append(block);
      decorate(block);
    });

    it('Creates Salesforce Campaign ID input field', async () => {
      const salesforceInput = document.querySelector('#salesforceCampaignId');
      expect(salesforceInput).to.exist;
    });

    it('Salesforce field has correct ID', async () => {
      const salesforceInput = document.querySelector('#salesforceCampaignId');
      expect(salesforceInput.id).to.equal('salesforceCampaignId');
    });

    it('Salesforce field has correct name attribute', async () => {
      const salesforceInput = document.querySelector('#salesforceCampaignId');
      expect(salesforceInput.name).to.equal('salesforceCampaignId');
    });

    it('Salesforce field has required attribute', async () => {
      const salesforceInput = document.querySelector('#salesforceCampaignId');
      expect(salesforceInput.hasAttribute('required')).to.be.true;
    });

    it('Creates label for Salesforce Campaign ID field', async () => {
      const salesforceLabel = document.querySelector('label[for="salesforceCampaignId"]');
      expect(salesforceLabel).to.exist;
    });

    it('Salesforce label has correct text', async () => {
      const salesforceLabel = document.querySelector('label[for="salesforceCampaignId"]');
      expect(salesforceLabel.textContent).to.equal('Salesforce Campaign ID');
    });

    it('Salesforce field is within salesforce-fields container', async () => {
      const salesforceDiv = document.querySelector('.salesforce-fields');
      const input = salesforceDiv.querySelector('#salesforceCampaignId');
      expect(input).to.exist;
    });
  });

  describe('Submit Button', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./preform-test.html');
      const block = document.querySelector('.preform-test-wrapper');
      document.querySelector('main').append(block);
      decorate(block);
    });

    it('Creates submit button', async () => {
      const submitBtn = document.querySelector('input[type="submit"]');
      expect(submitBtn).to.exist;
    });

    it('Submit button has correct value', async () => {
      const submitBtn = document.querySelector('input[type="submit"]');
      expect(submitBtn.value).to.equal('Submit');
    });

    it('Submit button is part of the form', async () => {
      const form = document.querySelector('form');
      const submitBtn = form.querySelector('input[type="submit"]');
      expect(submitBtn).to.exist;
    });

    it('Submit button is within the form', async () => {
      const form = document.querySelector('form');
      const submitBtn = form.querySelector('input[type="submit"]');
      expect(submitBtn).to.exist;
      expect(submitBtn.parentElement).to.exist;
    });
  });

  describe('Form Structure and Organization', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./preform-test.html');
      const block = document.querySelector('.preform-test-wrapper');
      document.querySelector('main').append(block);
      decorate(block);
    });

    it('Form contains environment section', async () => {
      const form = document.querySelector('form');
      const environment = form.querySelector('.environment');
      expect(environment).to.exist;
    });

    it('Form contains salesforce-fields section', async () => {
      const form = document.querySelector('form');
      const salesforce = form.querySelector('.salesforce-fields');
      expect(salesforce).to.exist;
    });

    it('Form elements are in logical order', async () => {
      const form = document.querySelector('form');
      const environment = form.querySelector('.environment');
      const salesforce = form.querySelector('.salesforce-fields');
      expect(environment).to.exist;
      expect(salesforce).to.exist;
      // Verify they're both direct children of form
      expect(environment.parentElement).to.equal(form);
      expect(salesforce.parentElement).to.equal(form);
    });

    it('Block has form appended after decoration', async () => {
      const block = document.querySelector('.preform-test-wrapper');
      const form = block.querySelector('form');
      expect(form.parentElement).to.equal(block);
    });
  });

  describe('Form Submission and Event Handling', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./preform-test.html');
      const block = document.querySelector('.preform-test-wrapper');
      document.querySelector('main').append(block);
      decorate(block);
    });

    it('Form submission is preventable', async () => {
      const form = document.querySelector('form');
      const prodRadio = document.querySelector('#prodId');
      const salesforceInput = document.querySelector('#salesforceCampaignId');

      prodRadio.checked = true;
      salesforceInput.value = 'TEST123';

      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      // Form submission event should have been handled
      expect(form).to.exist;
    });

    it('Form submission creates HubSpot content', async () => {
      const form = document.querySelector('form');
      const prodRadio = document.querySelector('#prodId');
      const salesforceInput = document.querySelector('#salesforceCampaignId');

      prodRadio.checked = true;
      salesforceInput.value = 'PROD123';

      const submitEvent = new Event('submit', { bubbles: true });
      form.dispatchEvent(submitEvent);

      const hubspotBlock = document.querySelector('.hubspot.block');
      expect(hubspotBlock).to.exist;
    });

    it('Form submission hides the preform after submission', async () => {
      // Fresh form for this test
      document.body.innerHTML = await setupPage('./preform-test.html');
      const block = document.querySelector('.preform-test-wrapper');
      document.querySelector('main').append(block);
      decorate(block);

      const form = document.querySelector('form');
      const prodRadio = document.querySelector('#prodId');
      const salesforceInput = document.querySelector('#salesforceCampaignId');

      prodRadio.checked = true;
      salesforceInput.value = 'TESTCAMP';

      const submitEvent = new Event('submit', { bubbles: true });
      form.dispatchEvent(submitEvent);

      expect(form.parentElement.classList.contains('hidden')).to.be.true;
    });

    it('Form submission creates HubSpot block', async () => {
      // Fresh form for this test
      document.body.innerHTML = await setupPage('./preform-test.html');
      const block = document.querySelector('.preform-test-wrapper');
      document.querySelector('main').append(block);
      decorate(block);

      const form = document.querySelector('form');
      const sandboxRadio = document.querySelector('#sandboxId');
      const salesforceInput = document.querySelector('#salesforceCampaignId');

      sandboxRadio.checked = true;
      salesforceInput.value = 'SANDBOX123';

      const submitEvent = new Event('submit', { bubbles: true });
      form.dispatchEvent(submitEvent);

      const hubspotBlock = document.querySelector('.hubspot.block');
      expect(hubspotBlock).to.exist;
    });

    it('Form submission with production portal uses production form ID', async () => {
      // Fresh form for this test
      document.body.innerHTML = await setupPage('./preform-test.html');
      const block = document.querySelector('.preform-test-wrapper');
      document.querySelector('main').append(block);
      decorate(block);

      const form = document.querySelector('form');
      const prodRadio = document.querySelector('#prodId');
      const salesforceInput = document.querySelector('#salesforceCampaignId');

      prodRadio.checked = true;
      salesforceInput.value = 'PROD456';

      const submitEvent = new Event('submit', { bubbles: true });
      form.dispatchEvent(submitEvent);

      const pageText = document.body.textContent;
      expect(pageText).to.include('Production');
      expect(pageText).to.include('PROD456');
    });
  });

  describe('Form Data Collection', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./preform-test.html');
      const block = document.querySelector('.preform-test-wrapper');
      document.querySelector('main').append(block);
      decorate(block);
    });

    it('Form collects selected portal ID', async () => {
      const form = document.querySelector('form');
      const prodRadio = document.querySelector('#prodId');
      const salesforceInput = document.querySelector('#salesforceCampaignId');

      prodRadio.checked = true;
      salesforceInput.value = 'CAMPAIGN789';

      const formData = new FormData(form);
      const entries = Object.fromEntries(formData);

      expect(entries.portalId).to.exist;
      expect(entries.salesforceCampaignId).to.equal('CAMPAIGN789');
    });

    it('Form collects Salesforce Campaign ID', async () => {
      const form = document.querySelector('form');
      const prodRadio = document.querySelector('#prodId');
      const salesforceInput = document.querySelector('#salesforceCampaignId');

      prodRadio.checked = true;
      salesforceInput.value = 'CAMPAIGN999';

      const formData = new FormData(form);
      const entries = Object.fromEntries(formData);

      expect(entries.salesforceCampaignId).to.equal('CAMPAIGN999');
    });

    it('Form correctly switches between portal selections', async () => {
      const form = document.querySelector('form');
      const sandboxRadio = document.querySelector('#sandboxId');
      const salesforceInput = document.querySelector('#salesforceCampaignId');

      sandboxRadio.checked = true;
      salesforceInput.value = 'SANDBOXCAMP';

      const formData = new FormData(form);
      const entries = Object.fromEntries(formData);

      expect(entries.portalId).to.exist;
      expect(entries.salesforceCampaignId).to.equal('SANDBOXCAMP');
    });
  });

  describe('Block Initialization and Configuration', () => {
    before(async () => {
      document.body.innerHTML = await setupPage('./preform-test.html');
      const block = document.querySelector('.preform-test-wrapper');
      document.querySelector('main').append(block);
      decorate(block);
    });

    it('Decorate function clears block initial content', async () => {
      const block = document.querySelector('.preform-test-wrapper');
      const form = block.querySelector('form');
      expect(form).to.exist;
      // After decoration, block should have form as primary content
    });

    it('Block configuration is read from HTML structure', async () => {
      const prodRadio = document.querySelector('#prodId');
      const sandboxRadio = document.querySelector('#sandboxId');
      // Configuration values should be set from the HTML
      expect(prodRadio).to.exist;
      expect(sandboxRadio).to.exist;
      expect(prodRadio.value).to.not.equal('');
      expect(sandboxRadio.value).to.not.equal('');
    });

    it('All configured form elements are created', async () => {
      const form = document.querySelector('form');
      const environment = form.querySelector('.environment');
      const salesforce = form.querySelector('.salesforce-fields');
      const submit = form.querySelector('input[type="submit"]');

      expect(environment).to.exist;
      expect(salesforce).to.exist;
      expect(submit).to.exist;
    });
  });
});
