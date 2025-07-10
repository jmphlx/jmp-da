/* global beforeEach describe it */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const accordion = await import('../../../blocks/accordion-two-column/accordion-two-column.js');

describe('Accordion Block', () => {
  let decorate;

  beforeEach(async () => {
    decorate = accordion.default;
    document.body.innerHTML = await readFile({ path: './accordion-two-column.html' });

    const accordionBlock = document.querySelector('#accordion-block');
    decorate(accordionBlock);
  });

  it('Should transform each row into a <details> element', () => {
    const detailsItems = document.querySelectorAll('details.accordion-item');
    expect(detailsItems.length).to.equal(2);
  });

  it('Each item should have a summary and body with correct classes', () => {
    const summaries = document.querySelectorAll('summary.accordion-item-label');
    const bodies = document.querySelectorAll('.accordion-item-body');

    expect(summaries.length).to.equal(2);
    expect(bodies.length).to.equal(2);
  });

  it('Should wrap summary content in <p> if not block-wrapped', () => {
    const firstSummary = document.querySelector('summary.accordion-item-label');
    expect(firstSummary.querySelector('p')).to.not.be.null;
  });

  it('Should wrap body content in <p> if not block-wrapped', () => {
    const firstBody = document.querySelector('.accordion-item-body');
    expect(firstBody.querySelector('p')).to.not.be.null;
  });

  it('Should add correct column classes for one or two columns', () => {
    const firstBody = document.querySelector('.accordion-item-body');
    const col1 = firstBody.querySelector('.accordion-col-1');
    expect(col1).to.exist;

    const allDoubleAccordions = document.querySelectorAll('.accordion-item-body.accordion-double');
    expect(allDoubleAccordions.length).to.equal(1);

    const col2 = document.querySelector('.accordion-col-2');
    expect(col2).to.exist;
  });
});
