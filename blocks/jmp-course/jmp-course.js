/*
 * JMP Course Block
 * Embeds external, interactive JMP course modules (e.g. Articulate Rise /
 * Storyline courses) inside the page via an iframe. Renders full-width within
 * its container so the course behaves consistently across page layouts.
 *
 * Security: only content served from https://www.jmp.com/jmp-courses/ may be
 * embedded. Both the origin and the path prefix are pinned so the block cannot
 * be abused to frame arbitrary third-party content.
 */

const ALLOWED_ORIGIN = 'https://www.jmp.com';
const ALLOWED_PATH_PREFIX = '/jmp-courses/';

/**
 * Validate and normalise a candidate JMP course URL.
 * Returns a clean, safe href when the value points at an allowed course,
 * otherwise null.
 * @param {string} value the author-provided URL
 * @returns {string|null}
 */
function getAllowedUrl(value) {
  if (!value) return null;
  let url;
  try {
    url = new URL(value, ALLOWED_ORIGIN);
  } catch (e) {
    return null;
  }
  if (url.protocol !== 'https:') return null;
  if (url.origin !== ALLOWED_ORIGIN) return null;
  if (!url.pathname.startsWith(ALLOWED_PATH_PREFIX)) return null;
  // Rebuild from validated parts to drop any credentials/fragments.
  return `${url.origin}${url.pathname}${url.search}`;
}

function buildIframe(src) {
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = 'Interactive JMP course';
  iframe.loading = 'lazy';
  iframe.allow = 'fullscreen; autoplay; encrypted-media';
  iframe.allowFullscreen = true;
  return iframe;
}

/**
 * True when the course shares a section with a divider block. Dividers are used
 * to build column/tab/accordion layouts; by the time this block decorates they
 * have been consumed and the section is tagged with `data-layout`, so we detect
 * either the tag or a still-present divider.
 * @param {Element} block
 * @returns {boolean}
 */
function isInDividedSection(block) {
  const section = block.closest('.section');
  if (!section) return false;
  if (section.dataset.layout) return true;
  return !!section.querySelector('.divider, .divider-wrapper');
}

function loadModule(block, src) {
  if (block.classList.contains('jmp-course-is-loaded')) return;

  const frame = document.createElement('div');
  frame.className = 'jmp-course-frame';
  frame.append(buildIframe(src));

  block.textContent = '';

  if (isInDividedSection(block)) {
    block.classList.add('jmp-course-default');
  }

  block.append(frame);
  block.classList.add('jmp-course-is-loaded');
}

export default function decorate(block) {
  const link = block.querySelector('a');
  const rawUrl = link ? link.href : block.textContent.trim();
  const src = getAllowedUrl(rawUrl);

  block.textContent = '';

  if (!src) {
    // Invalid or disallowed source: render nothing rather than an open frame.
    block.classList.add('jmp-course-invalid');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadModule(block, src);
    }
  });
  observer.observe(block);
}
