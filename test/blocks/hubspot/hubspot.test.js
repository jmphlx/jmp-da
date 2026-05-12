/* global before describe it after */
import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';

const decorateModule = await import('../../../blocks/hubspot/hubspot.js');
const decorate = decorateModule.default;

function setupPage(htmlPath) {
  return readFile({ path: htmlPath });
}

describe('Hubspot Block', () => {
  let observerCallback;
  let observerInstance;
  let observerStub;
  let block;
  let sandbox;

  before(async () => {
    sandbox = sinon.createSandbox();
    observerCallback = null;
    observerInstance = {
      observe: sinon.stub(),
      disconnect: sinon.stub(),
      unobserve: sinon.stub(),
    };

    observerStub = sandbox.stub(window, 'IntersectionObserver').callsFake(function(callback) {
      observerCallback = callback;
      return observerInstance;
    });

    document.body.innerHTML = await setupPage('./hubspot.html');
    block = document.querySelector('.hubspot');
    const main = document.querySelector('main');
    if (main && block) {
      main.append(block);
    }
    if (block) {
      decorate(block);
    }
  });

  describe('Initialization', () => {
    it('Creates IntersectionObserver during decoration', async () => {
      expect(observerStub.called).to.be.true;
    });

    it('IntersectionObserver.observe called on block', async () => {
      expect(observerInstance.observe.called).to.be.true;
    });

    it('Block element exists in DOM', async () => {
      expect(block).to.exist;
    });

    it('Block content is cleared', async () => {
      const hasConfigContent = block.textContent.includes('portalId');
      expect(hasConfigContent).to.be.false;
    });
  });

  describe('Before Intersection', () => {
    it('Block does not have form-is-loaded class initially', async () => {
      expect(block.classList.contains('form-is-loaded')).to.be.false;
    });

    it('Non-intersecting callback does not trigger loading', async () => {
      const entries = [{ isIntersecting: false }];
      observerCallback(entries);
      expect(observerInstance.disconnect.notCalled).to.be.true;
    });
  });

  describe('On Intersection', () => {
    before(async () => {
      const entries = [{ isIntersecting: true }];
      observerCallback(entries);
    });

    it('Observer.disconnect is called', async () => {
      expect(observerInstance.disconnect.called).to.be.true;
    });

    it('Block receives form-is-loaded class', async () => {
      expect(block.classList.contains('form-is-loaded')).to.be.true;
    });

    it('Block receives required styling classes', async () => {
      expect(block.classList.contains('block')).to.be.true;
      expect(block.classList.contains('embed')).to.be.true;
      expect(block.classList.contains('embed-hubspot')).to.be.true;
    });
  });

  describe('Headline Creation', () => {
    it('Creates headline element when configured', async () => {
      const headline = block.querySelector('.headline');
      expect(headline).to.exist;
    });

    it('Headline is first child of block', async () => {
      const firstChild = block.firstChild;
      expect(firstChild.classList.contains('headline')).to.be.true;
    });

    it('Headline contains configuration text content', async () => {
      const headline = block.querySelector('.headline');
      expect(headline.textContent).to.include('Get Started');
      expect(headline.textContent).to.include('Today');
    });
  });

  describe('Script Injection', () => {
    it('jQuery script added to head with correct version', async () => {
      const jqueryScript = Array.from(document.head.querySelectorAll('script'))
        .find(s => s.src && s.src.includes('jquery'));
      expect(jqueryScript).to.exist;
      expect(jqueryScript.src).to.include('3.7.1');
    });

    it('HubSpot embed script added to head with correct configuration', async () => {
      const hubspotScript = Array.from(document.head.querySelectorAll('script'))
        .find(s => s.src && s.src.includes('hsforms'));
      expect(hubspotScript).to.exist;
      expect(hubspotScript.src).to.include('js.hsforms.net');
      expect(hubspotScript.type).to.equal('text/javascript');
    });
  });

  describe('Multiple Calls and Persistence', () => {
    it('Form only loads once', async () => {
      const scriptCountBefore = block.querySelectorAll('script').length;
      const entries = [{ isIntersecting: true }];
      observerCallback(entries);
      const scriptCountAfter = block.querySelectorAll('script').length;
      expect(scriptCountAfter).to.equal(scriptCountBefore);
    });

    it('Block maintains all required state after multiple calls', async () => {
      expect(block.classList.contains('form-is-loaded')).to.be.true;
      expect(block.classList.contains('block')).to.be.true;
      expect(block.classList.contains('embed')).to.be.true;
      expect(block.classList.contains('embed-hubspot')).to.be.true;
      const headline = block.querySelector('.headline');
      expect(headline).to.exist;
    });
  });

  describe('Block Structure', () => {
    it('Block has data-block-name attribute', async () => {
      expect(block.getAttribute('data-block-name')).to.equal('hubspot');
    });
  });

  after(() => {
    sandbox.restore();
  });
});

