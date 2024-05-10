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

const createHero = (document) => {
  const doc = {};
  //grab hero image
  const heroImgCss = 'div.container.transom.branding-jmp div.bg.bg-op-full.bg-pos-full img';
  const heroImg = document.querySelector(heroImgCss);
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
  const heroCss = 'div.container.transom.branding-jmp div.par.parsys div.text.parbase.section div';
  const heroText = document.querySelector(heroCss);
  //create heroContents
  if (heroText) {
      doc.heroContents += heroText.innerHTML.replace(/[\n\t]/gm, '') + '\n';
  }

  //get any subtext since the hero css isn't just for a text based hero image.
  const heroTextCss = 'div.container.transom.branding-jmp.feathered-overlay div.par.parsys div.parsys_column.cq-colctrl-lt2 div.parsys_column.cq-colctrl-lt2-c0 div.text.parbase.section div p span.text-large, div.container.transom.branding-jmp div.par.parsys div.parsys_column.cq-colctrl-lt0 div.parsys_column.cq-colctrl-lt0-c0 div.text.parbase.section div h3, div.container.transom.branding-jmp div.par.parsys div.parsys_column.cq-colctrl-lt13 div.parsys_column.cq-colctrl-lt13-c0 div.text.parbase.section div.larger-text, div.container.transom.branding-jmp.feathered-overlay div.par.parsys div.parsys_column.cq-colctrl-lt2 div.parsys_column.cq-colctrl-lt2-c0 div.text.parbase.section div p span.text-large, div.container.transom.branding-jmp div.par.parsys div.parsys_column.cq-colctrl-lt0 div.parsys_column.cq-colctrl-lt0-c0 div.text.parbase.section div h3, div.container.transom.branding-jmp div.par.parsys div.parsys_column.cq-colctrl-lt2 div.parsys_column.cq-colctrl-lt2-c0 div.text.parbase.section div.p-large p span.text-large';
  const heroSubText = document.querySelector(heroTextCss);
  if (heroSubText){
    doc.heroContents += heroSubText.innerHTML.replace(/[\n\t]/gm, '') + '\n'; 
  }

  //parse any buttons that may be there.
  const heroBtnCss = 'div.container.transom.branding-jmp div.par.parsys div.parsys_column div.parsys_column div.text.parbase.section ul.list-none li span.button, div.container.transom.branding-jmp.feathered-overlay div.par.parsys div.parsys_column.cq-colctrl-lt2 div.parsys_column.cq-colctrl-lt2-c0 div.text.parbase.section ul.list-none li span.button';
  const heroBtns = document.querySelectorAll(heroBtnCss);
  if (heroBtns){
      if (heroBtns.length > 0){
        doc.heroContents += '\n';
        heroBtns.forEach((btn) => {
        doc.heroContents += btn.innerHTML;
        });
      }
  }
  //sometimes there is a image link and link in hero's. Let's deal with them now
  const subImgCss = 'div.container.transom.branding-jmp div.par.parsys div.parsys_column.cq-colctrl-lt0 div.parsys_column.cq-colctrl-lt0-c1 div.image.parbase.section div a';
  const subImg = document.querySelector(subImgCss);
  if (subImg){
    const el = document.createElement('p');
    el.append(subImg);
    doc.heroContents += el.outerHTML;
  }
  //now lets deal with the link itself. 
  const linkCss = 'div.container.transom.branding-jmp div.par.parsys div.parsys_column.cq-colctrl-lt0 div.parsys_column.cq-colctrl-lt0-c1 div.text.parbase.section div.sub-capability-cards.link-white';
  const link = document.querySelector(linkCss);
  if (link) doc.heroContents += link.innerHTML;
  const cells = [
    ['Hero (block)'],
    [doc.heroContents],
  ];
  if (doc.heroContents !== undefined) return WebImporter.DOMUtils.createTable(cells, document);
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
  }
};

const createROIColumns = (document) => {
  const doc = {};
  doc.cells = [];
  const cells = [
    ['Columns (roi)'],
  ]
  const roiColCss = 'div.container.brand-neutral-dark.roi-block div.par.parsys div.text.parbase.section div.roi-grid div';
  const rCol = document.querySelectorAll(roiColCss);
  if (rCol.length > 0) {
    rCol.forEach((el) => {
      doc.col = el;
      if (doc.col){
        //if it contains a break, we need to replace it.
        const hasBr = doc.col.querySelector('br');
        if (hasBr) {
          if (doc.col.querySelector('h3')){
            const br = doc.col.querySelector('h3').innerHTML.split('<br>');
          
          const h3 = document.createElement('h3');
          br.forEach((el) => {
            const p = document.createElement('p');
            p.innerHTML = el;
            h3.append(p);
          });
          doc.col.querySelector('h3').replaceWith(h3);
        }
          
        }        
        doc.cells.push(doc.col);
      }
    });
    cells.push(doc.cells);  
  }
  //grab the link
  const lCss = 'div.container.brand-neutral-dark.roi-block div.par.parsys div.text.parbase.section div.pivot p';
  const link = document.querySelectorAll(lCss);
  doc.link = [];
  if (link.length > 0) {
    link.forEach((el) => {
      doc.link.push('', el.innerHTML, '');
    });
    cells.push(doc.link);
  }
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};

