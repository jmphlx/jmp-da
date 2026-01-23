import {
  getLanguage,
  isLanguageSupported,
} from './jmp.js';

const localizedCheckCache = new Map();

function stripLeadingFragment(pathname) {
  // Only strip the first segment if it is a known language directory.
  // "/en/home" -> "/home"
  // "/zh-hans/foo" -> "/foo"
  // "/modals/foo" -> "/modals/foo" (unchanged)
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && isLanguageSupported(parts[0])) {
    parts.shift();
  }
  return `/${parts.join('/')}`; // if empty -> "/"
}

function stripDntParam(url) {
  if (url.searchParams.get('dnt') === 'true') {
    url.searchParams.delete('dnt');
    return true; // indicates it was present
  }
  return false;
}

function buildTargetPathname(pathname, currLang) {
  const parts = pathname.split('/').filter(Boolean);

  // Special case: /modals/:lang  (or /modals/:lang/...)
  if (parts[0] === 'modals' && parts[1] && isLanguageSupported(parts[1])) {
    parts[1] = currLang;
    return `/${parts.join('/')}`;
  }

  // General case: remove existing leading language (if present)
  const basePath = stripLeadingFragment(pathname); // "/home" etc.

  // Prefix current language
  return basePath === '/' ? `/${currLang}` : `/${currLang}${basePath}`;
}

function isAllowedHost(host) {
  return (
    host === 'localhost:3000'
    || host === 'www.jmp.com'
    || /--jmp-da--jmphlx\.aem\.(page|live)$/.test(host)
  );
}

function shouldUrlBeLocalized(url) {
  if (!isAllowedHost(url.host)) return false;

  const lang = getLanguage();

  // Skip already-localized "normal" pages
  if (url.pathname === `/${lang}` || url.pathname.startsWith(`/${lang}/`)) return false;

  // Skip already-localized modal paths
  if (url.pathname === `/modals/${lang}` || url.pathname.startsWith(`/modals/${lang}/`)) return false;

  return true;
}

async function getLocalizedLink(urlObj) {
  const lang = getLanguage();
  const targetPathname = buildTargetPathname(urlObj.pathname, lang);
  const cacheKey = `${urlObj.host}|${lang}|${targetPathname}`;

  if (localizedCheckCache.has(cacheKey)) {
    return localizedCheckCache.get(cacheKey);
  }

  const promise = (async () => {
    const localized = new URL(urlObj.href);
    localized.pathname = targetPathname;

    try {
      const res = await fetch(localized.href, { redirect: 'manual' });
      if (!res.ok) return null;
      return localized.pathname; // assign to url.pathname
    } catch {
      return null;
    }
  })();

  localizedCheckCache.set(cacheKey, promise);
  return promise;
}

async function localizeLinks(doc) {
  const links = [...doc.querySelectorAll('a')];

  await Promise.all(
    links.map(async (link) => {
      const url = new URL(link.href);
      if (url.searchParams.get('dnt') === 'true') {
        stripDntParam(url);
        link.href = url.toString();
        return;
      }

      if (link.closest('.fragment')) {
        console.log('in a fragment');
        return;
      }

      if (!shouldUrlBeLocalized(url)) return;

      const localizedPath = await getLocalizedLink(url);
      if (!localizedPath) return;

      url.pathname = localizedPath;
      link.href = url.toString();
    }),
  );
}

function clearLocalizationCache() {
  localizedCheckCache.clear();
}

export {
  clearLocalizationCache,
  localizeLinks,
  getLocalizedLink,
  shouldUrlBeLocalized,
  buildTargetPathname,
  stripDntParam,
  stripLeadingFragment,
};
