import { createTag } from '../../scripts/helper.js';

const linkUrls = {
  'facebook': 'https://www.facebook.com/sharer/sharer.php?u=',
  'linkedin': 'https://www.linkedin.com/shareArticle?url=',
}

function createShareLinkIcon(shareType) {
  const spanEl = document.createElement('span');

  const link = document.createElement('a');
  link.setAttribute('data-type', shareType);
  let urlPath;
  if (window.location.hostname === 'localhost') {
    urlPath = `https://www.jmp.com${window.location.pathname}`;
  } else {
    urlPath = encodeURIComponent(window.location.href);
  }
  link.href = `${linkUrls[shareType]}${urlPath}`;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(link.href, 'shareWindow','height=450, width=550, top=' + (window.height / 2 - 275) + ', left=' + (window.width / 2 - 225) + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
    return false;
  });

  const icon = createTag('img', {
    src: `${window.location.origin}/icons/${shareType}-icon.svg`,
    classList: shareType,
  });
  
  link.append(icon);
  spanEl.append(link);
  return spanEl;
}

function createWebShareLink(shareType) {
  const spanEl = document.createElement('span');
  const icon = createTag('img', {
    src: `${window.location.origin}/icons/${shareType}-icon.svg`,
    classList: shareType,
  });

  spanEl.addEventListener('click', async (e) => {
    if (navigator.canShare) {
      try {
        await navigator.share({
          title: "JMP Test",
          text: "Testing share JMP",
        });
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  });
  spanEl.append(icon);
  return spanEl;
}

export default async function decorate(block) {
  block.textContent = '';
  console.log(`Classes ${block.classList}`);
  const wrapper = document.createElement('div');
  if (block.classList.contains('facebook')) {
    wrapper.append(createShareLinkIcon('facebook'));
  }
  if (block.classList.contains('linkedin')) {
    wrapper.append(createShareLinkIcon('linkedin'));
  }
  if (block.classList.contains('instagram')) {
    wrapper.append(createWebShareLink('instagram'));
  }
  if (block.classList.contains('copylink')) {

  }
  block.append(wrapper);
}
