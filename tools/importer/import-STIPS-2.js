// customer stories import.js
/* eslint-disable */
const createMetadataBlock = (document) => {
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
    meta.capabilityType = [];
    meta.product = [];
    meta.industry = [];
    meta.redirectUrl = [];
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
              meta.resourceType.push("Customer Story" + ",");
            } else {
            meta.resourceType.push(el.content.split(splitChar)[1] + ",");}
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
            meta.capabilityType.push(el.content.split(splitChar)[1]);
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
  const siteAreaMeta = document.querySelectorAll('[property="siteArea"]');
  if (siteAreaMeta) {
    meta.SiteArea = [];
    siteAreaMeta.forEach((el) => {
      if (el.content) meta.SiteArea.push(el.content);
    });
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
const createFragment = (document) => {
  const cells = [
    ['fragment'],
  ]
  const anchor = document.createElement('a');
  anchor.href = 'https://main--jmp-da--jmphlx.hlx.live/fragments/en/resource-breadcrumb';
  anchor.innerText = 'https://main--jmp-da--jmphlx.hlx.live/fragments/en/resource-breadcrumb';
  console.log("LOOK HERE DREW");
  console.log(anchor);
  cells.push([anchor]);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};


//get any full width 'hero' with only text likes
const createDivider = (document) => {
  const cells = [
    ['divider'],
  ]
  return WebImporter.DOMUtils.createTable(cells, document);
};

const createInternalDivider = (document) => {
  const cells = [
    ['horizontal-rule (rule-padding-small)'],
  ]
  return WebImporter.DOMUtils.createTable(cells, document);
};

const createLeftHandRail = (document) => {

  const column = document.querySelector("div.container.billboard div.par.parsys div.parsys_column.cq-colctrl-lt2 div.parsys_column.cq-colctrl-lt2-c0");
  column.className = "";
  const paragraphs = column.children;
  console.log(column);
  for(let el of paragraphs) {
    console.log(el);
    console.log(el.innerText);
    console.log("links are below");
    const links = el.getElementsByTagName("a");
    for(let link of links) {
      console.log(link.href);
      const href = link.href;
      const isSearch = href.slice(0,50);
      console.log(link.innerText);
      console.log(isSearch);
      if (isSearch === "http://localhost:3001/en_us/search/support.html?q=") {
        console.log("truuuuuuuuuuuuuuuuuuuu");
        let query = link.innerText;
        query = query.replace(/\"/g,'').replace('.','');
        console.log(query);
        link.href = "https://edge-www.jmp.com/support/help/en/18.1/#search/" + query;
        console.log(link.href);
      };
    };
    console.log(links);
    if (el.className === "horizontalline parbase section") {
      console.log("Get spaced idiot!");
      let spacer = createInternalDivider(document);
      el.replaceWith(spacer);
      console.log("Get spaced idiot!");
      console.log(el);
    };
    el.className = "";
  };

  return column;
  };

  const createQuickStart = (document) => {
    const cells = [
      ['cards (extra-space, block-top-padding-small)'],
    ]

    const leftCell = document.createElement("img");
    const rightCell = document.createElement("div");

    leftCell.src = "https://www.jmp.com/en_us/online-statistics-course/resources/design-of-experiments/_jcr_content/par/styledcontainer_e089/par/lightbox_b417/lightboxThumbnail.img.jpg/1551199879413.jpg";
    leftCell.href = "/modals/stips/jmp-quick-start-video";

    const title = document.createElement("h5");
    title.innerText = "JMP Quick Start Video";
    rightCell.append(title)

    const blurb = document.createElement("p");
    blurb.innerText = "Enhance your learning by following along in JMP. Watch this video to see how easy it is to get started.";
    rightCell.append(blurb);
  
    cells.push([leftCell, rightCell]);
    console.log(cells);
    if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
  };

const createRightHandRail = (document) => {
  const newDiv = document.createElement("div");

  const column = document.querySelector("div.container.billboard div.par.parsys div.parsys_column.cq-colctrl-lt2 div.parsys_column.cq-colctrl-lt2-c1 div.image.parbase.section div");
  console.log(column.lastElementChild);
  const image = document.createElement("img");

  console.log(column);

  console.log(column.getAttribute("data-asset"));

  image.src = "https://www.jmp.com" + column.lastElementChild.firstElementChild.firstElementChild.getAttribute("src");
  console.log(image);

  newDiv.append(image);

  const quickStart = createQuickStart(document);
  newDiv.append(quickStart);

  return newDiv;
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
  pic.src = "https://www.jmp.com/en_us/online-statistics-course/_jcr_content/par/styledcontainer_b465/image.img.jpg/1539725705859.jpg";

  cells.push(['background-image', pic]);
  cells.push(['Style', style]);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

const createSM2 = (document) => {
  const cells = [
    ['section-metadata'],
  ]

  cells.push(['layout','2 Column']);
  cells.push(['Style', 'columns-75-25, section-top-padding-small, section-padding-large, bullet-arrow']);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

export default {
  transformDOM: ({ document }) => {
    const main = document.querySelector('main');
    //create the container div/section
    const section = document.createElement('div');
    const sectionBreak = document.createElement('hr');

    const title = document.querySelector('div.parsys_column.cq-colctrl-lt2 div.parsys_column.cq-colctrl-lt2-c0 div.text.parbase.section div');
    console.log(title.innerText);
    title.classList.remove("text-parbase-section");
    if (title) section.append(title);


    const topSectionMeta = createDoublSM(document, 'blue, background-fill, text-light , section-top-padding-small');
    if(topSectionMeta) section.append(topSectionMeta);

    section.append(document.createElement('hr'));

    const backlink = document.createElement('a');
    backlink.innerText = "Back to Course Overview";
    backlink.href = "/en/online-statistics-course/resources";
    section.append(backlink);

    const sectionMetadata = createSM(document, 'text-link-back, section-top-padding-small, section-padding-none');
    if(sectionMetadata) section.append(sectionMetadata);

    section.append(document.createElement('hr'));





    const lhrail = createLeftHandRail( document);
    console.log(lhrail)
    if (lhrail) section.append(lhrail);

    const divider = createDivider(document);
    if (divider) section.append(divider);

    const rightHR = createRightHandRail(document);
    console.log(rightHR);
    if (rightHR) section.append(rightHR);





    const sectionMetadata2 = createSM2(document);
    if(sectionMetadata2) section.append(sectionMetadata2);
  
    const meta = createMetadataBlock(document);
    if (meta) section.append(meta);
    
    main.innerHTML = '';
    main.append(section);
    return main;
  },
};
