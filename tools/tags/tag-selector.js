import { LitElement, html, until } from 'https://da.live/deps/lit/lit-all.min.js';
import getSheet from 'https://da.live/blocks/shared/sheet.js';

const sheet = await getSheet('/tools/tags/tag-selector.css');

export default class DaTagSelector extends LitElement {
  static properties = {
    project: { type: String },
    token: { type: String },
    datasource: { type: String },
    iscategory: { type: Boolean },
    displayName: { type: String },
    parent: { type: Object },
  };

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }

  getTagURL() {
    return `https://admin.da.live/source/${this.project.org}/${this.project.repo}/${this.datasource}`;
  }

  tagClicked(e) {
    if (this.iscategory) {
      const tagtext = e.target.innerText;
      const sel = document.querySelector('da-tag-selector');
      if (sel) {
        const ts = document.createElement('da-tag-selector');
        ts.project = sel.project;
        ts.token = sel.token;
        ts.datasource = `tools/tagbrowser/${tagtext.toLowerCase()}.json`;
        ts.displayName = tagtext;
        ts.parent = sel;
        sel.parentNode.appendChild(ts);
        sel.parentNode.removeChild(sel);
      }
    } else {
      const { target: { form } } = e;
      if (form) {
        const values = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const item of form.elements) {
          if (item.checked) {
            values.push(item.value);
          }
        }
        const vl = values.join(', ');
        navigator.clipboard.writeText(vl).then(() => {
          const sd = document.querySelector('#copy-status');
          sd.style.opacity = '1';
        }, (err) => {
          // eslint-disable-next-line no-console
          console.error('Async: Could not copy text: ', err);
        });
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  upClicked() {
    const sel = document.querySelector('da-tag-selector');
    if (sel) {
      if (sel.parent) {
        const sd = document.querySelector('#copy-status');
        sd.style.opacity = '0';

        sel.parentNode.appendChild(sel.parent);
        sel.parentNode.removeChild(sel);
      }
    }
  }

  async fetchTags() {
    const url = this.getTagURL();

    const opts = {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };
    const resp = await fetch(url, opts);
    const tagData = await resp.json();

    const categories = new Map();
    tagData.data.forEach((el) => {
      const k = Object.keys(el)[0];
      const v = Object.values(el)[0];
      let vals = categories.get(k);
      if (!vals) {
        vals = [];
        categories.set(k, vals);
      }
      vals.push(v);
    });

    const tagLists = [];
    categories.forEach((v, k) => {
      this.iscategory = k.toLowerCase() === 'category';
      const uplink = this.iscategory
        ? html``
        : html`<span class="up" @click="${this.upClicked}">↑</span> `;

      const li = this.iscategory
        ? html`${v.map((tag) => html`<li @click="${this.tagClicked}">${tag}</li>`)}`
        : html`${v.map((tag) => html`<li><label><input type="checkbox" value="${tag}" @click="${this.tagClicked}">${tag}</label></li>`)}`;

      const el = html`<h2>${uplink}${this.displayName}</h2>
      <ul><form>
        ${li}
      </form></ul>`;
      tagLists.push(el);
    });
    return tagLists;
  }

  listTags() {
    return html`${until(this.fetchTags(), html`<p><em>Fetching tags...</em></p>`)}`;
  }

  render() {
    return html`
      ${this.listTags()}
    `;
  }
}

customElements.define('da-tag-selector', DaTagSelector);
