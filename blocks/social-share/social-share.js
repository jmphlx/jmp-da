import { createTag } from '../../scripts/helper.js';

const linkUrls = {
  facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
  linkedin: 'https://www.linkedin.com/shareArticle?url=',
  bluesky: 'https://bsky.app/intent/compose?text=',
};

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
    window.open(link.href, 'shareWindow', `height=450, width-550, top=${window.height / 2 - 275}, left=${window.width / 2 - 225}, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0`);
    return false;
  });

  const icon = createTag('img', {
    src: `${window.location.origin}/icons/${shareType}-icon.svg`,
    class: shareType,
  });

  link.append(icon);
  spanEl.append(link);
  return spanEl;
}

function createMobileShareLink(shareType) {
  const spanEl = document.createElement('span');
  const icon = createTag('img', {
    src: `${window.location.origin}/icons/${shareType}-icon.svg`,
    class: shareType,
  });

  spanEl.addEventListener('click', async () => {
    if (navigator.canShare) {
      try {
        await navigator.share({
          title: `${document.title}`,
          text: `Check out this blog post: ${window.location.href}`,
        });
      } catch (error) {
        console.log('Cannot share url');
      }
    }
  });
  spanEl.append(icon);
  return spanEl;
}

async function copyToClipboard(button, copyTxt) {
  try {
    await navigator.clipboard.writeText(window.location.href);
    button.setAttribute('title', copyTxt);
    button.setAttribute('aria-label', copyTxt);

    const tooltip = createTag('div', { role: 'status', 'aria-live': 'polite', class: 'copied-to-clipboard' }, copyTxt);
    button.append(tooltip);

    setTimeout(() => {
      /* c8 ignore next 1 */
      tooltip.remove();
    }, 3000);
    button.classList.remove('copy-failure');
    button.classList.add('copy-success');
  } catch (e) {
    button.classList.add('copy-failure');
    button.classList.remove('copy-success');
  }
}

function createCopyLinkButton() {
  const spanEl = document.createElement('span');

  const link = document.createElement('a');
  link.setAttribute('id', 'copy-to-clipboard');
  link.setAttribute('data-type', 'copylink');
  let urlPath;
  if (window.location.hostname === 'localhost') {
    urlPath = `https://www.jmp.com${window.location.pathname}`;
  } else {
    urlPath = encodeURIComponent(window.location.href);
  }
  link.href = urlPath;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    // copy link
    copyToClipboard(link, 'Copied Link to Clipboard');
    return false;
  });

  const icon = createTag('img', {
    src: `${window.location.origin}/icons/copylink-icon.svg`,
    class: 'copylink',
  });

  link.append(icon);
  spanEl.append(link);
  return spanEl;
}

export default async function decorate(block) {
  block.textContent = '';
  const wrapper = document.createElement('div');
  block.classList.forEach((value) => {
    switch (value) {
      case 'facebook':
        wrapper.append(createShareLinkIcon('facebook'));
        break;
      case 'linkedin':
        wrapper.append(createShareLinkIcon('linkedin'));
        break;
      case 'instagram':
        wrapper.append(createMobileShareLink('instagram'));
        break;
      case 'copylink':
        wrapper.append(createCopyLinkButton());
        break;
      case 'bluesky':
        wrapper.append(createShareLinkIcon('bluesky'));
        break;
      default:
        // Do nothing.
        break;
    }
  });
  block.append(wrapper);
}
