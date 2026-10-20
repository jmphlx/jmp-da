/* global describe it */
import { expect } from '@esm-bundle/chai';

const { buildFolderTree, sortedChildren } = await import('../../../tools/asset-references/asset-tree.js');

const PATHS = [
  '/content/dam/jmp/images/why-jmp/hero.png',
  '/content/dam/jmp/images/why-jmp/second.png',
  '/content/dam/jmp/images/events/one.png',
  '/content/dam/jmp/documents/en/guide.pdf',
  '/content/dam/SAS/logo.png',
];

function child(node, name) {
  return node.children.get(name);
}

describe('buildFolderTree', () => {
  it('nests folders under the DAM root', () => {
    const root = buildFolderTree(PATHS);
    expect(root.path).to.equal('/content/dam');
    expect([...root.children.keys()].sort()).to.deep.equal(['SAS', 'jmp']);
    expect(child(child(root, 'jmp'), 'images').path).to.equal('/content/dam/jmp/images');
  });

  it('totals every asset at or below each folder', () => {
    const root = buildFolderTree(PATHS);
    expect(root.total).to.equal(5);
    expect(child(root, 'jmp').total).to.equal(4);
    expect(child(child(root, 'jmp'), 'images').total).to.equal(3);
    expect(child(child(child(root, 'jmp'), 'images'), 'why-jmp').total).to.equal(2);
  });

  it('does not turn the file name into a folder', () => {
    const root = buildFolderTree(['/content/dam/SAS/logo.png']);
    expect([...child(root, 'SAS').children.keys()]).to.deep.equal([]);
  });

  it('ignores paths outside the DAM root and bad input', () => {
    expect(buildFolderTree(['/media_1abc.png']).total).to.equal(0);
    expect(buildFolderTree(['/content/dam']).total).to.equal(0);
    expect(buildFolderTree([null, 42]).total).to.equal(0);
    expect(buildFolderTree(null).total).to.equal(0);
  });
});

describe('sortedChildren', () => {
  it('returns the heaviest folders first', () => {
    const root = buildFolderTree(PATHS);
    expect(sortedChildren(child(root, 'jmp')).map((n) => n.name)).to.deep.equal(['images', 'documents']);
  });

  it('breaks ties by name', () => {
    const root = buildFolderTree([
      '/content/dam/jmp/b/one.png',
      '/content/dam/jmp/a/one.png',
    ]);
    expect(sortedChildren(child(root, 'jmp')).map((n) => n.name)).to.deep.equal(['a', 'b']);
  });
});
