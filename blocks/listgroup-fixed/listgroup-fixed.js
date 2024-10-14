/* eslint consistent-return: 0 */
/* eslint no-restricted-syntax: 0 */
/* eslint no-await-in-loop: 0 */

import {
  getMetadata,
} from '../../scripts/aem.js';
import {
  getBlockPropertiesList,
  getBlockProperty,
} from '../../scripts/jmp.js';

export default async function decorate(block) {
  const optionsObject = getBlockPropertiesList(block, 'options');
  const emptyResultsMessage = getBlockProperty(block, 'emptyResultsMessage');
  const pageList = getBlockProperty(block, 'pages');

  const pageUrls = pageList.split(',').map((string) => string.trim());

  const wrapper = document.createElement('ul');
  const columns = optionsObject.columns !== undefined ? optionsObject.columns : 5;
  wrapper.classList = `listOfItems image-list list-tile col-size-${columns}`;

  let pageNotFound = 0;
  // Needs to be a for instead of forEach to maintain order of urls.
  for (const item of pageUrls) {
    const resp = await fetch(`${item}`);
    if (!resp.ok) {
      pageNotFound += 1;
    } else {
      const html = await resp.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');

      const listItem = document.createElement('li');
      listItem.classList = `${getMetadata('resourceOptions', doc)}`;
      const cardLink = document.createElement('a');
      const redirectTarget = getMetadata('redirecttarget', doc);
      if (redirectTarget.length > 0) {
        cardLink.href = redirectTarget;
        cardLink.target = '_blank';
      } else {
        cardLink.href = item;
        cardLink.target = '_self';
      }
      let htmlOutput = `
      <span class="navigation-title">${getMetadata('resourcetype', doc)}</span>
      <span class="title">${getMetadata('og:title', doc)}</span>`;
      if (optionsObject.images === undefined || optionsObject.images.toLowerCase() !== 'off') {
        htmlOutput += `<span class="cmp-image image"><img src="${getMetadata('og:image', doc)}"/></span>`;
      }
      htmlOutput += `<span class="abstract">${getMetadata('displaydescription', doc)}</span>`;

      cardLink.innerHTML = htmlOutput;

      listItem.append(cardLink);
      wrapper.append(listItem);
    }
  }

  if (pageNotFound === pageUrls.length && emptyResultsMessage !== undefined) {
    const emptyResultsDiv = document.createElement('div');
    emptyResultsDiv.classList = 'no-results';
    emptyResultsDiv.innerHTML = `<span>${emptyResultsMessage}</span>`;
    wrapper.append(emptyResultsDiv);
  }

  block.append(wrapper);
}
