/* eslint-disable no-console */
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

  //find the <meta property="date"> element
  const date = document.querySelector('[property="date"]');
  if (date) meta.Date = date.content;
  
  //helper to create the metadata block
  const metaBlock = WebImporter.Blocks.getMetadataBlock(document, meta);
  //returning the meta object might be usefull to other rules
  return metaBlock;
};

const createHero = (document) => {
  const doc = {};
  //grab hero image
  var heroImgCss = 'div.container.transom.branding-jmp div.bg.bg-op-full.bg-pos-full img';
  var heroImg = document.querySelector(heroImgCss);
  if (heroImg){
    const img = document.createElement('img');
    if (heroImg.alt)
    img.src = heroImg.src;
    if (heroImg.alt){
      img.alt = heroImg.alt;
    }
    if (heroImg.title){
      img.title = heroImg.title;
    } else {
      img.title = heroImg.alt;
    }
    doc.heroContents = img.outerHTML + '\n';
  }
 
  //create heroText
  var heroCss = 'div.container.transom.branding-jmp div.par.parsys div.text.parbase.section div';
  const heroText = document.querySelector(heroCss);
  //create heroContents
  if (heroText) {
      doc.heroContents += heroText.innerHTML.replace(/[\n\t]/gm, '') + '\n';
  }

  //get any subtext since the hero css isn't just for a text based hero image.
  var heroTextCss = 'div.container.transom.branding-jmp.feathered-overlay div.par.parsys div.parsys_column.cq-colctrl-lt2 div.parsys_column.cq-colctrl-lt2-c0 div.text.parbase.section div p span.text-large';
  const heroSubText = document.querySelector(heroTextCss);
  if (heroSubText){
   doc.heroContents += heroSubText.innerHTML.replace(/[\n\t]/gm, '') + '\n'; 
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
    ['Hero (block)'],
    [doc.heroContents],
  ];

   return WebImporter.DOMUtils.createTable(cells, document);
  // add our top level css to the fired array for element removal later
  //removeEls.push('div.container.transom.branding-jmp.feathered-overlay');
};

//get any full width 'hero' with only text likes
const createTextHero = (document) => {
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
        return table;
    }
    });
    //removeEls.push('div.styledcontainer.parbase div.container.segment.first div.par.parsys div.text.parbase.section div h2');
  }
};

const createCTABanner = (document) => {
  const doc = {};
  const cells = [
    ['Hero (cta)'],
  ];
  // grab the background image
  const imgCss = 'div.container.transom.branding-jmp div.bg.bg-op-full.bg-pos-full div.cmp-image.cq-dd-image img';
  const img = document.querySelector(imgCss);
  if (img) {
    doc.heroContents = img.outerHTML;
  }  
  //check for  as that's in the cta banners
  const heroH3Css = 'div.dark-button-center h3';
  const heroH3 = document.querySelector(heroH3Css);
  if (heroH3) {
    doc.heroContents += heroH3.outerHTML;
  }
  //now let's deal with buttons:
  var heroBtnCss = '.dark-button-center span.button a';
  const heroBtns = document.querySelectorAll(heroBtnCss);
  if (heroBtns){
      heroBtns.forEach((btn) => {
        doc.heroContents += btn.outerHTML + '\n';
      });
  }
  cells.push([doc.heroContents]);
  return WebImporter.DOMUtils.createTable(cells, document);
};

// createQuote
const createQuote = (document) => {
  const doc = {};

  // get quote text
  const bqTextCSS = '.narrow blockquote';
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
      // ['Column1', 'Column2', 'column3']
      [doc.attribution],
    ];

    return WebImporter.DOMUtils.createTable(cells, document);
  }
};

// createColumns
const createColumns = (document) => {
  const doc = {};
  doc.contents = [];
  const cells = [
    ['Columns'],
 ];
  // get text
  const cHeadCss = 'div#page-content.par div#par div.par.parsys div.styledcontainer.parbase div.container div.par.parsys div.text.parbase.section div h2:not(:has(sup))';
  const cHead = document.querySelectorAll(cHeadCss);  
  if (cHead) { // we have some content, process each
    if (cHead.length == 1){
      console.log(cHead[0]);
      cells.push([cHead[0]]);
    }
  }
  //get left hand side txt
  const lTxtCss = 'div.styledcontainer.parbase div.container div.par.parsys div.parsys_column.cq-colctrl-lt0.list-container div.parsys_column.cq-colctrl-lt0-c0 div.text.parbase.section div';
  const lTxt = document.querySelectorAll(lTxtCss);
  if (lTxt) {
      lTxt.forEach((el)=> {
        doc.contents.push(el.innerHTML.replace(/[\n\t]/gm, ''));
      });
  }
  const rTxtCss = 'div.styledcontainer.parbase div.container div.par.parsys div.parsys_column.cq-colctrl-lt0.list-container div.parsys_column.cq-colctrl-lt0-c1 div.text.parbase.section div';
  const rTxt = document.querySelectorAll(rTxtCss);
  if (rTxt) {
    rTxt.forEach((el) => {
      doc.contents.push(el.innerHTML.replace(/[\n\t]/gm, ''));
    });
  }
  if (doc.contents) {
    cells.push(doc.contents);
    return WebImporter.DOMUtils.createTable(cells, document);
  }
};

