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
