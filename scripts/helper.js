/* eslint object-curly-newline: 0 */
/**
 * From Adobe blog: https://github.com/adobe/blog/
 * Create an element with ID, class, children, and attributes
 * @param {String} tag the tag nav of the element
 * @param {Object} attributes the attributes of the tag
 * @param {HTMLElement} html the content of the element
 * @returns {HTMLElement} the element created
 */
export function createTag(tag, attributes, html) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement) {
      el.append(html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      el.setAttribute(key, attributes[key]);
    });
  }
  return el;
}

export function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export const DA_CONSTANTS = {
  sourceUrl: 'https://admin.da.live/source',
  versionUrl: 'https://admin.da.live/versionsource',
  editUrl: 'https://da.live/edit#',
  mainUrl: 'https://main--jmp-da--jmphlx.aem.live',
  previewUrl: 'https://main--jmp-da--jmphlx.aem.page',
  org: 'jmphlx',
  repo: 'jmp-da',
};

export function replaceHtml(text) {
  let inner = text;
  const fromOrigin = `${DA_CONSTANTS.mainUrl}`;
  inner = text
    .replaceAll('./media', `${fromOrigin}/media`)
    .replaceAll('href="/', `href="${fromOrigin}/`);

  return `
    <body>
      <header></header>
      <main>${inner}</main>
      <footer></footer>
    </body>
  `;
}

export async function saveToDa(text, pathname, token) {
  const daPath = `/${DA_CONSTANTS.org}/${DA_CONSTANTS.repo}${pathname}`;
  const daHref = `${DA_CONSTANTS.editUrl}${daPath}`;

  const body = replaceHtml(text);

  const blob = new Blob([body], { type: 'text/html' });
  const formData = new FormData();
  formData.append('data', blob);
  const opts = {
    method: 'PUT',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const daResp = await fetch(`${DA_CONSTANTS.sourceUrl}${daPath}.html`, opts);
    return { daHref, daStatus: daResp.status, daResp, ok: daResp.ok };
  } catch {
    console.log(`Couldn't save ${pathname}`);
    return null;
  }
}

export async function createVersion(path, token, description = 'Search & Replace Version') {
  const cleanPath = `${DA_CONSTANTS.org}/${DA_CONSTANTS.repo}${path}`;
  const url = `${DA_CONSTANTS.versionUrl}/${cleanPath}.html`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        label: description,
      }),
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const result = await response.json();
          return result;
        } catch (jsonError) {
          return { success: true, status: response.status };
        }
      } else {
        return { success: true, status: response.status };
      }
    } else {
      const errorText = await response.text();
      return { success: false, status: response.status, error: errorText };
    }
  } catch (e) {
    return { success: false, status: null, error: e.getMessage() };
  }
}
