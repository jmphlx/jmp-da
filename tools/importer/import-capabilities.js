// customer stories import.js
/* eslint-disable */
const createMetadataBlock = (document) => {
  const lhText = document.querySelector('div.parsys_column.cq-colctrl-lt0 div.parsys_column.cq-colctrl-lt0-c0');
  console.log(lhText);
  const meta = {};
  //find the <title> element
  const title = document.querySelector('title');
  if (title) {
    const myTitle = title.innerHTML.replace(/[\n\t]/gm, '');
    meta.Title = myTitle.split('|')[0];
  }
  //find the <meta property="og:description"> element
  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  const descDisp = document.querySelector('[name="description"]');
  if (descDisp) {
    console.log("this ran");
    meta.displayDescription = descDisp.content;
  }

  

  //find the <meta property="og:type"> element
  const type = document.querySelector('[property="og:type"]');
  if (type) meta.Type = type.content;
  //find the <meta property="og:image"> element
  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }
 //grab meta prop=software (because of course both product and software exist)
  const softwareMeta = document.querySelectorAll('[property="software"]');
  //grab meta property=jmp
  const jmpMeta = document.querySelectorAll('[property="jmp"]');
  if (jmpMeta) {
    const splitChar = '|';
    meta.resourceType = [];
    meta.resourceOptions = [];
    meta.capability = [];
    meta.product = [];
    meta.industry = [];
    meta.redirectTarget = [];
    //events arrays
    meta.eventType = [];
    meta.eventTime = [];
    meta.eventSeries = [];
    jmpMeta.forEach((el) => {
      if (el.content){ 
          // console.log("SplitContents:");
          // console.log(el.content.split(splitChar));
          // handle custom page tags
          // handle resourceType 
          if (el.content.split(splitChar)[0] == 'Content Type'){
            //meta.resourceType = [];
            //console.log("el.content splits below");
            //console.log(el.content.split(splitChar)[1]);
            if (el.content.split(splitChar)[1] == 'Success Story'){
              meta.resourceType.push("Customer Story");
            } else {
            meta.resourceType.push(el.content.split(splitChar)[1]);}
          }
          // console.log("metaResourceType below"); 
          // console.log(meta.resourceType);

          if (el.content.split(splitChar)[0] == 'Tier' || el.content.split(splitChar)[0] == 'Success Stories'){
            //meta.resourceType = [];
            //console.log("el.content splits below");
            //console.log(el.content.split(splitChar)[1]);
            if (!(el.content.split(splitChar)[1] === undefined)){
            meta.resourceOptions.push(el.content.split(splitChar)[1] + ",");}
          }



          //handle capability
          if (el.content.split(splitChar)[0] == 'Capability'){ 
            //meta.capabilityType = [];
            //console.log("el.content splits below");
            //console.log(el.content.split(splitChar)[1]);
            meta.capability.push(el.content.split(splitChar)[1]);
          }
          // console.log("metaCapabilityType below"); 
          // console.log(meta.capabilityType);
                  
        // handle redirectUrl types
        if (el.content.split(splitChar)[0] == 'redirectUrl'){
          //meta.redirectUrl = [];
          meta.redirectUrl.push(el.content.split(splitChar)[1]);
        }
        //console.log("metaredirectUrl below"); 
        //console.log(meta.redirectUrl);

        // handle software/product types
        if (el.content.split(splitChar)[0] == 'Product' || el.content.split(splitChar)[0] == 'Software'){
          //meta.product = [];
          meta.product.push(el.content.split(splitChar)[1]);
        }
        //console.log("metaproduct below"); 
        //console.log(meta.product);

        // handle industries
        if (el.content.split(splitChar)[0] == 'Industry'){
          //meta.industry = [];
          meta.industry.push(el.content.split(splitChar)[1]);
        }

        // EVENTS
        // handle event types
        if (el.content.split(splitChar)[0] == 'Event Type'){
          //meta.eventType = [];
          meta.eventType.push(el.content.split(splitChar)[1]);
        }
        // console.log("metaEventType below"); 
        // console.log(meta.eventType);

        if (el.content.split(splitChar)[0] == 'Event Time'){
          //meta.eventTime = [];
          meta.eventTime.push(el.content.split(splitChar)[1]);
        }
        //console.log("metaEventType below");

        if (el.content.split(splitChar)[0] == 'Event Series'){
          //meta.eventSeries = [];
          meta.eventSeries.push(el.content.split(splitChar)[1]);
        }
        //console.log("metaEventSeries below");
        // console.log(meta);

      
     }
    });


    if (softwareMeta) {
      //meta.product = [];
      softwareMeta.forEach((el) => {
        if (el.content){ 
         if (el.content.includes("|")){
          if (el.content.split(splitChar)[0]){
            //meta.eventTime = [];
            meta.product.push(el.content.split(splitChar)[1]);
          }
          console.log("productMeta");
          console.log(meta.product);
       }
        else {
            meta.product.push(el.content);
        }
      }
      });
    }
  }
  const metaBlock = WebImporter.Blocks.getMetadataBlock(document, meta);
  //returning the meta object might be usefull to other rules
  return metaBlock;
};
const createFragment = (document, link) => {
  const cells = [
    ['fragment'],
  ]
  const anchor = document.createElement('a');
  anchor.href = link;
  anchor.innerText = link;
  cells.push([anchor]);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};

