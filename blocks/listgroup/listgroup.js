import { getJsonFromUrl, parseBlockOptions } from '../../scripts/aem.js';

export default async function decorate(block) {

  const pathval = block.firstElementChild?.children.item(1).textContent;
  block.firstElementChild.remove();

  console.log(pathval);
  const container = document.createElement('div');
  const wrapper = document.createElement('ul');
  wrapper.classList = 'listOfItems image-list list-tile';

  const url = '/jmp-all.json';
  const { data: allPages } = await getJsonFromUrl(url);
  console.log(allPages);

  allPages.forEach((item) => {
    const listItem = document.createElement('li');
    const cardLink = document.createElement('a');
    cardLink.href = item.path;
    cardLink.target = '_self';
    cardLink.innerHTML = `
    <span class="title">${item.title}</span>
    <span class="cmp-image image"><img src="${item.image}"/></span>
    <span class="abstract">${item.description}</span>"
  `;
    listItem.append(cardLink)
    wrapper.append(listItem);
  });

  block.append(wrapper);
}
