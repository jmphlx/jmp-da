/* global describe it */
import { expect } from '@esm-bundle/chai';

const {
  STATUS, compareWithDam, referencesOnly, tally,
} = await import('../../../tools/asset-references/compare.js');

const used = (damPath, count = 1) => ({
  damPath, count, publishedCount: count, pages: Array.from({ length: count }, (_, i) => `en/p${i}.html`),
});

const byPath = (rows) => Object.fromEntries(rows.map((r) => [r.damPath, r]));

describe('compareWithDam', () => {
  const usage = [
    used('/content/dam/jmp/images/a.png', 3),
    used('/content/dam/jmp/images/gone.png', 2),
  ];
  const inventory = new Set(['/content/dam/jmp/images/a.png', '/content/dam/jmp/images/b.png']);
  const rows = byPath(compareWithDam(usage, inventory));

  it('marks a DAM asset that DA links as referenced, keeping its locations', () => {
    expect(rows['/content/dam/jmp/images/a.png'].status).to.equal(STATUS.referenced);
    expect(rows['/content/dam/jmp/images/a.png'].count).to.equal(3);
  });

  it('marks a DAM asset nothing links as unreferenced, with no locations', () => {
    const row = rows['/content/dam/jmp/images/b.png'];
    expect(row.status).to.equal(STATUS.unreferenced);
    expect(row.count).to.equal(0);
    expect(row.pages).to.deep.equal([]);
  });

  it('marks a reference to a path absent from the DAM as missing', () => {
    expect(rows['/content/dam/jmp/images/gone.png'].status).to.equal(STATUS.missing);
  });

  it('lists each asset exactly once', () => {
    expect(compareWithDam(usage, inventory).length).to.equal(3);
  });

  it('tolerates empty input', () => {
    expect(compareWithDam([], new Set())).to.deep.equal([]);
    expect(compareWithDam(null, null)).to.deep.equal([]);
  });
});

describe('referencesOnly', () => {
  it('marks every DA reference as referenced when the DAM could not be read', () => {
    const rows = referencesOnly([used('/content/dam/a.png')]);
    expect(rows[0].status).to.equal(STATUS.referenced);
  });
});

describe('tally', () => {
  it('counts each status and the assets actually in the DAM', () => {
    const rows = compareWithDam(
      [used('/content/dam/a.png'), used('/content/dam/gone.png')],
      new Set(['/content/dam/a.png', '/content/dam/b.png', '/content/dam/c.png']),
    );
    expect(tally(rows)).to.deep.equal({
      referenced: 1, unreferenced: 2, missing: 1, inDam: 3,
    });
  });
});
