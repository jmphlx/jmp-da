// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';
import { createTag } from './helper.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

function addConsentChangeListener() {
  console.log('add my own listener');
  const functionalCookieRegex = /permit(.*)2(.*)/;
  if (!window.truste || !window.truste.util || typeof window.truste.util.readCookie !== 'function') {
    console.log('cant read cookie');
    return false;
  }
  var cmapi_cookie_privacy = window.truste.util.readCookie("cmapi_cookie_privacy") || '';
  if (cmapi_cookie_privacy && cmapi_cookie_privacy.matches(functionalCookieRegex)) {
    console.log('allow functional cookies');
  }
}

// google tag manager
function loadGTM() {
  const scriptTag = document.createElement('script');
  const gtmContainerID = 'GTM-NGNNXZW';
  scriptTag.innerHTML = `
  // googleTagManager
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${gtmContainerID}');
  `;
  document.head.prepend(scriptTag);

  const gtmIFrame = createTag('iframe', {
    src: `https://www.googletagmanager.com/ns.html?id=${gtmContainerID}`,
    height: '0',
    width: '0',
    style: 'display:none;visibility:hidden',
  });

  const noscriptTag = createTag('noscript');
  noscriptTag.append(gtmIFrame);
  document.body.prepend(noscriptTag);
}

const gtmActive = !window.location.hostname.includes('localhost')
  && !document.location.hostname.includes('.hlx.page')
  && !document.location.hostname.includes('.aem.page');

if (gtmActive) {
  loadGTM();
  addConsentChangeListener();
}
