/* global describe it */
import { expect } from '@esm-bundle/chai';

const {
  AEM_AUTHOR_ORIGIN,
  InventoryError,
  PAGE_SIZE,
  fetchDamInventory,
  inventoryUrl,
  isManagedAsset,
  totalUrl,
} = await import('../../../tools/asset-references/dam-inventory.js');

/** A fake fetch serving a DAM of `paths`, paged the way QueryBuilder pages. */
function fakeAem(paths, { status = 200, total = paths.length } = {}) {
  const calls = [];
  const fetchFn = async (url, options) => {
    calls.push({ url, auth: options?.headers?.Authorization });
    if (status !== 200) return { ok: false, status, json: async () => ({}) };
    const params = new URL(url).searchParams;
    if (params.get('p.guessTotal')) return { ok: true, status: 200, json: async () => ({ total }) };
    const offset = Number(params.get('p.offset'));
    const limit = Number(params.get('p.limit'));
    const hits = paths.slice(offset, offset + limit).map((p) => ({ 'jcr:path': p }));
    return { ok: true, status: 200, json: async () => ({ hits }) };
  };
  return { fetchFn, calls };
}

const asset = (i) => `/content/dam/jmp/images/a${i}.png`;

describe('inventoryUrl and totalUrl', () => {
  it('query author for every asset under the DAM, in a stable order', () => {
    const params = new URL(inventoryUrl(4000)).searchParams;
    expect(inventoryUrl(0).startsWith(`${AEM_AUTHOR_ORIGIN}/bin/querybuilder.json`)).to.equal(true);
    expect(params.get('path')).to.equal('/content/dam');
    expect(params.get('type')).to.equal('dam:Asset');
    expect(params.get('orderby')).to.equal('@jcr:path');
    expect(params.get('p.offset')).to.equal('4000');
    expect(params.get('p.limit')).to.equal(String(PAGE_SIZE));
  });

  it('asks for a count without hits', () => {
    const params = new URL(totalUrl()).searchParams;
    expect(params.get('p.guessTotal')).to.not.equal(null);
    expect(params.get('p.limit')).to.equal('1');
  });
});

describe('isManagedAsset', () => {
  it('accepts ordinary DAM assets', () => {
    expect(isManagedAsset('/content/dam/jmp/images/a.png')).to.equal(true);
  });

  it('rejects the discarded copies AEM keeps after a delete', () => {
    expect(isManagedAsset('/content/dam/jmp/x/jcr:content/cq:discarded/abc')).to.equal(false);
  });

  it('rejects anything outside the DAM, and bad input', () => {
    expect(isManagedAsset('/content/jmp/page')).to.equal(false);
    expect(isManagedAsset(null)).to.equal(false);
  });
});

describe('fetchDamInventory', () => {
  it('reads every page and stops on a short one', async () => {
    const paths = Array.from({ length: PAGE_SIZE + 5 }, (_, i) => asset(i));
    const { fetchFn, calls } = fakeAem(paths);
    const result = await fetchDamInventory({ token: 't', fetchFn });
    expect(result.paths.size).to.equal(PAGE_SIZE + 5);
    // two inventory pages plus one count request
    expect(calls.length).to.equal(3);
  });

  it('sends the DA session token as a bearer token', async () => {
    const { fetchFn, calls } = fakeAem([asset(1)]);
    await fetchDamInventory({ token: 'abc', fetchFn });
    expect(calls.every((c) => c.auth === 'Bearer abc')).to.equal(true);
  });

  it('drops discarded copies from the result but counts them against the server', async () => {
    const paths = [asset(1), '/content/dam/jmp/x/jcr:content/cq:discarded/old'];
    const { fetchFn } = fakeAem(paths);
    const result = await fetchDamInventory({ token: 't', fetchFn });
    expect([...result.paths]).to.deep.equal([asset(1)]);
    expect(result.matchesServer).to.equal(true);
  });

  it('reports a mismatch with the server count instead of hiding it', async () => {
    const { fetchFn } = fakeAem([asset(1), asset(2)], { total: 5 });
    const result = await fetchDamInventory({ token: 't', fetchFn });
    expect(result.matchesServer).to.equal(false);
    expect(result.serverTotal).to.equal(5);
  });

  it('turns a refused session into a readable error carrying the status', async () => {
    const { fetchFn } = fakeAem([], { status: 401 });
    try {
      await fetchDamInventory({ token: 't', fetchFn });
      expect.fail('should have thrown');
    } catch (error) {
      expect(error).to.be.instanceOf(InventoryError);
      expect(error.status).to.equal(401);
      expect(error.message).to.contain('refused your session');
    }
  });

  it('turns a blocked request into a readable error', async () => {
    const fetchFn = async () => { throw new TypeError('Failed to fetch'); };
    try {
      await fetchDamInventory({ token: 't', fetchFn });
      expect.fail('should have thrown');
    } catch (error) {
      expect(error.status).to.equal(0);
      expect(error.message).to.contain('Could not reach AEM');
    }
  });

  it('refuses to run without a token', async () => {
    try {
      await fetchDamInventory({ token: '', fetchFn: async () => ({}) });
      expect.fail('should have thrown');
    } catch (error) {
      expect(error.message).to.contain('No DA session token');
    }
  });
});
