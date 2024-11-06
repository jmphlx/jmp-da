/* eslint-disable no-underscore-dangle */
import { LitElement, html, nothing } from 'https://da.live/nx/deps/lit/lit-core.min.js';
import getStyle from 'https://da.live/nx/utils/styles.js';

import DA_SDK from 'https://da.live/nx/utils/sdk.js';

const { actions } = await DA_SDK;

const ROOT_TAG_PATH = '/content/cq:tags';
const TAG_EXT = '.1.json';

const style = await getStyle(import.meta.url);

class DaTagBrowser extends LitElement {
  static properties = {
    aemRepo: { attribute: false },
    token: { attribute: false },
    _tags: { state: true },
  };

  constructor() {
    super();
    this._tags = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [style];
    if (this.aemRepo && this.token) this.getTags(`https://${this.aemRepo}${ROOT_TAG_PATH}${TAG_EXT}`);
  }

  async getTags(path) {
    this.caasPath = path.split('cq:tags').pop().replace('.1.json', '').slice(1);
    if (this.caasPath) console.log(this.caasPath);
    const opts = { headers: { Authorization: `Bearer ${this.token}` } };
    const resp = await fetch(path, opts);
    if (!resp.ok) return;
    const json = await resp.json();
    const tags = Object.keys(json).reduce((acc, key) => {
      if (json[key]['jcr:primaryType'] === 'cq:Tag') {
        acc.push({
          path: `${path.replace(TAG_EXT, '')}/${key}${TAG_EXT}`,
          name: key,
          title: json[key]['jcr:title'] || key,
          details: json[key],
        });
      }
      return acc;
    }, []);
    this._tags = [...this._tags, tags];
    setTimeout(() => {
      window.scrollTo(document.body.scrollWidth, 0);
    }, 100);
  }

  handleTagClick(tag, idx) {
    this._tags = this._tags.toSpliced(idx + 1);
    this.getTags(tag.path);
  }

  handleTagInsert(e, title) {
    actions.sendText(`${this.caasPath}/${title}`);
    actions.closeLibrary();
  }

  renderTagGroup(group, idx) {
    return html`
      <ul class="da-tag-group-list">
        ${group.map((tag) => html`
          <li class="da-tag-group">
            <span @click=${() => this.handleTagClick(tag, idx)}>${tag.title}</span>
            <button @click=${(e) => { this.handleTagInsert(e, tag.title); }}>→</button>
          </li>
        `)}
      </ul>
    `;
  }

  render() {
    if (this._tags.length === 0) return nothing;
    return html`
      <ul class="da-tag-groups">
        ${this._tags.map((group, idx) => html`
          <li class="da-tag-group-column">
            ${this.renderTagGroup(group, idx)}
          </li>
        `)}
      </ul>
    `;
  }
}

customElements.define('da-tag-browser', DaTagBrowser);