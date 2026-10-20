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
 * Whether a folder is already covered by the selection, either exactly or by an ancestor.
 * Selecting a parent makes its children redundant, so they are shown as covered rather than
 * selectable - otherwise the chip list fills with folders that change nothing.
 * @param {string} path folder path
 * @param {string[]} selected selected folder paths
 * @returns {string} 'self', 'ancestor' or ''
 */
export function coverage(path, selected) {
  if (!Array.isArray(selected) || selected.length === 0) return '';
  if (selected.includes(path)) return 'self';
  return selected.some((s) => path.startsWith(`${s}/`)) ? 'ancestor' : '';
}

function countsFor(node) {
  const assets = document.createElement('span');
  assets.className = 'tree-count';
  assets.textContent = `${node.total.toLocaleString()} assets`;
  const refs = document.createElement('span');
  refs.className = 'tree-refs';
  refs.textContent = `${node.refs.toLocaleString()} refs`;
  return [assets, refs];
}

/**
 * Renders a node's children as a collapsible, multi-select list.
 * @param {HTMLElement} container element to render into
 * @param {Object} node tree node
 * @param {Object} options selection state and callback
 */
function renderChildren(container, node, options) {
  const { selected, onToggle } = options;
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

    const state = coverage(child.path, selected);
    const choose = document.createElement('button');
    choose.type = 'button';
    choose.className = `tree-choose${state ? ` is-${state}` : ''}`;
    choose.setAttribute('aria-pressed', String(state === 'self'));
    if (state === 'ancestor') {
      choose.title = 'Already covered by a selected parent folder';
    }

    const mark = document.createElement('span');
    mark.className = 'tree-mark';
    mark.textContent = state ? '✓' : '';
    mark.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'tree-name';
    label.textContent = child.name;

    choose.append(mark, label, ...countsFor(child));
    choose.addEventListener('click', () => onToggle(child.path));

    row.append(twisty, choose);
    item.append(row);

    if (hasChildren) {
      const sub = document.createElement('div');
      sub.className = 'tree-sub';
      sub.hidden = true;
      item.append(sub);
      twisty.addEventListener('click', () => {
        const open = !sub.hidden;
        if (!open) {
          // Rebuilt on every open so selection marks stay current.
          sub.innerHTML = '';
          renderChildren(sub, child, options);
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
 * Renders the whole tree, with a row for the DAM root that clears the selection.
 * @param {HTMLElement} container element to render into
 * @param {Object} root root node from buildFolderTree
 * @param {Object} options { selected: string[], onToggle: Function, onClear: Function }
 */
export function renderFolderTree(container, root, options) {
  const { selected = [], onToggle, onClear } = options;
  container.innerHTML = '';

  const all = document.createElement('button');
  all.type = 'button';
  all.className = `tree-choose tree-all${selected.length ? '' : ' is-self'}`;
  all.setAttribute('aria-pressed', String(selected.length === 0));
  const allMark = document.createElement('span');
  allMark.className = 'tree-mark';
  allMark.textContent = selected.length ? '' : '✓';
  allMark.setAttribute('aria-hidden', 'true');
  const allLabel = document.createElement('span');
  allLabel.className = 'tree-name';
  allLabel.textContent = 'All folders';
  all.append(allMark, allLabel, ...countsFor(root));
  all.addEventListener('click', onClear);
  container.append(all);

  if (root.children.size === 0) {
    const empty = document.createElement('p');
    empty.className = 'tree-empty';
    empty.textContent = 'No referenced assets to browse.';
    container.append(empty);
    return;
  }

  renderChildren(container, root, { selected, onToggle });
}
