/* eslint consistent-return: 0 */
/* eslint no-restricted-syntax: 0 */
/* eslint no-await-in-loop: 0 */

import {
  getMetadata,
} from '../../scripts/aem.js';
import {
  getBlockConfig,
  isTagProperty,
  convertCamelToKebabCase,
  writeImagePropertyInList,
} from '../../scripts/jmp.js';
import {
  checkForTagProperties,
  getEmptyResultsMessage,
  getTagTranslations,
} from '../../scripts/listgroup.js';

const ogNames = {
  title: 'og:title',
  image: 'og:image',
  tags: 'article:tag',
};

function getMetaValue(prop, doc) {
  let val;
  if (Object.prototype.hasOwnProperty.call(ogNames, prop)) {
    val = getMetadata(ogNames[prop], doc);
  } else {
    val = getMetadata(prop.toLowerCase(), doc);
  }

  // Make images relative to the domain,
  // and not the meta image which is
  // relative to the production origin.
  if (prop === 'image' && val) {
    try {
      const { pathname, search } = new URL(val);
      return `${pathname}${search}`;
    } catch {
      return val;
    }
  }

  return val;
}

function writeOutTagProperties(prop, doc, propValue) {
  const tagsProperty = getMetaValue('tags', doc);
  if (!tagsProperty || tagsProperty.length < 1 || !window.tagtranslations) {
    // No tags or no translations so default to old method.
    return propValue;
  }

  const convertedProp = convertCamelToKebabCase(prop);
  const tagsValue = tagsProperty.split(',');
  const tagsArray = [];
  tagsValue.forEach((tag) => {
    // eslint-disable-next-line no-param-reassign
    tag = tag.trim();
    if (tag.trim().startsWith(convertedProp)) {
      // Found the prop string. Convert it to displayable format
      if (window.tagtranslations[tag]) {
        tagsArray.push(window.tagtranslations[tag]);
      } else {
        // Couldn't find translation of prop.
        tagsArray.push(propValue);
      }
    }
  });
  return tagsArray.join(', ');
}

export default async function decorate(block) {
  const config = getBlockConfig(block);
  block.textContent = '';

  const includesTagProperty = checkForTagProperties(config.displayProperties);
  if (includesTagProperty) {
    await getTagTranslations();
  }

  const emptyResultsMessage = await getEmptyResultsMessage(config.emptyResultsMessage);
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
        if (isTagProperty(prop)) {
          span = `<span class="${prop}">${writeOutTagProperties(prop, doc, pagePropVal)}</span>`;
        } else if (prop === 'image' || prop === 'displayImage') {
          const imageItem = {
            image: getMetaValue('image', doc),
            displayImage: getMetaValue('displayImage', doc),
          };
          span = writeImagePropertyInList(prop, imageItem);
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
    emptyResultsDiv.innerHTML = `${emptyResultsMessage}`;
    wrapper.append(emptyResultsDiv);
  }

  block.append(wrapper);
}