//create 'billboard' columns, basically columns with a different CSS Class
const createbbColumns = (document) => {
  const cells = [
    ['Columns (billboard)'],
 ];
  // get text
  const bbHeadCss = 'div.container.software.billboard.billboard-video.sub-hero div.par.parsys div.parsys_column.cq-colctrl-lt8';
  var bbHead = document.querySelectorAll(bbHeadCss);
  if (bbHead) { // we have some content, process each 
    //for some reason we end up with one undefined entry at the end.
    if (bbHead.length > 0){
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
      return WebImporter.DOMUtils.createTable(cells, document);
    }
  }
};

const createCardHeader = (document) => {
  const doc = {};
  //grab card header 
  const headCss = 'div.container.tile-3 div.par.parsys div.text.parbase.section div h2';
  const el = document.querySelector(headCss);
  if (el){
   return el;
  }
};

const createCardLink = (document) => {
  const doc = {};
  //grab card link (after cards) 
  const headCss = 'div.container.tile-3 div.par.parsys div.text.parbase.section div.sub-capability-cards p a';
  const el = document.querySelector(headCss);
  if (el){
    return el;
  }

};
// create cards
const createCards = (document) => {
  const doc = {};
  const header = {};
  const cells = [
    ['Cards (linked)'],      
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
      const nvTitle = el.querySelector('.navigation-title');
      if (nvTitle) {
        doc.nvTitle = nvTitle.innerHTML.replace('\n','');
      }
      
      //grab the title
      const title = el.querySelector('.title');
      if (title) {
        doc.title = title.innerHTML.replace('\n','');
      }
      //grab the abstract
      const abstract = el.querySelector('.is-visible.abstract');
      if (abstract) {
        doc.abstract = abstract.innerHTML.replace('\n','')
      }
      // build our content string
      var contentString = '';
      if (nvTitle) contentString += '<p>' + doc.nvTitle + '</p>';
      if (title) contentString += '<p class=="title">' + doc.title + '</p>';
      if (abstract) contentString += '<p class="is-visible.abstract">' + doc.abstract + '</p>';
      //if (link) contentString += link;     
      //lets build our cell entries
      cells.push([img, contentString]);
    });
  }

    //@TODO need to figure out how to return both.
    //spit out the heading first
    doc.headerText = header.text;
    //now append the cards below heading
    return WebImporter.DOMUtils.createTable(cells, document);
};

export default {
  transformDOM: ({ document }) => {
    const main = document.querySelector('main');
    //create the container div/section
    const section = document.createElement('div');
    const sectionBreak = document.createElement('hr');

    const hero = createHero(document);
    if (hero) section.append(hero);
    section.append(sectionBreak);
    /*const heroTest = createHeroTest(document);
    if (heroTest) section.append(heroTest);*/

    const columns = createColumns(document);
    if (columns) section.append(columns);

    const textHero = createTextHero(document);
    if (textHero) section.append(textHero);

    const quote = createQuote( document,);
    if (quote) section.append(quote);

    /*const ctaBanner = createCTABanner(document);
    if (ctaBanner) section.append(ctaBanner);*/

    const bbCols = createbbColumns(document);
    if (bbCols) section.append(bbCols);
    
    section.append(sectionBreak);

    const cardHeader = createCardHeader(document);
    if (cardHeader) section.append(cardHeader);

    const cards = createCards(document);
    if (cards) section.append(cards);
    
    const cardLink = createCardLink(document);
    if (cardLink) section.append(cardLink);

    section.append(sectionBreak);

    const ctaBanner = createCTABanner(document);
    if (ctaBanner) section.append(ctaBanner);

    const meta = createMetadataBlock(document);
    if (meta) section.append(meta);

    main.innerHTML = '';
    main.append(section);
    return main;
  },
};