/* global describe it */
import { expect } from '@esm-bundle/chai';

const { compareUsage, findUnmatchedRefs, toPagePath } = await import('../../../tools/asset-usage/compare.js');
const { USAGE_STATUS } = await import('../../../tools/asset-usage/aem.js');

const usageEntry = (pages, publishedPages = []) => ({
  pages: new Set(pages),
  publishedPages: new Set(publishedPages),
});

const SCANNED_AT = '2026-09-16T00:00:00.000Z';

describe('Usage comparison', () => {
  describe('compareUsage', () => {
    it('marks an asset on a live page as used-published', () => {
      const assets = [{ path: '/content/dam/jmp/a.jpg', currentStatus: null, currentCount: 0 }];
      const usage = new Map([
        ['/content/dam/jmp/a.jpg', usageEntry(['/x/y/en/home.html'], ['/x/y/en/home.html'])],
      ]);

      const [row] = compareUsage({ assets, usage, scannedAt: SCANNED_AT });
      expect(row.status).to.equal(USAGE_STATUS.usedPublished);
      expect(row.count).to.equal(1);
    });

    it('marks an asset only on drafts as used-unpublished, not unused', () => {
      // The distinction is the safety property: an asset on an unpublished draft is in
      // use and must not appear on a cleanup list.
      const assets = [{ path: '/content/dam/jmp/a.jpg', currentStatus: null, currentCount: 0 }];
      const usage = new Map([
        ['/content/dam/jmp/a.jpg', usageEntry(['/x/y/en/drafts/noah/p.html'], [])],
      ]);

      const [row] = compareUsage({ assets, usage, scannedAt: SCANNED_AT });
      expect(row.status).to.equal(USAGE_STATUS.usedUnpublished);
    });

    it('marks an asset referenced nowhere as unused', () => {
      const assets = [{ path: '/content/dam/jmp/orphan.jpg', currentStatus: null, currentCount: 0 }];

      const [row] = compareUsage({ assets, usage: new Map(), scannedAt: SCANNED_AT });
      expect(row.status).to.equal(USAGE_STATUS.unused);
      expect(row.count).to.equal(0);
      expect(row.pages).to.deep.equal([]);
    });

    it('counts distinct pages rather than raw references', () => {
      const assets = [{ path: '/content/dam/jmp/a.jpg', currentStatus: null, currentCount: 0 }];
      const usage = new Map([
        ['/content/dam/jmp/a.jpg', usageEntry(['/x/y/en/a.html', '/x/y/en/b.html'], ['/x/y/en/a.html'])],
      ]);

      const [row] = compareUsage({ assets, usage, scannedAt: SCANNED_AT });
      expect(row.count).to.equal(2);
      expect(row.status).to.equal(USAGE_STATUS.usedPublished);
    });

    it('preserves the existing DAM values so deltas can be computed', () => {
      const assets = [{ path: '/content/dam/jmp/a.jpg', currentStatus: 'unused', currentCount: 0 }];
      const usage = new Map([
        ['/content/dam/jmp/a.jpg', usageEntry(['/x/y/en/home.html'], ['/x/y/en/home.html'])],
      ]);

      const [row] = compareUsage({ assets, usage, scannedAt: SCANNED_AT });
      expect(row.currentStatus).to.equal('unused');
      expect(row.scannedAt).to.equal(SCANNED_AT);
    });
  });

  describe('findUnmatchedRefs', () => {
    it('reports references to assets outside the scanned inventory', () => {
      const usage = new Map([
        ['/content/dam/jmp/a.jpg', usageEntry(['/p.html'])],
        ['/content/dam/other/b.jpg', usageEntry(['/p.html'])],
      ]);
      const assets = [{ path: '/content/dam/jmp/a.jpg' }];

      expect(findUnmatchedRefs(usage, assets)).to.deep.equal(['/content/dam/other/b.jpg']);
    });

    it('reports nothing when every reference is accounted for', () => {
      const usage = new Map([['/content/dam/jmp/a.jpg', usageEntry(['/p.html'])]]);
      expect(findUnmatchedRefs(usage, [{ path: '/content/dam/jmp/a.jpg' }])).to.deep.equal([]);
    });
  });

  describe('toPagePath', () => {
    it('strips the org and repo prefix', () => {
      expect(toPagePath('/jmphlx/jmp-da/en/home.html')).to.equal('en/home.html');
    });
  });
});
