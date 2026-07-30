/**
 * brand-carousel — the www.sas.com customer-logos carousel. The live site uses
 * Swiper with speed=3000 / autoplay delay=1000 / loop / slidesPerView=6, which
 * reads as a *gentle glide then stop*: it eases one logo across over ~3s, holds
 * for ~1s, then eases to the next — looping seamlessly. We emulate that exactly
 * with a stepper (a CSS marquee would be a constant crawl, not a glide/stop).
 * The slide set is duplicated so the loop never visibly jumps.
 */
const GLIDE_MS = 3000;
const HOLD_MS = 1000;
const EASING = 'cubic-bezier(0.37, 0, 0.63, 1)'; // gentle ease-in-out

function perView(width) {
  if (width <= 600) return 2;
  if (width <= 900) return 4;
  return 6;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const track = document.createElement('div');
  track.className = 'brand-carousel-track';

  // Each authored row is [logo image, label/link]. Keep the logo, and preserve
  // the link so a logo click opens the customer story (as on the live site).
  const slides = rows.reduce((acc, row) => {
    const logo = row.querySelector('picture, img');
    const link = row.querySelector('a');
    row.remove();
    if (!logo) return acc;
    const slide = document.createElement('div');
    slide.className = 'brand-carousel-slide';
    if (link) {
      const anchor = document.createElement('a');
      anchor.href = link.getAttribute('href');
      const label = link.textContent.trim();
      if (label) anchor.setAttribute('aria-label', label);
      anchor.append(logo);
      slide.append(anchor);
    } else {
      slide.append(logo);
    }
    acc.push(slide);
    return acc;
  }, []);
  if (!slides.length) return;

  const count = slides.length;
  slides.forEach((slide) => track.append(slide));
  // Duplicate the set so translating past the last logo lands on an identical
  // frame — the reset back to 0 is then invisible.
  slides.forEach((slide) => track.append(slide.cloneNode(true)));

  const viewport = document.createElement('div');
  viewport.className = 'brand-carousel-viewport';
  viewport.append(track);
  block.append(viewport);

  const allSlides = [...track.children];
  let slideWidth = 0;
  let index = 0;
  let started = false;
  let lastWidth = 0;

  // Size every slide to viewport / slides-per-view. Returns false until the
  // block actually has a layout width.
  const sizeSlides = () => {
    const width = viewport.clientWidth;
    if (!width) return false;
    lastWidth = width;
    slideWidth = width / perView(width);
    allSlides.forEach((slide) => { slide.style.width = `${slideWidth}px`; });
    track.style.transition = 'none';
    track.style.transform = `translateX(${-index * slideWidth}px)`;
    return true;
  };

  const glide = () => {
    index += 1;
    track.style.transition = `transform ${GLIDE_MS}ms ${EASING}`;
    track.style.transform = `translateX(${-index * slideWidth}px)`;
  };

  track.addEventListener('transitionend', (e) => {
    // Only react to the track's OWN transform transition. Site base CSS puts
    // `transition: all` on links/images/slides, whose transitionend events
    // bubble here — without this guard they'd trigger spurious extra glides and
    // the track would run off-screen.
    if (e.target !== track || e.propertyName !== 'transform') return;
    if (index >= count) {
      // Snap from the cloned frame back to the original — no transition.
      track.style.transition = 'none';
      index = 0;
      track.style.transform = 'translateX(0)';
      track.getBoundingClientRect(); // force reflow before the next glide
    }
    window.setTimeout(glide, HOLD_MS);
  });

  const startGlide = () => {
    if (started) return;
    started = true;
    window.setTimeout(glide, HOLD_MS);
  };

  // EDS frequently decorates this block while its section is still display:none
  // (clientWidth 0), and ResizeObserver's initial callback can fire before that
  // resolves. Poll with rAF until the block has a real width, then size + start.
  // (The live site's Swiper autoplays regardless of reduced-motion, so we match
  // that and always animate.)
  let frames = 0;
  const init = () => {
    if (sizeSlides()) {
      startGlide();
      return;
    }
    frames += 1;
    if (frames < 600) window.requestAnimationFrame(init);
  };
  init();

  // Re-size on width changes; also a safety net that starts the glide if the
  // block only gained width after the poll gave up.
  const ro = new ResizeObserver(() => {
    const width = viewport.clientWidth;
    if (!width || width === lastWidth) return;
    if (sizeSlides()) startGlide();
  });
  ro.observe(viewport);
}