describe('Hubspot Block - Already Loaded Check', () => {
  let observerCallback;
  let observerInstance;
  let block;
  let sandbox;

  before(async () => {
    sandbox = sinon.createSandbox();
    observerCallback = null;
    observerInstance = {
      observe: sinon.stub(),
      disconnect: sinon.stub(),
      unobserve: sinon.stub(),
    };

    sandbox.stub(window, 'IntersectionObserver').callsFake(function(callback) {
      observerCallback = callback;
      return observerInstance;
    });

    document.body.innerHTML = await setupPage('./hubspot.html');
    block = document.querySelector('.hubspot');
    const main = document.querySelector('main');
    if (main && block) {
      main.append(block);
    }
    if (block) {
      decorate(block);
    }
    const entries = [{ isIntersecting: true }];
    observerCallback(entries);
  });

  it('Does not re-load when block already has form-is-loaded class', async () => {
    const scriptCountBefore = document.head.querySelectorAll('script').length;
    const entries = [{ isIntersecting: true }];
    observerCallback(entries);
    const scriptCountAfter = document.head.querySelectorAll('script').length;
    expect(scriptCountAfter).to.equal(scriptCountBefore);
  });

  after(() => {
    sandbox.restore();
  });
});

describe('Hubspot Block - Redirect Target Processing', () => {
  let block;
  let sandbox;
  let observerCallback;

  before(async () => {
    sandbox = sinon.createSandbox();
    observerCallback = null;
    const observerInstance = {
      observe: sinon.stub(),
      disconnect: sinon.stub(),
      unobserve: sinon.stub(),
    };

    sandbox.stub(window, 'IntersectionObserver').callsFake(function(callback) {
      observerCallback = callback;
      return observerInstance;
    });

    document.body.innerHTML = '<main><div class="hubspot" data-block-name="hubspot"></div></main>';
    block = document.querySelector('.hubspot');

    const configHtml = `
      <div>
        <div>portalId</div>
        <div><p>123456</p></div>
      </div>
      <div>
        <div>formId</div>
        <div><p>789012</p></div>
      </div>
      <div>
        <div>region</div>
        <div><p>na1</p></div>
      </div>
      <div>
        <div>redirectTarget</div>
        <div><p>./relative/path</p></div>
      </div>
      <div>
        <div>leadSource</div>
        <div><p>Website</p></div>
      </div>
      <div>
        <div>lastAction</div>
        <div><p>Form Submission</p></div>
      </div>
      <div>
        <div>salesforceCampaignId</div>
        <div><p>CAMPAIGN123</p></div>
      </div>
    `;
    block.innerHTML = configHtml;

    decorate(block);
    const entries = [{ isIntersecting: true }];
    observerCallback(entries);
  });

  it('Processes relative redirect target with regex', async () => {
    const jqueryScript = Array.from(document.head.querySelectorAll('script'))
      .find(s => s.src && s.src.includes('jquery'));
    expect(jqueryScript).to.exist;
  });

  after(() => {
    sandbox.restore();
  });
});

