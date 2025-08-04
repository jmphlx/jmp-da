// eslint-disable-next-line import/no-unresolved
import { crawl } from 'https://da.live/nx/public/utils/tree.js';
// eslint-disable-next-line import/no-unresolved
import { setImsDetails } from 'https://da.live/nx/utils/daFetch.js';

const BASE = '/';

let context;
let token;

function setSelectedClass(itemToHighlight) {
  document.querySelectorAll('.selected-item')?.forEach((item) => {
    item.classList.remove('selected-item');
  });
  itemToHighlight.classList.add('selected-item');
}

/**
 * Shows a message in the feedback container with optional error styling and auto-hide
 * @param {string} text - Message text to display
 * @param {boolean} [isError=false] - Whether to style as error message
 * @param {boolean} [autoHide=false] - Whether to auto-hide the message
 */
function showMessage(text, isError = false, autoHide = false) {
  const message = document.querySelector('.feedback-message');
  const msgContainer = document.querySelector('.message-wrapper');

  message.innerHTML = text.replace(/\r?\n/g, '<br>');
  message.classList.toggle('error', isError);
  msgContainer.classList.remove('hidden');

  if (autoHide && !isError) {
    setTimeout(() => {
      msgContainer.classList.add('hidden');
    }, 1000);
  }
}

/**
 * Handles page selection by setting window variable.
 * @param {Object} file - Selected page file
 * @param {Object} context - SDK context
 */
function handlePageSelect(file) {
  const basePath = `/${context.org}/${context.repo}`;
  const displayPath = file.path.replace(basePath, '').replace(/\.html$/, '');
  showMessage(`Selected: ${displayPath}`);
  window.pagePath = displayPath;
}

function handleFolderSelect(file) {
  const basePath = `/${context.org}/${context.repo}`;
  const displayPath = file.path.replace(basePath, '').replace(/[^/]+$/, '');
  console.log(displayPath);
  showMessage(`Selected: ${displayPath}`);
  window.pagePath = displayPath;
}

/**
 * Creates a tree item element
 * @param {string} name - Item name
 * @param {Object} node - Tree node data
 * @param {Function} onClick - Click handler for page items
 * @param {Object} context - SDK context (for URL generation)
 * @returns {HTMLElement} Tree item element
 */
function createTreeItem(name, node, onClick) {
  const item = document.createElement('li');
  item.className = 'tree-item';

  const content = document.createElement('div');
  content.className = 'tree-item-content';

  if (node.isFile) {
    const button = document.createElement('button');
    button.className = 'page-btn-item';
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', `Insert link for page "${name.replace('.html', '')}"`);

    const pageIcon = document.createElement('img');
    pageIcon.src = '/icons/file.png';
    pageIcon.alt = 'Page';
    pageIcon.className = 'tree-icon';
    pageIcon.setAttribute('aria-hidden', 'true');

    const textSpan = document.createElement('span');
    const displayName = name.replace('.html', '');
    textSpan.textContent = displayName;

    // --- Preview Icon ---
    const previewIcon = document.createElement('button');
    previewIcon.className = 'page-preview-btn';
    previewIcon.setAttribute('aria-label', `Preview page "${displayName}"`);
    previewIcon.title = `Preview "${displayName}"`;
    previewIcon.style.display = 'none'; // Hidden by default
    // Use an eye icon (assume /icons/eye-icon.png exists)
    const eyeImg = document.createElement('img');
    eyeImg.src = '/icons/folder.png';
    eyeImg.alt = 'Preview';
    eyeImg.className = 'tree-icon preview-icon';
    eyeImg.setAttribute('aria-hidden', 'true');
    previewIcon.appendChild(eyeImg);

    // Always use context to generate pageUrl
    let pageUrl = '';
    if (context && context.org && context.repo) {
      const basePath = `/${context.org}/${context.repo}`;
      const displayPath = node.path.replace(basePath, '').replace(/\.html$/, '');
      pageUrl = displayPath.startsWith('/') ? displayPath : `/${displayPath}`;
    }
    previewIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      if (pageUrl) {
        window.open(pageUrl, '_blank');
      }
    });

    // Show preview icon on hover
    button.addEventListener('mouseenter', () => {
      previewIcon.style.display = '';
    });
    button.addEventListener('mouseleave', () => {
      previewIcon.style.display = 'none';
    });
    previewIcon.addEventListener('mouseenter', () => {
      previewIcon.style.display = '';
    });
    previewIcon.addEventListener('mouseleave', () => {
      previewIcon.style.display = 'none';
    });

    button.appendChild(pageIcon);
    button.appendChild(textSpan);
    content.appendChild(button);
    content.appendChild(previewIcon);
    button.title = `Click to insert link for "${displayName}"`;
    button.addEventListener('click', () => {
      onClick({ path: node.path });
      setSelectedClass(button);
    });
  } else {
    const folderButton = document.createElement('button');
    folderButton.className = 'folder-btn';
    folderButton.setAttribute('role', 'button');
    folderButton.setAttribute('aria-expanded', 'false');
    folderButton.setAttribute('aria-label', `Folder ${name}`);

    const folderIcon = document.createElement('img');
    folderIcon.src = '/icons/folder.png';
    folderIcon.alt = ''; // Decorative image, using aria-hidden instead
    folderIcon.className = 'tree-icon folder-icon';
    folderIcon.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'folder-name';
    label.textContent = name;

    folderButton.appendChild(folderIcon);
    folderButton.appendChild(label);

    const toggleFolder = () => {
      setSelectedClass(folderButton);
      handleFolderSelect(node);

      folderButton.classList.toggle('expanded');
      folderButton.setAttribute('aria-expanded', folderButton.classList.contains('expanded'));
      folderIcon.src = folderButton.classList.contains('expanded')
        ? '/icons/folder-open.png'
        : '/icons/folder.png';
      const list = item.querySelector('.tree-list');
      if (list) {
        list.classList.toggle('hidden');
      }
    };

    folderButton.addEventListener('click', toggleFolder);
    content.appendChild(folderButton);

    if (Object.keys(node.children).length > 0) {
      const list = document.createElement('ul');
      list.className = 'tree-list hidden';

      Object.entries(node.children)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([childName, childNode]) => {
          list.appendChild(createTreeItem(childName, childNode, onClick));
        });

      item.appendChild(content);
      item.appendChild(list);
    }
  }

  if (!content.parentElement) {
    item.appendChild(content);
  }

  return item;
}

