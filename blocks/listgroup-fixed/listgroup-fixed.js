/* eslint consistent-return: 0 */
/* eslint no-restricted-syntax: 0 */
/* eslint no-await-in-loop: 0 */

import {
  getMetadata,
} from '../../scripts/aem.js';
import {
  getBlockConfig,
} from '../../scripts/jmp.js';

const ogNames = {
  title: 'og:title',
  image: 'og:image',
};

function getMetaValue(prop, doc) {
  let val;
  if (Object.prototype.hasOwnProperty.call(ogNames, prop)) {
    val = getMetadata(ogNames[prop], doc);
  } else {
    val = getMetadata(prop.toLowerCase(), doc);
  }
  return val;
}

export default async function decorate(block) {
  const config = getBlockConfig(block);
  block.textContent = '';

  const emptyResultsMessage = config.emptyResultsMessage;
  const pageList = config.pages;
  const columns = config.columns ? config.columns : 5;

  const pageUrls = Array.of(pageList).flat().map((string) => string.trim());

  const wrapper = document.createElement('ul');
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

      const htmlOutput = [];

      config.displayProperties?.forEach((prop) => {
        const pagePropVal = getMetaValue(prop, doc);
        let span;
        if (prop === 'image') {
          span = `<span class="${prop}"><img src="${pagePropVal}"/></span>`;
        } else {
          span = `<span class="${prop}">${pagePropVal}</span>`;
        }
        htmlOutput.push(span);
      });
      cardLink.innerHTML = htmlOutput.join('');

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
