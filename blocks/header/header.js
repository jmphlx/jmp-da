import {
  wrapImgsInLinks,
  createElement,
} from '../../scripts/scripts.js';
import { getMetadata } from '../../scripts/aem.js';
import { getLanguageNav } from '../../scripts/jmp.js';

// import { createSearchForm } from '../../scripts/search-utils.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * fetches the navigation markup
 * JMP Customization
 * Use language nav based on page lang. Default to /en/nav.
 */
async function fetchNavigationHTML() {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta) : getLanguageNav();

  const response = await fetch(`${navPath}.plain.html`);
  return response.text();
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      closeAllNavSections(nav);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav);
      nav.querySelector('button').focus();
    }
  }
}

/**
 * Closes all nav sections
 * @param {Element} nav The nav element
 */
function closeAllNavSections(nav) {
  nav.querySelectorAll('.nav-drop').forEach((section) => {
    section.setAttribute('aria-expanded', false);
  });

  nav.querySelectorAll('.drop-expanded').forEach((sections) => {
    sections.classList.remove('drop-expanded');
  });
}

function toggleNavDrop(section, sections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : section.getAttribute('aria-expanded') === 'true';
  closeAllNavSections(sections.closest('nav'));
  section.setAttribute('aria-expanded', expanded ? 'false' : 'true');

  const anyExpanded = sections.querySelector('.nav-drop[aria-expanded="true"]');
  if (anyExpanded) {
    sections.classList.add('drop-expanded');
  } else {
    sections.classList.remove('drop-expanded');
  }
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  closeAllNavSections(nav);
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

function addNavDropToggle(section, sections) {
  section.addEventListener('click', () => {
    toggleNavDrop(section, sections);
  });
}

async function buildMobileMenu(nav) {
  const mobileMenu = createElement('div', { class: 'nav-mobile-menu' });
  let sections = nav.querySelector('.nav-sections');
  let tools = nav.querySelector('.nav-tools');
  if (sections && tools) {
    sections = sections.cloneNode(true);
    tools = tools.cloneNode(true);
    // const searchItem = tools.querySelector('.search-item');
    // const searchAction = searchItem.querySelector('a').href;
    // searchItem.innerHTML = '';
    // //searchItem.append(await createSearchForm({ type: 'minimal', action: searchAction }));
    sections.classList.add('nav-sections-mobile');
    mobileMenu.append(sections);
    sections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
      const subList = navSection.querySelector('ul');
      if (subList) {
        navSection.classList.add('nav-drop');
        addNavDropToggle(navSection, sections);
      }
    });

    tools.classList.add('nav-tools-mobile');
    mobileMenu.append(tools);
    tools.querySelectorAll(':scope > ul > li').forEach((navSection) => {
      const subList = navSection.querySelector('ul');
      if (subList) {
        navSection.classList.add('nav-drop');
        addNavDropToggle(navSection, tools);
      }
    });
  }

  nav.append(mobileMenu);
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.innerHTML = '';
  const navHTML = await fetchNavigationHTML();

  // decorate nav DOM
  const nav = createElement('nav', {
    id: 'nav',
  });
  nav.innerHTML = navHTML;

  const classes = ['brand', 'tools', 'sections'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
      const subList = navSection.querySelector('ul');
      if (subList) {
        navSection.classList.add('nav-drop');
        addNavDropToggle(navSection, navSections);

        const sectionLink = navSection.querySelector(':scope > a');
        if (sectionLink) {
          const sectionLi = createElement('li', { class: 'nav-section-link' });
          sectionLi.append(sectionLink.cloneNode(true));
          subList.insertAdjacentElement('afterbegin', sectionLi);

          sectionLink.className = 'nav-section-heading';
          sectionLink.role = 'button';

          const sectionUrl = new URL(sectionLink.href);
          if (sectionUrl.pathname === window.location.pathname) {
            navSection.setAttribute('aria-current', 'page');
          } else {
            const parentPath = window.location.pathname
              .split('/')
              .slice(0, -1)
              .join('/');
            if (sectionUrl.pathname === parentPath) {
              navSection.setAttribute('aria-current', 'page');
            }
          }
          sectionLink.setAttribute('href', '#');
        }
      }
    });
  }

  // hamburger for mobile
  const hamburger = createElement('div', {
    class: 'nav-hamburger',
  }, createElement('button', {
    type: 'button',
    'aria-controls': 'nav',
    'aria-label': 'Open navigation',
  }, createElement('span', {
    class: 'nav-hamburger-icon',
  })));

  hamburger.addEventListener('click', () => toggleMenu(nav));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));

  // wrapImgsInLinks(nav);

  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    navTools.querySelectorAll(':scope > ul > li').forEach(async (navTool) => {
      // const isSearch = navTool.querySelector('.fa-search');

      // if (isSearch) {
      //   navTool.setAttribute('aria-expanded', 'false');
      //   navTool.classList.add('search-item');
      //   const searchAction = navTool.querySelector('a').href;
      //   // const searchForm = await createSearchForm({ type: 'minimal', action: searchAction });
      //   navTool.append(searchForm);
      //   searchForm.hidden = true;

      //   navTool.querySelector('a').addEventListener('click', (e) => {
      //     e.preventDefault();
      //     navTool.querySelector('.search-form-container').toggleAttribute('hidden');
      //     const isExpanded = navTool.getAttribute('aria-expanded') === 'true' || false;
      //     navTool.setAttribute('aria-expanded', !isExpanded);
      //   });
      // }

      const subList = navTool.querySelector('ul');
      if (subList) {
        navTool.classList.add('nav-drop');
        const sectionLink = navTool.querySelector(':scope > a');
        if (sectionLink) {
          sectionLink.className = 'nav-section-heading';

          sectionLink.className = 'nav-section-heading';
          sectionLink.role = 'button';
          sectionLink.setAttribute('href', '#');
        }

        addNavDropToggle(navTool, navTools);
      }
    });
  }

  const utilRowWrapper = createElement('div', { class: 'nav-utility-row' });
  utilRowWrapper.append(navTools);
  nav.prepend(utilRowWrapper);

  await buildMobileMenu(nav);

  nav.addEventListener('click', (e) => {
    const sectionHeading = e.target.closest('.nav-section-heading');
    if (sectionHeading) {
      const sections = sectionHeading.closest('.nav-sections, .nav-tools');
      const section = sectionHeading.closest('.nav-drop');
      if (section && sections) {
        e.preventDefault();
        e.stopPropagation();
        toggleNavDrop(section, sections);
      }
    }
  });

  const navWrapper = createElement('div', {
    class: 'nav-wrapper',
  }, nav);
  block.append(navWrapper);
}