const createCTABanner = (document) => {
  const bannerCss = 'div.container.transom.branding-jmp:has(div.dark-button-center)';
  const banner = document.querySelectorAll(bannerCss);
  if (banner){
    var table = [];
    banner.forEach((el) => {
      const cells = [
        ['Hero (cta)'],
      ];
      const doc = {};
      // grab the background image
      const imgCss = 'div.cmp-image.cq-dd-image img';
      const img = el.querySelector(imgCss);
      if (img) {
        //console.log(img);    
        doc.heroContents = img.outerHTML;
      }  
      //check for  as that's in the cta banners
      const heroH3Css = 'h3';
      const heroH3 = el.querySelector(heroH3Css);
      if (heroH3) {
        doc.heroContents += heroH3.outerHTML;
      }
      //check for h2 as that could be in the cta banners
      const heroH2Css = 'h2';
      const heroH2 = el.querySelector(heroH2Css);
      if (heroH2) {
        doc.heroContents += heroH2.outerHTML;
      }
      //now let's deal with buttons:
      var heroBtnCss = '.dark-button-center span.button a';
      const heroBtns = el.querySelectorAll(heroBtnCss);
      if (heroBtns){
          heroBtns.forEach((btn) => {
            doc.heroContents += btn.outerHTML + '\n';
          });
      }
      if (doc.heroContents); cells.push([doc.heroContents]);
      table.push(WebImporter.DOMUtils.createTable(cells, document));
      
   });
   return table;
  }
};

const createLinkList = (document) => {
  const doc = {};
  const cells = [
    ['Columns (link-list)'],
  ];
  //['col1','col2','col3']
  // grab the background image
  const linksCss = 'div.container div.par.parsys div.text.parbase.section div.sub-capability-cards.sub-nav-anchor-list';
  const link = document.querySelector(linksCss);
  //console.log(link);
  if (link) {
    doc.col = document.createElement('p');
    doc.col2 = document.createElement('div');
    doc.col3 = document.createElement('p');
    
    doc.col.append(link.querySelector('h4'));
    const links = link.querySelectorAll('a');
    if (links) {
      doc.count = 0;
      links.forEach((el) => {
        //console.log(el);
        doc.elP = document.createElement('p');
        if (doc.count < 5 ) {
          doc.col.append(el);
          doc.count++;
        } else if (doc.count < 10 ) {
          console.log(doc.elP);
          doc.elP.innerHTML = el.outerHTML;
          doc.col2.append(doc.elP);
          doc.count++;
        } else {
          doc.elP.innerHTML = el.outerHTML;
          doc.col3.append(doc.elP);
        }
      });
      //console.log(doc.col);
      //console.log(doc.col2);
      //console.log(doc.col3);
    }
  }
  cells.push([doc.col, doc.col2, doc.col3]);
  if (cells[1].length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};

// createQuote
const createQuote = (document) => {
  const doc = {};
  // get quote text
  const bqTextCSS = '.narrow blockquote';
  const bqText = document.querySelector(bqTextCSS);
  if (bqText) {
    //if it has a random break, remove it.
    doc.bqText = bqText.innerHTML;
  }
  
  //create attribution
  const attCSS = 'div.text.parbase.section div.narrow p :not(span)';
  const attribution = document.querySelector(attCSS);
  //console.log(attribution);
  if (attribution) {
    doc.attribution = attribution.parentElement.innerHTML;
  }
  //console.log(doc.attribution);
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
  const cHeadCss = 'div#page-content.par div#par div.par.parsys div.styledcontainer.parbase:not(:has(.container.transom.branding-jmp)) div.container div.par.parsys div.text.parbase.section div h2:not(:has(sup))';
  const cHead = document.querySelectorAll(cHeadCss);  
  if (cHead) { // we have some content, process each
    if (cHead.length == 1){
      cells.push([cHead[0]]);
    }
    
  }
  const contentRowCss = 'div.styledcontainer.parbase:not(:has(.container.transom.branding-jmp)) div.container:not(.billboard) div.par.parsys div.parsys_column.cq-colctrl-lt0';
  const contentRow = document.querySelectorAll(contentRowCss);
  if (contentRow) {
    contentRow.forEach((row) => {
      
      doc.flipText = false;
      if (row.classList.contains('text-flip-right')){
        //might make sense to flip the css around, since due to this class, they're reversed. 
         doc.flipText = true; 
      }
      const rContentCss = '.parsys_column .cq-colctrl-lt0-c0 img.cmp-image__image, .parsys_column .cq-colctrl-lt0-c0 .text';
      const rightContent = row.querySelector(rContentCss);

      const lContentCss = '.parsys_column .cq-colctrl-lt0-c1 img.cmp-image__image, .parsys_column .cq-colctrl-lt0-c1 .text'
      const leftContent = row.querySelector(lContentCss);
      if (doc.flipText) {
        cells.push([rightContent, leftContent]);
      } else {
        cells.push([leftContent, rightContent]);
      }
    });
  }
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
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
      if (link) contentString += link;
      //lets build our cell entries
      cells.push([img, contentString]);
    });
    if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
  }
};

