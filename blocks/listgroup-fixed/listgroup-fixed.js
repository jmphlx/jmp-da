/* eslint arrow-parens: 0 */
/* eslint consistent-return: 0 */
/* eslint no-restricted-syntax: 0 */
/* eslint no-await-in-loop: 0 */

import {
  getMetadata,
} from '../../scripts/aem.js';
import {
  parseBlockOptions,
} from '../../scripts/jmp.js';

export default async function decorate(block) {
  const optionsObject = parseBlockOptions(block);
  if (optionsObject !== undefined && Object.keys(optionsObject).length > 0) {
    block.firstElementChild.remove();
  }

  const list = block.firstElementChild?.children.item(0).textContent;
  const pageUrls = list.split(',').map(string => string.trim());
  // Remove block urls list now that we have it.
  block.firstElementChild.remove();

  const wrapper = document.createElement('ul');
  const columns = optionsObject.columns !== undefined ? optionsObject.columns : 5;
  wrapper.classList = `listOfItems image-list list-tile col-size-${columns}`;

  // Needs to be a for instead of forEach to maintain order of urls.
  for (const item of pageUrls) {
    const resp = await fetch(`${item}`);
    if (!resp.ok) return null;
    const html = await resp.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const listItem = document.createElement('li');
    const cardLink = document.createElement('a');
    const redirectUrl = getMetadata('redirecturl', doc);
    if (redirectUrl.length > 0) {
      cardLink.href = redirectUrl;
      cardLink.target = '_blank';
    } else {
      cardLink.href = item;
      cardLink.target = '_self';
    }
    const htmlOutput = `
    <span class="navigation-title">${getMetadata('resourcetype', doc)}</span>
    <span class="title">${getMetadata('og:title', doc)}</span>
    <span class="cmp-image image"><img src="${getMetadata('og:image', doc)}"/></span>
    <span class="abstract">${getMetadata('og:description', doc)}</span>`;

    cardLink.innerHTML = htmlOutput;

    listItem.append(cardLink);
    wrapper.append(listItem);
  }

  block.append(wrapper);
}