/**
 * Creates a tree structure from file paths
 * @param {Array} files - Array of file objects with paths
 * @param {string} basePath - Base path to remove from display
 * @returns {Object} Tree structure
 */
function createFileTree(files, basePath) {
  const tree = {};
  files.forEach((file) => {
    // Remove the org/repo prefix from display path
    const displayPath = file.path.replace(basePath, '');
    const parts = displayPath.split('/').filter(Boolean);
    let current = tree;
    parts.forEach((part, i) => {
      if (!current[part]) {
        current[part] = {
          isFile: i === parts.length - 1 && file.path.endsWith('.html'),
          children: {},
          path: file.path, // Keep original path for link creation
        };
      }
      current = current[part].children;
    });
  });
  return tree;
}

function createTree(item, files) {
  if (!item.path.endsWith('.html')) return;
  files.push(item);
}

async function init() {
  console.log('in init');
  const folderList = document.querySelector('.folder-tree');
  const cancelBtn = document.querySelector('.pagetree-btn[type="reset"]');
  const submitBtn = document.querySelector('.pagetree-btn[type="submit"]');
  submitBtn.addEventListener('click', () => {
    if (window.pagePath) {
      window.parent.postMessage(window.pagePath);
    } else {
      window.parent.postMessage('');
    }
  });
  cancelBtn.addEventListener('click', () => {
    window.parent.postMessage('');
  });
  const files = [];

  const path = `/${context.org}/${context.repo}${BASE}`;
  const basePath = `/${context.org}/${context.repo}`;
  const opts = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { results } = crawl({
    path,
    callback: (item) => createTree(item, files),
    throttle: 10,
    ...opts,
  });
  await results;
  folderList.innerHTML = '';

  const tree = createFileTree(files, basePath);

  try {
    Object.entries(tree)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([name, node]) => {
        const item = createTreeItem(
          name,
          node,
          (file) => handlePageSelect(file),
        );
        folderList.appendChild(item);
      });
  } catch (error) {
    showMessage('Failed to load files', true);
    console.error(error);
    // Also disable cancel button on error
    cancelBtn.disabled = true;
  }
}

window.addEventListener('message', (event) => {
  if (event.origin === 'http://localhost:3000'
  || event.origin === 'https://www.jmp.com'
  || event.origin === 'https://main--jmp-da--jmphlx.aem.live'
  || event.origin === 'https://aem-819-v2--jmp-da--jmphlx.aem.live') {
    console.log(event.origin);
  }
  token = event.data.token;
  context = event.data.context;
  setImsDetails(token);
  init();
});
