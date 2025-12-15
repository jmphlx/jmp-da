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
  aemUrl: 'https://admin.hlx.page/status',
  mainUrl: 'https://main--jmp-da--jmphlx.aem.live',
  previewUrl: 'https://main--jmp-da--jmphlx.aem.page',
  org: 'jmphlx',
  repo: 'jmp-da',
};

export function replaceHtml(text) {
  let inner = text;
  const fromOrigin = `${DA_CONSTANTS.mainUrl}`;
  inner = text
    .replaceAll('./media', `${fromOrigin}/media`);

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

/**
 * Requests to https://admin.hlx.page/ urls need to be limited to at most
 * 10 requests per second.
 */
export function createRateLimiter(limit, interval) {
  const queue = [];
  const timestamps = [];

  function processQueue() {
    if (queue.length === 0) return;

    const now = Date.now();

    // Remove old timestamps outside the window
    while (timestamps.length > 0 && now - timestamps[0] >= interval) {
      timestamps.shift();
    }

    if (timestamps.length < limit) {
      // We can run immediately
      const { fn, resolve, reject } = queue.shift();
      timestamps.push(now);
      fn().then(resolve).catch(reject).finally(() => {
        processQueue(); // process next right after this one finishes
      });
    } else {
      // Need to wait until earliest timestamp falls out of the window
      const wait = interval - (now - timestamps[0]);
      setTimeout(processQueue, wait);
    }
  }

  return function schedule(fn) {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      processQueue();
    });
  };
}

export async function getPageStatus(path, token) {
  const cleanPath = `${DA_CONSTANTS.org}/${DA_CONSTANTS.repo}/main/${path}`;
  const url = `${DA_CONSTANTS.aemUrl}/${cleanPath}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const result = await response.json();
      return {
        live: result.live.status,
        preview: result.preview.status,
        lastPublished: result.live.lastModified,
      };
    }
    return {
      live: 500,
      preview: 500,
    };
  } catch (e) {
    return {
      live: 500,
      preview: 500,
    };
  }
}

export function getPublishStatus(statusObj) {
  const liveStatus = statusObj.live;
  const previewStatus = statusObj.preview;

  if (liveStatus >= 200 && liveStatus < 300) {
    // Page is published.
    return 'published';
  }
  if (previewStatus >= 200 && previewStatus < 300) {
    // Page is not published but has been previewed.
    return 'previewed';
  }
  if (liveStatus >= 400 && liveStatus < 500
      && previewStatus >= 400 && previewStatus < 500) {
    // Page is not previewed or published by returning valid 404s.
    return 'unpublished';
  }
  // To catch unexpected errors in obtaining the status.
  return 'error';
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

export function toLowerCaseObject(obj) {
  if (Array.isArray(obj)) {
    // If it's an array, map over it
    return obj.map(toLowerCaseObject);
  }
  if (obj !== null && typeof obj === 'object') {
    // If it's an object, transform keys and recurse values
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.toLowerCase(),
        toLowerCaseObject(value),
      ]),
    );
  }
  if (typeof obj === 'string') {
    // Lowercase strings
    return obj.toLowerCase();
  }
  // Return other types unchanged
  return obj;
}
