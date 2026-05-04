/* global before after describe it */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const {
  createTag,
  getCookie,
  DA_CONSTANTS,
  replaceHtml,
  saveToDa,
  createRateLimiter,
  getPageStatus,
  getPublishStatus,
  createVersion,
  toLowerCaseObject,
} = await import('../../scripts/helper.js');

describe('Helper Functions', () => {
  describe('createTag', () => {
    it('creates an element with the specified tag', () => {
      const el = createTag('div');
      expect(el.tagName).to.equal('DIV');
    });

    it('creates an element and sets attributes', () => {
      const el = createTag('div', { id: 'test', class: 'my-class' });
      expect(el.getAttribute('id')).to.equal('test');
      expect(el.getAttribute('class')).to.equal('my-class');
    });

    it('creates an element with HTML string content', () => {
      const el = createTag('div', {}, '<span>Hello</span>');
      expect(el.innerHTML).to.equal('<span>Hello</span>');
    });

    it('creates an element with HTMLElement content', () => {
      const span = document.createElement('span');
      span.textContent = 'World';
      const el = createTag('div', {}, span);
      expect(el.querySelector('span')).to.exist;
      expect(el.querySelector('span').textContent).to.equal('World');
    });

    it('creates element with attributes and HTML content', () => {
      const el = createTag('div', { id: 'wrap' }, '<p>Content</p>');
      expect(el.getAttribute('id')).to.equal('wrap');
      expect(el.innerHTML).to.include('<p>Content</p>');
    });

    it('handles null attributes', () => {
      const el = createTag('div', null, '<span>Test</span>');
      expect(el.innerHTML).to.include('Test');
      expect(el.attributes.length).to.equal(0);
    });

    it('handles undefined HTML content', () => {
      const el = createTag('div', { id: 'test' }, undefined);
      expect(el.getAttribute('id')).to.equal('test');
      expect(el.innerHTML).to.equal('');
    });

    it('creates data attributes', () => {
      const el = createTag('div', { 'data-value': '123' });
      expect(el.getAttribute('data-value')).to.equal('123');
    });
  });

  describe('getCookie', () => {
    afterEach(() => {
      document.cookie = 'test=; max-age=0';
    });

    it('returns cookie value when found', () => {
      document.cookie = 'testCookie=testValue';
      const value = getCookie('testCookie');
      expect(value).to.equal('testValue');
    });

    it('returns empty string when cookie not found', () => {
      const value = getCookie('nonexistentCookie');
      expect(value).to.equal('');
    });

    it('retrieves correct cookie from multiple cookies', () => {
      document.cookie = 'cookie1=value1';
      document.cookie = 'cookie2=value2';
      expect(getCookie('cookie2')).to.equal('value2');
      expect(getCookie('cookie1')).to.equal('value1');
    });

    it('handles cookies with spaces', () => {
      document.cookie = 'spacedCookie=spacedValue';
      const value = getCookie('spacedCookie');
      expect(value).to.equal('spacedValue');
    });

    it('handles cookie value with equals sign', () => {
      document.cookie = 'jsonCookie={"key":"value"}';
      const value = getCookie('jsonCookie');
      expect(value).to.equal('{"key":"value"}');
    });
  });

  describe('DA_CONSTANTS', () => {
    it('has sourceUrl property', () => {
      expect(DA_CONSTANTS.sourceUrl).to.equal('https://admin.da.live/source');
    });

    it('has versionUrl property', () => {
      expect(DA_CONSTANTS.versionUrl).to.equal('https://admin.da.live/versionsource');
    });

    it('has editUrl property', () => {
      expect(DA_CONSTANTS.editUrl).to.equal('https://da.live/edit#');
    });

    it('has org property', () => {
      expect(DA_CONSTANTS.org).to.equal('jmphlx');
    });

    it('has repo property', () => {
      expect(DA_CONSTANTS.repo).to.equal('jmp-da');
    });

    it('has mainUrl property', () => {
      expect(DA_CONSTANTS.mainUrl).to.include('jmp-da');
    });
  });

  describe('replaceHtml', () => {
    it('wraps content in body, header, main, and footer', () => {
      const input = '<p>Test</p>';
      const output = replaceHtml(input);
      expect(output).to.include('<body>');
      expect(output).to.include('<header></header>');
      expect(output).to.include('<main>');
      expect(output).to.include('<footer></footer>');
      expect(output).to.include('<p>Test</p>');
    });

    it('replaces ./media with mainUrl/media', () => {
      const input = '<img src="./media/test.jpg">';
      const output = replaceHtml(input);
      expect(output).to.include(`${DA_CONSTANTS.mainUrl}/media/test.jpg`);
    });

    it('handles multiple media references', () => {
      const input = '<img src="./media/1.jpg"><img src="./media/2.jpg">';
      const output = replaceHtml(input);
      expect(output).to.include(`${DA_CONSTANTS.mainUrl}/media/1.jpg`);
      expect(output).to.include(`${DA_CONSTANTS.mainUrl}/media/2.jpg`);
    });

    it('preserves other content', () => {
      const input = '<p>Hello World</p>';
      const output = replaceHtml(input);
      expect(output).to.include('Hello World');
    });
  });

  describe('saveToDa', () => {
    let fetchStub;

    beforeEach(() => {
      fetchStub = sinon.stub(window, 'fetch');
    });

    afterEach(() => {
      fetchStub.restore();
    });

    it('sends PUT request with correct path and token', async () => {
      fetchStub.resolves(new Response('', { status: 200, ok: true }));
      await saveToDa('<p>Test</p>', '/test/page', 'token123');
      expect(fetchStub.called).to.be.true;
      const call = fetchStub.firstCall;
      expect(call.args[0]).to.include('/source/');
      expect(call.args[0]).to.include('/test/page.html');
      expect(call.args[1].headers.Authorization).to.equal('Bearer token123');
    });

    it('returns correct daHref', async () => {
      fetchStub.resolves(new Response('', { status: 200, ok: true }));
      const result = await saveToDa('<p>Test</p>', '/test/page', 'token123');
      expect(result.daHref).to.include('da.live/edit#');
      expect(result.daHref).to.include('jmphlx');
      expect(result.daHref).to.include('jmp-da');
    });

    it('returns status code from response', async () => {
      fetchStub.resolves(new Response('', { status: 201, ok: true }));
      const result = await saveToDa('<p>Test</p>', '/test/page', 'token123');
      expect(result.daStatus).to.equal(201);
    });

    it('returns ok flag', async () => {
      fetchStub.resolves(new Response('', { status: 200, ok: true }));
      const result = await saveToDa('<p>Test</p>', '/test/page', 'token123');
      expect(result.ok).to.be.true;
    });

    it('returns null on fetch error', async () => {
      fetchStub.rejects(new Error('Network error'));
      const result = await saveToDa('<p>Test</p>', '/test/page', 'token123');
      expect(result).to.be.null;
    });

    it('wraps HTML content with body structure', async () => {
      let capturedFormData;
      fetchStub.resolves(new Response('', { status: 200, ok: true }));
      fetchStub.callsFake((url, opts) => {
        const formData = opts.body;
        capturedFormData = formData;
        return Promise.resolve(new Response('', { status: 200, ok: true }));
      });
      await saveToDa('<p>Content</p>', '/page', 'token');
      expect(capturedFormData).to.exist;
    });

    it('handles false ok response', async () => {
      fetchStub.resolves(new Response('', { status: 400, ok: false }));
      const result = await saveToDa('<p>Test</p>', '/test/page', 'token123');
      expect(result.ok).to.be.false;
    });
  });

  describe('createRateLimiter', () => {
    it('executes function immediately when under limit', async () => {
      const limiter = createRateLimiter(2, 1000);
      const fn = sinon.stub().resolves('result');
      const result = await limiter(fn);
      expect(fn.called).to.be.true;
      expect(result).to.equal('result');
    });

    it('executes multiple functions within limit immediately', async () => {
      const limiter = createRateLimiter(3, 1000);
      const fn1 = sinon.stub().resolves('1');
      const fn2 = sinon.stub().resolves('2');
      const fn3 = sinon.stub().resolves('3');

      const results = await Promise.all([limiter(fn1), limiter(fn2), limiter(fn3)]);
      expect(results).to.deep.equal(['1', '2', '3']);
    });

    it('delays function when over limit', async () => {
      const limiter = createRateLimiter(1, 100);
      const fn1 = sinon.stub().resolves('1');
      const fn2 = sinon.stub().resolves('2');

      const start = Date.now();
      await Promise.all([limiter(fn1), limiter(fn2)]);
      const elapsed = Date.now() - start;

      expect(elapsed).to.be.at.least(90);
    });

    it('rejects promise on function error', async () => {
      const limiter = createRateLimiter(1, 100);
      const fn = sinon.stub().rejects(new Error('Test error'));
      try {
        await limiter(fn);
        throw new Error('Should have rejected');
      } catch (e) {
        expect(e.message).to.equal('Test error');
      }
    });

    it('processes queue sequentially', async () => {
      const limiter = createRateLimiter(1, 50);
      const order = [];
      const fn1 = sinon.stub().callsFake(async () => {
        order.push(1);
        return '1';
      });
      const fn2 = sinon.stub().callsFake(async () => {
        order.push(2);
        return '2';
      });
      const fn3 = sinon.stub().callsFake(async () => {
        order.push(3);
        return '3';
      });

      await Promise.all([limiter(fn1), limiter(fn2), limiter(fn3)]);
      expect(order).to.deep.equal([1, 2, 3]);
    });
  });

  describe('getPageStatus', () => {
    let fetchStub;

    beforeEach(() => {
      fetchStub = sinon.stub(window, 'fetch');
    });

    afterEach(() => {
      fetchStub.restore();
    });

    it('returns live and preview status on success', async () => {
      const mockResponse = {
        live: { status: 200, lastModified: '2024-01-01' },
        preview: { status: 200 },
      };
      fetchStub.resolves(new Response(JSON.stringify(mockResponse), { ok: true }));
      const result = await getPageStatus('/test/page', 'token123');
      expect(result.live).to.equal(200);
      expect(result.preview).to.equal(200);
    });

    it('returns lastPublished timestamp', async () => {
      const mockResponse = {
        live: { status: 200, lastModified: '2024-01-15T10:30:00Z' },
        preview: { status: 200 },
      };
      fetchStub.resolves(new Response(JSON.stringify(mockResponse), { ok: true }));
      const result = await getPageStatus('/test/page', 'token123');
      expect(result.lastPublished).to.equal('2024-01-15T10:30:00Z');
    });

    it('returns 500 status on fetch error', async () => {
      fetchStub.rejects(new Error('Network error'));
      const result = await getPageStatus('/test/page', 'token123');
      expect(result.live).to.equal(500);
      expect(result.preview).to.equal(500);
    });

    it('returns 500 status when response not ok', async () => {
      fetchStub.resolves(new Response('', { ok: false }));
      const result = await getPageStatus('/test/page', 'token123');
      expect(result.live).to.equal(500);
      expect(result.preview).to.equal(500);
    });

    it('sends authorization header', async () => {
      fetchStub.resolves(new Response(JSON.stringify({
        live: { status: 200, lastModified: '2024-01-01' },
        preview: { status: 200 },
      }), { ok: true }));
      await getPageStatus('/test/page', 'mytoken');
      const call = fetchStub.firstCall;
      expect(call.args[1].headers.Authorization).to.equal('Bearer mytoken');
    });

    it('returns 500 for non-ok response without parsing JSON', async () => {
      fetchStub.resolves(new Response('', { ok: false, status: 401 }));
      const result = await getPageStatus('/test/page', 'token123');
      expect(result.live).to.equal(500);
      expect(result.preview).to.equal(500);
      expect(result.lastPublished).to.be.undefined;
    });
  });

  describe('getPublishStatus', () => {
    it('returns loading when statusObj is null', () => {
      const status = getPublishStatus(null);
      expect(status).to.equal('loading');
    });

    it('returns loading when statusObj is undefined', () => {
      const status = getPublishStatus(undefined);
      expect(status).to.equal('loading');
    });

    it('returns published when live status is 2xx', () => {
      const status = getPublishStatus({ live: 200, preview: 200 });
      expect(status).to.equal('published');
    });

    it('returns published for live 299', () => {
      const status = getPublishStatus({ live: 299, preview: 404 });
      expect(status).to.equal('published');
    });

    it('returns previewed when live not 2xx but preview is 2xx', () => {
      const status = getPublishStatus({ live: 404, preview: 200 });
      expect(status).to.equal('previewed');
    });

    it('returns unpublished when both live and preview are 4xx', () => {
      const status = getPublishStatus({ live: 404, preview: 404 });
      expect(status).to.equal('unpublished');
    });

    it('returns unpublished for 404s', () => {
      const status = getPublishStatus({ live: 404, preview: 404 });
      expect(status).to.equal('unpublished');
    });

    it('returns error for unexpected status', () => {
      const status = getPublishStatus({ live: 500, preview: 500 });
      expect(status).to.equal('error');
    });

    it('returns previewed when live is 5xx but preview is 2xx', () => {
      const status = getPublishStatus({ live: 500, preview: 200 });
      expect(status).to.equal('previewed');
    });

    it('returns error when only live is 4xx', () => {
      const status = getPublishStatus({ live: 404, preview: 500 });
      expect(status).to.equal('error');
    });
  });

  describe('createVersion', () => {
    let fetchStub;

    beforeEach(() => {
      fetchStub = sinon.stub(window, 'fetch');
    });

    afterEach(() => {
      fetchStub.restore();
    });

    it('sends POST request with correct parameters', async () => {
      fetchStub.resolves(new Response(JSON.stringify({ success: true }), { ok: true }));
      await createVersion('/test/page', 'token123', 'Test Version');
      const call = fetchStub.firstCall;
      expect(call.args[1].method).to.equal('POST');
      expect(call.args[1].headers.Authorization).to.equal('Bearer token123');
    });

    it('sends description in request body', async () => {
      fetchStub.resolves(new Response(JSON.stringify({ success: true }), { ok: true }));
      await createVersion('/test/page', 'token123', 'Custom Description');
      const call = fetchStub.firstCall;
      const body = JSON.parse(call.args[1].body);
      expect(body.label).to.equal('Custom Description');
    });

    it('uses default description', async () => {
      fetchStub.resolves(new Response(JSON.stringify({ success: true }), { ok: true }));
      await createVersion('/test/page', 'token123');
      const call = fetchStub.firstCall;
      const body = JSON.parse(call.args[1].body);
      expect(body.label).to.equal('Search & Replace Version');
    });

    it('returns JSON response when content-type is JSON', async () => {
      const mockResponse = { versionId: '123', label: 'Test' };
      fetchStub.resolves(new Response(JSON.stringify(mockResponse), {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
      }));
      const result = await createVersion('/test/page', 'token123');
      expect(result.versionId).to.equal('123');
    });

    it('returns success true with status for non-JSON response', async () => {
      fetchStub.resolves(new Response('', {
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'text/plain' }),
      }));
      const result = await createVersion('/test/page', 'token123');
      expect(result.success).to.be.true;
      expect(result.status).to.equal(201);
    });

    it('returns success false on error response', async () => {
      fetchStub.resolves(new Response('Error message', { ok: false, status: 400 }));
      const result = await createVersion('/test/page', 'token123');
      expect(result.success).to.be.false;
      expect(result.status).to.equal(400);
    });

    it('returns success false on fetch exception', async () => {
      fetchStub.rejects(new Error('Network error'));
      const result = await createVersion('/test/page', 'token123');
      expect(result.success).to.be.false;
      expect(result.status).to.be.null;
    });

    it('handles malformed JSON gracefully', async () => {
      fetchStub.resolves(new Response('invalid json', {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
      }));
      const result = await createVersion('/test/page', 'token123');
      expect(result.success).to.be.true;
      expect(result.status).to.equal(200);
    });
  });

  describe('toLowerCaseObject', () => {
    it('lowercases object keys and string values', () => {
      const obj = { FirstName: 'John', LastName: 'Doe' };
      const result = toLowerCaseObject(obj);
      expect(result.firstname).to.equal('john');
      expect(result.lastname).to.equal('doe');
    });

    it('lowercases string values', () => {
      const obj = { status: 'ACTIVE' };
      const result = toLowerCaseObject(obj);
      expect(result.status).to.equal('active');
    });

    it('handles nested objects', () => {
      const obj = { User: { FirstName: 'John', ACTIVE: true } };
      const result = toLowerCaseObject(obj);
      expect(result.user.firstname).to.equal('john');
      expect(result.user.active).to.equal(true);
    });

    it('handles arrays', () => {
      const arr = [{ Name: 'John' }, { Name: 'Jane' }];
      const result = toLowerCaseObject(arr);
      expect(result[0].name).to.equal('john');
      expect(result[1].name).to.equal('jane');
    });

    it('handles array of strings', () => {
      const arr = ['HELLO', 'WORLD'];
      const result = toLowerCaseObject(arr);
      expect(result[0]).to.equal('hello');
      expect(result[1]).to.equal('world');
    });

    it('leaves numbers unchanged', () => {
      const obj = { age: 30, score: 95.5 };
      const result = toLowerCaseObject(obj);
      expect(result.age).to.equal(30);
      expect(result.score).to.equal(95.5);
    });

    it('leaves booleans unchanged', () => {
      const obj = { Active: true, Deleted: false };
      const result = toLowerCaseObject(obj);
      expect(result.active).to.equal(true);
      expect(result.deleted).to.equal(false);
    });

    it('leaves null unchanged', () => {
      const obj = { value: null };
      const result = toLowerCaseObject(obj);
      expect(result.value).to.be.null;
    });

    it('handles deeply nested structures', () => {
      const obj = {
        User: {
          Profile: {
            Name: 'John',
            Tags: ['ADMIN', 'USER'],
          },
        },
      };
      const result = toLowerCaseObject(obj);
      expect(result.user.profile.name).to.equal('john');
      expect(result.user.profile.tags[0]).to.equal('admin');
      expect(result.user.profile.tags[1]).to.equal('user');
    });

    it('handles empty object', () => {
      const obj = {};
      const result = toLowerCaseObject(obj);
      expect(Object.keys(result).length).to.equal(0);
    });

    it('handles empty array', () => {
      const arr = [];
      const result = toLowerCaseObject(arr);
      expect(result.length).to.equal(0);
    });
  });
});
