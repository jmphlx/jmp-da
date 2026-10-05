/* global describe it */
import { expect } from '@esm-bundle/chai';

const {
  toAssetsApiPath,
  flattenHit,
  selectDeltas,
  listAssets,
  writeUsageMetadata,
  USAGE_PROPS,
} = await import('../../../tools/asset-usage/aem.js');

describe('AEM Assets client', () => {
  describe('toAssetsApiPath', () => {
    it('maps a DAM path onto the Assets API root', () => {
      expect(toAssetsApiPath('/content/dam/jmp/asset.jpg')).to.equal('/api/assets/jmp/asset.jpg');
    });
  });

  describe('flattenHit', () => {
    it('reads a hit with nested metadata', () => {
      const hit = {
        'jcr:path': '/content/dam/jmp/a.jpg',
        'jcr:content': { metadata: { [USAGE_PROPS.status]: 'unused', [USAGE_PROPS.count]: '0' } },
      };

      expect(flattenHit(hit)).to.deep.equal({
        path: '/content/dam/jmp/a.jpg',
        currentStatus: 'unused',
        currentCount: 0,
      });
    });

    it('reads a hit with flattened properties', () => {
      const hit = {
        'jcr:path': '/content/dam/jmp/a.jpg',
        [USAGE_PROPS.status]: 'used-published',
        [USAGE_PROPS.count]: 3,
      };

      expect(flattenHit(hit).currentStatus).to.equal('used-published');
      expect(flattenHit(hit).currentCount).to.equal(3);
    });

    it('defaults cleanly for an asset that has never been scanned', () => {
      expect(flattenHit({ 'jcr:path': '/content/dam/jmp/a.jpg' })).to.deep.equal({
        path: '/content/dam/jmp/a.jpg',
        currentStatus: null,
        currentCount: 0,
      });
    });

    it('coerces a non-numeric count to zero', () => {
      const hit = { 'jcr:path': '/a', 'jcr:content': { metadata: { [USAGE_PROPS.count]: 'x' } } };
      expect(flattenHit(hit).currentCount).to.equal(0);
    });
  });

  describe('selectDeltas', () => {
    it('selects only rows whose usage changed', () => {
      // Writing unchanged assets would churn the modified date administrators rely on.
      const rows = [
        {
          path: '/a', status: 'unused', count: 0, currentStatus: 'unused', currentCount: 0,
        },
        {
          path: '/b', status: 'used-published', count: 2, currentStatus: 'unused', currentCount: 0,
        },
        {
          path: '/c', status: 'used-published', count: 3, currentStatus: 'used-published', currentCount: 2,
        },
      ];

      expect(selectDeltas(rows).map((row) => row.path)).to.deep.equal(['/b', '/c']);
    });

    it('selects nothing when a rescan finds no changes', () => {
      const rows = [
        {
          path: '/a', status: 'unused', count: 0, currentStatus: 'unused', currentCount: 0,
        },
      ];
      expect(selectDeltas(rows)).to.deep.equal([]);
    });
  });

  describe('listAssets', () => {
    it('requests assets under the folder and flattens the hits', async () => {
      let requested;
      const fetchFn = async (url) => {
        requested = url;
        return {
          ok: true,
          json: async () => ({ hits: [{ 'jcr:path': '/content/dam/jmp/a.jpg' }] }),
        };
      };

      const assets = await listAssets({ folder: '/content/dam/jmp', token: 't', fetchFn });

      expect(requested).to.contain('type=dam%3AAsset');
      expect(requested).to.contain('p.limit=-1');
      expect(assets).to.deep.equal([
        { path: '/content/dam/jmp/a.jpg', currentStatus: null, currentCount: 0 },
      ]);
    });

    it('discards hits with no path', async () => {
      const fetchFn = async () => ({ ok: true, json: async () => ({ hits: [{}] }) });
      expect(await listAssets({ token: 't', fetchFn })).to.deep.equal([]);
    });

    it('throws when AEM rejects the request', async () => {
      const fetchFn = async () => ({ ok: false, status: 403, text: async () => 'Forbidden' });

      let message = '';
      try {
        await listAssets({ token: 't', fetchFn });
      } catch (error) {
        message = error.message;
      }
      expect(message).to.contain('403');
    });
  });

  describe('writeUsageMetadata', () => {
    it('PUTs the usage properties onto the asset metadata node', async () => {
      let captured;
      const fetchFn = async (url, options) => {
        captured = { url, options };
        return { ok: true };
      };

      await writeUsageMetadata({
        damPath: '/content/dam/jmp/a.jpg',
        status: 'unused',
        count: 0,
        scannedAt: '2026-09-16T00:00:00.000Z',
        token: 't',
        fetchFn,
      });

      expect(captured.url).to.contain('/api/assets/jmp/a.jpg');
      expect(captured.options.method).to.equal('PUT');

      const body = JSON.parse(captured.options.body);
      expect(body.class).to.equal('asset');
      expect(body.properties.metadata[USAGE_PROPS.status]).to.equal('unused');
      expect(body.properties.metadata[USAGE_PROPS.scannedAt]).to.equal('2026-09-16T00:00:00.000Z');
    });

    it('throws when the write is rejected', async () => {
      const fetchFn = async () => ({ ok: false, status: 500 });

      let message = '';
      try {
        await writeUsageMetadata({ damPath: '/content/dam/jmp/a.jpg', token: 't', fetchFn });
      } catch (error) {
        message = error.message;
      }
      expect(message).to.contain('/content/dam/jmp/a.jpg');
    });
  });
});
