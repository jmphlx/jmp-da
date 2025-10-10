/* eslint no-unused-vars: 0 */
// Remove after experimentation is working.

import {
  sampleRUM,
  buildBlock,
  decorateBlock,
  getMetadata,
  loadBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  readBlockConfig,
} from './aem.js';
import {
  createTag,
} from './helper.js';

const experimentationConfig = {
  prodHost: 'www.my-site.com',
  audiences: {
    mobile: () => window.innerWidth < 600,
    desktop: () => window.innerWidth >= 600,
    // define your custom audiences here as needed
  },
};

let runExperimentation;
let showExperimentationOverlay;
const isExperimentationEnabled = document.head.querySelector('[name^="experiment"],[name^="campaign-"],[name^="audience-"],[property^="campaign:"],[property^="audience:"]')
    || [...document.querySelectorAll('.section-metadata div')].some((d) => d.textContent.match(/Experiment|Campaign|Audience/i));
if (isExperimentationEnabled) {
  ({
    loadEager: runExperimentation,
    loadLazy: showExperimentationOverlay,
    // eslint-disable-next-line import/no-relative-packages
  } = await import('../plugins/experimentation/src/index.js'));
}

let isSKPPage = false;
let includeGATracking = false;
let includeDelayedScript = true;

const defaultMetaImage = `${window.location.origin}/icons/jmp-com-share.jpg`;

/**
 * OUT OF THE BOX code that impacts our hero blocks.
 * To be removed if no other issues found.
 *
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element

function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}
*/

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

function autolinkModals(element) {
  element.addEventListener('click', async (e) => {
    const origin = e.target.closest('a');

    if (origin && origin.href && origin.href.includes('/modals/')) {
      e.preventDefault();
      const { openModal } = await import(`${window.hlx.codeBasePath}/blocks/modal/modal.js`);
      openModal(origin.href);
    }
  });
}

/**
 * Add background image to entire section if present.
 * @param {*} main the Container Element
 * @author JMP
 */
function buildSectionBackground(main) {
  main.querySelectorAll('div.section-metadata').forEach((metadata) => {
    const config = readBlockConfig(metadata);
    const position = Object.keys(config).indexOf('background-image');
    if (position >= 0) {
      const picture = metadata.children[position].children[1].querySelector('picture');
      const block = buildBlock('background-img', { elems: [picture] });
      metadata.children[position].remove();
      metadata.parentElement.prepend(block);
    }
  });
}

/**
 * Remove div from horizontal-rule element so it doesn't try to build
 * as a block. We only need the horizontal-rule style (and other styles)
 * on it's own empty element.
 * @param {*} main the Container Element
 * @author JMP
 */
function buildHorizontalRule(main) {
  main.querySelectorAll('div.horizontal-rule').forEach((line) => {
    const pElement = createTag('p', { class: line.classList.toString() });
    line.replaceWith(pElement);
  });
}

/**
 * Get all sections that have a data-id attribute and change data-id to id.
 * @param {*} main The container element
 * @author JMP
 */
function updateSectionIds(main) {
  main.querySelectorAll('div.section[data-id]:not([data-id=""])').forEach((section) => {
    section.id = section.getAttribute('data-id');
    section.removeAttribute('data-id');
  });
}

/**
 * If the page has a pageStyle, import the appropriate css as well.
 * Got from Adobe support.
 * @author JMP
 */
