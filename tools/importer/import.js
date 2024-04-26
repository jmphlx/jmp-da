/* eslint-disable no-console */

/* eslint-disable */
const createMetadataBlock = (main, document) => {

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


  //find the <meta property="date"> element
  const date = document.querySelector('[property="date"]');
  if (date) meta.Date = date.content;
  
  //helper to create the metadata block
  const metaBlock = WebImporter.Blocks.getMetadataBlock(document, meta);
  // append the block to the main element
  main.append(metaBlock);

  //returning the meta object might be usefull to other rules
  return metaBlock;
};

const createHero = (main, document, removeEls) => {
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
        //console.log(btn.innerHTML);
        doc.heroContents += btn.innerHTML;
      });
  }

  const cells = [
    ['Hero'],
    [doc.heroContents],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  main.append(table);
  // add our top level css to the fired array for element removal later
  removeEls.push('div.container.transom.branding-jmp.feathered-overlay');
};

//get any full width 'hero' with only text likes
const createTextHero = (main, document, removeEls) => {
  const doc = {};
  const tHeroCss = 'div.styledcontainer.parbase div.container.segment.first div.par.parsys div.text.parbase.section div h2';
  const tHeros = document.querySelectorAll(tHeroCss);
  if (tHeros) {
    tHeros.forEach((el) => {
      doc.tHeroTxt = el;
      if (doc.tHeroTxt){
        const cells = [
          ['Hero (textonly)'],
          [doc.tHeroTxt],
        ];
        const table = WebImporter.DOMUtils.createTable(cells, document);
        main.append(table);
    }
    });
    removeEls.push('div.styledcontainer.parbase div.container.segment.first div.par.parsys div.text.parbase.section div h2');
  }
};

const createCTABanner = (main, document, removeEls) => {
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
const createQuote = (main, document, removeEls) => {
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
    removeEls.push(bqTextCSS);
  }
};

// createColumns
const createColumns = (main, document, removeEls) => {
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
    //removeEls.push();
  }
};

//create 'billboard' columns, basically columns with a different CSS Class
const createbbColumns = (main, document, removeEls) => {
  const cells = [
    ['Columns (billboard)'],
 ];
  // get text
  const bbHeadCss = 'div.container.software.billboard.billboard-video.sub-hero div.par.parsys div.parsys_column.cq-colctrl-lt8';
  var bbHead = document.querySelectorAll(bbHeadCss);
  if (bbHead) { // we have some content, process each 
    //for some reason we end up with one undefined entry at the end.
    var count = 0;
    bbHead.forEach((el)=> {
      const bbText = el.querySelector('.text.parbase.section div');
      if (typeof bbText !== 'undefined'){
         const text = bbText.innerHTML;
         const bbImg = el.querySelector('.cmp-image__image');
        if (typeof bbImg !== 'undefined'){
          /* build cells for the block */
          if (count % 2 === 0){
            cells.push([text, bbImg]);
            count++;
          }else{
            cells.push([bbImg, text]);
            count++
          }
        }
      } 
    });
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  main.append(table);
  removeEls.push('div.container.software.billboard.billboard-video.sub-hero');
  
};

// create cards
const createCards = (main, document, removeEls) => {
  const header = {};
  const cells = [
    ['Cards (link)'],      
  ];
  //get card heading if any
  const headCss = 'div.styledcontainer.parbase div.container.tile-3 div.par.parsys div.text.parbase.section div h2';
  const head = document.querySelector(headCss);
  //strip the style attribute
  if (head){
    header.text = head;
  }
  // get card container li's
  const cardCss = 'ul.listOfItems.image-list.list-tile li.listItem';
  const li = document.querySelectorAll(cardCss);
  if (li) {
    li.forEach((el) => {
      //start building out each card
      //grab the link
      const link = el.querySelector('a');
      
      //grab the img
      const img = el.querySelector('img');
      
      //grab the navTitle
      const nvTitle = el.querySelector('.navigation-title').innerHTML.replace('\n','');
      
      //grab the title
      const title = el.querySelector('.title').innerHTML.replace('\n','');
      
      //grab the abstract
      const abstract = el.querySelector('.is-visible.abstract').innerHTML.replace('\n','');

      // build our content string
      var contentString = '';
      if (nvTitle) contentString += '<p class="nav-title">' + nvTitle + '</p>';
      if (title) contentString += '<p class=="title">' + title + '</p>';
      if (abstract) contentString += '<p class="is-visible.abstract">' + abstract + '</p>';       

      //console.log(contentString);
      //lets build our cell entries
      cells.push([img, contentString]);
    });
  }
    //spit out the heading first
    main.append(header.text);
    //now append the cards below heading
    const table = WebImporter.DOMUtils.createTable(cells, document);
    main.append(table);
    //destroy previous cards:
    removeEls.push('.container.tile-3');
};

export default {
  transformDOM: ({ document }) => {
    const main = document.querySelector('main');
    /* We'll store the respective CSS classes in the fired array
    * and then pass those to the remove function of DOMUtils to 
    * remove elements we've already processed.
    */
    const removeEls = [];
    
    createHero(main, document, removeEls);
    createTextHero(main, document, removeEls);
    createColumns(main, document, removeEls);
    createQuote(main, document, removeEls);
    createCTABanner(main, document, removeEls);
    createbbColumns(main, document, removeEls);
    createCards(main, document, removeEls);
    createMetadataBlock(main, document, removeEls);

    // final cleanup
    /*WebImporter.DOMUtils.remove(main, [
      '.disclaimer',
      
    ]);*/
    WebImporter.DOMUtils.remove(main, removeEls);

    return main;
  },
};