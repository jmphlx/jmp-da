import { loadScript } from '../../scripts/aem.js';
import {
  getJsonFromUrl,
  getListFilterOptions,
  languageIndexExists,
  pageAndFilter,
  pageOrFilter,
  parseBlockOptions
} from '../../scripts/jmp.js';

export function createDateFromString(date) {
  let dateTimeValue = moment(date, 'YYYY-MM-DD').format();
  return dateTimeValue;
}

export default async function decorate(block) {
  await loadScript('/scripts/moment/moment.js');
  const optionsObject = parseBlockOptions(block);
  block.firstElementChild.remove();

  const filterOptions = getListFilterOptions(block);

  // Get Index based on language directory of current page.
  const pageLanguage = window.location.pathname.split('/')[1];
  let url = '/jmp-all.json';
  if (languageIndexExists(pageLanguage)) {
    url = `/jmp-${pageLanguage}.json`;
  }

  const { data: allPages } = await getJsonFromUrl(url);

  // Filter pages
  let pageSelection = allPages;
  if (optionsObject.filterType !== undefined && optionsObject.filterType.toLowerCase() === 'and') {
    pageSelection = pageAndFilter(pageSelection, filterOptions);
  } else {
    pageSelection = pageOrFilter(pageSelection, filterOptions);
  }

    // Order filtered pages by releaseDate
    pageSelection.sort((a, b) => (moment(createDateFromString(a.releaseDate)).isBefore(createDateFromString(b.releaseDate)) ?  -1 :  1));


  // Cut results down to fit within specified limit.
  const limitObjects = optionsObject.limit;
  if (limitObjects !== undefined && pageSelection.length > limitObjects) {
    pageSelection = pageSelection.slice(0, limitObjects);
  }

  const wrapper = document.createElement('ul');
  const columns = optionsObject.columns !== undefined ? optionsObject.columns : 5;
  wrapper.classList = `listOfItems image-list list-tile col-size-${columns}`;

  pageSelection.forEach((item) => {
    const listItem = document.createElement('li');
    const cardLink = document.createElement('a');
    cardLink.href = item.path;
    cardLink.target = '_self';
    let htmlOutput = `
    <span class="navigation-title">${item.resourceType}</span>
    <span class="title">${item.title}</span>`;
    if (optionsObject.images === undefined || optionsObject.images.toLowerCase() !== 'off') {
      htmlOutput += `<span class="cmp-image image"><img src="${item.image}"/></span>`;
    }
    htmlOutput += `<span class="abstract">${item.description}</span>`;
    cardLink.innerHTML = htmlOutput;

    listItem.append(cardLink);
    wrapper.append(listItem);
  });

  block.append(wrapper);
}
