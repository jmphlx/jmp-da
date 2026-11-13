import {
  embedVidyard,
  embedYoutube,
} from '../embed/embed.js';

function decorateVidyardEmbed(elems) {
  elems.forEach((elem) => {
    const parentEl = elem.parentElement;
    // authored image in the same column, shown as the poster until the player renders
    const poster = parentEl.closest('div')?.querySelector('picture');

    if (!poster) {
      parentEl.classList.add('embed', 'embed-ceros');
      parentEl.innerHTML = embedVidyard(elem);
      elem.remove();
      return;
    }

    // the poster is the first thing the user should see, so fetch it right away
    const posterImg = poster.querySelector('img');
    if (posterImg) {
      posterImg.loading = 'eager';
      posterImg.fetchPriority = 'high';
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'embed-placeholder';
    wrapper.prepend(poster);

    // the player renders into this hidden holder; the poster stays visible until it is ready
    const holder = document.createElement('div');
    holder.style.cssText = 'position: absolute; inset: 0; opacity: 0; pointer-events: none;';
    wrapper.append(holder);
    parentEl.replaceChildren(wrapper);
    parentEl.classList.add('embed', 'embed-ceros');

    const playerObserver = new MutationObserver(() => {
      if (holder.querySelector('.vidyard-player-container')) {
        playerObserver.disconnect();
        holder.removeAttribute('style');
        parentEl.replaceChildren(holder);
      }
    });

    const viewportObserver = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        viewportObserver.disconnect();
        // start the player only after the poster has decoded, so the poster is painted
        // and does not compete with the player's script and thumbnail downloads
        const posterReady = posterImg?.decode
          ? posterImg.decode().catch(() => {})
          : Promise.resolve();
        posterReady.then(() => {
          playerObserver.observe(holder, { childList: true, subtree: true });
          holder.innerHTML = embedVidyard(elem);
        });
      }
    });
    viewportObserver.observe(wrapper);
    elem.remove();
  });
}

function decorateYoutubeEmbed(elems) {
  elems.forEach((elem) => {
    const embedHTML = embedYoutube(elem);
    const parentEl = elem.parentElement;
    parentEl.classList.add('embed');
    parentEl.innerHTML = embedHTML;
    elem.remove();
  });
}

export default function decorate(block) {
  // get all elements that are a vidyard share url & decorate them
  const vidyardUrls = block.querySelectorAll('a[href*="share.vidyard.com"]');
  decorateVidyardEmbed(vidyardUrls);

  const youtubeUrls = block.querySelectorAll('a[href*="youtube.com/watch"]');
  decorateYoutubeEmbed(youtubeUrls);

  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
