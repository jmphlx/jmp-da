/*
 * Hubspot embed Block
 * Shows hubspot forms on a page
 */
/*  global hbspt  */

const embedHubspot = (fRegion, fPortalId, fFormId, sfdcCampaignId = null) => {
  // clean up hubspot url query paramaters

  const scriptHubspot = document.createElement('script');
  scriptHubspot.setAttribute('type', 'text/javascript');
  scriptHubspot.src = 'https://js.hsforms.net/forms/embed/v2.js';

  if (sfdcCampaignId) {
    // check if form has a salesforce campaign id
    const fsfdcCampaignIdVal = sfdcCampaignId.textContent;
    scriptHubspot.addEventListener('load', () => {
      hbspt.forms.create({
        region: fRegion,
        portalId: fPortalId,
        formId: fFormId,
        sfdcCampaignIdVal: fsfdcCampaignIdVal,
      });
    });
  } else {
    // function to call if it doesn't
    scriptHubspot.addEventListener('load', () => {
      hbspt.forms.create({
        region: fRegion,
        portalId: fPortalId,
        formId: fFormId,
      });
    });
  }
  document.head.append(scriptHubspot);

  const embedHTML = `
  <script>
    hbspt.forms.create({});
  </script>
`;
  return embedHTML;
};

const loadEmbed = (block, region, portalId, formID) => {
  if (block.classList.contains('form-is-loaded')) {
    return;
  }

  block.innerHTML = embedHubspot(region, portalId, formID);
  block.classList = 'block embed embed-hubspot';

  block.classList.add('form-is-loaded');
};

export default function decorate(block) {
  const [region, portalId, formID, sfdcCampaignId] = [...block.children].map(
    (c) => c.firstElementChild,
  ); // mapping variables

  const regionVal = region.textContent; // extracting text content
  const portalIdVal = portalId.textContent;
  const formIDVal = formID.textContent;

  block.textContent = '';

  const observer = new IntersectionObserver((entries) => {
    // calling embed function
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadEmbed(block, regionVal, portalIdVal, formIDVal, sfdcCampaignId);
    }
  });
  observer.observe(block);
}
