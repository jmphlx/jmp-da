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

const createEmbed = (document) => {
  const cells = [
    ['embed'],
  ]
  const lhText = document.querySelector('div.parsys_column.cq-colctrl-lt8-c1 div.styledcontainer.parbase div.container.shaded.rounded.bordered div.par.parsys div.videoBrightcove.section');
  console.log("LOOK HERE");
  if (lhText){
  console.log(lhText.firstElementChild.firstElementChild.getAttribute("data-video-id"));
  const link = lhText.firstElementChild.firstElementChild.getAttribute("data-video-id");


  const anchor = document.createElement('a');
  anchor.href = link;
  anchor.innerText = link;
  cells.push([anchor]);
};
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};


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
  pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com/content/dam/jmp/images/data-viz/jmp-data-viz-bar-chart-background.png";

  cells.push(['background-image', pic]);
  cells.push(['Style', style]);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

const createDoublSM2 = (document, style) => {
  const cells = [
    ['section-metadata'],
  ]
  cells.push(['layout', "2 column"]);
  cells.push(['Style', style]);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};


const createSection = (document, section) => {
  const cells = [['columns (text-left)'],]

  console.log(section);

  const left = section.querySelector("div.parsys_column.cq-colctrl-lt3 div.parsys_column.cq-colctrl-lt3-c0");
  const middle = section.querySelector("div.parsys_column.cq-colctrl-lt3 div.parsys_column.cq-colctrl-lt3-c1");
  const right = section.querySelector("div.parsys_column.cq-colctrl-lt3 div.parsys_column.cq-colctrl-lt3-c2"); 

  const port = left.cloneNode(true);
  const aft = middle.cloneNode(true);
  const starboard = right.cloneNode(true);

  const bobs = [port,aft,starboard];

  for (var i = 0; i < 3; i++) {
    const content = document.createElement("div");
    console.log("this is the section:");
    console.log(bobs[i]);

    const pic = document.createElement("img");
    const originPic = bobs[i].querySelector("div.image.parbase.section");
    console.log("this is the pic");
    console.log(originPic);
    if (originPic.children[1].firstElementChild.hasAttribute("data-asset")){
      pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com" +originPic.children[1].firstElementChild.getAttribute("data-asset");
      console.log("found it!");
    } else {
      pic.src = "https://www.jmp.com" + originPic.getAttribute("src");
    }

    let text = bobs[i].querySelectorAll("div.text.parbase.section");

    fixLinks(document,text);

    content.append(text[0]);
    content.append(pic);
    content.append(text[1]);
    content.append(text[2]);
    bobs[i] = content;
  };

  cells.push(bobs);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);

};


const createLastSection = (document, section) => {
  const cells = [['columns (text-left)'],]

  console.log(section);

  const left = section.querySelector("div.parsys_column.cq-colctrl-lt0 div.parsys_column.cq-colctrl-lt0-c0");
  const right = section.querySelector("div.parsys_column.cq-colctrl-lt0 div.parsys_column.cq-colctrl-lt0-c1"); 

  const port = left.cloneNode(true);
  const starboard = right.cloneNode(true);

  const bobs = [port,starboard];

  for (var i = 0; i < 2; i++) {
    const content = document.createElement("div");
    console.log("this is the section:");
    console.log(bobs[i]);

    const pic = document.createElement("img");
    const originPic = bobs[i].querySelector("div.image.parbase.section");
    console.log("this is the pic");
    console.log(originPic);
    if (originPic.children[1].firstElementChild.hasAttribute("data-asset")){
      pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com" +originPic.children[1].firstElementChild.getAttribute("data-asset");
      console.log("found it!");
    } else {
      pic.src = "https://www.jmp.com" + originPic.getAttribute("src");
    }

    const text = bobs[i].querySelectorAll("div.text.parbase.section");

    fixLinks(document,text);
    content.append(text[0]);
    content.append(pic);
    content.append(text[1]);
    content.append(text[2]);
    bobs[i] = content;
  };



  cells.push(bobs);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);

};

