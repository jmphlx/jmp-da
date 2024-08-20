/* global before describe it */
import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';

const jmpHelper = await import('../../scripts/jmp.js');
const data = await readFile({ path: './jmp-all.json' });

describe('jmp.js tests', () => {
  describe('Array Comparison Logic', () => {
    let arrayIncludesAllValues;
    let arrayIncludesSomeValues;

    before(async () => {
      arrayIncludesAllValues = jmpHelper.arrayIncludesAllValues;
      arrayIncludesSomeValues = jmpHelper.arrayIncludesSomeValues;
    });

    it('Array contains another entire array', () => {
      expect(arrayIncludesAllValues(['1', '2'], ['1', '2'])).to.be.true;
      expect(arrayIncludesAllValues(['1', '2', '3'], ['1', '2'])).to.be.true;
      expect(arrayIncludesAllValues(['1', '2'], ['1', '2', '3'])).to.be.false;
    });

    it('Array contains partial array', () => {
      expect(arrayIncludesSomeValues(['1', '2'], ['1', '2'])).to.be.true;
      expect(arrayIncludesSomeValues(['1', '2', '3'], ['1', '2'])).to.be.true;
      expect(arrayIncludesSomeValues(['1', '2'], ['1', '2', '3'])).to.be.true;
      expect(arrayIncludesSomeValues(['2'], ['1', '2', '3'])).to.be.true;
    });
  });

  describe('And Logic', () => {
    let andFilter;

    before(async () => {
      andFilter = jmpHelper.pageAndFilter;
    });

    it('Multiple filters of the same category, with matching results', () => {
      const filterObject = {
        industry: ['chemistry', 'biotechnology'],
      };
      const pageSelection = JSON.parse(data).data;
      expect(andFilter(pageSelection, filterObject).length).to.equal(2);
    });

    it('More than one type of filter criteria, with matching results', () => {
      const filterObject = {
        industry: 'biotechnology',
        resourceType: 'interview',
      };
      const pageSelection = JSON.parse(data).data;
      expect(andFilter(pageSelection, filterObject).length).to.equal(2);
    });

    it('More than one type of filter in the same category, matching no resources', () => {
      const filterObject = {
        industry: ['chemistry', 'pharmaceutical-and-biotech'],
      };
      const pageSelection = JSON.parse(data).data;
      expect(andFilter(pageSelection, filterObject).length).to.equal(0);
    });
  });

  describe('Or Logic', () => {
    let orFilter;

    before(async () => {
      orFilter = jmpHelper.pageOrFilter;
    });

    it('Multiple filters of the same category, with matching results', () => {
      const filterObject = {
        industry: ['chemistry', 'biotechnology'],
      };
      const pageSelection = JSON.parse(data).data;
      expect(3).to.equal(orFilter(pageSelection, filterObject).length);
    });

    it('More than one type of filter criteria, with matching results', () => {
      const filterObject = {
        industry: 'biotechnology',
        resourceType: 'interview',
      };
      const pageSelection = JSON.parse(data).data;
      expect(10).to.equal(orFilter(pageSelection, filterObject).length);
    });

    it('Different non-overlapping filter criteria for industry', () => {
      const filterObject = {
        industry: ['chemistry', 'pharmaceutical-and-biotech'],
      };
      const pageSelection = JSON.parse(data).data;
      expect(4).to.equal(orFilter(pageSelection, filterObject).length);
    });
  });

  describe('Language Index', () => {
    let isLanguageSupported;

    before(async () => {
      isLanguageSupported = jmpHelper.isLanguageSupported;
    });

    it('Language index should exist for certain languages', () => {
      expect(true, isLanguageSupported('en'));
      expect(true, isLanguageSupported('FR'));
      expect(true, isLanguageSupported('zh_hans'));
      expect(false, isLanguageSupported('en_us'));
    });
  });
});
