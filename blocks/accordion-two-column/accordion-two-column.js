import { createTag } from '../../scripts/helper.js';

function hasWrapper(el) {
  return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = createTag('summary', { class: 'accordion-item-label' });
    summary.append(...label.childNodes);
    if (!hasWrapper(summary)) {
      summary.innerHTML = `<p>${summary.innerHTML}</p>`;
    }

    // create accordion body
    const details = createTag('details', { class: 'accordion-item' });
    const accordionBody = createTag('div', { class: 'accordion-item-body' });

    // Include accordion column 1 as there will be at least 1 column.
    const bodyOne = row.children[1];
    bodyOne.classList.add('accordion-col-1');
    if (!hasWrapper(bodyOne)) {
      bodyOne.innerHTML = `<p>${bodyOne.innerHTML}</p>`;
    }

    // Include accordion column 2 if there is one.
    if (row.children[2] !== undefined) {
      accordionBody.classList.add('accordion-double');
      const bodyTwo = row.children[2];
      bodyTwo.classList.add('accordion-col-2');
      if (!hasWrapper(bodyTwo)) {
        bodyTwo.innerHTML = `<p>${bodyTwo.innerHTML}</p>`;
      }
      accordionBody.append(bodyOne, bodyTwo);
    } else {
      accordionBody.append(bodyOne);
    }
    details.append(summary, accordionBody);
    row.replaceWith(details);
  });
}
