// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
/* preflight.js — standalone, no da-live dependencies */
import { LitElement, html, nothing } from 'https://esm.sh/lit@3.2.1';

/* ------------------------------------------------------------------ *
 * Styles (merged from preflight.css + label.css, S2 vars replaced)
 * ------------------------------------------------------------------ */
const CSS = `
  :host {
    --inline-spacing: 24px;
    display: block;
    width: 600px;
    height: 400px;
    padding: 0 0 24px;
    overflow-y: auto;
    font-family: system-ui, sans-serif;
  }
  p { margin: 0; line-height: 1.3; }
  button { background: transparent; font-family: inherit; border: none; padding: 0; cursor: pointer; }
  ul { margin: 0; padding: 0; list-style: none; }

  .category { position: relative; margin: -1px 0; }
  .category-header {
    position: relative; display: flex; justify-content: space-between;
    padding: 0 var(--inline-spacing); border-top: 1px solid #d1d1d1; border-bottom: 1px solid #d1d1d1;
  }
  .category-header:hover { color: #167af3; background: #e4f0ff; }
  .category-title { display: block; flex: 0 1 100%; min-height: 48px; text-align: start; font-weight: 700; font-size: 16px; }
  .category-labels { display: flex; align-items: center; gap: 8px; }
  .category-details { display: none; padding-bottom: 12px; margin: 12px 12px 0; }
  .category.is-open .category-details { display: block; }
  .category.is-open .category-header { background: #f5f5f5; }
  .check-label { font-weight: 700; font-size: 12px; text-transform: uppercase; margin: 16px 12px 6px; }

  .result-item {
    display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center;
    min-height: 44px; border-radius: 12px; padding: 6px 12px; font-size: 14px;
  }
  .result-item:hover { background: #ececec; }
  .result-item div { overflow-wrap: anywhere; }

  .badge {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 40px; height: 24px; padding: 0 8px; border-radius: 8px;
    font-size: 12px; font-weight: 700;
  }
  .badge-success { background: #c9f0d0; color: #0a5c22; }
  .badge-info    { background: #d6e7ff; color: #0a4c9e; }
  .badge-warn    { background: #ffe1c2; color: #8f4700; }
  .badge-error   { background: #ffd6d6; color: #93000a; }
`;
const sheet = new CSSStyleSheet();
sheet.replace(CSS);

/* ------------------------------------------------------------------ *
 * Reasons — add entries for your custom checks here
 * ------------------------------------------------------------------ */
const REASONS = {
  'h1.info': { badge: 'info', reason: 'Found exactly one H1 heading.' },
  'h1.warn': { badge: 'warn', reason: 'Found more than one H1 heading.' },
  'h1.error': { badge: 'error', reason: 'No H1 elements found.' },
  'lorem.info': { badge: 'info', reason: 'This document appears to be free of lorem ipsum.' },
  'lorem.error': { badge: 'error', reason: 'This document appears to have lorem ipsum.' },
  'title.info.meta': { badge: 'info', reason: 'Title found in metadata.' },
  'title.info.h1': { badge: 'info', reason: 'Document using H1 as title.' },
  'title.error': { badge: 'error', reason: 'No title found in metadata or H1 fallback.' },
  'description.info.meta': { badge: 'info', reason: 'Description found in metadata.' },
  'description.info.para': { badge: 'info', reason: 'Description found as first paragraph.' },
  'description.warn': { badge: 'warn', reason: 'Description not found in metadata or first paragraph.' },
  'alt.info': { badge: 'info', reason: 'All images have alt text.' },
};

/* ------------------------------------------------------------------ *
 * Checks — each receives { details, doc } and resolves to
 * an array of { badge, reason } objects.
 * ------------------------------------------------------------------ */
const getMetadata = (el) => {
  if (!el) return {};
  return [...el.childNodes].reduce((rdx, row) => {
    if (row.children) {
      const key = row.children[0].textContent.trim().toLowerCase();
      const content = row.children[1];
      if (key && content) rdx[key] = { content, text: content.textContent.trim().toLowerCase() };
    }
    return rdx;
  }, {});
};

