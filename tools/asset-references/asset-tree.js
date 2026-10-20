/**
 * Folder tree for the DAM paths found by the scan.
 *
 * The tree is built from the scan results rather than from AEM. That keeps the tool free of
 * AEM credentials, and it is the right source anyway: the picker filters the result list, so
 * it should only ever offer folders that the results actually contain.
 *
 * buildFolderTree is pure so it can be unit tested; renderFolderTree is the only part that
 * touches the DOM.
 */

export const DAM_ROOT = '/content/dam';

/**
 * Groups scan rows into a nested folder tree.
 *
 * Each node carries `total`, the assets at or below it, and `refs`, how many document
 * references those assets account for. Both are what make the tree worth browsing: a
 * folder's weight is visible before you open it.
 *
 * Note that a folder containing no referenced assets has no node at all, because the tree is
 * derived from the results. Showing such folders would require the DAM's own folder list,
 * which means AEM credentials this tool deliberately does not need.
 * @param {Object[]} entries rows from toRows, or bare /content/dam/... path strings
 * @returns {Object} root node
 */
export function buildFolderTree(entries) {
  const root = {
    name: DAM_ROOT, path: DAM_ROOT, total: 0, refs: 0, children: new Map(),
  };
  if (!Array.isArray(entries)) return root;

  entries.forEach((entry) => {
    const damPath = typeof entry === 'string' ? entry : entry?.damPath;
    const refs = typeof entry === 'string' ? 0 : (entry?.count ?? 0);
    if (typeof damPath !== 'string' || !damPath.startsWith(`${DAM_ROOT}/`)) return;
    // The last segment is the file itself, so it never becomes a folder node.
    const segments = damPath.slice(DAM_ROOT.length + 1).split('/').slice(0, -1);

    root.total += 1;
    root.refs += refs;
    let node = root;
    segments.forEach((segment) => {
      if (!node.children.has(segment)) {
        node.children.set(segment, {
          name: segment,
          path: `${node.path}/${segment}`,
          total: 0,
          refs: 0,
          children: new Map(),
        });
      }
      node = node.children.get(segment);
      node.total += 1;
      node.refs += refs;
    });
  });

  return root;
}

/** Child nodes, heaviest first, so the folders worth looking at come to the top. */
export function sortedChildren(node) {
  return [...node.children.values()].sort((a, b) => b.total - a.total
    || a.name.localeCompare(b.name));
}

/**
 * Renders a node's children as a collapsible list.
 * @param {HTMLElement} container element to render into
 * @param {Object} node tree node
 * @param {Function} onSelect called with the chosen folder path
 */
function renderChildren(container, node, onSelect) {
  const list = document.createElement('ul');
  list.className = 'tree-children';

  sortedChildren(node).forEach((child) => {
    const item = document.createElement('li');
    item.className = 'tree-item';

    const row = document.createElement('div');
    row.className = 'tree-row';

    const hasChildren = child.children.size > 0;
    const twisty = document.createElement('button');
    twisty.type = 'button';
    twisty.className = 'tree-twisty';
    twisty.textContent = hasChildren ? '▸' : '';
    twisty.disabled = !hasChildren;
    twisty.setAttribute('aria-expanded', 'false');
    twisty.setAttribute('aria-label', hasChildren ? `Expand ${child.name}` : child.name);

    const choose = document.createElement('button');
    choose.type = 'button';
    choose.className = 'tree-choose';
    choose.innerHTML = '';
    const label = document.createElement('span');
    label.className = 'tree-name';
    label.textContent = child.name;
    const count = document.createElement('span');
    count.className = 'tree-count';
    count.textContent = `${child.total.toLocaleString()} assets`;
    const refs = document.createElement('span');
    refs.className = 'tree-refs';
    refs.textContent = `${child.refs.toLocaleString()} refs`;
    choose.append(label, count, refs);
    choose.addEventListener('click', () => onSelect(child.path));

    row.append(twisty, choose);
    item.append(row);

    if (hasChildren) {
      const sub = document.createElement('div');
      sub.className = 'tree-sub';
      sub.hidden = true;
      item.append(sub);
      twisty.addEventListener('click', () => {
        const open = !sub.hidden;
        if (!open && !sub.dataset.filled) {
          renderChildren(sub, child, onSelect);
          sub.dataset.filled = 'true';
        }
        sub.hidden = open;
        twisty.textContent = open ? '▸' : '▾';
        twisty.setAttribute('aria-expanded', String(!open));
      });
    }

    list.append(item);
  });

  container.append(list);
}

/**
 * Renders the whole tree, with a row for the DAM root that clears the filter.
 * @param {HTMLElement} container element to render into
 * @param {Object} root root node from buildFolderTree
 * @param {Function} onSelect called with the chosen folder path, or null for everything
 */
export function renderFolderTree(container, root, onSelect) {
  container.innerHTML = '';

  const all = document.createElement('button');
  all.type = 'button';
  all.className = 'tree-choose tree-all';
  const allLabel = document.createElement('span');
  allLabel.className = 'tree-name';
  allLabel.textContent = 'All folders';
  const allCount = document.createElement('span');
  allCount.className = 'tree-count';
  allCount.textContent = `${root.total.toLocaleString()} assets`;
  const allRefs = document.createElement('span');
  allRefs.className = 'tree-refs';
  allRefs.textContent = `${root.refs.toLocaleString()} refs`;
  all.append(allLabel, allCount, allRefs);
  all.addEventListener('click', () => onSelect(null));
  container.append(all);

  if (root.children.size === 0) {
    const empty = document.createElement('p');
    empty.className = 'tree-empty';
    empty.textContent = 'Run a scan to populate the folder tree.';
    container.append(empty);
    return;
  }

  renderChildren(container, root, onSelect);
}
