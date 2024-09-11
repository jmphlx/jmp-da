/* global describe it */
import { expect } from '@esm-bundle/chai';
import { html, fixture } from '@open-wc/testing';

const { default: DaTagSelector } = await import('../../../tools/tags/tag-selector.js');

describe('Tag Selector Plugin Tests', () => {
  it('Fetch tags', async () => {
    const project = {
      org: 'jmphlx',
      repo: 'jmp-da',
    };
    const dts = new DaTagSelector();
    dts.project = project;
    dts.token = 'foobar';
    dts.datasource = 'tools/tagbrowser/mytags.json';
    dts.displayName = 'mytags';

    const jsonData = {
      total: 2,
      limit: 2,
      offset: 0,
      data: [
        {
          Tag: 'jmp',
        },
        {
          Tag: 'jmp-pro',
        },
      ],
      ':type': 'sheet',
    };

    const fetchResp = {
      json: async () => jsonData,
    };

    const savedFetch = window.fetch;
    try {
      window.fetch = async (url, opts) => {
        if (url === 'https://admin.da.live/source/jmphlx/jmp-da/tools/tagbrowser/mytags.json'
          && opts.headers.Authorization === 'Bearer foobar') {
          return fetchResp;
        }
        return null;
      };

      const tags = await dts.fetchTags();
      const tr = await fixture(html`<div>${tags}</div>`);
      expect(tr.querySelector('h2').innerText).to.equal('↑ mytags');
      expect(tr.querySelector('h2 span.up').innerText).to.equal('↑');

      const items = tr.querySelectorAll('form ul li label');
      expect(items.length).to.equal(2);

      const values = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const item of items) {
        const input = item.querySelector('input');
        expect(item.innerText).to.equal(input.value);
        expect(input.type).to.equal('checkbox');
        values.push(item.innerText);
      }
      expect(values).to.deep.equal(['jmp', 'jmp-pro']);
    } finally {
      window.fetch = savedFetch;
    }
  });

  it('Fetch categories', async () => {
    const project = {
      org: 'da',
      repo: 'live',
    };
    const dts = new DaTagSelector();
    dts.project = project;
    dts.datasource = 'tools/tagbrowser/mycategories.json';
    dts.displayName = 'Categories';

    const jsonData = {
      total: 3,
      limit: 3,
      offset: 0,
      data: [
        {
          Category: 'resourceType',
        },
        {
          Category: 'capabilities',
        },
        {
          Category: 'product',
        },
      ],
      ':type': 'sheet',
    };

    const fetchResp = {
      json: async () => jsonData,
    };

    const savedFetch = window.fetch;
    try {
      window.fetch = async (url) => {
        if (url === 'https://admin.da.live/source/da/live/tools/tagbrowser/mycategories.json') {
          return fetchResp;
        }
        return null;
      };

      const tags = await dts.fetchTags();
      const tr = await fixture(html`<div>${tags}</div>`);
      expect(tr.querySelector('h2').innerText).to.equal('Categories');

      const items = tr.querySelectorAll('form ul li');
      expect(items.length).to.equal(3);
      const categories = [];
      items.forEach((item) => {
        categories.push(item.innerText);
      });
      categories.sort();
      expect(categories).to.deep.equal(['capabilities', 'product', 'resourceType']);
    } finally {
      window.fetch = savedFetch;
    }
  });

  it('Single select tags', async () => {
    const project = {
      org: 'jmphlx',
      repo: 'jmp-da',
    };
    const dts = new DaTagSelector();
    dts.project = project;
    dts.datasource = 'tools/tagbrowser/mytags.json';
    dts.displayName = 'mytags';

    const jsonData = {
      data: {
        total: 2,
        offset: 0,
        limit: 2,
        data: [
          {
            EN: 'Chemical',
            NL: 'Chemisch',
            DE: 'Chemisch',
          },
          {
            EN: 'Medical Devices',
            NL: 'Medische Apparatuur',
            DE: 'Medizinische Geräte',
          },
        ],
      },
      metadata: {
        total: 3,
        offset: 0,
        limit: 3,
        data: [
          {
            Key: 'Selection',
            Value: 'Single',
          },
          {
            Key: 'Type',
            Value: 'Tag',
          },
          {
            Key: 'Default Language',
            Value: 'EN',
          },
        ],
      },
      ':version': 3,
      ':names': [
        'data',
        'metadata',
      ],
      ':type': 'multi-sheet',
    };

    const fetchResp = {
      json: async () => jsonData,
    };

    const savedFetch = window.fetch;
    try {
      window.fetch = async (url) => {
        if (url === 'https://admin.da.live/source/jmphlx/jmp-da/tools/tagbrowser/mytags.json') {
          return fetchResp;
        }
        return null;
      };

      const tags = await dts.fetchTags();
      const tr = await fixture(html`<div>${tags}</div>`);
      expect(tr.querySelector('h2').innerText).to.equal('↑ mytags');
      expect(tr.querySelector('h2 span.up').innerText).to.equal('↑');

      const items = tr.querySelectorAll('form ul li label');
      expect(items.length).to.equal(2);

      const values = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const item of items) {
        const input = item.querySelector('input');
        expect(item.innerText).to.equal(input.value);
        expect(input.type).to.equal('radio');
        values.push(item.innerText);
      }
      expect(values).to.deep.equal(['Chemical', 'Medical Devices']);
    } finally {
      window.fetch = savedFetch;
    }
  });
});
