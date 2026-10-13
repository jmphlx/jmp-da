/*
 * JMP Flipbook Block
 * Embeds a Heyzine flipbook (e.g. https://jmp.hflip.co/jmp-foreword-june2026)
 * inside the page via a lazy-loaded iframe sized for book spreads.
 *
 * Security: only content served over https from the JMP Heyzine custom domain
 * or heyzine.com may be embedded, so the block cannot be abused to frame
 * arbitrary third-party content.
 */

const ALLOWED_HOSTS = ['jmp.hflip.co', 'heyzine.com'];

/**
 * Validate and normalise a candidate flipbook URL.
 * Returns a clean, safe href when the value points at an allowed host,
 * otherwise null.
 * @param {string} value the author-provided URL
 * @returns {string|null}
 */
function getAllowedUrl(value) {
  if (!value) return null;
  let url;
  try {
    url = new URL(value);
  } catch (e) {
    return null;
  }
  if (url.protocol !== 'https:') return null;
  if (!ALLOWED_HOSTS.includes(url.hostname)) return null;
  // Rebuild from validated parts to drop any credentials/fragments.
  return `${url.origin}${url.pathname}${url.search}`;
}

function buildIframe(src, title) {
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = title;
  iframe.loading = 'lazy';
  iframe.allow = 'fullscreen; clipboard-write';
  iframe.allowFullscreen = true;
  iframe.setAttribute('scrolling', 'no');
  return iframe;
}

function loadFlipbook(block, src, title) {
  if (block.classList.contains('jmp-flipbook-is-loaded')) return;

  const frame = document.createElement('div');
  frame.className = 'jmp-flipbook-frame';
  frame.append(buildIframe(src, title));

  block.append(frame);
  block.classList.add('jmp-flipbook-is-loaded');
}

export default function decorate(block) {
  const link = block.querySelector('a');
  const rawUrl = link ? link.href : block.textContent.trim();
  const src = getAllowedUrl(rawUrl);
  // Use descriptive link text as the iframe title when the author provides it.
  const linkText = link ? link.textContent.trim() : '';
  const title = linkText && !linkText.startsWith('http') ? linkText : 'JMP flipbook';

  block.textContent = '';

  if (!src) {
    // Invalid or disallowed source: render nothing rather than an open frame.
    block.classList.add('jmp-flipbook-invalid');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadFlipbook(block, src, title);
    }
  });
  observer.observe(block);
}