// create accordion
const createAccordion = (document) => {
  const doc = {};
  const cells = [
    ['Accordion'],      
  ];
  //get accordion heading if any
  const headCss = 'div.styledcontainer.parbase div.container.software:not(.billboard.billboard-video.sub-hero) div.par.parsys div.text.parbase.section div h3';
  const head = document.querySelector(headCss);
  //strip the style attribute
  if (head){
    doc.headerTxt = head;
   // console.log('header');
    //console.log(head);
  }
  // get accordion titles
  const titleCss = 'div.accordionwrapper.parbase div.accordionWrapperParsys.boxed-items div.parsys div.accordion.parbase div.accordion-title';
  const titles = document.querySelectorAll(titleCss);
  if (titles) {
    doc.titles = [];
    titles.forEach((title) => {
      //console.log(title.innerHTML);
      /*title.removeAttribute('id');
      title.removeAttribute('class');*/
      doc.titles.push(title.innerHTML);
      
    });
  }
  const contentCss = 'div.accordionwrapper.parbase div.accordionWrapperParsys.boxed-items div.parsys div.accordion.parbase div.accordion-content';
  const aContent = document.querySelectorAll(contentCss);
  if (aContent){
    doc.contents = [];
    aContent.forEach((el) => {
      el.classList.remove();
      //sanitize attributes
      /*el.removeAttribute('id');
      el.removeAttribute('class');*/
      doc.contents.push(el);
    });
  }
  //lets grab the button if it exists.
  const btnCss = 'div.container.software div.par.parsys div.btn.parbase a';
  const btn = document.querySelector(btnCss);
  if (btn){
    //console.log(btn);
    //for some reason button contains span. We'll have to remove that?
    if (btn.querySelector('span')){
      const linkText = btn.querySelector('span').innerHTML;
      console.log(linkText);
      btn.querySelector('span').remove();
      btn.innerHTML = linkText;
    }
    doc.btn = btn;
  }
  if (doc.contents.length === doc.titles.length){
    var count = 0;
    doc.titles.forEach((title) => {
      cells.push([title, doc.contents[count]]);
      count++;
    });
    
    //lets build the block section
    var block = document.createElement('div');
    if (doc.headerTxt) block.append(doc.headerTxt);
    const table =  WebImporter.DOMUtils.createTable(cells, document);
    //console.log(table.innerHTML);
    if (table) block.append(table);
    if (doc.btn )block.append(doc.btn);
    //console.log(block);
    if (cells.length > 1) return block;
  }
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
 
    const listText = createLinkList(document);
    if (listText) section.append(listText);

    section.append(sectionBreak);

    const columns = createColumns(document);
    if (columns) section.append(columns);

    section.append(sectionBreak);

    const textHero = createTextHero(document);
    if (textHero) section.append(textHero);

    section.append(sectionBreak);

    const quote = createQuote( document,);
    if (quote) section.append(quote);

    section.append(sectionBreak);

    const bbCols = createbbColumns(document);
    if (bbCols) section.append(bbCols);

    section.append(sectionBreak);

    const roi = createROIColumns(document);
    if (roi) section.append(roi);

    section.append(sectionBreak);

    const cardHeader = createCardHeader(document);
    if (cardHeader) section.append(cardHeader);

    const cards = createCards(document);
    if (cards) section.append(cards);
    
    const cardLink = createCardLink(document);
    if (cardLink) section.append(cardLink);

    section.append(sectionBreak);

    const accordion = createAccordion(document);
    if (accordion) section.append(accordion);

    section.append(sectionBreak);

    const ctaBanner = createCTABanner(document);
    if (ctaBanner) {
      ctaBanner.forEach((el) => { section.append(el); });
    }  

    const meta = createMetadataBlock(document);
    if (meta) section.append(meta);

    main.innerHTML = '';
    main.append(section);
    return main;
  },
};