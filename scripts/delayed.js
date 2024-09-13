// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';
import { createTag } from './helper.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
// Add TrustArc for Cookie Management.
function addTrustArc() {
  const divConsentBlackBar = createTag('div', { id: 'consent_blackbar'});
  const divTEConsent = createTag('div', { id: 'teconsent'});
  const trustArcScript = createTag('script', { 
    async: 'async',
    type: 'text/javascript',
    crossorigin: '',
    src: '//consent.trustarc.com/notice?domain=jmp.com&c=teconsent&js=nj&noticeType=bb&gtm=1&text=true'
  });
  document.querySelector('footer').append(divConsentBlackBar, divTEConsent, trustArcScript);
}

addTrustArc();