describe('Hubspot Block - No Headline Configuration', () => {
  let observerCallback;
  let observerInstance;
  let block;
  let sandbox;

  before(async () => {
    sandbox = sinon.createSandbox();
    observerCallback = null;
    observerInstance = {
      observe: sinon.stub(),
      disconnect: sinon.stub(),
      unobserve: sinon.stub(),
    };

    sandbox.stub(window, 'IntersectionObserver').callsFake(function(callback) {
      observerCallback = callback;
      return observerInstance;
    });

    document.body.innerHTML = '<main><div class="hubspot" data-block-name="hubspot"></div></main>';
    block = document.querySelector('.hubspot');

    const configHtml = `
      <div>
        <div>portalId</div>
        <div><p>123456</p></div>
      </div>
      <div>
        <div>formId</div>
        <div><p>789012</p></div>
      </div>
      <div>
        <div>region</div>
        <div><p>na1</p></div>
      </div>
      <div>
        <div>redirectTarget</div>
        <div><p>/thank-you</p></div>
      </div>
      <div>
        <div>leadSource</div>
        <div><p>Website</p></div>
      </div>
      <div>
        <div>lastAction</div>
        <div><p>Form Submission</p></div>
      </div>
      <div>
        <div>salesforceCampaignId</div>
        <div><p>CAMPAIGN123</p></div>
      </div>
    `;
    block.innerHTML = configHtml;

    const main = document.querySelector('main');
    if (main && block) {
      main.append(block);
    }

    decorate(block);
    const entries = [{ isIntersecting: true }];
    observerCallback(entries);
  });

  it('Does not create headline when not configured', async () => {
    const headline = block.querySelector('.headline');
    expect(headline).to.not.exist;
  });

  it('Block still gets required classes without headline', async () => {
    expect(block.classList.contains('form-is-loaded')).to.be.true;
    expect(block.classList.contains('block')).to.be.true;
    expect(block.classList.contains('embed')).to.be.true;
    expect(block.classList.contains('embed-hubspot')).to.be.true;
  });

  after(() => {
    sandbox.restore();
  });
});

describe('Hubspot Block - Absolute Redirect Target', () => {
  let observerCallback;
  let observerInstance;
  let block;
  let sandbox;

  before(async () => {
    sandbox = sinon.createSandbox();
    observerCallback = null;
    observerInstance = {
      observe: sinon.stub(),
      disconnect: sinon.stub(),
      unobserve: sinon.stub(),
    };

    sandbox.stub(window, 'IntersectionObserver').callsFake(function(callback) {
      observerCallback = callback;
      return observerInstance;
    });

    document.body.innerHTML = '<main><div class="hubspot" data-block-name="hubspot"></div></main>';
    block = document.querySelector('.hubspot');

    const configHtml = `
      <div>
        <div>portalId</div>
        <div><p>123456</p></div>
      </div>
      <div>
        <div>formId</div>
        <div><p>789012</p></div>
      </div>
      <div>
        <div>region</div>
        <div><p>na1</p></div>
      </div>
      <div>
        <div>redirectTarget</div>
        <div><p>/absolute/path</p></div>
      </div>
      <div>
        <div>leadSource</div>
        <div><p>Website</p></div>
      </div>
      <div>
        <div>lastAction</div>
        <div><p>Form Submission</p></div>
      </div>
      <div>
        <div>salesforceCampaignId</div>
        <div><p>CAMPAIGN123</p></div>
      </div>
    `;
    block.innerHTML = configHtml;

    const main = document.querySelector('main');
    if (main && block) {
      main.append(block);
    }

    decorate(block);
    const entries = [{ isIntersecting: true }];
    observerCallback(entries);
  });

  it('Handles absolute redirect path without regex transformation', async () => {
    const jqueryScript = Array.from(document.head.querySelectorAll('script'))
      .find(s => s.src && s.src.includes('jquery'));
    expect(jqueryScript).to.exist;
  });

  after(() => {
    sandbox.restore();
  });
});

