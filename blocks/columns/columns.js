import {
  embedVidyard,
  embedYoutube,
} from '../embed/embed.js';

function decorateVidyardEmbed(elems) {
  elems.forEach((elem) => {
    const embedHTML = embedVidyard(elem);
    const parentEl = elem.parentElement;
    parentEl.classList.add('embed', 'embed-ceros');
    parentEl.innerHTML = embedHTML;
    elem.remove();
  });
}

function decorateEmbeds(block, selector, embedFn, extraClasses = []) {
  block.querySelectorAll(selector).forEach((link) => {
    const parentEl = link.parentElement;
    if (!parentEl) return;

    parentEl.classList.add('embed', ...extraClasses);
    parentEl.innerHTML = embedFn(link);
  });
}

function initFadeUpColumns(block) {
  const section = block.closest('.section');
  const shouldFadeBlock = block.classList.contains('fade-up-column')
    || section?.classList.contains('fade-up-column');

  const targets = shouldFadeBlock
    ? [...block.querySelectorAll(':scope > div > div')]
    : [...block.querySelectorAll('.fade-up-column')];

  if (!targets.length) return;
  targets.forEach((el, idx) => {
    el.classList.add('fade-up-column');
    el.style.animationDelay = `${idx * 120}ms`;
  });
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    },
  );
  targets.forEach((target) => observer.observe(target));
}

export default function decorate(block) {
  // Decorate Vidyard & YouTube embeds
    // get all elements that are a vidyard share url & decorate them
  const vidyardUrls = block.querySelectorAll('a[href*="share.vidyard.com"]');
  decorateVidyardEmbed(vidyardUrls);
  decorateEmbeds(block, 'a[href*="youtube.com/watch"]', embedYoutube);
  // Set column count class safely
  const firstRow = block.firstElementChild;
  if (firstRow) {
    block.classList.add(`columns-${firstRow.children.length}-cols`);
  }
  // Mark image-only columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      const picWrapper = pic?.closest('div');
      if (picWrapper && picWrapper.children.length === 1) {
        picWrapper.classList.add('columns-img-col');
      }
    });
  });
  // Trigger staggered viewport fade-up animation
  initFadeUpColumns(block);
}
