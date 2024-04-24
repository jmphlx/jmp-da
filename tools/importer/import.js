const createMetadataBlock = (main, document) => {

  const meta = {};

  // find the <title> element
  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
  }

  // find the <meta property="og:description"> element
  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  // find the <meta property="og:image"> element
  const img = document.querySelector('[property="og:image"]');
  if (img) {
    // create an <img> element
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  // helper to create the metadata block
  const metaBlock = WebImporter.Blocks.getMetadataBlock(document, meta);
  // append the block to the main element
  main.append(metaBlock);

  // returning the meta object might be usefull to other rules
  return metaBlock;
};


const createHero = (main, document) => {
  const doc = {};
 
  // get hero image src
  const heroImg = 'div.container.transom.branding-jmp div.bg.bg-op-full.bg-pos-full img.cq-dd-image';
  const img = document.querySelector(heroImg);
  if (img) {
    const el = document.createElement('img');
    el.src = img.src;
    doc.img = WebImporter.DOMUtils.encodeImagesForTable(el);
  }
  //create heroText
  var heroCss = 'div.container.transom.branding-jmp div.par.parsys div.text.parbase.section div';
  const heroText = document.querySelector(heroCss).innerHTML.replace(/[\n\t]/gm, '');;
  //create heroContents
  if (heroText) {
      doc.heroContents = heroText + '\n';
  }
  const cells = [
    ['Hero'],
    [doc.heroContents],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  main.append(table);
};

const createCTABanner = (main, document) => {
  const doc = {};
 
  // get hero image src
  const heroImg = 'div.container.transom.branding-jmp div.bg.bg-op-full.bg-pos-full img.cq-dd-image';
  const img = document.querySelector(heroImg);
  if (img) {
    const el = document.createElement('img');
    el.src = img.src;
    doc.img = WebImporter.DOMUtils.encodeImagesForTable(el);
  }
  //create heroText
  var heroCss = 'div.container.transom.branding-jmp div.par.parsys div.text.parbase.section div';
  const heroText = document.querySelector(heroCss).innerHTML.replace(/[\n\t]/gm, '');;
  //create heroContents
  if (heroText) {
      doc.heroContents = heroText + '\n';
  }
  const cells = [
    ['Hero'],
    [doc.heroContents],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  main.append(table);
};
// createQuote
const createQuote = (main, document) => {
  const doc = {};

  // get quote text
  const bqTextCSS = '.narrow blockquote'
  const bqText = document.querySelector(bqTextCSS);
  if (bqText) {
    doc.bqText = bqText.innerHTML;
  }

  //create attribution
  const attribCSS = 'div.text.parbase.section div.narrow p';
  const attribution = document.querySelector(attribCSS);
  if (attribution) {
    doc.attribution = attribution.innerHTML;
  }

  const cells = [
    ['Quote'],
    [doc.bqText],
    [doc.attribution],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  main.append(table);
};

// createColumns
const createColumns = (main, document) => {
  const doc = {};
  // get quote text
  const headerCSS = 'div.styledcontainer.parbase div.container.segment.first div.par.parsys div.parsys_column.cq-colctrl-lt0 div.parsys_column.cq-colctrl-lt0-c0 h3';
  const headerTxt = document.querySelector(headerCSS);
  if (headerTxt) {
    doc.headerTxt = headerTxt.innerHTML;
  }

  //create desc
  const descCSS = 'div.styledcontainer.parbase div.container.segment.first div.par.parsys div.parsys_column.cq-colctrl-lt0 div.parsys_column.cq-colctrl-lt0-c0 div.text.parbase.section div ul';
  const desc = document.querySelector(descCSS);
  if (desc) {
    doc.desc = desc.innerHTML;
  }

  //grab the image placeholder for modal
  const imgCSS = 'div.styledcontainer.parbase div.container.segment.first div.par.parsys div.parsys_column.cq-colctrl-lt0 div.parsys_column.cq-colctrl-lt0-c1 div.lightbox.section div.video a.text-bottom div.image div span.cmp-image img.cmp-image__image';
  const img = document.querySelector(imgCSS);
  //combine the two
  if (img){
    doc.img = img;
  }
  doc.txt = doc.headerTxt + doc.desc;
  const cells = [
    ['Columns'],
    [ doc.txt, doc.img ],
    
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  main.append(table);
};
// create cards
const createCards = (main, document) => {
  const doc = {};

  // get card image
  const imgCss = 'li.listItem.jmpappareas.jmpappareasdoe.jmpindustry.jmpindustryconservation.jmpappareasquality-reliability-six-sigma.jmpappareasdashboard-building.jmpappareasdataviz-eda.jmpcontent-type.jmpcontent-typecustomer-story.jmpproducts.jmpproductsjmp.jmpindustryenergy-and-utilities.jmptier.jmptierfeatured-resource-tier-1.jmpcapabilities.jmpcapabilitiesautomation-and-scripting.childpageheliatek a span.cmp-image.image img.cmp-image__image';
  const img = document.querySelector(imgCss);
  if (img) {
    doc.img = img;    
  }

  //create card navTitle
  const cnTitleCss = 'li.listItem.jmpappareas.jmpappareasdoe.jmpindustry.jmpindustryconservation.jmpappareasquality-reliability-six-sigma.jmpappareasdashboard-building.jmpappareasdataviz-eda.jmpcontent-type.jmpcontent-typecustomer-story.jmpproducts.jmpproductsjmp.jmpindustryenergy-and-utilities.jmptier.jmptierfeatured-resource-tier-1.jmpcapabilities a span.navigation-title';
  const cnTitle = document.querySelector(cnTitleCss);
  if (cnTitle) {
    doc.cnTitle = cnTitle.innerHTML;
  }
  
  //create card title
  const cTitleCss = 'li.listItem.jmpappareas.jmpappareasdoe.jmpindustry.jmpindustryconservation.jmpappareasquality-reliability-six-sigma.jmpappareasdashboard-building.jmpappareasdataviz-eda.jmpcontent-type.jmpcontent-typecustomer-story.jmpproducts.jmpproductsjmp.jmpindustryenergy-and-utilities.jmptier.jmptierfeatured-resource-tier-1.jmpcapabilities a span.title';
  const cTitle = document.querySelector(cTitleCss);
  if (cTitle) {
    doc.cTitle = cTitle.innerHTML;
  }

  //create card content
  const cContnetCss = 'li.listItem.jmpappareas.jmpappareasdataviz-eda.jmpjmp-product-version.jmpjmp-product-versionjmp-16.jmpproducts.jmpproductsjmp.jmpcontent-type.jmpcontent-typearticle.jmpappareasstats-modeling-data-mining.jmptier.jmptierfeatured-resource-tier-1.jmpcapabilities.jmpcapabilitiesautomation-and-scripting a span.is-visible.abstract';
  const cContent = document.querySelector(cContnetCss);
  if (cContent) {
    doc.cContent = cContent.innerHTML;
  }

  //grab link 
  const linkCss = 'li.listItem.jmpappareas.jmpappareasdataviz-eda.jmpjmp-product-version.jmpjmp-product-versionjmp-16.jmpproducts.jmpproductsjmp.jmpcontent-type.jmpcontent-typearticle.jmpappareasstats-modeling-data-mining.jmptier.jmptierfeatured-resource-tier-1.jmpcapabilities a';
  const link = document.querySelector(linkCss);
  if (link){
    doc.link = link.href;
  }

  // combine it together into one object.
  doc.content = '<a href="' + doc.link + ' target="_self">' + doc.cnTitle + ' ' + doc.cTitle + '\n' + doc.cContent +'</a>\n'

  const cells = [
    ['Cards'],
    [doc.img, doc.content],
    
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  main.append(table);
};

export default {
  transformDOM: ({ document }) => {
    const main = document.querySelector('main');
    
    createHero(main, document);
    createColumns(main, document);
    createQuote(main, document);
    createCards(main, document);
    createMetadataBlock(main, document);

    // final cleanup
    WebImporter.DOMUtils.remove(main, [
      '.disclaimer',
    ]);

    return main;
  },
};