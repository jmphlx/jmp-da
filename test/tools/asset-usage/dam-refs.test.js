/* global describe it */
import { expect } from '@esm-bundle/chai';

const {
  normalizeDamPath,
  parseSrcset,
  extractDamRefs,
  parseHtml,
  isUnpublishedPath,
} = await import('../../../tools/asset-usage/dam-refs.js');

describe('DAM reference extraction', () => {
  describe('normalizeDamPath', () => {
    it('normalizes the AEM publish host used by existing content', () => {
      const url = 'https://publish-p107857-e1299068.adobeaemcloud.com/content/dam/jmp/a.png';
      expect(normalizeDamPath(url)).to.equal('/content/dam/jmp/a.png');
    });

    it('normalizes the www.jmp.com host used by existing content', () => {
      expect(normalizeDamPath('https://www.jmp.com/content/dam/jmp/asset.jpg'))
        .to.equal('/content/dam/jmp/asset.jpg');
    });

    it('normalizes the AEM author host used by Content Advisor inserts', () => {
      const url = 'https://author-p107857-e1299068.adobeaemcloud.com/content/dam/jmp/a.jpg';
      expect(normalizeDamPath(url)).to.equal('/content/dam/jmp/a.jpg');
    });

    it('accepts a root-relative reference', () => {
      expect(normalizeDamPath('/content/dam/jmp/a.jpg')).to.equal('/content/dam/jmp/a.jpg');
    });

    it('accepts a host it has never seen before', () => {
      expect(normalizeDamPath('https://example.com/content/dam/jmp/a.jpg'))
        .to.equal('/content/dam/jmp/a.jpg');
    });

    it('strips query strings and fragments', () => {
      expect(normalizeDamPath('/content/dam/jmp/a.jpg?width=750&format=webply#x'))
        .to.equal('/content/dam/jmp/a.jpg');
    });

    it('decodes percent escapes so paths compare equal to AEM', () => {
      expect(normalizeDamPath('/content/dam/jmp/my%20asset.jpg'))
        .to.equal('/content/dam/jmp/my asset.jpg');
    });

    it('rejects references outside the DAM', () => {
      expect(normalizeDamPath('/en/home')).to.equal(null);
      expect(normalizeDamPath('./media_1abc.jpg')).to.equal(null);
      expect(normalizeDamPath('https://www.jmp.com/en/home')).to.equal(null);
    });

    it('rejects empty and non-string input', () => {
      expect(normalizeDamPath('')).to.equal(null);
      expect(normalizeDamPath(null)).to.equal(null);
      expect(normalizeDamPath(undefined)).to.equal(null);
      expect(normalizeDamPath(42)).to.equal(null);
    });
  });

  describe('parseSrcset', () => {
    it('reads a single candidate', () => {
      expect(parseSrcset('/content/dam/jmp/a.jpg')).to.deep.equal(['/content/dam/jmp/a.jpg']);
    });

    it('discards width and density descriptors', () => {
      expect(parseSrcset('/a.jpg 750w, /b.jpg 2x'))
        .to.deep.equal(['/a.jpg', '/b.jpg']);
    });

    it('returns an empty list for missing input', () => {
      expect(parseSrcset('')).to.deep.equal([]);
      expect(parseSrcset(null)).to.deep.equal([]);
    });
  });

  describe('extractDamRefs', () => {
    it('counts a picture element once, not once per source', () => {
      // A <picture> repeats the same asset across its sources. Counting raw matches
      // would report roughly threefold usage for every image on the site.
      const doc = parseHtml(`
        <picture>
          <source srcset="https://www.jmp.com/content/dam/jmp/asset.jpg">
          <source srcset="https://www.jmp.com/content/dam/jmp/asset.jpg" media="(min-width: 600px)">
          <img src="https://www.jmp.com/content/dam/jmp/asset.jpg" alt="asset.jpg">
        </picture>`);

      const refs = extractDamRefs(doc);
      expect(refs.size).to.equal(1);
      expect([...refs]).to.deep.equal(['/content/dam/jmp/asset.jpg']);
    });

    it('treats the same asset referenced via different hosts as one asset', () => {
      const doc = parseHtml(`
        <img src="https://www.jmp.com/content/dam/jmp/a.jpg">
        <img src="https://publish-p107857-e1299068.adobeaemcloud.com/content/dam/jmp/a.jpg">`);

      expect(extractDamRefs(doc).size).to.equal(1);
    });

    it('collects linked documents from href', () => {
      const doc = parseHtml('<a href="https://www.jmp.com/content/dam/jmp/documents/g.pdf">Guide</a>');
      expect([...extractDamRefs(doc)]).to.deep.equal(['/content/dam/jmp/documents/g.pdf']);
    });

    it('collects distinct assets from a mixed document', () => {
      const doc = parseHtml(`
        <img src="/content/dam/jmp/a.jpg">
        <img src="/content/dam/jmp/b.png">
        <a href="/en/home">home</a>
        <img src="./media_1abc.jpg">`);

      expect([...extractDamRefs(doc)].sort())
        .to.deep.equal(['/content/dam/jmp/a.jpg', '/content/dam/jmp/b.png']);
    });

    it('returns an empty set for a page with no DAM references', () => {
      expect(extractDamRefs(parseHtml('<p>no assets</p>')).size).to.equal(0);
    });

    it('returns an empty set when given no document', () => {
      expect(extractDamRefs(null).size).to.equal(0);
    });
  });

  describe('isUnpublishedPath', () => {
    it('identifies draft and sandbox subtrees', () => {
      expect(isUnpublishedPath('/jmphlx/jmp-da/en/drafts/noah/page.html')).to.equal(true);
      expect(isUnpublishedPath('/jmphlx/jmp-da/en/sandbox/page.html')).to.equal(true);
    });

    it('treats other content as publishable', () => {
      expect(isUnpublishedPath('/jmphlx/jmp-da/en/home.html')).to.equal(false);
      expect(isUnpublishedPath('/jmphlx/jmp-da/de/software.html')).to.equal(false);
    });

    it('handles missing input', () => {
      expect(isUnpublishedPath('')).to.equal(false);
      expect(isUnpublishedPath(null)).to.equal(false);
    });
  });
});
