import { embedVidyard } from '../embed/embed.js';

function decorateEmbed(elems) {
  elems.forEach((elem) => {
    console.log('this is');
    console.log(elem);
    const embedHTML = embedVidyard(elem);
    const parentEl = elem.parentElement;
    parentEl.classList.add('embed', 'embed-ceros');
    parentEl.innerHTML = embedHTML;
    elem.remove();
  });
}

export default function decorate(block) {
  // get all elements that are a vidyard share url & decorate them
  const embedUrls = block.querySelectorAll('a[href*="share.vidyard.com"]');
  console.log(embedUrls);

  decorateEmbed(embedUrls);

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
