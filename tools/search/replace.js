import { saveToDa, createTag } from '../../scripts/helper.js';

class ActionResult {
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceKeyword(text, keyword, replacement) {
  const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
  return text.replaceAll(regex, replacement);
}

async function doReplace(
  token,
  dom,
  elements,
  pageSourceUrl,
  queryObject,
  classStyle,
  replaceText,
) {
  const keyword = queryObject.keyword;

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
  saveToDa(html.innerHTML, pageSourceUrl, token);
}

async function resetDocumentsToOriginalState(token) {
  const resetPromises = window.searchResults.map((result) => {
    const htmlToUse = result.original.querySelector('main');
    return saveToDa(htmlToUse.innerHTML, result.pagePath, token);
  });
  await Promise.all(resetPromises);
}

function findLine(parentEl, propertyName) {
  let line;
  const foundProperties = Array.from(parentEl.querySelectorAll('p')).filter((ele) => ele.children.length === 0 && ele.textContent.trim().toLowerCase() === propertyName);
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
  window.searchResults.forEach((result) => {
    result.elements.forEach((el) => {
      if (!rowName) {
        deleteLine(el);
      } else {
        deleteLineFromBlock(el.parentElement, rowName);
      }
    });
    const htmlToUse = result.dom.querySelector('main');
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
  try {
    const deleteRowName = document.getElementById('deleteRowName').value.toLowerCase();
    const resultClassStyle = window.searchResults[0]?.classStyle;
    switch (resultClassStyle) {
      case 'property':
        if (!deleteRowName) {
          throw new Error('Row name cannot be blank');
        }
        if (queryObject.scope.property.toLowerCase() === deleteRowName) {
          deleteFromPropertyElement(token, undefined);
        } else {
          // try to find the element in the block.
          deleteFromPropertyElement(token, deleteRowName);
        }
        break;
      case 'block':
        if (!deleteRowName) {
          throw new Error('Row name cannot be blank.');
        }
        deleteFromBlockElement(token, deleteRowName);
        break;
      case 'tag':
        throw new Error('not an identifiable block');
      case 'attribute':
        throw new Error('not an identifiable block');
      default:
        throw new Error('could not delete');
    }
  } catch (e) {
    return new ActionResult('error', e);
  }
  return new ActionResult('success', 'Successfully Deleted');
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
    const newRowName = document.querySelector('#add-section > #newRowName').value;
    if (!newRowName) {
      throw new Error('no row name specified');
    }
    const newRowValue = document.querySelector('#add-section > #newRowValue').value;
    if (!newRowValue) {
      throw new Error('no row value specified');
    }
    window.searchResults.forEach((result) => {
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
    return new ActionResult('error', e);
  }
  return new ActionResult('success', 'Successfully added row');
}

function changeRowName(rowEl, newRowName) {
  const rowNameCell = rowEl.children[0];
  rowNameCell.textContent = newRowName;
}

function adjustStringValue(currentText, newText, stringLocation) {
  let newValue;
  switch (stringLocation) {
    case 'prepend':
      newValue = `${newText}${currentText}`;
      break;
    case 'append':
      newValue = `${currentText}${newText}`;
      break;
    case 'replace':
      newValue = newText;
      break;
    default:
      throw new Error('not a valid action');
  }
  return newValue;
}

function changeRowValue(rowEl, newTextValue, editAmount, editStringLocation, queryObject) {
  const rowValueCell = rowEl.children[1];
  const currentRowValue = rowValueCell.textContent;

  if (editAmount === 'each') {
    /* For each, split the string using ',' and then add the newTextValue
    to each item. Finally rejoin the array as string using ','
    /* if we need to make change for each element. split string using ','
      this will give an array. If the , isn't found it is array size 1
      iterate over the array. For each item, check the string location.
      prepend, append or replace. after iterating, change the textContent to
      array.join(',')
    */
    let itemList = currentRowValue.split(',');
    itemList = itemList.map((str) => str.trim());
    itemList.forEach((item, index) => {
      itemList[index] = adjustStringValue(item, newTextValue, editStringLocation);
    });
    const adjustedStringList = itemList.join(',');
    rowValueCell.textContent = adjustedStringList;
  } else if (editAmount === 'whole') {
    /* For whole, get add newTextValue to location and set textContent */
    rowValueCell.textContent = adjustStringValue(currentRowValue, newTextValue, editStringLocation);
  } else if (editAmount === 'keyword') {
    /* For keyword, error if no keyword is provided.
    If there is a keyword, add/replace the newTextValue to the keyword.
    Then replace all instances of the keyword in the row with the new value. */
    const keyword = queryObject.keyword;
    if (!keyword) {
      throw new Error('No Keyword provided');
    }
    const adjustedKeyword = adjustStringValue(keyword, newTextValue, editStringLocation);
    // Replace all intances of the keyword in the text.
    rowEl.innerHTML = replaceKeyword(rowEl.innerHTML, keyword, adjustedKeyword);
  }
}

function editRows(queryObject, token) {
  const doNameChange = document.getElementById('changeRowName').checked;
  const doValueChange = document.getElementById('changeRowValue').checked;
  try {
    if (!doNameChange && !doValueChange) {
      throw new Error('no operation selected');
    }
    const resultClassStyle = window.searchResults[0]?.classStyle;
    if (resultClassStyle !== 'property') {
      throw new Error('property is not selected');
    }
    const newNameValue = document.querySelector('#edit-section #newRowName')?.value;
    if (doNameChange && !newNameValue) {
      throw new Error('no property name provided');
    }
    const newTextValue = document.querySelector('#edit-section #newText')?.value;
    if (doValueChange && !newTextValue) {
      throw new Error('no value change provided');
    }
    const editAmount = document.querySelector('#edit-section [name="partialEdit"]')?.value;
    const editStringLocation = document.querySelector('#edit-section [name="editTextAction"]')?.value;
    window.searchResults.forEach((result) => {
      result.elements.forEach((el) => {
        if (newNameValue) {
          changeRowName(el, newNameValue);
        }
        if (newTextValue) {
          changeRowValue(el, newTextValue, editAmount, editStringLocation, queryObject);
        }
      });
      const htmlToUse = result.dom.querySelector('main');
      saveToDa(htmlToUse.innerHTML, result.pagePath, token);
    });
  } catch (e) {
    return new ActionResult('error', e);
  }
  return new ActionResult('success', 'Successfully updated row');
}

function mergeRows(token) {
  const separator = ', ';
  try {
    window.searchResults.forEach((result) => {
      const objectType = result.classStyle;
      if (objectType !== 'property') {
        throw new Error('need a single propery to merge');
      }
      const secondRow = document.querySelector('#mergeName')?.value.toLowerCase();
      result.elements.forEach((el) => {
        if (!el.parentElement) {
          throw new Error('invalid parent element');
        }
        const mergeLine = findLine(el.parentElement, secondRow);
        if (mergeLine) {
          const oldMergeLineContent = mergeLine.children[1]?.textContent;
          /* Have the row it needs to go in.
          Get the found content from el and append it to the oldMerge.
          and save that value. */
          const currElContent = el.children[1]?.textContent;
          const newContentString = oldMergeLineContent + separator + currElContent;
          mergeLine.children[1].querySelector('p').textContent = newContentString;
        } else {
          /* If there is no line in the block, look
          at the value of the checkbox. If it is checked.
          Add a new row with the secondRow as the name and el value
          as it's value.
          */
          if (!document.getElementById('createRowCheckbox').checked) {
            // do not replace.
            throw new Error('Did not specify that new row should be created');
          }
          addRow(el.parentElement, secondRow, el.children[1]?.textContent);
        }
        // row has either been updated or created, delete the source row
        deleteLine(el);
      });
      const htmlToUse = result.dom.querySelector('main');
      saveToDa(htmlToUse.innerHTML, result.pagePath, token);
    });
  } catch (e) {
    return new ActionResult('error', e);
  }
  return new ActionResult('success', 'Successfully merged');
}

export {
  ActionResult,
  addNewRow,
  deleteRow,
  doReplace,
  editRows,
  escapeRegExp,
  mergeRows,
  resetDocumentsToOriginalState,
};
