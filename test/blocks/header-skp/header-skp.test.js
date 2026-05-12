/* global beforeEach describe it afterEach */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import decorate from '../../../blocks/header-skp/header-skp.js';

describe('Header SKP Block', () => {
  const originalMatchMedia = window.matchMedia;
  const originalFetch = window.fetch;
  const originalCommonsSheet = window.commonsSheet;
  let sandbox;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    // Mock fetch to return basic nav HTML
    sandbox.stub(window, 'fetch').resolves({
      text: async () => `
        <div class="brand">Brand</div>
        <div class="tools">
          <ul>
            <li>
              <a href="#">English</a>
              <ul>
                <li><a href="/en/">English</a></li>
                <li><a href="/fr/">Français</a></li>
              </ul>
            </li>
            <li>
              <picture><img src="search.png" alt="Search icon"/></picture>
            </li>
          </ul>
        </div>
        <div class="knowledgeportal">Knowledge Portal</div>
        <div class="sections">
          <ul class="subnav">
            <li>
              <a href="#">Foo</a>
            </li>
          </ul>
        </div>
      `,
    });

    // Mock media query
    sandbox.stub(window, 'matchMedia').returns({
      matches: false,
      media: '(min-width: 900px)',
      addEventListener: sinon.stub(),
      removeEventListener: sinon.stub(),
    });

    // Mock translation logic
    window.commonsSheet = {
      translations: {
        search: 'Search',
      },
    };

    // Inject block HTML
    document.body.innerHTML = await readFile({ path: './header-skp.html' });
    const block = document.querySelector('#header-block');
    await decorate(block);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    window.matchMedia = originalMatchMedia;
    window.fetch = originalFetch;
    window.commonsSheet = originalCommonsSheet;
    sandbox.restore();
  });

  it('should render a nav with brand, tools, knowledgeportal, and sections', () => {
    const nav = document.querySelector('nav#nav');
    expect(nav).to.exist;

    const brand = nav.querySelector('.nav-brand');
    const tools = nav.querySelector('.nav-tools');
    const knowledgeportal = nav.querySelector('.nav-knowledgeportal');
    const sections = nav.querySelector('.nav-sections');

    expect(brand).to.exist;
    expect(tools).to.exist;
    expect(knowledgeportal).to.exist;
    expect(sections).to.exist;
  });

  it('should wrap nav in nav-wrapper div', () => {
    const wrapper = document.querySelector('.nav-wrapper');
    expect(wrapper).to.exist;
    const nav = wrapper.querySelector('nav#nav');
    expect(nav).to.exist;
  });

  it('should create search bar with input field', () => {
    const searchBar = document.querySelector('#gnav-search-bar');
    expect(searchBar).to.exist;
    const input = searchBar.querySelector('.gnav-search-input');
    expect(input).to.exist;
  });

  it('should set search input placeholder from translation', () => {
    const input = document.querySelector('.gnav-search-input');
    expect(input).to.exist;
    expect(input.placeholder).to.equal('Search');
  });

  it('should create search results div', () => {
    const results = document.querySelector('.gnav-search-results');
    expect(results).to.exist;
  });

  it('should have hamburger button with correct attributes', () => {
    const button = document.querySelector('.nav-hamburger button');
    expect(button).to.exist;
    expect(button.getAttribute('type')).to.equal('button');
    expect(button.getAttribute('aria-label')).to.equal('Open navigation');
    expect(button.getAttribute('aria-controls')).to.equal('nav');
  });

  it('should have hamburger icon span', () => {
    const icon = document.querySelector('.nav-hamburger-icon');
    expect(icon).to.exist;
  });

  it('should add search-icon and gnav-search classes to nav-tools', () => {
    const tools = document.querySelector('.nav-tools');
    expect(tools).to.exist;
    expect(tools.classList.contains('search-icon')).to.be.true;
    expect(tools.classList.contains('gnav-search')).to.be.true;
  });

  it('should set initial nav aria-expanded to false', () => {
    const nav = document.querySelector('nav#nav');
    expect(nav.getAttribute('aria-expanded')).to.equal('false');
  });

  it('should set initial search bar aria-expanded to false', () => {
    const searchBar = document.querySelector('#gnav-search-bar');
    expect(searchBar.getAttribute('aria-expanded')).to.equal('false');
  });

  it('should clone subnav to side rail wrapper', () => {
    const sideRailWrapper = document.querySelector('.sideRail-wrapper');
    expect(sideRailWrapper).to.exist;
    const clonedNav = sideRailWrapper.querySelector('.subnav');
    expect(clonedNav).to.exist;
  });

  it('should add mobile-nav class to original subnav', () => {
    const nav = document.querySelector('nav#nav');
    const subnav = nav.querySelector('.subnav');
    expect(subnav).to.exist;
    expect(subnav.classList.contains('mobile-nav')).to.be.true;
  });

  it('should append side rail wrapper to group-2 element', () => {
    const group2 = document.querySelector('.group-2');
    expect(group2).to.exist;
    const sideRailWrapper = group2.querySelector('.sideRail-wrapper');
    expect(sideRailWrapper).to.exist;
  });

  it('should toggle hamburger menu on button click', () => {
    const button = document.querySelector('.nav-hamburger button');
    const nav = document.querySelector('nav#nav');
    const initialExpanded = nav.getAttribute('aria-expanded');

    button.click();
    const afterClick = nav.getAttribute('aria-expanded');

    expect(afterClick).to.not.equal(initialExpanded);
    expect(afterClick).to.equal('true');
  });

  it('should toggle search on search picture click', () => {
    const tools = document.querySelector('.nav-tools');
    const picture = tools.querySelector('picture');
    const searchBar = tools.querySelector('#gnav-search-bar');

    const initialExpanded = searchBar.getAttribute('aria-expanded');
    picture.click();
    const afterClick = searchBar.getAttribute('aria-expanded');

    expect(afterClick).to.not.equal(initialExpanded);
    expect(afterClick).to.equal('true');
  });

  it('should add is-Open class to gnav-search when search is opened', () => {
    const picture = document.querySelector('picture');
    const search = document.querySelector('.gnav-search');

    picture.click();
    expect(search.classList.contains('is-Open')).to.be.true;
  });

  it('should remove is-Open class when search is closed', () => {
    const picture = document.querySelector('picture');
    const search = document.querySelector('.gnav-search');

    picture.click();
    picture.click();
    expect(search.classList.contains('is-Open')).to.be.false;
  });

  it('should focus search input when search is opened', () => {
    const tools = document.querySelector('.nav-tools');
    const picture = tools.querySelector('picture');
    const input = tools.querySelector('.gnav-search-input');

    picture.click();
    expect(document.activeElement).to.equal(input);
  });

  it('should close all mobile dropdowns when hamburger is toggled', () => {
    const button = document.querySelector('.nav-hamburger button');
    const nav = document.querySelector('nav#nav');
    const searchBar = nav.querySelector('#gnav-search-bar');

    button.click();

    expect(searchBar.getAttribute('aria-expanded')).to.equal('false');
  });

  it('should close all mobile dropdowns when search is toggled', () => {
    const tools = document.querySelector('.nav-tools');
    const picture = tools.querySelector('picture');
    const button = document.querySelector('.nav-hamburger button');
    const nav = document.querySelector('nav#nav');

    button.click();
    expect(nav.getAttribute('aria-expanded')).to.equal('true');

    picture.click();
    expect(nav.getAttribute('aria-expanded')).to.equal('false');
  });

  it('should clear search input value when closing mobile dropdowns', () => {
    const tools = document.querySelector('.nav-tools');
    const picture = tools.querySelector('picture');
    const input = tools.querySelector('.gnav-search-input');

    picture.click();
    input.value = 'test search';

    const button = document.querySelector('.nav-hamburger button');
    button.click();

    expect(input.value).to.equal('');
  });

  it('should dispatch input event on search input when clearing', () => {
    const tools = document.querySelector('.nav-tools');
    const picture = tools.querySelector('picture');
    const input = tools.querySelector('.gnav-search-input');

    let eventDispatched = false;
    input.addEventListener('input', () => {
      eventDispatched = true;
    });

    picture.click();
    const button = document.querySelector('.nav-hamburger button');
    button.click();

    expect(eventDispatched).to.be.true;
  });
});
