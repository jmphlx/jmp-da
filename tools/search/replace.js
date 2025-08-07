import { saveToDa, createTag } from '../../scripts/helper.js';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceKeyword(text, keyword, replacement) {
  const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
  return text.replaceAll(regex, replacement);
}

async function doReplace(token, dom, elements, pageSourceUrl, queryObject, classStyle) {
  console.log('doReplace');
  const keyword = queryObject.keyword;
  const replaceText = document.querySelector('[name="replaceText"]').value;

  if (classStyle === 'attribute') {
    // Replace only the attribute.
    elements.forEach((el) => {
      el[queryObject.scope.attribute] = replaceKeyword(
        el[queryObject.scope.attribute],
        keyword,
        replaceText,
      );
    });
  } else if (classStyle === 'tag') {
    // Replace all instances of the keyword in the html element and all
    // it's children (including textContent).
    elements.forEach((el, index) => {
      const newHTML = replaceKeyword(el.outerHTML, keyword, replaceText);
      const newDomEl = new DOMParser().parseFromString(newHTML, 'text/html');
      // Apparently need to update the array reference and the element itself.
      elements[index] = newDomEl.body.firstChild;
      el.outerHTML = newHTML;
    });
  } else {
    elements.forEach((el) => {
      // Replace all intances of the keyword in the text.
      el.innerHTML = replaceKeyword(el.innerHTML, keyword, replaceText);
    });
  }

  const html = dom.body.querySelector('main');
  console.log(pageSourceUrl);
  saveToDa(html.innerHTML, pageSourceUrl, token);
}

function resetDocumentsToOriginalState(token) {
  window.searchResults.forEach((result) => {
    const htmlToUse = result.original.querySelector('main');
    saveToDa(htmlToUse.innerHTML, result.pagePath, token);
  });
}

function deleteLine(token) {
  let msg;
  try {
    window.searchResults.forEach((result) => {
    if (result.classStyle !== 'property') {
      throw new Error('not a single line property');
    }
    console.log(result.pagePath);
    console.log(result.dom);

    const matchingElements = result.elements;
    matchingElements.forEach((el) => {
      console.log(el.parentElement);
      el.parentElement?.removeChild(el);
    });
    const htmlToUse = result.dom.querySelector('main');
    saveToDa(htmlToUse.innerHTML, result.pagePath, token);
    console.log('updated')
    msg = 'Successfully deleted line';
  });
  } catch (e) {
    msg = e;
  }
  return msg;
}

function addLine() {
  window.searchResults.forEach((result) => {
    const matchingElements = result.elements;

    matchingElements.forEach((el) => {
      console.log(result.classStyle);
      if (result.classStyle === 'property') {
        console.log('property');
        const blockLevel = el.parentElement;
        console.log(blockLevel);
      } else if(result.classStyle === 'block') {
        console.log('block');
      }
    });

  });
}

function addRow(block, rowName, rowContent, token) {
  const rowDiv = createTag('div');
  const leftCellDiv = createTag('div');
  const leftCellContent = createTag('p', undefined, rowName);
  leftCellDiv.append(leftCellContent);
  const rightCellDiv = createTag('div');
  const rightCellContent = createTag('p', undefined, rowContent);
  rightCellDiv.append(rightCellContent);
  rowDiv.append(leftCellDiv, rightCellDiv);
  console.log(rowDiv);
  block.append(rowDiv);
  console.log(block);
}

function findLine(parentEl, propertyName) {
  console.log(propertyName);
  let line;
  const foundProperties = Array.from(parentEl.querySelectorAll('p')).filter((ele) => ele.children.length === 0 && ele.textContent.trim() === propertyName);
  foundProperties.forEach((prop) => {
    line = prop.parentElement.parentElement;
  });
  return line;
}

function mergeRows(token) {
  console.log('hello from merge');
  const separator = ' ,';
  try {
    window.searchResults.forEach((result) => {
      console.log(result);
      const objectType = result.classStyle;
      if (objectType !== 'property') {
        throw new Error('need a single propery to merge');
      }
      const secondRow = document.querySelector('#mergeName')?.value;
      console.log(secondRow);
      result.elements.forEach((el) => {
        console.log(el.parentElement);
        if (!el.parentElement) {
          throw new Error('invalid parent element');
        }
        const mergeLine = findLine(el.parentElement, secondRow);
        console.log(mergeLine);
        if (mergeLine) {
          const oldMergeLineContent = mergeLine.children[1]?.textContent;
          /* Have the row it needs to go in.
          Get the found content from el and append it to the oldMerge.
          and save that value. */ 
          console.log(oldMergeLineContent);
          const currElContent = el.children[1]?.textContent;
          console.log(currElContent);
          const newContentString = oldMergeLineContent + separator + currElContent;
          console.log(newContentString);
          console.log(mergeLine.children[1]);
          console.log(mergeLine.children[1].querySelector('p').textContent);
          mergeLine.children[1].querySelector('p').textContent = newContentString;
        } else {
          /* If there is no line in the block, look
          at the value of the checkbox. If it is checked. 
          Add a new row with the secondRow as the name and el value
          as it's value.
          */
          const createRowIfNeeded = document.querySelector('#createRowCheckbox');
          if (!createRowIfNeeded.checked) {
          //do not replace.
          throw new Error('Did not specify that new row should be created');
          }
          addRow(el.parentElement, secondRow, el.children[1]?.textContent, token);
        }
        // row has either been updated or created, delete the source row
        el.parentElement.removeChild(el);
      });
      console.log(result.dom);
      const htmlToUse = result.dom.querySelector('main');
      saveToDa(htmlToUse.innerHTML, result.pagePath, token);
    });
  } catch (e) {
    return e;
  }
  return 'success';
}

export {
  addRow,
  deleteLine,
  doReplace,
  escapeRegExp,
  mergeRows,
  resetDocumentsToOriginalState,
};