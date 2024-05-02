import { span } from '../../scripts/dom-helpers.js';

function createButtonGroup(block) {
    var allButtons = block.querySelectorAll('.button-container');
    if (allButtons.length != 0) {
        const buttonGroup = span({ class: 'button-group' });
        for (var i = 0, element; element = allButtons[i]; i++) {
            buttonGroup.append(element);
        }
        block.append(buttonGroup);
    }
}

export default async function decorate(block) {
    createButtonGroup(block);
}