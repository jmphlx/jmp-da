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

  const date = document.querySelector('[property="date"]');
  if (date) meta.Date = date.content;
  //find the <meta property="date"> element
  const tCard = document.querySelector('[name="twitter:card"]');
  if (tCard) meta['twitter:card'] = tCard.content;
  const tSite = document.querySelector('[name="twitter:site"]');
  if (tCard) meta['twitter:site'] = tSite.content;  
  const metaBlock = WebImporter.Blocks.getMetadataBlock(document, meta);
  //returning the meta object might be usefull to other rules
  return metaBlock;
};

const createHighlight = (document) => {
  const doc = {};
  const cells = [
    ['columns'],
  ]
  
  const lhText = document.querySelector('div.parsys_column.cq-colctrl-lt8 div.parsys_column.cq-colctrl-lt8-c0 div.text.parbase.section div');
  const rhText = document.createElement('div');

  const link = document.createElement('a');
  link.innerText = "Enroll now";
  link.href = 'https://support.sas.com/edu/viewmyelearn.html?activationCode=FAEJMPST';
  link.target = "_blank";
  lhText.append(link);

  // const vid = rhText.querySelector("lightbox-brightcove");
  // console.log("DREW LOOK HERE");
  // console.log(typeof rhText);
  
  cells.push([lhText, rhText]);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};

const createTopics = (document) => {
  const doc = {};
  const cells = [
    ['columns'],
  ]
  
  const lhText = document.querySelector('div.parsys_column.cq-colctrl-lt9 div.parsys_column.cq-colctrl-lt9-c0');
  const rhText = document.querySelector('div.parsys_column.cq-colctrl-lt9 div.parsys_column.cq-colctrl-lt9-c1');

  const headers = lhText.querySelectorAll('h2');

  headers.forEach((elem) => {

    elem.outerHTML = "<h3>" + elem.innerHTML + '</h3>';
  });

  const headers2 = rhText.querySelectorAll('h2');

  headers2.forEach((elem) => {

    elem.outerHTML = "<h3>" + elem.innerHTML + '</h3>';
  });

  

  // const page = title.innerText.trim().replaceAll(" ","-").toLowerCase();
  // rhText.setAttribute("href",`https://main--jmp-da--jmphlx.hlx.page/modals/${page}`);
  // rhText.setAttribute("src", "https://www.jmp.com" + rhText.getAttribute('src'));
  
  cells.push([lhText, rhText]);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
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

  const link1 = document.createElement('a');
  link1.innerHTML = "Try JMP free"
  link1.setAttribute("href", "https://www.jmp.com/en_us/download-jmp-free-trial.html");
  main.append(link1);

  main.append(document.createElement('p'));

  const link2 = document.createElement('a');
  link2.innerHTML = "Buy JMP now"
  link2.setAttribute("href", "https://www.jmp.com/en_us/software/buy-jmp.html");
  main.append(link2);

  console.log("LOOK HERE DREW PLEASE");
  console.log(main);



  return main; 
};

const createContact = (document) => {
  

  const link1 = document.createElement('a');
  link1.innerHTML = "Contact us"
  link1.setAttribute("href", "en/about/contact/contact-us-form");


  return link1; 
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


    const topSectionMeta = createDoublSM(document, 'blue, background-fill, text-light , section-top-padding-small, section-padding-xsmall');
    if(topSectionMeta) section.append(topSectionMeta);

    section.append(document.createElement('hr'));

    const backlink = document.createElement('a');
    backlink.innerText = "Back to Course Overview";
    backlink.href = "/en/online-statistics-course";
    section.append(backlink);

    const sectionMetadata = createSM(document, 'text-link-back, section-top-padding-small, section-padding-none');
    if(sectionMetadata) section.append(sectionMetadata);

    section.append(document.createElement('hr'));

    const title2 = document.createElement('h1');
    const heading = document.querySelector("div.par.parsys div.text.parbase.section div h1");
    console.log(heading);
    title2.innerText = heading.innerText;
   
    console.log(title2.innerText);
    title2.classList.remove("text-parbase-section");
    if (title2) section.append(title2);


    const bio = createHighlight(document);
    if (bio) section.append(bio);

    const sectionMetadata2 = createSM(document, 'section-top-padding-none ');
    if(sectionMetadata2) section.append(sectionMetadata2);

    section.append(document.createElement('hr'));

    const topics = document.createElement('h4');
    topics.innerText = "Specific topics covered in this module include:";
    section.append(topics);

    const relatedTopics = createTopics(document);
    if (relatedTopics) section.append(relatedTopics);

    const sectionMetadata3 = createSM(document, 'section-padding-none');
    if(sectionMetadata3) section.append(sectionMetadata3);

    const meta = createMetadataBlock(document);
    if (meta) section.append(meta);
    
    main.innerHTML = '';
    main.append(section);
    return main;
  },
};
