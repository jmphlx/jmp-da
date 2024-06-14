import { getJsonFromUrl, parseBlockOptions } from '../../scripts/aem.js';

/*
 * Check if an array includes all values of another array
 */
function arrayIncludesAllValues(filterValues, pageValues) {
  return pageValues.every(val => filterValues.includes(val));
}

/*
 * Check if an array contains any of the values of another array.
 */
function arrayIncludesSomeValues(filterValues, pageValues) {
  return pageValues.some(val => filterValues.includes(val));
}

/*
 * Apply all filters as an OR. If any condition is true, include the page in the results.
 */
function orFilter(pageSelection, filterObject) {
  const filteredData = pageSelection.filter( (item) => {
    let flag = false;
    Object.keys(filterObject).forEach((key) => {
      const pageValue = item[key].toLowerCase();
      let filterValue = filterObject[key];
      if(typeof filterValue === 'object') {
        //if filterValue is an array of values
        //is pageValue also an array of values?
        if(pageValue !== undefined && pageValue.indexOf(',') > -1) {
          const list = pageValue.split(',');
          const trimmedList = list.map(str => str.trim().toLowerCase());
          console.log('filterValue is array and pageValue is array');
          flag = arrayIncludesSomeValues(filterValue, trimmedList);
          console.log(flag);
        } else {
          //if filterValue is an array of values
          //but pageValue is a singular value
          flag = filterValue.includes(pageValue);
        }
      } else {
        //if filterValue is a single string.
        //but pageValue is an array.
        //Check if pageValue contains filter.
        if(pageValue !== undefined && pageValue.indexOf(',') > -1) {
          const list = pageValue.split(',');
          const trimmedList = list.map(str => str.trim().toLowerCase());
          flag = trimmedList.includes(pageValue);
        } else {
          //both pageValue and filterValue are strings so test ===
          flag = filterValue === pageValue;
        }
      }
    });
    return flag;
  });
  return filteredData;
}

/*
 * Apply all filters as an AND. All conditions must be true in order
 * to include the page in the results.
 */
function andFilter(pageSelection, filterObject) {
  const filteredData = pageSelection.filter( (item) => {
    let flag = true;
    console.log(JSON.stringify(filterObject));
    try {
      Object.keys(filterObject).forEach((key) => {
        const pageValue = item[key].toLowerCase();
        let filterValue = filterObject[key];
        if(typeof filterValue === 'object') {
          //if filterValue is an array of values
          //is pageValue also an array of values?
          if(pageValue !== undefined && pageValue.indexOf(',') > -1) {
            const list = pageValue.split(',');
            const trimmedList = list.map(str => str.trim().toLowerCase());
            console.log('filterValue is array and pageValue is array');
            if(!arrayIncludesAllValues(filterValue, trimmedList)) {
              throw BreakException;
            }
          } else {
            //if pageValue is not also an array of values then it can't possibly match.
            throw BreakException;
          }
        } else {
          //if filterValue is a single string.
          //but pageValue is an array.
          //Check if pageValue contains filter.
          if(pageValue !== undefined && pageValue.indexOf(',') > -1) {
            const list = pageValue.split(',');
            const trimmedList = list.map(str => str.trim().toLowerCase());
            if(!trimmedList.includes(pageValue)) {
              throw BreakException;
            }
          } else {
            //both pageValue and filterValue are strings so test ===
            if(filterValue !== pageValue) {
              throw BreakException;
            }
          }
        }
      });
    } catch (e) {
      flag = false;
    }
    console.log('flagggg ' + flag);
    return flag;
  });
  console.log('filtered');
  console.log(filteredData);
  return filteredData;
}

function getFilterOptions(block) {
  let filterOptions = {};
  console.log('getFIlterOptions');

  while(block.firstElementChild !== undefined && block.firstElementChild !== null) {
    const optionName = block.firstElementChild?.children.item(0).textContent.toLowerCase();
    let optionValue = block.firstElementChild?.children.item(1).textContent.toLowerCase();
    console.log(optionName + ' : ' + optionValue);
    if(optionValue.indexOf(',') > -1) {
      optionValue = optionValue.split(',').map(str => str.trim().toLowerCase());
      console.log('converted ' + optionValue);
    }
    filterOptions[optionName] = optionValue;
    block.firstElementChild.remove();
  }
  console.log(filterOptions);
  return filterOptions;
}

export default async function decorate(block) {

  const optionsObject = parseBlockOptions(block);
  block.firstElementChild.remove();
  console.log(JSON.stringify(optionsObject));

  let filterOptions = getFilterOptions(block);

  //Get Index
  const url = '/jmp-all.json';
  const { data: allPages } = await getJsonFromUrl(url);
  let pageSelection = allPages;

  if(optionsObject.filterType !== undefined && optionsObject.filterType.toLowerCase() === 'and') {
    //do an and
    console.log('and filter');
    pageSelection = andFilter(pageSelection, filterOptions);
  } else {
    //do an or
    console.log('or filter');
    pageSelection = orFilter(pageSelection, filterOptions);
  
  } 

  const container = document.createElement('div');
  const wrapper = document.createElement('ul');
  wrapper.classList = 'listOfItems image-list list-tile';

  const limitObjects = optionsObject.limit;
  if(limitObjects !== undefined && pageSelection.length > limitObjects) {
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
