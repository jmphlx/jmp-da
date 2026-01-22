/*
 * Fragment Block
 * Include content on a page as a fragment.
 * https://www.aem.live/developer/block-collection/fragment
 */

import {
  decorateMain,
} from '../../scripts/scripts.js';

import {
  loadSections,
} from '../../scripts/aem.js';
import {
  shouldUrlBeLocalized,
  getLocalizedLink,
  localizeLinks,
} from '../../scripts/link-localizer.js';

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {HTMLElement} The root element of the fragment
 */
export async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    const resp = await fetch(`${path}.plain.html`);
    if (resp.ok) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();

      // reset base path for media to fragment base
      const resetAttributeBase = (tag, attr) => {
        main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
          elem[attr] = new URL(elem.getAttribute(attr), new URL(path, window.location)).href;
        });
      };
      resetAttributeBase('img', 'src');
      resetAttributeBase('source', 'srcset');

      decorateMain(main);
      await loadSections(main);
      return main;
    }
  }
  return null;
}

export default async function decorate(block) {
  const link = block.querySelector('a');

  const url = link ? new URL(link.href) : new URL(block.textContent.trim());
  console.log(url);
  let path = url.href;
  if (shouldUrlBeLocalized(url)) {
    path = await getLocalizedLink(url);
  }
  console.log(path);
  const fragment = await loadFragment(path);
  const unwrapBlock = block.classList.contains('unwrap');
  if (fragment) {
    localizeLinks(fragment);
    const fragmentSection = fragment.querySelector(':scope .section');
    if (fragmentSection) {
      block.closest('.section').classList.add(...fragmentSection.classList);
      if (unwrapBlock) {
        block.closest('.fragment-container').replaceWith(...fragment.childNodes);
      } else {
        block.closest('.fragment').replaceWith(...fragment.childNodes);
      }
    }
  }
}
