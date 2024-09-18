import { createTag } from '../../scripts/helper.js';
import { onSearchInput } from './search.js';
import { getLanguageNav } from '../../scripts/jmp.js';

/**
 * fetches the navigation markup
 * JMP Customization
 * Use language nav based on page lang. Default to /en/nav.
 */
async function fetchNavigationHTML() {
  const navPath = getLanguageNav(true);
  const response = await fetch(`${navPath}.plain.html`);
  return response.text();
}

function toggleHamburgerMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');

  // TO-DO Enable escape keypress toggle??
}

function decorateSearchBar(results) {
  const searchBar = createTag('div', { id: 'gnav-search-bar', class: 'gnav-search-bar' });
  const searchField = createTag('div', { class: 'gnav-search-field' });
  const searchInput = createTag('input', { class: 'gnav-search-input', placeholder: 'Search' });
  searchInput.addEventListener('input', (e) => {
    onSearchInput(e.target.value, results);
  });

  searchField.append(searchInput);
  searchBar.append(searchField);
  return searchBar;
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.innerHTML = '';
  const navHTML = await fetchNavigationHTML();

  // decorate nav DOM
  const nav = createTag('nav', { id: 'nav' });
  nav.innerHTML = navHTML;

  const classes = ['brand', 'tools', 'knowledgeportal', 'sections'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // Don't need to decorate nav-sections (Try jmp button)

  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    // Add Search search
    navTools.classList.add('search-icon');
    navTools.classList.add('gnav-search');
    const searchButton = navTools.querySelector('picture');
    const results = createTag('div', { class: 'gnav-search-results' });
    nav.append(results);
    const searchBar = decorateSearchBar(results);
    searchButton.addEventListener('click', () => {
      searchBar.focus();
    });
    navTools.append(searchBar);

    // hamburger for mobile
    const hamburger = createTag('div', {
      class: 'nav-hamburger',
    }, createTag('button', {
      type: 'button',
      'aria-controls': 'nav',
      'aria-label': 'Open navigation',
    }, createTag('span', {
      class: 'nav-hamburger-icon',
    })));

    hamburger.addEventListener('click', () => toggleHamburgerMenu(nav));
    navTools.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    // prevent mobile nav behavior on window resize
    // isDesktop.addEventListener('change', () => {
    //   // toggleMenu(nav, isDesktop.matches);
    //   //languageDropdownDecorated = false;
    // });
  }

  const navWrapper = createTag('div', {
    class: 'nav-wrapper',
  }, nav);
  block.append(navWrapper);
}
