import { getJsonFromUrl, parseBlockOptions } from '../../scripts/aem.js';


export default async function decorate(block) {

  const optionsObject = parseBlockOptions(block);
  block.firstElementChild.remove();
  const container = document.createElement('div');
  const wrapper = document.createElement('ul');
  wrapper.classList = 'listOfItems image-list list-tile';

  const url = '/jmp-all.json';
  const { data: allPages } = await getJsonFromUrl(url);

  let pageSelection = allPages;

  let newArray = pageSelection.filter(function (el) {
    return el.product === "JMP"
  });

  const limitObjects = optionsObject.limit;
  if(limitObjects !== undefined) {
    pageSelection = pageSelection.slice(0, limitObjects);
  }

  console.log(pageSelection);
  pageSelection.forEach((item) => {
    //const datePublished = item.lastPublished;
    //console.log(Date.parse(datePublished));
    const listItem = document.createElement('li');
    const cardLink = document.createElement('a');
    cardLink.href = item.path;
    cardLink.target = '_self';
    cardLink.innerHTML = `
    <span class="title">${item.title}</span>
    <span class="cmp-image image"><img src="${item.image}"/></span>
    <span class="abstract">${item.description}</span>
  `;
    listItem.append(cardLink);
    wrapper.append(listItem);
  });

  block.append(wrapper);
}