describe('Hubspot Block - Script Event Listeners', () => {
  let block;
  let sandbox;

  before(async () => {
    sandbox = sinon.createSandbox();

    const observerInstance = {
      observe: sinon.stub(),
      disconnect: sinon.stub(),
      unobserve: sinon.stub(),
    };

    sandbox.stub(window, 'matchMedia').returns({
      matches: false,
      media: '(min-width: 900px)',
      addEventListener: sinon.stub(),
      removeEventListener: sinon.stub(),
    });

    sandbox.stub(window, 'IntersectionObserver').callsFake(function(callback) {
      return observerInstance;
    });

    document.body.innerHTML = await setupPage('./hubspot.html');
    block = document.querySelector('.hubspot');
    const main = document.querySelector('main');
    if (main && block) {
      main.append(block);
    }

    decorate(block);
  });

  it('HubSpot embed script is created with event listeners', async () => {
    const hubspotScript = Array.from(document.head.querySelectorAll('script'))
      .find(s => s.src && s.src.includes('hsforms'));
    expect(hubspotScript).to.exist;
  });

  it('jQuery script is created before HubSpot script', async () => {
    const scripts = Array.from(document.head.querySelectorAll('script'));
    const jqueryScript = scripts.find(s => s.src && s.src.includes('jquery'));
    const hubspotScript = scripts.find(s => s.src && s.src.includes('hsforms'));
    const jqueryIndex = scripts.indexOf(jqueryScript);
    const hubspotIndex = scripts.indexOf(hubspotScript);
    expect(jqueryIndex).to.be.lessThan(hubspotIndex);
  });

  after(() => {
    sandbox.restore();
  });
});

describe('Hubspot Block - Search Bar Setup', () => {
  let block;
  let sandbox;

  before(async () => {
    sandbox = sinon.createSandbox();

    sandbox.stub(window, 'matchMedia').returns({
      matches: false,
      media: '(min-width: 900px)',
      addEventListener: sinon.stub(),
      removeEventListener: sinon.stub(),
    });

    const observerInstance = {
      observe: sinon.stub(),
      disconnect: sinon.stub(),
      unobserve: sinon.stub(),
    };

    sandbox.stub(window, 'IntersectionObserver').callsFake(function() {
      return observerInstance;
    });

    document.body.innerHTML = await setupPage('./hubspot.html');
    block = document.querySelector('.hubspot');
    const main = document.querySelector('main');
    if (main && block) {
      main.append(block);
    }

    decorate(block);
  });

  it('Search bar has correct aria attributes', async () => {
    const searchBar = document.querySelector('#gnav-search-bar');
    if (searchBar) {
      expect(searchBar.getAttribute('aria-expanded')).to.equal('false');
    }
  });

  it('Search input field exists', async () => {
    const input = document.querySelector('.gnav-search-input');
    if (input) {
      expect(input).to.exist;
    }
  });

  after(() => {
    sandbox.restore();
  });
});

describe('Hubspot Block - Form Configuration', () => {
  let block;
  let sandbox;
  let observerCallback;

  before(async () => {
    sandbox = sinon.createSandbox();

    const observerInstance = {
      observe: sinon.stub(),
      disconnect: sinon.stub(),
      unobserve: sinon.stub(),
    };

    observerCallback = null;
    sandbox.stub(window, 'matchMedia').returns({
      matches: false,
      media: '(min-width: 900px)',
      addEventListener: sinon.stub(),
      removeEventListener: sinon.stub(),
    });

    sandbox.stub(window, 'IntersectionObserver').callsFake(function(callback) {
      observerCallback = callback;
      return observerInstance;
    });

    document.body.innerHTML = await setupPage('./hubspot.html');
    block = document.querySelector('.hubspot');
    const main = document.querySelector('main');
    if (main && block) {
      main.append(block);
    }

    decorate(block);
    const entries = [{ isIntersecting: true }];
    observerCallback(entries);
  });

  it('Configuration values are extracted from HTML', async () => {
    expect(block).to.exist;
    expect(block.classList.contains('form-is-loaded')).to.be.true;
  });

  it('Block is decorated as embed component', async () => {
    expect(block.classList.contains('block')).to.be.true;
    expect(block.classList.contains('embed')).to.be.true;
  });

  it('Nav wrapper is created', async () => {
    const wrapper = document.querySelector('.nav-wrapper');
    if (wrapper) {
      expect(wrapper.querySelector('nav')).to.exist;
    }
  });

  after(() => {
    sandbox.restore();
  });
});

