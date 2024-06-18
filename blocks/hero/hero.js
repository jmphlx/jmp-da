import { span } from '../../scripts/dom-helpers.js';

function createButtonGroup(block) {
  const allButtons = block.querySelectorAll('.button-container');
  if (allButtons.length !== 0) {
    const buttonGroup = span({ class: 'button-group' });
    allButtons.forEach((element) => {
      buttonGroup.append(element);
    });
    block.append(buttonGroup);
  }
}

export default async function decorate(block) {
  createButtonGroup(block);
}
