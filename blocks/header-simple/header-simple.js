import { createTag } from '../../scripts/helper.js';
import { getLanguage } from '../../scripts/jmp.js';

/**
 * fetches the navigation markup
 * JMP Customization
 * Use language nav based on page lang. Default to /en/nav.
 */
async function fetchNavigationHTML() {
  const navURL = `/${getLanguage()}/navigation/header-simple`;
  const navPath = new URL(navURL, window.location).pathname;

  const response = await fetch(`${navPath}.plain.html`);
  return response.text();
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

  const classes = ['brand', 'tools', 'sections'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navWrapper = createTag('div', {
    class: 'nav-wrapper',
  }, nav);

  block.append(navWrapper);
}
