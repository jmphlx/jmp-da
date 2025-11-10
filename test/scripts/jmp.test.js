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
  /*
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
  */

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

  describe('Contains Operator', () => {
    let containsOperator;
    let pageObj;
    let conditionObj;

    before(() => {
      containsOperator = jmpHelper.containsOperator;

    });

    beforeEach(() => {
      pageObj = {
        path: '/interviewTestPage',
        title: 'My Interview',
        resourceType: 'Interview',
        industry: 'Academic',
        product: 'JMP',
      };
    });

    it('Compare single string page value and search conditions', () => {
      conditionObj = {
        property: 'resourceType',
        value: 'White Paper',
      };
      expect(containsOperator(pageObj, conditionObj)).to.be.false;
      conditionObj = {
        property: 'Industry',
        value: 'Academic',
      };
      expect(containsOperator(pageObj, conditionObj)).to.be.true;
    });


    it('Compare when page value is an array that contains the string', () => {
      pageObj.industry = 'Academic, Chemical';
      conditionObj = {
        property: 'Industry',
        value: 'Academic',
      };
      expect(containsOperator(pageObj, conditionObj)).to.be.true;
    });

    it('Compare when page value is an array that does not contain the string', () => {
      pageObj.industry = 'Academic, Chemical';
      conditionObj = {
        property: 'Industry',
        value: 'Biomedical',
      };
      expect(containsOperator(pageObj, conditionObj)).to.be.false;
    });

    it('Compare when both values are arrays with at least one matching value', () => {
      pageObj.industry = 'Academic, Chemical';
      conditionObj = {
        property: 'Industry',
        value: 'Biomedical, Academic',
      };
      expect(containsOperator(pageObj, conditionObj)).to.be.true;
    });

    it('Verify that search condition and page value comparisons are case insensitive', () => {
      pageObj.industry = 'Academic, Chemical';
      conditionObj = {
        property: 'industry',
        value: 'Biomedical, AcAdEmic',
      };
      expect(containsOperator(pageObj, conditionObj)).to.be.true;
    });

    it('Compare when both values are arrays without one matching value', () => {
      pageObj.industry = 'Academic, Chemical';
      conditionObj = {
        property: 'Industry',
        value: 'Biomedical, Medical',
      };
      expect(containsOperator(pageObj, conditionObj)).to.be.false;
    });

    it('Compare when the search is an array containing the string page value', () => {
      pageObj.industry = 'Chemical';
      conditionObj = {
        property: 'Industry',
        value: 'Biomedical, Chemical',
      };
      expect(containsOperator(pageObj, conditionObj)).to.be.true;
    });

    it('Compare when the search is an array but does not contain the string page value', () => {
      pageObj.industry = 'Academic';
      conditionObj = {
        property: 'Industry',
        value: 'Biomedical, Chemical',
      };
      expect(containsOperator(pageObj, conditionObj)).to.be.false;
    });
  });

  describe('Matches Operator', () => {
    let matchesOperator;
    let pageObj;
    let conditionObj;

    before(() => {
      matchesOperator = jmpHelper.matchesOperator;
      pageObj = {
        path: '/en/sandbox/interviewTestPage',
        title: 'My JMP Pro Interview',
        displayDescription: 'JMP Data Analytics and stuff',
      };
    });

    it('Check if a path starts with a folder (startingFolder check)', () => {
      conditionObj = {
        property: 'path',
        value: '/en',
      };
      expect(matchesOperator(pageObj, conditionObj).length).to.be.greaterThan(0);
    });

    it('Check if a page is not within a folder', () => {
      conditionObj = {
        property: 'path',
        value: '/es',
      };
      expect(matchesOperator(pageObj, conditionObj)).to.be.null;
    });

    it('Check if string contains a string with matches', () => {
      conditionObj = {
        property: 'displayDescription',
        value: 'Analytics',
      };
      expect(matchesOperator(pageObj, conditionObj).length).to.be.greaterThan(0);
    });
  });

  describe('StartsWith Operator', () => {
    let startsWithOperator;
    let pageObj;
    let conditionObj;

    before(() => {
      startsWithOperator = jmpHelper.startsWithOperator;
      pageObj = {
        path: '/en/sandbox/interviewTestPage',
      };
    });

    it('Check if a path starts with a folder (startingFolder check)', () => {
      conditionObj = {
        property: 'path',
        value: '/en',
      };
      expect(startsWithOperator(pageObj, conditionObj)).to.be.true;
    });

    it('Check if a property starts with a string', () => {
      conditionObj = {
        property: 'path',
        value: '/sandbox',
      };
      expect(startsWithOperator(pageObj, conditionObj)).to.be.false;
    });
  });

  describe('sortPageList', () => {
    let sortPageList;
    let pageList;

    before(() => {
      sortPageList = jmpHelper.sortPageList;
      pageList = [{
        path: '/en/sandbox/apple',
        title: 'Apple',
        releaseDate: '2024-02-02',
      },
      {
        path: '/en/sandbox/banana',
        title: 'Banana',
        releaseDate: '2024-01-01',
      },
      {
        path: '/en/sandbox/carrot',
        title: 'Carrot',
        releaseDate: '2024-03-03',
      },
    ];
    });

    it('Sort By Default', () => {
      const sortedList = sortPageList(pageList);
      expect('Banana').to.equal(sortedList[0].title);
      expect('Apple').to.equal(sortedList[1].title);
      expect('Carrot').to.equal(sortedList[2].title);
    });

    it('Sort By Default Descending', () => {
      const sortedList = sortPageList(pageList, undefined, 'descending');
      expect('Carrot').to.equal(sortedList[0].title);
      expect('Apple').to.equal(sortedList[1].title);
      expect('Banana').to.equal(sortedList[2].title);
    });

    it('Sort By Title Default', () => {
      const sortedList = sortPageList(pageList, 'title');
      expect('Apple').to.equal(sortedList[0].title);
      expect('Banana').to.equal(sortedList[1].title);
      expect('Carrot').to.equal(sortedList[2].title);
    });

    it('Sort By Title Descending', () => {
      const sortedList = sortPageList(pageList, 'title', 'descending');
      expect('Carrot').to.equal(sortedList[0].title);
      expect('Banana').to.equal(sortedList[1].title);
      expect('Apple').to.equal(sortedList[2].title);
    });

    it('Sort By Title Ascending', () => {
      const sortedList = sortPageList(pageList, 'title', 'ascending');
      expect('Apple').to.equal(sortedList[0].title);
      expect('Banana').to.equal(sortedList[1].title);
      expect('Carrot').to.equal(sortedList[2].title);
    });

    it('Sort By ReleaseDate Default', () => {
      const sortedList = sortPageList(pageList, 'releasedate');
      expect('Banana').to.equal(sortedList[0].title);
      expect('Apple').to.equal(sortedList[1].title);
      expect('Carrot').to.equal(sortedList[2].title);
    });

    it('Sort By ReleaseDate Descending', () => {
      const sortedList = sortPageList(pageList, 'releasedate', 'descending');
      expect('Carrot').to.equal(sortedList[0].title);
      expect('Apple').to.equal(sortedList[1].title);
      expect('Banana').to.equal(sortedList[2].title);
    });
  });

  describe('getBlockConfig', () => {
    let getBlockConfig;
    let config;
    before(async () => {
      getBlockConfig = jmpHelper.getBlockConfig;
      document.body.innerHTML = await readFile({ path: './block-definition.html' });
      config = getBlockConfig(document.querySelector('.listgroup-custom'));
    });

    it('Convert <p> into strings', () => {
      expect(config['sortBy']).to.equal('title');
      expect(config['tabProperty']).to.equal('resourceType');
      expect(config.filter).to.equal('/en/customquery.json');
      expect(config.paragraphs).to.have.all.members(['foo', 'bar']);
    });

    it('Convert <ol> to array of strings', () => {
      expect(config.tabs).to.have.all.members(['All Resources=all', 'Customer Story ABC=Customer Story','Interviews=Interview']);
      expect(config.displayProperties).to.have.all.members(['title']);
    });

    it('Convert <ul> to array of strings', () => {
      expect(config.bullets).to.have.all.members(['item1', 'item2']);
    });

    it('Convert <a> to the link', () => {
      expect(config.pages).to.have.all.members(['https://www.google.com/', 'https://www.jmp.com/']);
    });

    it('Convert <img> to the link', () => {
      expect(config.image).to.contain('/myTest.jpg');
      expect(2).to.equal(config['multipleImages'].length);
    });
  });
});
