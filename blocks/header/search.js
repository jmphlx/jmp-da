import { createTag } from '../../scripts/helper.js';
import { getLanguageIndex } from '../../scripts/jmp.js';

/**
 * Fetches language index with parameters
 * @returns {object} index with data and path lookup
 */
export async function fetchIndex() {
  const pageSize = 500;
  window.blogIndex = window.blogIndex || {
    data: [],
    byPath: {},
    offset: 0,
    complete: false,
  };
  if (window.blogIndex.complete) return (window.blogIndex);
  const index = window.blogIndex;
  const languageIndexUrl = getLanguageIndex();
  const resp = await fetch(`${languageIndexUrl}?limit=${pageSize}`);
  const json = await resp.json();
  const complete = (json.limit + json.offset) === json.total;
  json.data.forEach((post) => {
    index.data.push(post);
    index.byPath[post.path.split('.')[0]] = post;
  });
  index.complete = complete;
  index.offset = json.offset + pageSize;
  return (index);
}

function decorateCard(hit) {
  const {
    title, description,
  } = hit;
  const path = hit.path.split('.')[0];
  const displayUrl = path.startsWith('/') ? `${window.location.origin}${path}` : path;
  const titleLink = createTag('a', { class: 'title', href: path }, `${title}`);
  const desc = createTag('p', { class: 'description' }, `${description}`);
  const displayLink = createTag('a', { class: 'displayUrl', href: path }, `${displayUrl}`);
  const resultBody = createTag('div', { class: 'results-body' }, titleLink);
  resultBody.append(desc);
  resultBody.append(displayLink);
  return createTag('div', { class: 'result-listing' }, resultBody);
}

async function populateSearchResults(searchTerms, resultsContainer) {
  const limit = 25;
  const terms = searchTerms.toLowerCase().split(' ').map((e) => e.trim()).filter((e) => !!e);
  resultsContainer.innerHTML = '';

  if (terms.length) {
    await fetchIndex();

    const pages = window.blogIndex.data;

    const hits = [];
    let i = 0;
    for (; i < pages.length; i += 1) {
      const e = pages[i];
      const text = [e.title, e.description].join(' ').toLowerCase();

      if (terms.every((term) => text.includes(term.toLowerCase()))) {
        if (hits.length === limit) {
          break;
        }
        hits.push(e);
      }
    }
    hits.forEach((hit) => {
      const card = decorateCard(hit);
      resultsContainer.appendChild(card);
    });

    if (!hits.length) {
      resultsContainer.classList.add('no-Results');
    } else {
      resultsContainer.classList.remove('no-Results');
    }
  }
}

export function onSearchInput(value, resultsContainer) {
  populateSearchResults(value, resultsContainer);
}
