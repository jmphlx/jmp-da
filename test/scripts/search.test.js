/* global before describe it */
import { expect } from '@esm-bundle/chai';

const searchHelper = await import('../../scripts/search.js');

const cardTemplate = (title, description, href, displayUrl) => `<div class="results-body"><a class="title" href="${href}">${title}</a>` +
`<p class="description">${description}</p><a class="displayUrl" href="${href}">${displayUrl}</a></div>`;

describe('Search Script ', () => {
  it('Internal Card', () => {
    const hit = {
      title: 'My Title',
      description: 'My Description',
      path: '/en/home',
    };

    const card = searchHelper.decorateCard(hit);
    expect(card.innerHTML).to.equal(cardTemplate('My Title', 'My Description', '/en/home', 'http://localhost:2000/en/home'));
  });

  it('Escaped XSS', () => {
    const hit = {
      title: '<img src=x onerror=alert("BHIS")>',
      description: 'My Description',
      path: '/en/home',
    };

    const card = searchHelper.decorateCard(hit);
    expect(card.innerHTML).to.equal(cardTemplate('<img src="x">', 'My Description', '/en/home', 'http://localhost:2000/en/home'));
  });
});