const createTopic = (document, title) => {
  const doc = {};
  const cells = [
    ['columns'],
  ]
  
  const left = document.querySelector('div.container.segment.first div.par.parsys div.parsys_column.cq-colctrl-lt8 div.parsys_column.cq-colctrl-lt8-c0');
  console.log("this is the left hand text of the first section");
  console.log(left);
  const lhText = left.cloneNode(true);


  const right = document.querySelector('div.par.parsys div.parbase.section div.lightbox-brightcove template');
  const rhText = right.cloneNode(true);
  // const page = title.innerText.trim().replaceAll(" ","-").toLowerCase();
  // rhText.setAttribute("href",`https://main--jmp-da--jmphlx.hlx.page/modals/${page}`);
  // rhText.setAttribute("src", "https://www.jmp.com" + rhText.getAttribute('src'));

  console.log("LOOK HERE");
  console.log(rhText.content.querySelector("video-js"));
  console.log("the video ID");
  console.log(rhText.content.querySelector("video-js").getAttribute("data-video-id"));
  const link = rhText.content.querySelector("video-js").getAttribute("data-video-id");


  const anchor = document.createElement('a');
  anchor.href = link;
  anchor.innerText = link;
  
  cells.push([lhText, anchor]);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};

// create cards
const createCards = (document) => {
  const doc = {};
  const header = {};
  const cells = [
    ['cards (value-block-purple)'],      
  ];
  //get card heading if any
  const headCss = 'div.styledcontainer.parbase div.container.tile-3 div.par.parsys div.text.parbase.section div h2';
  const head = document.querySelector(headCss);
  //strip the style attribute
  if (head){
    header.text = head;
  }
  // get card container li's
  const cardCss = 'div.textimage_copy.textimage.parbase div.value-block-purple';
  const li = document.querySelectorAll(cardCss);
  if (li) {
    li.forEach((el) => {
      //start building out each card
      //grab the link
      console.log("Card Elements");
      const link = el.querySelector('span.button a');
      // link.innerHTML("Learn More");
      console.log(link);
      
      //grab the img
      const img = el.querySelector('img');
      img.setAttribute("src", "https://www.jmp.com" + img.getAttribute('src'));
      console.log(img);
      
      //grab the navTitle
      const nvTitle = el.querySelector('h2');
      if (nvTitle) {
        doc.nvTitle = nvTitle.innerHTML.replace('\n','');
      }
      //grab the title
      const title = el.querySelector('p');
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
      if (nvTitle) contentString += '<h2>' + doc.nvTitle + '</h2>';
      if (title) contentString += '<p>' + doc.title + '</p>';
      if (abstract) contentString += '<p class="is-visible.abstract">' + doc.abstract + '</p>';
      if (link) contentString += `<a href=${link}>Learn More</a>`;
      //lets build our cell entries
      cells.push([img, contentString]);
    });
    if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
  }
};

const createDivider = (document) => {
  const cells = [
    ['divider'],
  ]
  return WebImporter.DOMUtils.createTable(cells, document);
};

const createTitle = (document) => {
  const title = document.querySelector('div.text.parbase.section div.nametag');
  // console.log(title)
  if (title.querySelector('h4')) {title.querySelector('h4').outerHTML = "<h5>" + title.querySelector('h4').innerHTML + '</h5>'};
  if (title.querySelector('p')) {title.querySelector('p').outerHTML = "<h5>" + title.querySelector('p').innerHTML + '</h5>'};
  title.classList.remove('nametag');
  // title.querySelector('h4').outerHTML = "<h6>" + title.querySelector('h4').innerHTML + '</h6>'
  // console.log("DREW LOOK HERE");
  console.log(title);
  return title;
  };


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

