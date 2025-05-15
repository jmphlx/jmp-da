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

  if (consentStatus === 1) {
    const vwoLink = createTag('link', {
      rel: 'preconnect',
      href: 'https://dev.visualwebsiteoptimizer.com',
    });
    const vwoTracking = createTag('script', {
      type: 'text/javascript',
      id: 'vwoCode',
    });
    vwoTracking.innerText = 'window._vwo_code || (function() {'
    + 'var account_id=486089,'
    + 'version=2.1,'
    + 'settings_tolerance=2000,'
    + 'hide_element="body",'
    + '/* DO NOT EDIT BELOW THIS LINE */'
    + 'f=false,w=window,d=document,v=d.querySelector("#vwoCode"),cK="_vwo_"+account_id+"_settings",cc={};try{var c=JSON.parse(localStorage.getItem("_vwo_"+account_id+"_config"));cc=c&&typeof c==="object"?c:{}}catch(e){}var stT=cc.stT==="session"?w.sessionStorage:w.localStorage;'
    + 'code={nonce:v&&v.nonce,use_existing_jquery:function(){return typeof use_existing_jquery!=="undefined"?use_existing_jquery:undefined},library_tolerance:function(){return typeof library_tolerance!=="undefined"?library_tolerance:undefined},settings_tolerance:function(){return cc.sT||settings_tolerance},hide_element_style:function(){return"{"+(cc.hES||hide_element_style)+"}"},hide_element:function(){if(performance.getEntriesByName("first-contentful-paint")[0]){return""}return typeof cc.hE==="string"?cc.hE:hide_element},getVersion:function(){return version},finish:function(e){if(!f){f=true;var t=d.getElementById("_vis_opt_path_hides");if(t)t.parentNode.removeChild(t);if(e)(new Image).src="https://dev.visualwebsiteoptimizer.com/ee.gif?a="+account_id+e}},'
    + 'finished:function(){return f},addScript:function(e){var t=d.createElement("script");t.type="text/javascript";if(e.src){t.src=e.src}else{t.text=e.text}v&&t.setAttribute("nonce",v.nonce);d.getElementsByTagName("head")[0].appendChild(t)},load:function(e,t){var n=this.getSettings(),i=d.createElement("script"),r=this;t=t||{};if(n){i.textContent=n;d.getElementsByTagName("head")[0].appendChild(i);if(!w.VWO||VWO.caE){stT.removeItem(cK);r.load(e)}}else{var o=new XMLHttpRequest;o.open("GET",e,true);o.withCredentials=!t.dSC;o.responseType=t.responseType||"text";o.onload=function(){if(t.onloadCb){return t.onloadCb(o,e)}if(o.status===200||o.status===304){_vwo_code.addScript({text:o.responseText})}else{_vwo_code.finish("&e=loading_failure:"+e)}};o.onerror=function(){if(t.onerrorCb){return t.onerrorCb(e)}_vwo_code.finish("&e=loading_failure:"+e)};o.send()}},'
    + 'getSettings:function(){try{var e=stT.getItem(cK);if(!e){return}e=JSON.parse(e);if(Date.now()>e.e){stT.removeItem(cK);return}return e.s}catch(e){return}},init:function(){if(d.URL.indexOf("__vwo_disable__")>-1)return;var e=this.settings_tolerance();w._vwo_settings_timer=setTimeout(function(){_vwo_code.finish();stT.removeItem(cK)},e);var t;if(this.hide_element()!=="body"){t=d.createElement("style");var n=this.hide_element(),i=n?n+this.hide_element_style():"",r=d.getElementsByTagName("head")[0];t.setAttribute("id","_vis_opt_path_hides");v&&t.setAttribute("nonce",v.nonce);t.setAttribute("type","text/css");if(t.styleSheet)t.styleSheet.cssText=i;else t.appendChild(d.createTextNode(i));r.appendChild(t)}else{t=d.getElementsByTagName("head")[0];var i=d.createElement("div");i.style.cssText="z-index: 2147483647 !important;position: fixed !important;left: 0 !important;top: 0 !important;width: 100% !important;height: 100% !important;background: white !important;display: block !important;";i.setAttribute("id","_vis_opt_path_hides");i.classList.add("_vis_hide_layer");t.parentNode.insertBefore(i,t.nextSibling)}var o=window._vis_opt_url||d.URL,s="https://dev.visualwebsiteoptimizer.com/j.php?a="+account_id+"&u="+encodeURIComponent(o)+"&vn="+version;if(w.location.search.indexOf("_vwo_xhr")!==-1){this.addScript({src:s})}else{this.load(s+"&x=true")}}};'
    + 'w._vwo_code=code;code.init();})();';
  
    document.head.appendChild(vwoLink);
    document.head.appendChild(vwoTracking);
    const scriptTag = document.createElement('script');
    scriptTag.innerHTML = `window.VWO = window.VWO || [];
      window.VWO.init = window.VWO.init || function(state) { window.VWO.consentState = state; }
      window.VWO.init(${consentStatus});`;
    document.head.appendChild(scriptTag);
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
}

const vwoTracking = getMetadata('vwotracking');
const enableRegexPattern = /enable(d)*/g;
if (vwoTracking && vwoTracking.match(enableRegexPattern)) {
  addVWOTracking();

}
checkConsentCookie();