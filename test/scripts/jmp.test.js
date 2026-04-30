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

    it('Convert single <a> to the column element', () => {
      expect(config.link).to.not.be.undefined;
      expect(config.link.querySelector('a')).to.not.be.null;
    });
  });

  describe('getBlockConfig with plain-text options row', () => {
    let getBlockConfig;
    let config;
    before(() => {
      getBlockConfig = jmpHelper.getBlockConfig;
      document.body.innerHTML = `
        <div class="opts-block block">
          <div><div>options</div><div>key1=val1,key2=val2,flagonly</div></div>
          <div><div>tabs</div><div>Tab1=val1,FlagTab</div></div>
        </div>`;
      config = getBlockConfig(document.querySelector('.opts-block'));
    });

    it('parses key=value pairs in options plain text (caseSensitive=false)', () => {
      expect(config.options.key1).to.equal('val1');
      expect(config.options.key2).to.equal('val2');
    });

    it('parses flag-only entries in options plain text (caseSensitive=false)', () => {
      expect(config.options.flagonly).to.be.true;
    });

    it('parses flag-only entries in tabs plain text (caseSensitive=true)', () => {
      expect(config.tabs.FlagTab).to.be.true;
      expect(config.tabs.Tab1).to.equal('val1');
    });
  });

  describe('getDefaultMetaImage', () => {
    let getDefaultMetaImage;
    before(() => { getDefaultMetaImage = jmpHelper.getDefaultMetaImage; });

    it('returns a URL containing the default share image path', () => {
      expect(getDefaultMetaImage()).to.include('/icons/jmp-com-share.jpg');
    });
  });

  describe('getLanguageNav', () => {
    let getLanguageNav;
    before(() => { getLanguageNav = jmpHelper.getLanguageNav; });

    it('returns the standard header nav path by default', () => {
      expect(getLanguageNav()).to.include('/navigation/header');
    });

    it('returns the SKP nav path when isSKP is true', () => {
      expect(getLanguageNav(true)).to.include('/statistics-knowledge-portal/nav');
    });
  });

  describe('getLanguageFooter', () => {
    let getLanguageFooter;
    before(() => { getLanguageFooter = jmpHelper.getLanguageFooter; });

    it('returns the standard footer path by default', () => {
      expect(getLanguageFooter()).to.include('/navigation/footer');
    });

    it('returns the SKP footer path when isSKP is true', () => {
      expect(getLanguageFooter(true)).to.include('/statistics-knowledge-portal/footer');
    });
  });

  describe('getLanguageIndex', () => {
    let getLanguageIndex;
    before(() => { getLanguageIndex = jmpHelper.getLanguageIndex; });

    it('returns jmp-en.json when the overwrite language is unsupported', () => {
      expect(getLanguageIndex('xx')).to.equal('/jmp-en.json');
    });

    it('returns the correct index for a supported overwrite language', () => {
      expect(getLanguageIndex('fr')).to.equal('/jmp-fr.json');
    });
  });

  describe('getSKPLanguageIndex', () => {
    let getSKPLanguageIndex;
    before(() => { getSKPLanguageIndex = jmpHelper.getSKPLanguageIndex; });

    it('returns a skp-*.json path', () => {
      expect(getSKPLanguageIndex()).to.match(/\/skp-[a-z-]+\.json/);
    });
  });

  describe('filterOutPastEvents', () => {
    let filterOutPastEvents;
    before(() => { filterOutPastEvents = jmpHelper.filterOutPastEvents; });

    it('keeps items that have no offDateTime', () => {
      const pages = [{ title: 'No Date' }, { title: 'Also None' }];
      expect(filterOutPastEvents(pages)).to.have.length(2);
    });

    it('removes items with a past offDateTime and keeps future ones', () => {
      const pages = [
        { title: 'Past', offDateTime: '2000-01-01T00:00:00' },
        { title: 'Future', offDateTime: '2999-12-31T23:59:59' },
      ];
      const result = filterOutPastEvents(pages);
      expect(result).to.have.length(1);
      expect(result[0].title).to.equal('Future');
    });
  });

  describe('containsOperator with array page values', () => {
    let containsOperator;
    before(() => { containsOperator = jmpHelper.containsOperator; });

    it('matches when array pageValue includes single filterValue', () => {
      const page = { tags: ['academic', 'chemistry'] };
      expect(containsOperator(page, { property: 'tags', value: 'chemistry' })).to.be.true;
    });

    it('does not match when array pageValue lacks filterValue', () => {
      const page = { tags: ['academic', 'chemistry'] };
      expect(containsOperator(page, { property: 'tags', value: 'biomedical' })).to.be.false;
    });

    it('uses arrayIncludesAllValues when filterValue has commas and all match', () => {
      const page = { tags: ['academic', 'chemistry'] };
      expect(containsOperator(page, { property: 'tags', value: 'academic, chemistry' })).to.be.true;
    });

    it('returns false when not all comma-separated filter values are in the array', () => {
      const page = { tags: ['academic'] };
      expect(containsOperator(page, { property: 'tags', value: 'academic, chemistry' })).to.be.false;
    });
  });

  describe('sortPageList additional cases', () => {
    let sortPageList;
    before(() => { sortPageList = jmpHelper.sortPageList; });

    it('Sort By releaseDate (camelCase) ascending', () => {
      const list = [
        { title: 'Apple', releaseDate: '2024-02-02' },
        { title: 'Banana', releaseDate: '2024-01-01' },
        { title: 'Carrot', releaseDate: '2024-03-03' },
      ];
      const sorted = sortPageList(list, 'releaseDate');
      expect(sorted[0].title).to.equal('Banana');
      expect(sorted[1].title).to.equal('Apple');
      expect(sorted[2].title).to.equal('Carrot');
    });

    it('Sort By releaseDate (camelCase) descending', () => {
      const list = [
        { title: 'Apple', releaseDate: '2024-02-02' },
        { title: 'Banana', releaseDate: '2024-01-01' },
        { title: 'Carrot', releaseDate: '2024-03-03' },
      ];
      const sorted = sortPageList(list, 'releaseDate', 'descending');
      expect(sorted[0].title).to.equal('Carrot');
      expect(sorted[1].title).to.equal('Apple');
      expect(sorted[2].title).to.equal('Banana');
    });

    it('Sort by custom property uses localeCompare (default case) ascending', () => {
      const list = [{ label: 'Charlie' }, { label: 'Alpha' }, { label: 'Bravo' }];
      const sorted = sortPageList(list, 'label');
      expect(sorted[0].label).to.equal('Alpha');
      expect(sorted[1].label).to.equal('Bravo');
      expect(sorted[2].label).to.equal('Charlie');
    });

    it('Sort by custom property uses localeCompare (default case) descending', () => {
      const list = [{ label: 'Charlie' }, { label: 'Alpha' }, { label: 'Bravo' }];
      const sorted = sortPageList(list, 'label', 'descending');
      expect(sorted[0].label).to.equal('Charlie');
      expect(sorted[1].label).to.equal('Bravo');
      expect(sorted[2].label).to.equal('Alpha');
    });
  });

  describe('debounce', () => {
    let debounce;
    before(() => { debounce = jmpHelper.debounce; });

    it('calls the wrapped function after the delay elapses', async () => {
      let called = false;
      const fn = debounce(() => { called = true; }, 10);
      fn();
      await new Promise((resolve) => setTimeout(resolve, 30));
      expect(called).to.be.true;
    });

    it('invokes the function only once when called multiple times rapidly', async () => {
      let count = 0;
      const fn = debounce(() => { count += 1; }, 30);
      fn();
      fn();
      fn();
      await new Promise((resolve) => setTimeout(resolve, 80));
      expect(count).to.equal(1);
    });
  });

  describe('updateBodyClassOnWindowResize', () => {
    let updateBodyClassOnWindowResize;
    before(() => { updateBodyClassOnWindowResize = jmpHelper.updateBodyClassOnWindowResize; });
    afterEach(() => {
      document.body.classList.remove('basic', 'basic-mobile', 'skp-header', 'skp-header-mobile');
    });

    it('adds basic and removes basic-mobile on desktop', () => {
      document.body.classList.add('basic-mobile');
      updateBodyClassOnWindowResize(true);
      expect(document.body.classList.contains('basic')).to.be.true;
      expect(document.body.classList.contains('basic-mobile')).to.be.false;
    });

    it('adds basic-mobile and removes basic on mobile', () => {
      document.body.classList.add('basic');
      updateBodyClassOnWindowResize(false);
      expect(document.body.classList.contains('basic-mobile')).to.be.true;
      expect(document.body.classList.contains('basic')).to.be.false;
    });

    it('adds skp-header and removes skp-header-mobile on SKP desktop', () => {
      document.body.classList.add('skp-header-mobile');
      updateBodyClassOnWindowResize(true, true);
      expect(document.body.classList.contains('skp-header')).to.be.true;
      expect(document.body.classList.contains('skp-header-mobile')).to.be.false;
    });

    it('adds skp-header-mobile and removes skp-header on SKP mobile', () => {
      document.body.classList.add('skp-header');
      updateBodyClassOnWindowResize(false, true);
      expect(document.body.classList.contains('skp-header-mobile')).to.be.true;
      expect(document.body.classList.contains('skp-header')).to.be.false;
    });
  });

  describe('writeImagePropertyInList', () => {
    let writeImagePropertyInList;
    before(() => { writeImagePropertyInList = jmpHelper.writeImagePropertyInList; });

    it('uses displayImage when present', () => {
      const html = writeImagePropertyInList('myProp', { displayImage: '/custom.jpg' });
      expect(html).to.include('/custom.jpg');
      expect(html).to.include('class="myProp"');
    });

    it('uses image property when no displayImage', () => {
      const html = writeImagePropertyInList('myProp', { image: '/og-image.jpg' });
      expect(html).to.include('/og-image.jpg');
    });

    it('falls back to default meta image when no image properties are present', () => {
      const html = writeImagePropertyInList('myProp', {});
      expect(html).to.include('/icons/jmp-com-share.jpg');
    });
  });

  describe('getTagPropertyConverted', () => {
    let getTagPropertyConverted;
    before(() => { getTagPropertyConverted = jmpHelper.getTagPropertyConverted; });

    it('returns the mapped AEM tag path segment for known properties', () => {
      expect(getTagPropertyConverted('industry')).to.equal('industry');
      expect(getTagPropertyConverted('resourceType')).to.equal('resource-type');
      expect(getTagPropertyConverted('eventType')).to.equal('event-type');
    });
  });

  describe('convertCamelToKebabCase', () => {
    let convertCamelToKebabCase;
    before(() => { convertCamelToKebabCase = jmpHelper.convertCamelToKebabCase; });

    it('converts camelCase strings to kebab-case', () => {
      expect(convertCamelToKebabCase('resourceType')).to.equal('resource-type');
      expect(convertCamelToKebabCase('funnelStage')).to.equal('funnel-stage');
    });

    it('leaves already lowercase strings unchanged', () => {
      expect(convertCamelToKebabCase('simple')).to.equal('simple');
    });
  });

  describe('parseBlockOptions', () => {
    let parseBlockOptions;
    before(() => { parseBlockOptions = jmpHelper.parseBlockOptions; });

    it('parses key=value pairs from the options row', () => {
      document.body.innerHTML = `
        <div class="test-block">
          <div><div>options</div><div>key1=val1,key2=val2</div></div>
          <div><div>other</div><div>content</div></div>
        </div>`;
      const result = parseBlockOptions(document.querySelector('.test-block'));
      expect(result.key1).to.equal('val1');
      expect(result.key2).to.equal('val2');
    });

    it('parses flag-only values from the options row', () => {
      document.body.innerHTML = `
        <div class="test-block">
          <div><div>options</div><div>flagonly</div></div>
        </div>`;
      const result = parseBlockOptions(document.querySelector('.test-block'));
      expect(result.flagonly).to.be.true;
    });

    it('removes the options row from the block after parsing', () => {
      document.body.innerHTML = `
        <div class="test-block">
          <div><div>options</div><div>key=val</div></div>
          <div><div>other</div><div>content</div></div>
        </div>`;
      const block = document.querySelector('.test-block');
      parseBlockOptions(block);
      expect(block.children.length).to.equal(1);
    });

    it('returns an empty object when the options row is not the first row', () => {
      document.body.innerHTML = `
        <div class="test-block">
          <div><div>other</div><div>content</div></div>
          <div><div>options</div><div>key=val</div></div>
        </div>`;
      const result = parseBlockOptions(document.querySelector('.test-block'));
      expect(Object.keys(result)).to.have.length(0);
    });

    it('uses a custom rowName when provided', () => {
      document.body.innerHTML = `
        <div class="test-block">
          <div><div>settings</div><div>a=1</div></div>
        </div>`;
      const result = parseBlockOptions(document.querySelector('.test-block'), 'settings');
      expect(result.a).to.equal('1');
    });
  });

  describe('getBlockPropertiesList', () => {
    let getBlockPropertiesList;
    before(() => { getBlockPropertiesList = jmpHelper.getBlockPropertiesList; });

    it('parses flag-only items from the properties list', () => {
      document.body.innerHTML = `
        <div class="test-block">
          <div><div>myrow</div><div>flagonly</div></div>
        </div>`;
      const result = getBlockPropertiesList(document.querySelector('.test-block'), 'myrow');
      expect(result.flagonly).to.be.true;
    });

    it('returns an empty object when the row name is not found', () => {
      document.body.innerHTML = `
        <div class="test-block">
          <div><div>other</div><div>content</div></div>
        </div>`;
      const result = getBlockPropertiesList(document.querySelector('.test-block'), 'missing');
      expect(Object.keys(result)).to.have.length(0);
    });
  });

  describe('setTabFromHash', () => {
    let setTabFromHash;
    let btn1;
    let btn2;
    let panel1;
    let panel2;
    before(() => {
      setTabFromHash = jmpHelper.setTabFromHash;
      document.body.innerHTML = `
        <div class="block">
          <div role="tablist">
            <button id="btn1" aria-selected="false">Tab 1</button>
            <button id="btn2" aria-selected="false">Tab 2</button>
          </div>
          <div id="panel1" role="tabpanel" aria-hidden="true">Panel 1</div>
          <div id="panel2" role="tabpanel" aria-hidden="true">Panel 2</div>
        </div>`;
      btn1 = document.getElementById('btn1');
      btn2 = document.getElementById('btn2');
      panel1 = document.getElementById('panel1');
      panel2 = document.getElementById('panel2');
    });

    it('sets aria-hidden=false on the selected panel and hides the rest', () => {
      setTabFromHash(btn1, panel1);
      expect(panel1.getAttribute('aria-hidden')).to.equal('false');
      expect(panel2.getAttribute('aria-hidden')).to.equal('true');
    });

    it('sets aria-selected=true on the active button and false on others', () => {
      setTabFromHash(btn1, panel1);
      expect(btn1.getAttribute('aria-selected')).to.equal('true');
      expect(btn2.getAttribute('aria-selected')).to.equal('false');
    });
  });

  describe('getJsonFromLocalhostUrl', () => {
    let getJsonFromLocalhostUrl;
    let originalFetch;
    before(() => {
      getJsonFromLocalhostUrl = jmpHelper.getJsonFromLocalhostUrl;
      originalFetch = window.fetch;
    });
    after(() => { window.fetch = originalFetch; });

    it('returns parsed JSON when fetch succeeds', async () => {
      window.fetch = async () => ({ ok: true, json: async () => ({ data: [{ title: 'Test' }] }) });
      const result = await getJsonFromLocalhostUrl('/some/route');
      expect(result.data[0].title).to.equal('Test');
    });

    it('returns null when the response is not ok', async () => {
      window.fetch = async () => ({ ok: false });
      expect(await getJsonFromLocalhostUrl('/some/route')).to.be.null;
    });

    it('returns null when fetch throws', async () => {
      window.fetch = async () => { throw new Error('network error'); };
      expect(await getJsonFromLocalhostUrl('/some/route')).to.be.null;
    });
  });

  describe('getLangMenuPageUrl', () => {
    let getLangMenuPageUrl;
    let originalFetch;
    before(() => {
      getLangMenuPageUrl = jmpHelper.getLangMenuPageUrl;
      originalFetch = window.fetch;
    });
    after(() => { window.fetch = originalFetch; });

    it('returns a URL string when the page exists and is not redirected', async () => {
      window.fetch = async () => ({ ok: true, redirected: false });
      const result = await getLangMenuPageUrl('/fr/navigation/header');
      expect(result).to.be.a('string');
    });

    it('returns null when the response is not ok', async () => {
      window.fetch = async () => ({ ok: false, redirected: false });
      expect(await getLangMenuPageUrl('/fr/navigation/header')).to.be.null;
    });

    it('returns null when the response is redirected', async () => {
      window.fetch = async () => ({ ok: true, redirected: true });
      expect(await getLangMenuPageUrl('/fr/navigation/header')).to.be.null;
    });

    it('returns null when fetch throws', async () => {
      window.fetch = async () => { throw new Error('network error'); };
      expect(await getLangMenuPageUrl('/fr/navigation/header')).to.be.null;
    });
  });
});
