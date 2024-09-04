import {
  sampleRUM,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './aem.js';
import {
  setHtmlPageLanguage,
} from './jmp.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

(async function loadDa() {
  if (!new URL(window.location.href).searchParams.get('dapreview')) return;
  import('https://da.live/scripts/dapreview.js').then(({ default: daPreview }) => daPreview(loadPage));
}());

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
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element

function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}
*/

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

/**
 * create an element.
 * @param {string} tagName the tag for the element
 * @param {object} props properties to apply
 * @param {string|Element} html content to add
 * @returns the element
 */
export function createElement(tagName, props, html) {
  const elem = document.createElement(tagName);
  if (props) {
    Object.keys(props).forEach((propName) => {
      const val = props[propName];
      if (propName === 'class') {
        const classesArr = (typeof val === 'string') ? [val] : val;
        elem.classList.add(...classesArr);
      } else {
        elem.setAttribute(propName, val);
      }
    });
  }

  if (html) {
    const appendEl = (el) => {
      if (el instanceof HTMLElement || el instanceof SVGElement) {
        elem.append(el);
      } else {
        elem.insertAdjacentHTML('beforeend', el);
      }
    };

    if (Array.isArray(html)) {
      html.forEach(appendEl);
    } else {
      appendEl(html);
    }
  }

  return elem;
}
/* JMP HEADER END */

/** JMP Section Group Layout Support */
/**
 * Builds multi column layout within a section.
 * Expect layout to be written as '# column' i.e. '2 column' or '3 column'.
 * Only intended to support groups of 2 or 3.
 * @param {Element} main The container element
 */
export function buildLayoutContainer(main) {
  main.querySelectorAll(':scope > .section[data-layout]').forEach((section) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('layout-wrapper');
    const numberOfGroups = parseInt(section.getAttribute('data-layout'), 10);

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
  // buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  buildLayoutContainer(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  setHtmlPageLanguage();
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

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
  autolinkModals(doc);

  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
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
  loadDelayed();
}

loadPage();