const h1Check = async ({ doc }) => {
  const h1s = doc.querySelectorAll('h1');
  if (h1s.length === 1) return [REASONS['h1.info']];
  if (h1s.length > 1) return [REASONS['h1.warn']];
  return [REASONS['h1.error']];
};

const loremCheck = async ({ doc }) => {
  const hasLorem = doc.documentElement.innerHTML.toLowerCase().includes('lorem');
  return [hasLorem ? REASONS['lorem.error'] : REASONS['lorem.info']];
};

const titleCheck = async ({ doc }) => {
  const { title } = getMetadata(doc.querySelector('.metadata'));
  const h1 = doc.querySelector('h1');
  if (!(title || h1)) return [REASONS['title.error']];
  return [title ? REASONS['title.info.meta'] : REASONS['title.info.h1']];
};

const descCheck = async ({ doc }) => {
  const { description } = getMetadata(doc.querySelector('.metadata'));
  const para = doc.querySelector('p');
  if (!(description || para)) return [REASONS['description.warn']];
  return [description ? REASONS['description.info.meta'] : REASONS['description.info.para']];
};

/* Simplified replacement for pf-link: HEAD-check each link, one row per link.
   Note: external (non-AEM) links usually block cross-origin requests, so they
   report as unverifiable rather than broken. */
async function checkOneLink(url, external) {
  try {
    const resp = await fetch(`${url.href}?nocache=${Date.now()}`, { method: 'HEAD', redirect: 'manual' });
    const status = resp.status || 301;
    if (resp.status === 0) return { badge: 'warn', reason: `Redirected: ${url.pathname} (${status})` };
    if (resp.ok) return { badge: 'success', reason: `OK: ${url.pathname} (${status})` };
    return { badge: 'error', reason: `Broken: ${url.pathname} (${status})` };
  } catch {
    if (external) return { badge: 'warn', reason: `Could not verify external link: ${url.href} (CORS)` };
    return { badge: 'error', reason: `Could not validate: ${url.href}` };
  }
}

async function linkCheck({ details, doc }, selector = 'a:not([href*="/fragments/"])') {
  const { org, site } = details;
  const aemOrigin = `https://main--${site}--${org}.aem.live`;
  const links = [...doc.querySelectorAll(selector)];
  if (!links.length) return [{ badge: 'info', reason: 'No links found.' }];

  const results = links.map((link) => {
    const supplied = link.getAttribute('href') ?? '';
    let url;
    try {
      url = supplied.startsWith('/') ? new URL(`${aemOrigin}${supplied}`) : new URL(supplied);
    } catch {
      return { badge: 'error', reason: `Invalid href: ${supplied}` };
    }
    if (url.hostname.includes('.aem.')) url = new URL(`${aemOrigin}${url.pathname}`);
    const external = !url.href.startsWith(aemOrigin);
    return checkOneLink(url, external);
  });
  return Promise.all(results);
}

const fragmentCheck = ({ details, doc }) => linkCheck({ details, doc }, 'a[href*="/fragments/"]');

/* >>> YOUR CUSTOM CHECK — swap this body for your own logic <<< */
const altTextCheck = async ({ doc }) => {
  const missing = [...doc.querySelectorAll('img')].filter((img) => !img.getAttribute('alt')?.trim());
  if (!missing.length) return [REASONS['alt.info']];
  return missing.map((img) => ({
    badge: 'warn',
    reason: `Missing alt: ${img.getAttribute('src')?.split('?')[0] ?? 'unknown image'}`,
  }));
};

/* ------------------------------------------------------------------ *
 * Registry
 * ------------------------------------------------------------------ */