const createSM = (document, style) => {
  const cells = [
    ['section-metadata'],
  ]

  cells.push(['Style', style]);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

const createDoublSM = (document, style) => {
  const cells = [
    ['section-metadata'],
  ]

  const pic = document.createElement('img');
  pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com/content/dam/jmp/images/data-viz/jmp-data-viz-scatterplot-background.png";

  cells.push(['background-image', pic]);
  cells.push(['Style', style]);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

const createDoublSM2 = (document, style) => {
  const cells = [
    ['section-metadata'],
  ]

  const pic = document.createElement('img');
  pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com/content/dam/jmp/images/design/data-visualization-illustrations/bubble-plot-wide-01.png";

  cells.push(['background-image', pic]);
  cells.push(['Style', style]);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};


const createTrial = (document) => {
  const main = document.createElement('div');

  const buttons = document.querySelectorAll("div.dark-button-center ul.list-none li span.button a");
  if (buttons.length > 0){

  const link1 = buttons[0].cloneNode(true);
  main.append(link1);

  main.append(document.createElement('p'));
  

  const link2 = buttons[1].cloneNode(true);
  main.append(link2);

  console.log("LOOK HERE DREW PLEASE");
  console.log(main);
  };


  return main; 
};

const createContact = (document) => {
  

  const link1 = document.createElement('a');
  link1.innerHTML = document.querySelector("div.dark-button-center p span.button a").innerHTML;
  link1.setAttribute("href", "en/about/contact/contact-us-form");


  return link1; 
};


const createAnalytic = (document) => {
  const cells = [
    ['columns'],
  ]

  const link1 = document.querySelector("div.reference.parbase div.cq-dd-paragraph div.styledcontainer_fadb.styledcontainer.parbase div.container div.par.parsys div.parsys_column.cq-colctrl-lt0 div.parsys_column.cq-colctrl-lt0-c0 ");
  console.log("analytic content");
  console.log(link1);
  const pic = document.createElement('img');
  pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com/content/dam/jmp/images/why-jmp/why-JMP-img_600-v2.png";

  cells.push([link1, pic]);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

export default {
  transformDOM: ({ document }) => {
    const main = document.querySelector('main');
    //create the container div/section
    const section = document.createElement('div');
    const sectionBreak = document.createElement('hr');
    
    const title = document.querySelector('div.par.parsys div.styledcontainer.parbase div.container.transom.branding-jmp div.par.parsys div.text.parbase.section');
    console.log(title.innerText);
    title.classList.remove("text-parbase-section");
    const header = document.createElement('h1');
    header.innerText = title.innerText.trim();
    if (title) section.append(header);


    const topSectionMeta = createDoublSM(document, 'blue-purple-gradient, text-light');
    if(topSectionMeta) section.append(topSectionMeta);

    section.append(document.createElement('hr'));



    const bio = createTopic(document,title);
    if (bio) section.append(bio);

    const sectionMetadata = createSM(document, 'gray, clm-50-50, text-large');
    if(sectionMetadata) section.append(sectionMetadata);

    section.append(document.createElement('hr'));



    



    const card = createCards(document);
    if(card) section.append(card);


    const highlight = document.querySelector('div.par.parsys div.styledcontainer.parbase div.container div.par.parsys div.text.parbase.section div.nametag');
    highlight.classList.remove("nametag");
    if (highlight) section.append(highlight);

    const page = title.innerText.trim().replaceAll(" ","-").toLowerCase();
    console.log(page);


    const fragment = createFragment(document, `https://main--jmp-da--jmphlx.hlx.live/fragments/en/capabilities/${page}`);
    if (fragment) section.append(fragment);

    const sectionMetadata3 = createSM(document, 'sub-capability-cards, text-link, icon-inline, section-padding-medium');
    if(sectionMetadata3) section.append(sectionMetadata3);

    section.append(sectionBreak);

    const quote = createQuote(document);
    if(quote) section.append(quote);

    const sectionMetadata2 = createSM(document, 'section-padding-none');
    if(sectionMetadata2) section.append(sectionMetadata2);

    section.append(document.createElement('hr'));

    const bestDisc = document.createElement('h3');
    bestDisc.innerText = document.querySelector("div.text.parbase.section div.dark-button-center h2").innerText;
    bestDisc.classList.remove("nametag");
    section.append(bestDisc);


    const trial = createTrial(document);
    if(trial) section.append(trial);

    const middleSectionMeta = createDoublSM(document, 'blue-purple-gradient, text-center, background-image, block-padding-small, text-light, button-light, button-center');
    if(middleSectionMeta) section.append(middleSectionMeta);

    section.append(document.createElement('hr'));

    const analytic = createAnalytic(document);
    if(analytic) section.append(analytic);

    const penultimateMeta = createDoublSM2(document, 'background-image, text-link-caret-right, no-gray-border, text-vertical-center, listitem-links-left');
    if(penultimateMeta) section.append(penultimateMeta);

    section.append(document.createElement('hr'));

    const nextStep = document.createElement('h3');
    const reference = document.querySelectorAll("div.text.parbase.section div.dark-button-center h2");
    console.log(reference);
    if (reference.length > 1){
    nextStep.innerText = reference[1].innerText;
    nextStep.classList.remove("nametag");
    } else {
    nextStep.innerText = reference[0].innerText;
    nextStep.classList.remove("nametag");
    }
    section.append(nextStep);

    const contact = createContact(document);
    if(contact) section.append(contact);

    const bottomSectionMeta = createDoublSM(document, 'blue-purple-gradient, text-center, background-image, block-padding-small, text-light, button-light, button-center');
    if(bottomSectionMeta) section.append(bottomSectionMeta);
  
    const meta = createMetadataBlock(document);
    if (meta) section.append(meta);
    
    main.innerHTML = '';
    main.append(section);
    return main;
  },
};
