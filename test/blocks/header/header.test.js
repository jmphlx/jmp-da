/* global beforeEach describe it */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import decorate from '../../../blocks/header/header.js'; // adjust path accordingly

describe('Navigation Module', () => {
  const originalMatchMedia = window.matchMedia;
  const originalFetch = window.fetch;
  const originalCommonsSheet = window.commonsSheet;

  beforeEach(async () => {
    // Mock media query
    window.matchMedia = () => ({
      matches: false,
      media: '(min-width: 1000px)',
      addEventListener: () => {},
      removeEventListener: () => {},
    });

    // Mock fetch to return basic nav HTML
    window.fetch = async () => ({
      text: async () => `
        <div class="brand">Brand</div>
        <div class="tools">
          <ul>
            <li>
              <a href="#">English</a>
              <ul>
                <li><a href="/fr/">Français</a></li>
              </ul>
            </li>
            <li>
              <picture><img src="search.png" alt="Search icon"/></picture>
            </li>
          </ul>
        </div>
        <div class="sections">
          <ul>
            <li>
              <a href="/en/foo">Foo</a>
              <ul><li><a href="/en/foo/bar">Bar</a></li></ul>
            </li>
          </ul>
        </div>
      `,
    });

    // Mock translation logic
    window.commonsSheet = {
      translations: {
        search: 'Search',
      },
    };

    // Inject block HTML
    document.body.innerHTML = await readFile({ path: './header.html' });
    const block = document.querySelector('#header-block');
    await decorate(block);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    window.matchMedia = originalMatchMedia;
    window.fetch = originalFetch;
    window.commonsSheet = originalCommonsSheet;
  });

  it('should render a nav with brand, tools, and sections', () => {
    const nav = document.querySelector('nav');
    expect(nav).to.exist;

    const brand = nav.querySelector('.nav-brand');
    const tools = nav.querySelector('.nav-tools');
    const sections = nav.querySelector('.nav-sections');
    expect(brand).to.exist;
    expect(tools).to.exist;
    expect(sections).to.exist;
  });

  it('should include a language nav dropdown', () => {
    const lang = document.querySelector('.language-nav');
    expect(lang).to.exist;

    const links = lang.querySelectorAll('a');
    expect(links.length).to.be.greaterThan(1);
  });

  it('should decorate search placeholder based on translation', () => {
    const input = document.querySelector('.gnav-search-input');
    expect(input).to.exist;
    expect(input.placeholder).to.equal('Search');
  });

  it('should have hamburger button with correct aria-label', () => {
    const button = document.querySelector('.nav-hamburger button');
    expect(button).to.exist;
    expect(button.getAttribute('aria-label')).to.equal('Open navigation');
  });

  it('should mark section as aria-current if path matches', () => {
    // simulate current path with query param
    const currentLi = document.querySelector('.nav-sections [aria-current="page"]');
    expect(currentLi).to.exist;
  });

  it('should toggle dropdown on nav-section-heading click', () => {
    const heading = document.querySelector('.nav-section-heading');
    expect(heading).to.exist;

    const initialExpanded = heading.closest('.nav-drop').getAttribute('aria-expanded');
    heading.click();

    const toggledExpanded = heading.closest('.nav-drop').getAttribute('aria-expanded');
    expect(toggledExpanded).to.not.equal(initialExpanded);
  });

  it('should toggle search open and close on search icon click', () => {
    const tool = document.querySelector('.gnav-search');
    const icon = tool.querySelector('picture');

    const searchBar = tool.querySelector('#gnav-search-bar');
    expect(searchBar).to.exist;

    const before = tool.getAttribute('aria-expanded');
    icon.click();

    const after = tool.getAttribute('aria-expanded');
    expect(after).to.not.equal(before);
  });
});