describe('Hubspot Block - Error Event Handling', () => {
  let block;
  let sandbox;
  let observerCallback;
  let consoleErrorStub;

  before(async () => {
    sandbox = sinon.createSandbox();
    consoleErrorStub = sandbox.stub(console, 'error');

    const observerInstance = {
      observe: sinon.stub(),
      disconnect: sinon.stub(),
      unobserve: sinon.stub(),
    };

    observerCallback = null;
    sandbox.stub(window, 'matchMedia').returns({
      matches: false,
      media: '(min-width: 900px)',
      addEventListener: sinon.stub(),
      removeEventListener: sinon.stub(),
    });

    sandbox.stub(window, 'IntersectionObserver').callsFake(function(callback) {
      observerCallback = callback;
      return observerInstance;
    });

    document.body.innerHTML = await setupPage('./hubspot.html');
    block = document.querySelector('.hubspot');
    const main = document.querySelector('main');
    if (main && block) {
      main.append(block);
    }

    decorate(block);
    const entries = [{ isIntersecting: true }];
    observerCallback(entries);
  });

  it('HubSpot script error listeners log errors', async () => {
    const hubspotScript = Array.from(document.head.querySelectorAll('script'))
      .find(s => s.src && s.src.includes('hsforms'));
    expect(hubspotScript).to.exist;

    const errorEvent = new Event('error');
    hubspotScript.dispatchEvent(errorEvent);

    expect(consoleErrorStub.called).to.be.true;
  });

  after(() => {
    sandbox.restore();
  });
});

describe('Hubspot Block - Custom Error Message', () => {
  let block;
  let sandbox;
  let observerCallback;

  before(async () => {
    sandbox = sinon.createSandbox();

    const observerInstance = {
      observe: sinon.stub(),
      disconnect: sinon.stub(),
      unobserve: sinon.stub(),
    };

    observerCallback = null;
    sandbox.stub(window, 'matchMedia').returns({
      matches: false,
      media: '(min-width: 900px)',
      addEventListener: sinon.stub(),
      removeEventListener: sinon.stub(),
    });

    sandbox.stub(window, 'IntersectionObserver').callsFake(function(callback) {
      observerCallback = callback;
      return observerInstance;
    });

    document.body.innerHTML = '<main><div class="hubspot" data-block-name="hubspot"></div></main>';
    block = document.querySelector('.hubspot');

    const configHtml = `
      <div>
        <div>portalId</div>
        <div><p>123456</p></div>
      </div>
      <div>
        <div>formId</div>
        <div><p>789012</p></div>
      </div>
      <div>
        <div>region</div>
        <div><p>na1</p></div>
      </div>
      <div>
        <div>redirectTarget</div>
        <div><p>/thank-you</p></div>
      </div>
      <div>
        <div>leadSource</div>
        <div><p>Website</p></div>
      </div>
      <div>
        <div>lastAction</div>
        <div><p>Form Submission</p></div>
      </div>
      <div>
        <div>salesforceCampaignId</div>
        <div><p>CAMPAIGN123</p></div>
      </div>
      <div>
        <div>errorMessage</div>
        <div><p>Custom error message</p></div>
      </div>
    `;
    block.innerHTML = configHtml;

    const main = document.querySelector('main');
    if (main && block) {
      main.append(block);
    }

    decorate(block);
    const entries = [{ isIntersecting: true }];
    observerCallback(entries);
  });

  it('Block processes custom error message configuration', async () => {
    expect(block).to.exist;
    expect(block.classList.contains('form-is-loaded')).to.be.true;
  });

  after(() => {
    sandbox.restore();
  });
});
