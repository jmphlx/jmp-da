import { createTag } from '../../scripts/helper.js';

function createButtonGroup(block) {
  const allButtons = block.querySelectorAll('.button-container');
  if (allButtons.length !== 0) {
    const buttonGroup = createTag('span', { class: 'button-group' });
    allButtons.forEach((element) => {
      buttonGroup.append(element);
    });
    block.append(buttonGroup);
  }
}

export default async function decorate(block) {
  createButtonGroup(block);
}
