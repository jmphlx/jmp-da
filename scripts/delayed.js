// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';
import { createTag } from './helper.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkConsentCookie() {
  console.log('add my own listener');
  let consentStatus = 3;
  const functionalCookieRegex = /permit(.*)2(.*)/;
  const consentCookie = getCookie('cmapi_cookie_privacy');
  if (consentCookie && consentCookie.match(functionalCookieRegex)) {
    console.log('allow functional cookies');
    consentStatus = 1;
  }

  const scriptTag = document.createElement('script');
  scriptTag.innerHTML(`window.VWO = window.VWO || []; window.VWO.init = window.VWO.init || function(state) { window.VWO.consentState = state; } window.VWO.init(${consentStatus});`);
  document.head.append(scriptTag);
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

checkConsentCookie();
const gtmActive = !window.location.hostname.includes('localhost')
  && !document.location.hostname.includes('.hlx.page')
  && !document.location.hostname.includes('.aem.page');

if (gtmActive) {
  loadGTM();
}
