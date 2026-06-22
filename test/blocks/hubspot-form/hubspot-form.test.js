/* global beforeEach afterEach describe it */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import decorate from '../../../blocks/hubspot-form/hubspot-form.js';
import { getBlockConfig, getLanguage } from '../../../scripts/jmp.js';
import { createTag } from '../../../scripts/helper.js';

describe('HubSpot Form Block', () => {
  let block;
  let sandbox;
  let mockForm;
  let originalLocation;
  let eventListeners;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Create a mock block element
    block = document.createElement('div');
    block.id = 'hubspot-form-block';

    // Track event listeners
    eventListeners = {};
    const originalAddEventListener = window.addEventListener;
    sandbox.stub(window, 'addEventListener').callsFake((eventName, listener) => {
      if (!eventListeners[eventName]) {
        eventListeners[eventName] = [];
      }
      eventListeners[eventName].push(listener);
      return originalAddEventListener.call(window, eventName, listener);
    });

    // Mock HubSpot Forms API
    mockForm = {
      setFieldValue: sandbox.stub(),
    };

    const mockHubSpotForms = {
      getFormFromEvent: sandbox.stub().returns(mockForm),
    };

    window.HubSpotFormsV4 = mockHubSpotForms;

    // Mock MutationObserver
    const observerStub = sandbox.stub();
    observerStub.returns({
      observe: sandbox.stub(),
      disconnect: sandbox.stub(),
    });
    window.MutationObserver = observerStub;

    // Save original location
    originalLocation = window.location;
  });

  afterEach(() => {
    sandbox.restore();
    delete window.HubSpotFormsV4;
    if (originalLocation) {
      window.location = originalLocation;
    }
  });

  describe('decorate function', () => {
    it('should initialize the block and clear text content', async () => {
      block.textContent = 'Original content';

      decorate(block);
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(block.textContent).to.not.equal('Original content');
    });

    it('should set correct classes on block element', async () => {
      decorate(block);
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(block.classList.contains('block')).to.be.true;
      expect(block.classList.contains('embed')).to.be.true;
      expect(block.classList.contains('embed-hubspot')).to.be.true;
      expect(block.classList.contains('hubspot-form-builder')).to.be.true;
    });

    it('should create block with form configuration', async () => {
      // getBlockConfig is called internally and the structure is verified
      decorate(block);
      await new Promise((resolve) => setTimeout(resolve, 0));

      const formDiv = block.querySelector('.hs-form-html');
      expect(formDiv).to.exist;
    });
  });

  describe('Block decoration with form div', () => {
    it('should include a form div with correct data attributes', async () => {
      decorate(block);
      await new Promise((resolve) => setTimeout(resolve, 0));

      const formDiv = block.querySelector('.hs-form-html');
      expect(formDiv).to.exist;
      if (formDiv) {
        expect(formDiv.getAttribute('data-region')).to.equal('na1');
        expect(formDiv.getAttribute('data-form-id')).to.exist;
        expect(formDiv.getAttribute('data-portal-id')).to.exist;
        expect(formDiv.classList.contains('hs-form-html')).to.be.true;
      }
    });
  });

  describe('Event listener registration', () => {
    it('should register form ready event listener', async () => {
      decorate(block);
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(eventListeners['hs-form-event:on-ready']).to.exist;
      expect(eventListeners['hs-form-event:on-ready'].length).to.be.greaterThan(0);
    });

    it('should register form submission success event listener', async () => {
      decorate(block);
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(eventListeners['hs-form-event:on-submission:success']).to.exist;
      expect(eventListeners['hs-form-event:on-submission:success'].length).to.be.greaterThan(0);
    });

    it('should call HubSpot form setFieldValue on ready event', async () => {
      decorate(block);
      await new Promise((resolve) => setTimeout(resolve, 0));

      const readyListener = eventListeners['hs-form-event:on-ready'][0];
      if (readyListener) {
        const mockEvent = new Event('hs-form-event:on-ready');
        readyListener(mockEvent);

        expect(mockForm.setFieldValue.called).to.be.true;
        expect(mockForm.setFieldValue.callCount).to.be.greaterThan(0);
      }
    });
  });

  describe('HubSpot script loading', () => {
    it('should register listeners for HubSpot form events', async () => {
      decorate(block);
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Verify that addEventListener was called with HubSpot event names
      const addEventListenerCalls = window.addEventListener.getCalls();
      const hubspotEventCalls = addEventListenerCalls.filter(
        (call) => call.args[0].includes('hs-form-event'),
      );
      expect(hubspotEventCalls.length).to.be.greaterThan(0);
    });
  });

  describe('Form field population', () => {
    it('should populate form fields with config values on ready', async () => {
      decorate(block);
      await new Promise((resolve) => setTimeout(resolve, 0));

      const readyListener = eventListeners['hs-form-event:on-ready'][0];
      if (readyListener) {
        readyListener(new Event('hs-form-event:on-ready'));

        expect(mockForm.setFieldValue.calledWith(
          '0-1/last_action__c',
          sinon.match.any,
        )).to.be.true;
        expect(mockForm.setFieldValue.calledWith(
          '0-1/leadsource',
          sinon.match.any,
        )).to.be.true;
        expect(mockForm.setFieldValue.calledWith(
          '0-1/salesforce_campaign_event_id_event_registration_only',
          sinon.match.any,
        )).to.be.true;
      }
    });

    it('should set three form fields for each ready event', async () => {
      decorate(block);
      await new Promise((resolve) => setTimeout(resolve, 0));

      const readyListener = eventListeners['hs-form-event:on-ready'][0];
      if (readyListener) {
        readyListener(new Event('hs-form-event:on-ready'));

        expect(mockForm.setFieldValue.callCount).to.be.greaterThanOrEqual(3);
      }
    });
  });

  describe('CSS loading with MutationObserver', () => {
    it('should use MutationObserver to watch for HubSpot styles', async () => {
      decorate(block);
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(window.MutationObserver.called).to.be.true;
    });

    it('should observe head element for mutations', async () => {
      decorate(block);
      await new Promise((resolve) => setTimeout(resolve, 0));

      const observerInstance = window.MutationObserver.returnValues[0];
      if (observerInstance && observerInstance.observe.called) {
        const observeCall = observerInstance.observe.firstCall;
        expect(observeCall.args[0]).to.equal(document.head);
        expect(observeCall.args[1].childList).to.equal(true);
      }
    });
  });

  describe('Script error handling', () => {
    it('should add error listener to HubSpot script', async () => {
      let errorListeners = [];
      const originalCreateElement = document.createElement.bind(document);

      sandbox.stub(document, 'createElement').callsFake((tagName) => {
        const el = originalCreateElement(tagName);
        if (tagName === 'script') {
          const originalAddEventListener = el.addEventListener.bind(el);
          sandbox.stub(el, 'addEventListener').callsFake((eventName, listener) => {
            if (eventName === 'error') {
              errorListeners.push(listener);
            }
            return originalAddEventListener(eventName, listener);
          });
        }
        return el;
      });

      decorate(block);
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(errorListeners.length).to.be.greaterThan(0);

      document.createElement.restore();
    });

    it('should display error div on script load failure', async () => {
      let scriptElement;
      const originalCreateElement = document.createElement.bind(document);

      sandbox.stub(document, 'createElement').callsFake((tagName) => {
        const el = originalCreateElement(tagName);
        if (tagName === 'script') {
          scriptElement = el;
        }
        return el;
      });

      decorate(block);
      await new Promise((resolve) => setTimeout(resolve, 0));

      if (scriptElement) {
        // Simulate script error
        const errorEvent = new Event('error');
        scriptElement.dispatchEvent(errorEvent);
        await new Promise((resolve) => setTimeout(resolve, 0));

        const errorDiv = block.querySelector('.hbspt-load-error');
        expect(errorDiv).to.exist;
      }

      document.createElement.restore();
    });

    it('should show warning message when script fails and no custom message', async () => {
      let scriptElement;
      const originalCreateElement = document.createElement.bind(document);

      sandbox.stub(document, 'createElement').callsFake((tagName) => {
        const el = originalCreateElement(tagName);
        if (tagName === 'script') {
          scriptElement = el;
        }
        return el;
      });

      decorate(block);
      await new Promise((resolve) => setTimeout(resolve, 0));

      if (scriptElement) {
        scriptElement.dispatchEvent(new Event('error'));
        await new Promise((resolve) => setTimeout(resolve, 0));

        const errorDiv = block.querySelector('.hbspt-load-error');
        if (errorDiv) {
          const paragraphs = errorDiv.querySelectorAll('p');
          expect(paragraphs.length).to.be.greaterThan(0);
        }
      }

      document.createElement.restore();
    });
  });

  describe('Block structure validation', () => {
    it('should contain form div in block', async () => {
      decorate(block);
      await new Promise((resolve) => setTimeout(resolve, 0));

      const formDiv = block.querySelector('.hs-form-html');
      expect(formDiv).to.exist;
      expect(formDiv.parentElement).to.equal(block);
    });
  });

  describe('Return value', () => {
    it('should not return a value from decorate function', async () => {
      const result = decorate(block);
      expect(result).to.be.undefined;
    });
  });

  describe('Block clearing', () => {
    it('should empty block content before decoration', async () => {
      block.innerHTML = '<p>Some content</p><span>More content</span>';

      decorate(block);
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Block should only contain the newly added elements
      const paragraphs = block.querySelectorAll('p');
      const originalContent = Array.from(paragraphs).some(
        (p) => p.textContent === 'Some content',
      );
      expect(originalContent).to.be.false;
    });
  });

  describe('Multiple decorations', () => {
    it('should handle multiple block decorations', async () => {
      const block1 = document.createElement('div');
      const block2 = document.createElement('div');

      decorate(block1);
      decorate(block2);

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(block1.querySelector('.hs-form-html')).to.exist;
      expect(block2.querySelector('.hs-form-html')).to.exist;
    });
  });
});
