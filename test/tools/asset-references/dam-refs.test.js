/* global describe it */
import { expect } from '@esm-bundle/chai';

const {
  extractDamRefs,
  extractDamRefsFromJson,
  isUnpublishedPath,
  normalizeDamPath,
  parseHtml,
  parseSrcset,
} = await import('../../../tools/asset-references/dam-refs.js');

describe('normalizeDamPath', () => {
  it('accepts an absolute URL on any host', () => {
    expect(normalizeDamPath('https://www.jmp.com/content/dam/jmp/a.png')).to.equal('/content/dam/jmp/a.png');
    expect(normalizeDamPath('https://author-p107857-e1299068.adobeaemcloud.com/content/dam/jmp/a.png'))
      .to.equal('/content/dam/jmp/a.png');
  });

  it('accepts root relative and protocol relative references', () => {
    expect(normalizeDamPath('/content/dam/jmp/a.png')).to.equal('/content/dam/jmp/a.png');
    expect(normalizeDamPath('//www.jmp.com/content/dam/jmp/a.png')).to.equal('/content/dam/jmp/a.png');
  });

  it('drops query strings and fragments', () => {
    expect(normalizeDamPath('/content/dam/jmp/a.png?width=750#x')).to.equal('/content/dam/jmp/a.png');
  });

  it('decodes percent escapes so the path matches the one AEM reports', () => {
    expect(normalizeDamPath('/content/dam/jmp/a%20b.png')).to.equal('/content/dam/jmp/a b.png');
  });

  it('rejects anything that is not a DAM path', () => {
    expect(normalizeDamPath('/media_1abc.png')).to.equal(null);
    expect(normalizeDamPath('https://www.jmp.com/en/software')).to.equal(null);
    expect(normalizeDamPath('')).to.equal(null);
    expect(normalizeDamPath(null)).to.equal(null);
  });
});

describe('parseSrcset', () => {
  it('returns the URLs without their descriptors', () => {
    expect(parseSrcset('/content/dam/a.png 750w, /content/dam/b.png 2000w'))
      .to.deep.equal(['/content/dam/a.png', '/content/dam/b.png']);
  });

  it('tolerates empty input', () => {
    expect(parseSrcset('')).to.deep.equal([]);
    expect(parseSrcset(null)).to.deep.equal([]);
  });
});

describe('extractDamRefs', () => {
  it('reads src, href and srcset', () => {
    const doc = parseHtml(`
      <img src="/content/dam/jmp/one.png">
      <a href="https://www.jmp.com/content/dam/jmp/two.pdf">x</a>
      <source srcset="/content/dam/jmp/three.png 750w">
    `);
    expect([...extractDamRefs(doc)].sort())
      .to.deep.equal(['/content/dam/jmp/one.png', '/content/dam/jmp/three.png', '/content/dam/jmp/two.pdf']);
  });

  it('counts an asset once even when a picture repeats it', () => {
    const doc = parseHtml(`
      <picture>
        <source srcset="/content/dam/jmp/a.png 2000w">
        <source srcset="/content/dam/jmp/a.png 750w">
        <img src="/content/dam/jmp/a.png">
      </picture>
    `);
    expect([...extractDamRefs(doc)]).to.deep.equal(['/content/dam/jmp/a.png']);
  });

  it('ignores non DAM references and empty documents', () => {
    expect([...extractDamRefs(parseHtml('<img src="./media_1abc.png">'))]).to.deep.equal([]);
    expect([...extractDamRefs(null)]).to.deep.equal([]);
  });
});

describe('extractDamRefsFromJson', () => {
  it('finds DAM paths in a redirects sheet', () => {
    const sheet = JSON.stringify({
      data: [
        { Source: '/old-guide', Destination: '/content/dam/jmp/documents/en/guide.pdf' },
        { Source: '/other', Destination: '/en/software' },
      ],
    });
    expect([...extractDamRefsFromJson(sheet)]).to.deep.equal(['/content/dam/jmp/documents/en/guide.pdf']);
  });

  it('stops at the delimiters that end a JSON string', () => {
    expect([...extractDamRefsFromJson('{"a":"/content/dam/jmp/x.png","b":1}')])
      .to.deep.equal(['/content/dam/jmp/x.png']);
  });

  it('deduplicates repeats and tolerates empty input', () => {
    expect([...extractDamRefsFromJson('"/content/dam/a.png" "/content/dam/a.png"')])
      .to.deep.equal(['/content/dam/a.png']);
    expect([...extractDamRefsFromJson('')]).to.deep.equal([]);
    expect([...extractDamRefsFromJson(null)]).to.deep.equal([]);
  });
});

describe('isUnpublishedPath', () => {
  it('matches the drafts and sandbox exclusions', () => {
    expect(isUnpublishedPath('/jmphlx/jmp-da/en/drafts/noah/x.html')).to.equal(true);
    expect(isUnpublishedPath('/jmphlx/jmp-da/sandbox/x.html')).to.equal(true);
    expect(isUnpublishedPath('/jmphlx/jmp-da/en/software.html')).to.equal(false);
    expect(isUnpublishedPath('')).to.equal(false);
  });
});
