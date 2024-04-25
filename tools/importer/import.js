/* eslint-disable */
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

  // find the <meta property="og:type"> element
  const type = document.querySelector('[property="og:type"]');
  if (type) meta.Type = type.content;
  
  // find the <meta property="og:url"> element
  const url = document.querySelector('[property="og:url"]');
  if (url) meta.Url = url.content;

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

const createHero = (main, document, fired) => {
  const doc = {};
 
  const heroRootCss = '';
  //create heroText
  var heroCss = 'div.container.transom.branding-jmp div.par.parsys div.text.parbase.section div';
  const heroText = document.querySelector(heroCss).innerHTML.replace(/[\n\t]/gm, '');
  //create heroContents
  if (heroText) {
      doc.heroContents = heroText + '\n';
  }

  //get any subtext since the hero css isn't just for a text based hero image.
  var heroTextCss = 'div.container.transom.branding-jmp.feathered-overlay div.par.parsys div.parsys_column.cq-colctrl-lt2 div.parsys_column.cq-colctrl-lt2-c0 div.text.parbase.section div p span.text-large';
  const heroSubText = document.querySelector(heroTextCss).innerHTML.replace(/[\n\t]/gm, '');
  if (heroSubText){
    doc.heroContents += '\n' + heroSubText; 
  }

  //parse any buttons that may be there.
  var heroBtnCss = 'div.container.transom.branding-jmp.feathered-overlay div.par.parsys div.parsys_column.cq-colctrl-lt2 div.parsys_column.cq-colctrl-lt2-c0 div.text.parbase.section div.dark-button ul.list-none li span.button';
  const heroBtns = document.querySelectorAll(heroBtnCss);
  if (heroBtns){
      doc.heroContents += '\n';
      heroBtns.forEach((btn) => {
        doc.heroContents += '<a href="' + btn.href + '">' + btn.innerHTML + '</a>';
      });
  }

  const cells = [
    ['Hero'],
    [doc.heroContents],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  main.append(table);
  // add our top level css to the fired array for element removal later
  fired.push('div.container.transom.branding-jmp.feathered-overlay');
};

//get any full width 'hero' with only text likes
const createTextHero = (main, document, fired) => {
  const doc = {};
  console.log('inside text hero');
  const tHeroCss = 'div.styledcontainer.parbase div.container.segment.first div.par.parsys div.text.parbase.section div h2';
  const tHeros = document.querySelectorAll(tHeroCss);
  console.log('inside text hero');
  if (tHeros) {
    tHeros.forEach((el) => {
      doc.tHeroTxt = el;
      if (doc.tHeroTxt){
        console.log('heroTextExists');
        const cells = [
          ['Hero (textonly)'],
          [doc.tHeroTxt],
        ];
      
        const table = WebImporter.DOMUtils.createTable(cells, document);
        main.append(table);
        fired.push('div.styledcontainer.parbase div.container.segment.first div.par.parsys div.text.parbase.section div h2');
    }
    });
  }
};

const createCTABanner = (main, document) => {
  const doc = {};
  var ctaHeadings = [];
  
  //create CTABannerText
  var ctaBannerCss = 'div.container.transom.branding-jmp div.par.parsys div.text.parbase.section div h2';
  const ctaBannerTexts = document.querySelectorAll(ctaBannerCss);
  //for each CTA Banner we found on the site, generate a hero section with the appropriate buttons
  /*if (ctaBannerTexts){
    ctaBannerTexts.forEach((ctaHeading) => {
      ctaHeadings.push([ctaHeading.innerHTML]);
    });
  }*/

  //get the contents now
  var ctaContentsCss = 'div.container.transom.branding-jmp div.par.parsys div.text.parbase.section div.dark-button-center.narrow p span.text-large';
  const ctaContents = document.querySelectorAll(ctaContentsCss);
  /*if (ctaContents) {
    ctaContents.forEach((ctaContent) => {
      ctaHeadings.push(ctaContent.innerHTML);
    });
  }*/

  // get button links
  var ctaButCss = 'div.container.transom.branding-jmp div.par.parsys div.text.parbase.section div.dark-button-center.narrow ul.list-none li span.text-small strong span.button a';
  const ctaButtons = document.querySelectorAll(ctaButCss);
  /*if (ctaButtons) {
    ctaButtons.forEach((ctaButton) => {
      ctaButtons.push([ctaButtons.innerHTML, ctaButtons.href]);
    });
  }*/
  if (ctaBannerTexts && ctaContents && ctaButtons){
    console.log('inside cta test');
    ctaButtons.forEach((ctaButton) => {
      console.log('insideCTAButtons');
      /*ctaContents.forEach((ctaContent) => {
        console.log('insideCTAContents');
        ctaBannerTexts.forEach((ctaHeading) => {
          console.log('insideCTAHeading');
          doc.contents = ctaHeading + '\n' + ctaContent + '\n' + ctaButton;
          console.log(doc.contents);
          const cells = [
            ['Hero (cta)'],
            [doc.contents],
          ];
        
          const table = WebImporter.DOMUtils.createTable(cells, document);
          main.append(table);
          console.log(cells);
        });
      });**/
    });
  }
 /* const cells = [
    ['Hero'],
    [doc.heroContents],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  main.append(table);*/
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
  if (attribution && bqText){
    const cells = [
      ['Quote'],
      [doc.bqText],
      [doc.attribution],
    ];

    const table = WebImporter.DOMUtils.createTable(cells, document);
    main.append(table);
  }
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

  if (headerTxt && desc) {
    const cells = [
      ['Columns'],
      [ doc.txt, doc.img ],
      
    ];

    const table = WebImporter.DOMUtils.createTable(cells, document);
    main.append(table);
  }
};
// create cards
const createCards = (main, document) => {
  const doc = {};

  // get card image
  const imgCss = 'li.listItem.jmpappareas.jmpappareasdoe.jmpindustry.jmpindustryconservation.jmpappareasquality-reliability-six-sigma.jmpappareasdashboard-building.jmpappareasdataviz-eda.jmpcontent-type.jmpcontent-typecustomer-story.jmpproducts.jmpproductsjmp.jmpindustryenergy-and-utilities.jmptier.jmptierfeatured-resource-tier-1.jmpcapabilities.jmpcapabilitiesautomation-and-scripting a span.cmp-image.image img.cmp-image__image';
  const img = document.querySelector(imgCss);
  // const imgs = document.querySelectorAll('imgsCss');
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
  //doc.content = '<a href="' + doc.link + ' target="_self">' + doc.cnTitle + '\r\n' + doc.cTitle + '\n' + doc.cContent +'</a>\n'
  doc.content = doc.cnTitle + '\r\n' + doc.cTitle + '\n' + doc.cContent;
  if (img) {
    const cells = [
      ['Cards'],
      [doc.img, doc.content],
      
    ];

    const table = WebImporter.DOMUtils.createTable(cells, document);
    main.append(table);
  }
};

export default {
  transformDOM: ({ document }) => {
    const main = document.querySelector('main');
    /* We'll store the respective CSS classes in the fired array
    * and then pass those to the remove function of DOMUtils to 
    * remove elements we've already processed.
    */
    const fired = [];
    
    createHero(main, document, fired);
    createTextHero(main, document, fired);
    createColumns(main, document, fired);
    createQuote(main, document, fired);
    //createCTABanner(main, document, fired);
    createCards(main, document, fired);
    createMetadataBlock(main, document, fired);

    // final cleanup
    /*WebImporter.DOMUtils.remove(main, [
      '.disclaimer',
      
    ]);*/
    WebImporter.DOMUtils.remove(main, fired);

    return main;
  },
};