const fixLinks = (document, section) => {
  const title = document.querySelector("div.parsys_column.cq-colctrl-lt13 div.parsys_column.cq-colctrl-lt13-c0 div.text.parbase.section div h1");
  
  const highlight = title.cloneNode(true);

  const path = highlight.innerText.trim().replaceAll(" ","-").replaceAll(":","").toLowerCase();

  console.log("checking if link path is correct");
  console.log(title);
  console.log(highlight);
  console.log(path);

  console.log(section);

  console.log(section[2]);

  const links = section[section.length-1].querySelectorAll("ul.list-arrow li a");
  console.log(links);
  for (let link of links) {
    console.log(link.href);
    const pointer = link.href.split("www.jmp.com#")[1];
    console.log(typeof pointer)
    // const destination = pointer.cloneNode(true);

    
    if (link.href.includes("#m-") ) {
      console.log("WE GOT A HIT GAMERS");
      link.href = `/modals/en/course-materials/${path}/${pointer}`;
      console.log(link.href);
    };
  };
};


const createTable = (document) => {
  const nav = document.createElement("ul");

    const essentials = document.createElement("h6");
    const essentialsLink = document.createElement("a");
    essentialsLink.href = "#the-essentials-1";
    essentialsLink.innerText = "The Essentials";
    essentials.append(essentialsLink);
    const li1 = document.createElement("li");
    li1.append(essentials)
    nav.append(li1);

    const enhancements = document.createElement("h6");
    const enhancementsLink = document.createElement("a");
    enhancementsLink.href = "#enhancements-1";
    enhancementsLink.innerText = "Enhancements";
    enhancements.append(enhancementsLink);
    const li2 = document.createElement("li");
    li2.append(enhancements)
    nav.append(li2);
    
    const resources = document.createElement("h6");
    const resourcesLink = document.createElement("a");
    resourcesLink.href = "##additional-resources-1";
    resourcesLink.innerText = "Additional Resources";
    resources.append(resourcesLink);
    const li3 = document.createElement("li");
    li3.append(resources)
    nav.append(li3);
    return(nav);
};

export default {
  transformDOM: ({ document }) => {
    const main = document.querySelector('main');
    //create the container div/section
    const section = document.createElement('div');
    const sectionBreak = document.createElement('hr');
    // fixLinks(document);
    

    const highlight = document.querySelector('div.parsys_column.cq-colctrl-lt13 div.parsys_column.cq-colctrl-lt13-c0 div.text.parbase.section');
    // console.log(highlight.innerText.trim().replaceAll(" ","-").replaceAll(":","").toLowerCase());
    const title = highlight.cloneNode(true)
    title.className = "";
    if (highlight) section.append(title);


    const topSectionMeta = createDoublSM(document, 'purple-blue-gradient, background-image-narrow, text-light, section-padding-small, text-75');
    if(topSectionMeta) section.append(topSectionMeta);

    section.append(document.createElement('hr'));

    
    const nav = createTable(document);
    section.append(nav);

    const rule = createInternalDivider(document);
    section.append(rule);


    const sectionMetadata = createSM(document, 'text-center, jump-nav, block-padding-none');
    if(sectionMetadata) section.append(sectionMetadata);

    section.append(document.createElement('hr'));

    const essentials = document.createElement("h2");
    essentials.innerText = "The Essentials";
    section.append(essentials)


    const Top = createSection(document, document.querySelectorAll("div.par.parsys div.parsys_column.cq-colctrl-lt3")[1]);
    if (Top) section.append(Top);

    const rule2 = createInternalDivider(document);
    section.append(rule2);

    const Enhancements = document.createElement("h2");
    Enhancements.innerText = "Enhancements";
    section.append(Enhancements);

    const middle = createSection(document, document.querySelectorAll("div.par.parsys div.parsys_column.cq-colctrl-lt3")[2]);
    if (middle) section.append(middle);

    const rule3 = createInternalDivider(document);
    section.append(rule3);

    const Resources = document.createElement("h2");
    Resources.innerText = "Additional Resources";
    section.append(Resources);

    const bottom = createSection(document, document.querySelectorAll("div.par.parsys div.parsys_column.cq-colctrl-lt3")[3]);
    if (bottom) section.append(bottom);
    
    const sectionMetadata3 = createSM(document, 'text-center, text-link-caret-left, section-top-padding-xsmall');
    if(sectionMetadata3) section.append(sectionMetadata3);

    section.append(document.createElement('hr'));

    const question = document.createElement("p");
    const link = document.createElement("a");
    link.href = "/en/academic/contact-academic";
    link.innerText = "Have a Question? Contact us";
    question.append(link);
    section.append(question);

    const sectionMetadata4 = createSM(document, 'button-center, text-link-large, gray');
    if(sectionMetadata4) section.append(sectionMetadata4);
  
    const meta = createMetadataBlock(document);
    if (meta) section.append(meta);
    
    main.innerHTML = '';
    main.append(section);
    return main;
  },
};
