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
  block.classList.add(`styled-columns-${cols.length}-cols`);

  if (block.children.length > 1) {
    for (let i = 0; i < cols.length; i += 1) {
      const color = cols[i].textContent.toLowerCase().replaceAll(/[\s_]+/g, '-');
      block.children[1].children[i].classList.add(color);
    }
    block.firstElementChild.remove();
  }
}
