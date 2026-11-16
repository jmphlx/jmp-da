function hasWrapper(el) {
  return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}

function setupViewportObserver(block) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          block.classList.add('is-in-view');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.25,
      rootMargin: '0px 0px -50px 0px',
    },
  );
  observer.observe(block);
}

export default async function decorate(block) {
  const [quotation, attribution] = [...block.children].map((c) => c.firstElementChild);
  const blockquote = document.createElement('blockquote');
  // decorate quotation
  quotation.className = 'quote-quotation';
  if (!hasWrapper(quotation)) {
    quotation.innerHTML = `<p>${quotation.innerHTML}</p>`;
  }
  blockquote.append(quotation);
  // decorate attribution
  if (attribution) {
    attribution.className = 'quote-attribution';
    if (!hasWrapper(attribution)) {
      attribution.innerHTML = `<p>${attribution.innerHTML}</p>`;
    }
    blockquote.append(attribution);
    const ems = attribution.querySelectorAll('em');
    ems.forEach((em) => {
      const cite = document.createElement('cite');
      cite.innerHTML = em.innerHTML;
      em.replaceWith(cite);
    });
  }
  block.innerHTML = '';
  block.append(blockquote);
  if (block.classList.contains('animate-blur-type')) {
    setupViewportObserver(block);
  }
}