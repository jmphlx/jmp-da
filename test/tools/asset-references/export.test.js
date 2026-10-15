/* global describe it */
import { expect } from '@esm-bundle/chai';

const {
  ASSET_HEADERS,
  assetRows,
  csvCell,
  editUrl,
  folderOf,
  liveUrl,
  referenceRows,
  summaryRows,
  toCsv,
  typeOf,
} = await import('../../../tools/asset-references/export.js');

const ROWS = [
  {
    damPath: '/content/dam/jmp/images/why-jmp/hero.png',
    count: 2,
    publishedCount: 1,
    pages: ['en/software/why-jmp.html', 'de/drafts/x.html'],
  },
  {
    damPath: '/content/dam/jmp/images/a, comma.png',
    count: 1,
    publishedCount: 1,
    pages: ['en/index.html'],
  },
];

describe('csvCell', () => {
  it('quotes values containing a comma, quote or newline', () => {
    expect(csvCell('a,b')).to.equal('"a,b"');
    expect(csvCell('say "hi"')).to.equal('"say ""hi"""');
    expect(csvCell('one\ntwo')).to.equal('"one\ntwo"');
  });

  it('leaves ordinary values alone and renders empties as blank', () => {
    expect(csvCell('/content/dam/a.png')).to.equal('/content/dam/a.png');
    expect(csvCell(3)).to.equal('3');
    expect(csvCell(null)).to.equal('');
  });
});

describe('toCsv', () => {
  it('emits a header row followed by the data', () => {
    const csv = toCsv(['A', 'B'], [[1, 2], [3, 4]]);
    expect(csv).to.equal('A,B\n1,2\n3,4');
  });

  it('quotes an asset path containing a comma so columns do not shift', () => {
    const csv = toCsv(ASSET_HEADERS, assetRows(ROWS));
    const commaLine = csv.split('\n').find((line) => line.includes('comma'));
    const quoted = '"/content/dam/jmp/images/a, comma.png",';
    expect(commaLine.startsWith(quoted)).to.equal(true);
    // The remaining four columns are unquoted, so the row still has five fields in total.
    expect(commaLine.slice(quoted.length).split(',').length).to.equal(ASSET_HEADERS.length - 1);
    // Without the quoting, a naive reader would see six.
    expect(commaLine.split(',').length).to.equal(ASSET_HEADERS.length + 1);
  });
});

describe('folderOf and typeOf', () => {
  it('splits a path into its folder and extension', () => {
    expect(folderOf('/content/dam/jmp/images/why-jmp/hero.png')).to.equal('/content/dam/jmp/images/why-jmp');
    expect(typeOf('/content/dam/jmp/images/why-jmp/hero.png')).to.equal('png');
  });

  it('reports a missing extension rather than guessing', () => {
    expect(typeOf('/content/dam/jmp/images/no-extension')).to.equal('(none)');
  });
});

describe('assetRows', () => {
  it('returns one row per asset with its counts', () => {
    const [first] = assetRows(ROWS);
    expect(first).to.deep.equal([
      '/content/dam/jmp/images/why-jmp/hero.png',
      '/content/dam/jmp/images/why-jmp',
      'png',
      2,
      1,
    ]);
  });
});

describe('referenceRows', () => {
  it('expands each asset into one row per referencing document', () => {
    const refs = referenceRows(ROWS);
    expect(refs.length).to.equal(3);
    expect(refs[0][0]).to.equal('/content/dam/jmp/images/why-jmp/hero.png');
    expect(refs[0][1]).to.equal('en/software/why-jmp.html');
  });

  it('builds edit and live URLs without the .html suffix', () => {
    expect(editUrl('en/software/why-jmp.html')).to.contain('/jmphlx/jmp-da/en/software/why-jmp');
    expect(editUrl('en/software/why-jmp.html')).to.not.contain('.html');
    expect(liveUrl('en/software/why-jmp.html')).to.contain('main--jmp-da--jmphlx');
    expect(liveUrl('en/software/why-jmp.html')).to.not.contain('.html');
  });
});

describe('summaryRows', () => {
  it('records the crawl stats and totals the references', () => {
    const stats = {
      documentsScanned: 10, documentsFailed: 0, documentsWithRefs: 2, references: 3,
    };
    const pairs = Object.fromEntries(summaryRows(stats, ROWS));
    expect(pairs['Documents scanned']).to.equal(10);
    expect(pairs['Distinct DAM assets referenced']).to.equal(2);
    expect(pairs['Total references']).to.equal(3);
  });

  it('states that the evidence is DA only', () => {
    const text = summaryRows({ documentsScanned: 0 }, []).map((r) => r[1]).join(' ');
    expect(text).to.contain('Document Authoring only');
  });
});
