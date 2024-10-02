import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { getLanguageFooter } from '../../scripts/jmp.js';
import { createTag } from '../../scripts/helper.js';

function addBackToTopButton() {
  const buttonNav = createTag('nav', { id: 'back-top' });
  const buttonLink = createTag('a', { href: '#content' });
  buttonLink.textContent = 'Back to Top';
  buttonNav.append(buttonLink);

  document.addEventListener('scroll', () => {
    const scrollTop = (window.scrollY !== undefined) ? window.scrollY
      : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    if (scrollTop > 500) {
      buttonNav.classList.add('is-scrolled');
    } else {
      buttonNav.classList.remove('is-scrolled');
    }
  });
  buttonLink.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  return buttonNav;
}

function addStickyFooter(footer, stickyFooter) {
  document.addEventListener('scroll', () => {
    if (window.scrollY >= 300 && window.innerHeight <= footer.getBoundingClientRect().top) {
      stickyFooter.classList.add('active');
    } else {
      stickyFooter.classList.remove('active');
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  block.textContent = '';

  const isSKP = document.querySelector('body.skp');

  // load footer fragment
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname
    : getLanguageFooter(isSKP);
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const backToTopButton = addBackToTopButton();
  footer.append(backToTopButton);

  if (isSKP) {
    addStickyFooter(footer, footer.querySelector('.sticky-footer'));
  }

  block.append(footer);
}
