import {
  getMetadata,
} from '../../scripts/aem.js';
import {
  parseBlockOptions,
} from '../../scripts/jmp.js';

export default async function decorate(block) {
  const optionsObject = parseBlockOptions(block);
  if(optionsObject !== undefined && Object.keys(optionsObject).length > 0) {
    block.firstElementChild.remove();
  }
  
  const list = block.firstElementChild?.children.item(0).textContent;
  const pageUrls = list.split(',').map(string => string.trim());
  // Remove block urls list now that we have it.
  block.firstElementChild.remove();

  const wrapper = document.createElement('ul');
  const columns = optionsObject.columns !== undefined ? optionsObject.columns : 5;
  wrapper.classList = `listOfItems image-list list-tile col-size-${columns}`;

  pageUrls.forEach(async (item) => {
    const resp = await fetch(`${item}`);
    if (!resp.ok) return null;
    const html = await resp.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const listItem = document.createElement('li');
    const cardLink = document.createElement('a');
    cardLink.href = item;
    cardLink.target = '_self';
    let htmlOutput = `
    <span class="navigation-title">${getMetadata('resourcetype', doc)}</span>
    <span class="title">${getMetadata('og:title', doc)}</span>
    <span class="cmp-image image"><img src="${getMetadata('og:image', doc)}"/></span>
    <span class="abstract">${getMetadata('og:description', doc)}</span>`;

    cardLink.innerHTML = htmlOutput;

    listItem.append(cardLink);
    wrapper.append(listItem);
  });

  block.append(wrapper);
}
