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

/*
If there is an image in a hero block, assume it is the
background image and move it to just below the parent div.
Assumes that there is only one image in a hero block.
*/
function createBackgroundImage(block) {
  const backgroundImage = block.querySelector('picture');
  if (backgroundImage.length !== 0) {
    const parent = backgroundImage.closest('div.hero');
    parent.prepend(backgroundImage);
  }
}

export default async function decorate(block) {
  createBackgroundImage(block);
  createButtonGroup(block);
}
