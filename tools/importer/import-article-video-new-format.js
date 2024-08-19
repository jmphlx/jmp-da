// customer stories import.js
/* eslint-disable */
const createMetadataBlock = (document) => {
  const meta = {};
  //find the <title> element
  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
  }
  //find the <meta property="og:description"> element
  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }
  //find the <meta property="og:type"> element
  const type = document.querySelector('[property="og:type"]');
  if (type) meta.Type = type.content;
  //find the <meta property="og:url"> element
  const url = document.querySelector('[property="og:url"]');
  if (url) meta.Url = url.content;
  //find the <meta property="og:image"> element
  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }
 

  const siteAreaMeta = document.querySelectorAll('[property="siteArea"]');
  if (siteAreaMeta) {
    meta.SiteArea = [];
    siteAreaMeta.forEach((el) => {
      if (el.content) meta.SiteArea.push(el.content);
    });
  }
  //console.log(meta.jmp);
  //find the <meta property="date"> element
  const date = document.querySelector('[property="date"]');
  if (date) meta.Date = date.content;
  //find the <meta property="date"> element
  const tCard = document.querySelector('[name="twitter:card"]');
  if (tCard) meta['twitter:card'] = tCard.content;
  //find the <meta property="date"> element
  const tSite = document.querySelector('[name="twitter:site"]');
  if (tCard) meta['twitter:site'] = tSite.content;
    
  //helper to create the metadata block
  const metaBlock = WebImporter.Blocks.getMetadataBlock(document, meta);
  //returning the meta object might be usefull to other rules
  return metaBlock;
};
const createFragment = (document) => {
  const cells = [
    ['fragment'],
  ]
  const anchor = document.createElement('a');
  anchor.href = 'https://main--jmp-da--jmphlx.hlx.live/fragments/en/resource-breadcrumb';
  console.log(anchor);
  cells.push([anchor]);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};

const createHero = (document) => {
  const doc = {};
  const cells = [
    ['columns (video-story-hero)'],
  ]
  //grab hero image
  const heroCss = '#content div#page-content.par div#par div.par.parsys div.styledcontainer.parbase div.container.article-template.article-title div.par.parsys div.parsys_column.cq-colctrl-lt0';
  const hero = document.querySelector(heroCss);
  if (hero){
    //grab right hand text 
    const rhText = hero.querySelector('div.parsys_column.cq-colctrl-lt0-c0 div.text.parbase.section div');
    const lhText = hero.querySelector('div.parsys_column.cq-colctrl-lt0-c1 div div');
    cells.push([rhText, lhText]);
  }
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};

//get any full width 'hero' with only text likes
const createDivider = (document) => {
  const cells = [
    ['divider'],
  ]
  return WebImporter.DOMUtils.createTable(cells, document);
};

const createLeftHandRail = (document) => {
  const lhRail = document.querySelector('div.parsys_column.cq-colctrl-lt1.cols-halfgutter div.parsys_column.cq-colctrl-lt1-c0 div.text.parbase.section div.article-template.sidebar.success-story');
  if (lhRail){
   // console.log(lhRail);
    return lhRail;
  }
  
  //if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};

const createRightHandRail = (document) => {
  const rhRail = document.querySelector('div.parsys_column.cq-colctrl-lt1.cols-halfgutter div.parsys_column.cq-colctrl-lt1-c1 div.text.parbase.section div');
  if (rhRail){
   //console.log(rhRail.innerHTML);
   return rhRail;
  }
};

const createButtonLink = (document) => {
  const button = document.querySelector(' div.parsys_column.cq-colctrl-lt1.cols-halfgutter div.parsys_column.cq-colctrl-lt1-c1 div.reference.parbase div.cq-dd-paragraph div.text.parbase div.trial-button p span.button');
  return button;
}

const createDisclaimer = (document) => {
  const cells = [
    ['columns (disclaimer)'],
  ]

  const disclaimer = document.querySelector('div.trial-button p small span.txt-light');
  if (disclaimer){
    cells.push([disclaimer.innerHTML]);
  }
  console.log('LOOK HERE DREW');
  console.log(cells);
  /* disclaimer = document.querySelector('');
  if (disclaimer) {
    //cells.push([]);
  }*/
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

const createSM = (document) => {
  const cells = [
    ['section-metadata'],
  ]

  cells.push(['layout','2 Column']);
  cells.push(['Style', 'success-story-body, columns-25-75']);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

export default {
  transformDOM: ({ document }) => {
    const main = document.querySelector('main');
    //create the container div/section
    const section = document.createElement('div');
    const sectionBreak = document.createElement('hr');

    const fragment = createFragment(document);
    if (fragment) section.append(fragment);

    section.append(sectionBreak);

    const vidHero = createHero(document);
    if (vidHero) section.append(vidHero);

    section.append(sectionBreak);

    const lhrail = createLeftHandRail( document,);
    if (lhrail) section.append(lhrail);

    const divider = createDivider(document);
    if (divider) section.append(divider);

    const rightHR = createRightHandRail(document);
    if (rightHR) section.append(rightHR);

    const button = createButtonLink(document);
    if (button) section.append(button);

    const disclaimer = createDisclaimer(document);
    if (disclaimer) section.append(disclaimer);

    const sectionMetadata = createSM(document);
    if(sectionMetadata) section.append(sectionMetadata);

    section.append(sectionBreak);
  
    const meta = createMetadataBlock(document);
    if (meta) section.append(meta);
    
    main.innerHTML = '';
    main.append(section);
    return main;
  },
};
