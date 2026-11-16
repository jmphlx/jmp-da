import {
  embedVidyard,
  embedYoutube,
} from '../embed/embed.js';

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
  decorateEmbeds(block, 'a[href*="share.vidyard.com"]', embedVidyard, ['embed-ceros']);
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