const CATEGORIES = {
  References: [
    { title: 'Links', fn: linkCheck },
    { title: 'Fragments', fn: fragmentCheck },
  ],
  Content: [
    { title: 'H1 count', fn: h1Check },
    { title: 'Lorem ipsum', fn: loremCheck },
  ],
  SEO: [
    { title: 'Title', fn: titleCheck },
    { title: 'Description', fn: descCheck },
    { title: 'Image alt text', fn: altTextCheck },
  ],
};

function loadResults(details, doc, requestUpdate) {
  return Object.entries(CATEGORIES).map(([title, categoryChecks]) => {
    const checks = categoryChecks.map((check) => {
      const entry = { title: check.title, results: [] };
      check.fn({ details, doc }).then((results) => {
        if (results) entry.results = results;
        requestUpdate();
      });
      return entry;
    });
    return { title, checks };
  });
}

/* Fetch document source directly from the DA Admin API.
   details: { org, site, path, token? } — path like '/en/my-page'.
   Or pass details.sourceUrl to fetch any HTML endpoint directly. */
async function loadDoc(details) {
  const { org, site, path, token, sourceUrl } = details;
  const url = sourceUrl ?? `https://admin.da.live/source/${org}/${site}${path}.html`;
  const opts = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const resp = await fetch(url, opts);
  if (!resp.ok) return { error: `Could not fetch document. Status: ${resp.status}` };
  const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
  return { doc };
}

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */
class DaPreflight extends LitElement {
  static properties = {
    details: { attribute: false },
    _categories: { state: true },
    _status: { state: true },
  };

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [sheet];
    this.loadResults();
  }

  async loadResults() {
    const { error, doc } = await loadDoc(this.details);
    if (error) { this._status = error; return; }
    this._categories = loadResults(this.details, doc, this.requestUpdate.bind(this));
  }

  expandCategory(cat) {
    cat.open = !cat.open;
    this.requestUpdate();
  }

  renderBadge(badge, text) {
    return html`<span class="badge badge-${badge}">${text ?? badge}</span>`;
  }

  renderLabels(checks, expand) {
    const items = checks.flatMap((check) => check.results ?? []);
    const groups = Object.groupBy(items, (item) => item.badge);
    return Object.entries(groups).map(
      ([badge, group]) => html`<button @click=${expand}>${this.renderBadge(badge, group.length)}</button>`,
    );
  }

  renderChecks(checks) {
    const order = ['error', 'warn', 'info', 'success'];
    return html`
      <ul class="category-details">
        ${checks.map((check) => html`
          <li>
            <p class="check-label">${check.title}</p>
            <ul>
              ${check.results.toSorted((a, b) => order.indexOf(a.badge) - order.indexOf(b.badge))
                .map((result) => html`
                  <li class="result-item">
                    <div>${result.reason}</div>
                    ${this.renderBadge(result.badge)}
                  </li>`)}
            </ul>
          </li>`)}
      </ul>`;
  }

  renderCategory(category) {
    const { title, checks, open } = category;
    const expand = () => this.expandCategory(category);
    return html`
      <li class="category ${open ? 'is-open' : ''}">
        <div class="category-header">
          <button class="category-title" @click=${expand}>${title}</button>
          <div class="category-labels">${this.renderLabels(checks, expand)}</div>
        </div>
        ${this.renderChecks(checks)}
      </li>`;
  }

  render() {
    if (this._status) return html`<p>${this._status}</p>`;
    if (!this._categories) return nothing;
    return html`
      <div class="preflight-inner">
        <ul class="categories">
          ${this._categories.map((category) => this.renderCategory(category))}
        </ul>
      </div>`;
  }
}

customElements.define('da-preflight', DaPreflight);

async function mount() {
  const { context, token } = await DA_SDK;
  const path = context.path.startsWith('/') ? context.path : `/${context.path}`;

  const cmp = document.createElement('da-preflight');
  cmp.details = {
    org: context.org,
    site: context.repo,
    path,
    token,
  };
  // Mounts into <div id="preflight"></div> if present, otherwise appends to body
  (document.getElementById('preflight') ?? document.body).append(cmp);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}