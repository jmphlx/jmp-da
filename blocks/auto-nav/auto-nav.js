import {
  getBlockConfig,
  getJsonFromUrl,
  getLanguageIndex,
} from '../../scripts/jmp.js';

function buildNavTree(pages, basePath) {
  const root = { children: {}, page: null, path: basePath };

  pages.forEach((page) => {
    const relative = page.path.slice(basePath.length).replace(/^\//, '');
    if (!relative) return;

    const segments = relative.split('/');
    let node = root;
    let currentPath = basePath;

    segments.forEach((segment, i) => {
      currentPath += `/${segment}`;
      if (!node.children[segment]) {
        node.children[segment] = { children: {}, page: null, path: currentPath };
      }
      if (i === segments.length - 1) {
        node.children[segment].page = page;
      }
      node = node.children[segment];
    });
  });

  return root;
}

function renderTree(node, currentPath) {
  const keys = Object.keys(node.children);
  if (!keys.length) return null;

  const ul = document.createElement('ul');
  keys.forEach((key) => {
    const child = node.children[key];
    const li = document.createElement('li');
    const subUl = renderTree(child, currentPath);

    if (subUl) {
      const details = document.createElement('details');
      if (currentPath.startsWith(child.path)) {
        details.open = true;
      }

      const summary = document.createElement('summary');
      if (child.page) {
        const a = document.createElement('a');
        a.href = child.page.path;
        a.textContent = child.page.title;
        if (child.path === currentPath) {
          a.setAttribute('aria-current', 'page');
        }
        summary.appendChild(a);
      }
      details.appendChild(summary);
      details.appendChild(subUl);
      li.appendChild(details);
    } else if (child.page) {
      const a = document.createElement('a');
      a.href = child.page.path;
      a.textContent = child.page.title;
      if (child.path === currentPath) {
        a.setAttribute('aria-current', 'page');
      }
      li.appendChild(a);
    }

    ul.appendChild(li);
  });

  return ul;
}

export default async function decorate(block) {
  const config = getBlockConfig(block);
  block.textContent = '';

  const limitDepth = parseInt(config.limitDepth, 10);
  const baseDepth = config.path.split('/').filter(Boolean).length;
  const excludePages = new Set(
    (config.excludePages || '').split(',').map((p) => p.trim()).filter(Boolean),
  );

  const languageIndexUrl = getLanguageIndex(config.overwriteIndexLanguage);
  const { data: allPages } = await getJsonFromUrl(languageIndexUrl);
  const matching = allPages.filter((page) => {
    if (!page.path.startsWith(config.path)) return false;
    if (excludePages.has(page.path)) return false;
    if (limitDepth) {
      const pageDepth = page.path.split('/').filter(Boolean).length - baseDepth;
      return pageDepth <= limitDepth;
    }
    return true;
  });

  const currentPath = window.location.pathname;
  const nav = document.createElement('nav');
  const tree = buildNavTree(matching, config.path);
  const ul = renderTree(tree, currentPath);
  if (ul) nav.appendChild(ul);
  block.appendChild(nav);
}