function decoratePageStyles() {
  const pageStyle = getMetadata('pagestyle');
  if (pageStyle && pageStyle.trim().length > 0) {
    if (pageStyle.toLowerCase() === 'gatracking') {
      includeGATracking = true;
    } else {
      loadCSS(`${`${window.location.protocol}//${window.location.host}`}/styles/pages/${pageStyle.toLowerCase()}.css`);
      document.body.classList.add(pageStyle.toLowerCase());
      isSKPPage = pageStyle.toLowerCase() === 'skp';
    }
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 * @author Adobe & JMP modified
 */
export function buildAutoBlocks(main) {
  try {
    // buildHeroBlock(main);
    buildSectionBackground(main);
    buildHorizontalRule(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/* JMP HEADER */
/**
 * Wraps images followed by links within a matching <a> tag.
 * @param {Element} container The container element
 */
export function wrapImgsInLinks(container) {
  const ignorePatterns = ['/fragments/', '/forms/'];
  const pictures = container.querySelectorAll('picture');
  pictures.forEach((pic) => {
    // need to deal with 2 use cases here
    // 1) <picture><br/><a>
    // 2) <p><picture></p><p><a></p>
    if (pic.nextElementSibling && pic.nextElementSibling.tagName === 'BR'
      && pic.nextElementSibling.nextElementSibling && pic.nextElementSibling.nextElementSibling.tagName === 'A') {
      const link = pic.nextElementSibling.nextElementSibling;
      if (link.textContent.includes(link.getAttribute('href'))) {
        if (ignorePatterns.some((pattern) => link.getAttribute('href').includes(pattern))) {
          return;
        }
        pic.nextElementSibling.remove();
        link.innerHTML = pic.outerHTML;
        pic.replaceWith(link);
        return;
      }
    }

    const parent = pic.parentNode;
    if (!parent.nextElementSibling) {
      // eslint-disable-next-line no-console
      console.warn('no next element');
      return;
    }
    const nextSibling = parent.nextElementSibling;
    if (parent.tagName !== 'P' || nextSibling.tagName !== 'P' || nextSibling.children.length > 1) {
      // eslint-disable-next-line no-console
      console.warn('next element not viable link container');
      return;
    }
    const link = nextSibling.querySelector('a');
    if (link && link.textContent.includes(link.getAttribute('href'))) {
      if (ignorePatterns.some((pattern) => link.getAttribute('href').includes(pattern))) {
        return;
      }
      link.parentElement.remove();
      link.innerHTML = pic.outerHTML;
      pic.replaceWith(link);
    }
  });
}
/* JMP HEADER END */

/** JMP Section Group Layout Support */

/*
 * Separate the page into multiple divs using the dividers.
*/
export function buildColumns(wrapper, section, numberOfGroups) {
  // Create all group divs.
  for (let i = 1; i <= numberOfGroups; i++) {
    const noGroupDiv = document.createElement('div');
    noGroupDiv.classList.add(`group-${i}`);
    wrapper.append(noGroupDiv);
  }

  // Sort elements into groups. Every time you hit separator, increment group #.
  let currentGroupNumber = 1;

  [...section.children].forEach((child) => {
    const curr = wrapper.querySelector(`.group-${currentGroupNumber}`);
    if (child.classList.contains('divider-wrapper')) {
      currentGroupNumber += 1;
      child.remove();
    } else {
      curr.append(child);
    }
  });

  // Add all groups back to the page.
  section.append(wrapper);
}

/*
 * Separate the page into multiple accordions using the dividers.
*/
export function buildAccordions(wrapper, section, numberOfGroups) {
  // Create all group divs.
  for (let i = 1; i <= numberOfGroups; i++) {
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.classList.add(`accordion-${i}`);

    const body = document.createElement('div');
    body.className = 'accordion-item-body';

    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.classList.add(`accordion-${i}`);
    details.append(summary, body);
    wrapper.append(details);
  }

  // Sort elements into groups. Every time you hit separator, increment group #.
  let currentGroupNumber = 1;

  [...section.children].forEach((child) => {
    const curr = wrapper.querySelector(`.accordion-${currentGroupNumber}`);
    if (child.classList.contains('divider-wrapper')) {
      currentGroupNumber += 1;
      const config = readBlockConfig(child.querySelector('div'));
      curr.querySelector('summary').prepend(config.accordiontitle);
      child.remove();
    } else {
      curr.querySelector('.accordion-item-body').append(child);
    }
  });

  const lastItem = wrapper.querySelector(`.accordion-${numberOfGroups} summary`);
  lastItem.prepend(section.getAttribute('data-accordiontitle'));

  // Add all groups back to the page.
  section.append(wrapper);
}

/*
 * Separate the page into multiple tabs using the dividers.
*/
export function buildTabs(wrapper, section, numberOfGroups) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  // Create all tab panels and buttons first.
  for (let i = 1; i <= numberOfGroups; i++) {
    const tabpanel = document.createElement('div');
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${i}`;
    tabpanel.setAttribute('aria-hidden', i !== 1);
    tabpanel.setAttribute('aria-labelledby', `tab-${i}`);
    tabpanel.setAttribute('role', 'tabpanel');

    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${i}`;
    button.setAttribute('aria-controls', `tabpanel-${i}`);
    button.setAttribute('aria-selected', i === 1);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      section.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll(':scope > button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
      // Unhide any nested tabs that are selected.
      tabpanel.querySelectorAll('button[aria-selected=true]').forEach((selectedButton) => {
        const controlledPanel = selectedButton.getAttribute('aria-controls');
        document.getElementById(controlledPanel).setAttribute('aria-hidden', false);
      });
    });
    tablist.append(button);
    wrapper.append(tabpanel);
  }

  // Sort elements into groups. Every time you hit separator, increment group #.
  let currentGroupNumber = 1;
  [...section.children].forEach((child) => {
    const currTabPanel = wrapper.querySelector(`#tabpanel-${currentGroupNumber}`);
    const currTabButton = tablist.querySelector(`#tab-${currentGroupNumber}`);
    if (child.classList.contains('divider-wrapper')) {
      currentGroupNumber += 1;
      const config = readBlockConfig(child.querySelector('div'));
      currTabButton.innerHTML = config.tabtitle;
      child.remove();
    } else {
      currTabPanel.append(child);
    }
  });

  const lastButton = tablist.querySelector(`#tab-${numberOfGroups}`);
  lastButton.innerHTML = section.getAttribute('data-tabtitle');

  wrapper.prepend(tablist);
  section.append(wrapper);
}

/**
 * Builds multi group layout within a section.
 * Expect layout to be written as '# column' i.e. '2 column' or '3 column'.
 * OR to use accordions i.e. '2 accordion' or '3 accordion'.
 * Only intended to support column groups of 2 or 3. Can support any number of accordions.
 * @param {Element} main The container element
 */
export function buildLayoutContainer(main) {
  main.querySelectorAll(':scope > .section[data-layout]').forEach((section) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('layout-wrapper');
    const layoutType = section.getAttribute('data-layout');
    const numberOfGroups = parseInt(layoutType, 10);

    if (layoutType.includes('accordion')) {
      wrapper.classList.add('accordion-wrapper');
      buildAccordions(wrapper, section, numberOfGroups);
    } else if (layoutType.includes('tabs')) {
      wrapper.classList.add('tabs-wrapper');
      buildTabs(wrapper, section, numberOfGroups);
    } else {
      buildColumns(wrapper, section, numberOfGroups);
    }
  });
}
/** End more JMP */

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  updateSectionIds(main); // JMP Added
  decorateBlocks(main);
  buildLayoutContainer(main); // JMP Added
}

/**
 * For SKP pages, load the mathjax script for equations.
 * NOTE: This needs to be loaded before the body content or
 * the script won't convert text equations.
 * @author JMP
 */
function addMathJax() {
  const mathJaxConfig = createTag('script', {
    type: 'text/x-mathjax-config',
  });
  mathJaxConfig.innerText = "MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$']], processEscapes: true}});";
  document.head.appendChild(mathJaxConfig);

  const mathJaxScript = createTag('script', {
    src: 'https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js?config=TeX-MML-AM_CHTML',
  });
  document.head.appendChild(mathJaxScript);
}

function addGATracking() {
  const gaTracking = createTag('script', {
    type: 'text/javascript',
  });
  gaTracking.innerText = 'window.dataLayer = window.dataLayer || [];'
    + "window.addEventListener('message', function(event) {"
    + "if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady'){"
    + 'window.dataLayer.push({'
    + "'event': 'hubspot-form-ready',"
    + "'hs-form-guid': event.data.id"
    + '}); } });';

  document.head.appendChild(gaTracking);
}

/**
 * Function to determine which (if any) third party scripts
 * should be added to the <head>.
 */
function addThirdPartyScripts() {
  if (isSKPPage) {
    addMathJax();
  }
  if (includeGATracking) {
    addGATracking();
  }
}

/**
 * Apply suffix to document title property without impacting og:title.
 * If a suffix is provided in the metadata properties use it
 * (with an additional space as whitespace is trimmed when writing the head).
 * Otherwise, default to ' | JMP' as the suffix.
 */
function addTitleSuffix() {
  const suffixMeta = getMetadata('suffix');
  const suffix = suffixMeta ? ` ${suffixMeta}` : ' | JMP';
  document.title += suffix;
}

/**
 * If the metaproperty Image is not present, use the default value
 * Default metaimage is located in /icons/jmp-com-share.jpg.
 */
function setMetaImage() {
  const imageMeta = getMetadata('image');
  if (!imageMeta) {
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', defaultMetaImage);
  }
}

/**
 * Hash Utils
 * Transform links with a # value that includes '_'
 * into an <a> with a target value.
 * Supports _blank, _self, _parent, _top.
 * It does not support opening a link in a named iframe.
 * @param {*} doc entire page
 */
function addTargetsToLinks(doc) {
  doc.querySelectorAll('a').forEach((link) => {
    if (!link.hash) {
      return;
    }
    const hashArray = link.hash?.split(/(?=#)/);
    let targetVal;
    if (hashArray.length > 1) {
      hashArray.forEach((hashVal) => {
        if (hashVal.indexOf('#_') > -1) {
          targetVal = hashVal;
        }
      });
    } else if (hashArray[0].indexOf('#_') > -1) {
      targetVal = hashArray[0];
    }

    if (targetVal) {
      link.hash = link.hash.replace(targetVal, '');
      link.target = targetVal.substring(1);
    }
  });
}

export function getDefaultMetaImage() {
  return defaultMetaImage;
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  // If there is a redirectTarget in the page metadata, immediately
  // redirect to target.
  const redirectTarget = getMetadata('redirecttarget');
  if (redirectTarget.length > 0) {
    window.location.href = redirectTarget;
  }

  addTitleSuffix();
  setMetaImage();
  decorateTemplateAndTheme();
  decoratePageStyles();
  addThirdPartyScripts();

  if (runExperimentation) {
    await runExperimentation(document, experimentationConfig);
  }

  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');

    const headerValue = getMetadata('nav');
    const noHeader = headerValue === 'noHeader';
    if (noHeader) {
      document.body.classList.add('noHeader');
    } else if (isSKPPage) {
      if (window.innerWidth >= 900) {
        document.body.classList.add('skp-header');
      } else {
        document.body.classList.add('skp-header-mobile');
      }
    } else if (window.innerWidth >= 900) {
      document.body.classList.add('basic');
    } else {
      document.body.classList.add('basic-mobile');
    }
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  sampleRUM.enhance();

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  // This will transform all the links within the main content.
  addTargetsToLinks(doc);
  autolinkModals(doc);

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  const headerValue = getMetadata('nav');
  const footerValue = getMetadata('footer');

  const noHeader = headerValue === 'noHeader';
  const noFooter = footerValue === 'noFooter';
  includeDelayedScript = !noHeader && !noFooter;

  if (!noHeader) {
    let headerLoaded;
    // If this is a SKP page, use the SKP header (custom and reduces js).
    if (isSKPPage) {
      const headerBlock = buildBlock('header-skp', '');
      doc.querySelector('header').append(headerBlock);
      decorateBlock(headerBlock);
      headerLoaded = loadBlock(headerBlock);
    } else if (headerValue.toLowerCase() === 'simpleheader') {
      const headerBlock = buildBlock('header-simple', '');
      doc.querySelector('header').append(headerBlock);
      decorateBlock(headerBlock);
      headerLoaded = loadBlock(headerBlock);
    } else {
      headerLoaded = loadHeader(doc.querySelector('header'));
    }
    headerLoaded.then((result) => {
      // After loading header, transform links with hashes
      addTargetsToLinks(result);
    });
  }

  if (!noFooter) {
    loadFooter(doc.querySelector('footer')).then((result) => {
      // After loading footer, transform links with hashes
      addTargetsToLinks(result);
    });
  }

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  if (includeDelayedScript) {
    loadDelayed();
  }
}

loadPage();

async function loadSidekick() {
  if (document.querySelector('aem-sidekick')) {
    import('./sidekick.js');
    return;
  }

  document.addEventListener('sidekick-ready', () => {
    import('./sidekick.js');
  });
}

(async function loadDa() {
  const { searchParams } = new URL(window.location.href);

  /* eslint-disable import/no-unresolved */
  if (searchParams.get('dapreview')) {
    import('https://da.live/scripts/dapreview.js')
      .then(({ default: daPreview }) => daPreview(loadPage));
  }
  if (searchParams.get('daexperiment')) {
    import('https://da.live/nx/public/plugins/exp/exp.js');
  }
}());
