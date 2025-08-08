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

function findLine(parentEl, propertyName) {
  console.log(propertyName);
  let line;
  const foundProperties = Array.from(parentEl.querySelectorAll('p')).filter((ele) => ele.children.length === 0 && ele.textContent.trim() === propertyName);
  foundProperties.forEach((prop) => {
    line = prop.parentElement.parentElement;
  });
  return line;
}

function deleteLine(el) {
  el.parentElement?.removeChild(el);
}

function deleteLineFromBlock(block, rowName) {
  let deletedFlag = false;
  const foundRow = findLine(block, rowName);
  if (foundRow) {
    deleteLine(foundRow);
    deletedFlag = true;
  }
  return deletedFlag;
}

function deleteFromPropertyElement(token, rowName) {
  console.log(window.searchResults);
  window.searchResults.forEach((result) => {
    result.elements.forEach((el) => {
      if (!rowName) {
        deleteLine(el);
      } else {
        deleteLineFromBlock(el.parentElement, rowName);
        
      }
    });
    const htmlToUse = result.dom.querySelector('main');
    console.log(htmlToUse);
    saveToDa(htmlToUse.innerHTML, result.pagePath, token);
  });
}

function deleteFromBlockElement(token, rowName) {
  window.searchResults.forEach((result) => {
    result.elements.forEach((el) => {
      deleteLineFromBlock(el, rowName);
    });
    const htmlToUse = result.dom.querySelector('main');
    saveToDa(htmlToUse.innerHTML, result.pagePath, token);
  });
}

function deleteRow(queryObject, token) {
  let msg;
  try {
    const deleteRowName = document.getElementById('deleteRowName').value;
    const resultClassStyle = window.searchResults[0]?.classStyle;
    switch (resultClassStyle) {
      case 'property':
        // do stuff
        if (!deleteRowName) {
          throw new Error('Row name cannot be blank');
        }
        if (queryObject.scope.property === deleteRowName) {
          console.log('row is the same as the search result');
          deleteFromPropertyElement(token, undefined);
        } else {
          //try to find the element in the block.
          console.log('not the same. look for element');
          deleteFromPropertyElement(token, deleteRowName);
        }
        break;
      case 'block':
        if (!deleteRowName) {
          throw new Error('Row name cannot be blank.');
        }
        deleteFromBlockElement(token, rowName);
        break;
      case 'tag':
        throw new Error('not an identifiable block');
      case 'attribute':
        throw new Error('not an identifiable block');
      default:

    }
    msg = 'successfully deleted';
  } catch (e) {
    msg = e;
  }
  return msg;
}

function addRow(block, rowName, rowContent) {
  const rowDiv = createTag('div');
  const leftCellDiv = createTag('div');
  const leftCellContent = createTag('p', undefined, rowName);
  leftCellDiv.append(leftCellContent);
  const rightCellDiv = createTag('div');
  const rightCellContent = createTag('p', undefined, rowContent);
  rightCellDiv.append(rightCellContent);
  rowDiv.append(leftCellDiv, rightCellDiv);
  block.append(rowDiv);
}

function addNewRow(token) {
  try {
    window.searchResults.forEach((result) => {
      const newRowName = document.querySelector('#add-section > #newRowName').value;
      console.log(newRowName);
      const newRowValue = document.querySelector('#add-section > #newRowValue').value;

      result.elements.forEach((el) => {
        if (result.classStyle === 'property') {
          addRow(el.parentElement, newRowName, newRowValue);
        } else if (result.classStyle === 'block') {
          addRow(el, newRowName, newRowValue);
        } else {
          throw new Error('not a block or property object');
        }
      });
      const htmlToUse = result.dom.querySelector('main');
      saveToDa(htmlToUse.innerHTML, result.pagePath, token);
    });
  } catch (e) {
    return e;
  }
  return 'Successfully added row';
}

function mergeRows(token) {
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
          if (!document.getElementById('createRowCheckbox').checked) {
          //do not replace.
          throw new Error('Did not specify that new row should be created');
          }
          addRow(el.parentElement, secondRow, el.children[1]?.textContent);
        }
        // row has either been updated or created, delete the source row
        deleteLine(el);
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
  addNewRow,
  deleteRow,
  doReplace,
  escapeRegExp,
  mergeRows,
  resetDocumentsToOriginalState,
};