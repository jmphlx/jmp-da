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
    meta.resourceType.push("Case Study");
    const displayLabel = document.getElementsByTagName("h6");
    console.log("this is the display label");
    console.log(displayLabel);
    meta.displayLabel = displayLabel[0].innerText;
    meta.resourceOptions = [];
    meta.application = [];
    meta.course = [];
    meta.userLevel = [];
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

          if (el.content.split(splitChar).length === 4){
            if (el.content.split(splitChar)[2] == 'By Application'){
              console.log(el.content.split(splitChar));
              meta.application.push(el.content.split(splitChar)[3] + ",");
            };
            if (el.content.split(splitChar)[2] == 'By Level'){
              meta.userLevel.push(el.content.split(splitChar)[3] + ",");
            };
        };
          if (el.content.split(splitChar).length === 3){
            if (el.content.split(splitChar)[1] == 'Topic'){
              meta.course.push(el.content.split(splitChar)[2] + ",");
          };
        }
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

const createFragment = (document) => {
  const cells = [
    ['fragment'],
  ]
  const anchor = document.createElement('a');
  anchor.href = 'https://main--jmp-da--jmphlx.hlx.live/fragments/en/academic/case-studies-back-button';
  anchor.innerText = 'https://main--jmp-da--jmphlx.hlx.live/fragments/en/academic/case-studies-back-button';
  cells.push([anchor]);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};

const createHero = (document) => {
  const doc = {};
  const cells = [
    ['columns (success-story-hero, text-link-caret-left, block-top-padding-small)'],
  ]
  //grab hero image

  const lhText = document.querySelector('div.parsys_column.cq-colctrl-lt0 div.parsys_column.cq-colctrl-lt0-c0');

  const links = lhText.getElementsByTagName("a");
  console.log("Hero Links");
  console.log(links);
  for (let link of links) {
    const path = link.href.slice(21,link.href.length);
    link.href = "https://edge-www.jmp.com" + path;
  };

  const rhText = document.querySelector('div.parsys_column.cq-colctrl-lt0 div.parsys_column.cq-colctrl-lt0-c1');
  let images = lhText.getElementsByTagName("img");
  console.log(images);
  for (let el of images) {
    el.setAttribute('src',"https://www.jmp.com" + el.getAttribute("src"));
  };
  const pic = document.createElement("img");
  const originPic = rhText.firstElementChild.children[1].firstElementChild;
  console.log("this is the pic");
  console.log(originPic);
  if (originPic.hasAttribute("data-asset")){
    pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com" +originPic.getAttribute("data-asset");
  } else {
    pic.src = "https://www.jmp.com" + originPic.getAttribute("src");
  }
  console.log(pic);

  cells.push([lhText.cloneNode(true), pic]);
  
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
  const content = document.createElement("div");
  const lhRail = document.querySelector('div.parsys_column.cq-colctrl-lt1 div.parsys_column.cq-colctrl-lt1-c0');
  const kids = lhRail.children;
  for (var i = 0; i < kids.length; i+=2) {
    const pic = document.createElement("img");
    const originPic = kids[i].children[1].firstElementChild;
    console.log("this is the pic");
    console.log(originPic);
    if (originPic.hasAttribute("data-asset")){
      pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com" +originPic.getAttribute("data-asset");
    } else {
      pic.src = "https://www.jmp.com" + originPic.getAttribute("src");
    }
    console.log(pic);
    const text = kids[i+1];
    console.log(text);
    content.append(createAuthor(document, pic,text.cloneNode(true)));

  };
  return content;

};

const createRightHandRail = (document) => {
  const rhRail = document.querySelector('div.parsys_column.cq-colctrl-lt1 div.parsys_column.cq-colctrl-lt1-c1');
  const links = rhRail.getElementsByTagName("a");
  console.log("Hero Links");
  console.log(links);
  for (let link of links) {
    const path = link.href.slice(21,link.href.length);
    link.href = "https://edge-www.jmp.com" + path;
  };
  const content = document.createElement("div");
  const kids = rhRail.children;
  for (let el of kids) {
    if (el.className === "horizontalline parbase section") {
      content.append(createInternalDivider(document));
    } else {
      content.append(el.cloneNode(true));
    };
  };

  return content;
};

const createInternalDivider = (document) => {
  const cells = [
    ['horizontal-rule (rule-padding-small)'],
  ]
  return WebImporter.DOMUtils.createTable(cells, document);
};

const createAuthor = (document, image, text) => {
  const cells = [['columns (author-bio-small)']]
  console.log("author elelments");

  cells.push([image,text]);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
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
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

const createSM = (document) => {
  const cells = [
    ['section-metadata'],
  ]

  cells.push(['layout','2 Column']);
  cells.push(['Style', 'columns-25-75, text-link-caret-left, section-padding-large']);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

const createSectionMetadata = (document, style) => {
  const cells = [
    ['section-metadata'],
  ]

  cells.push(['Style', style]);
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

    const sectionMetadata = createSectionMetadata(document, 'gray, section-top-padding-small, section-padding-none');
    if(sectionMetadata) section.append(sectionMetadata);

    section.append(document.createElement('hr'));

    const vidHero = createHero(document);
    if (vidHero) section.append(vidHero);

    const sectionMetadata2 = createSectionMetadata(document, 'text-link-caret-left, section-top-padding-none');
    if(sectionMetadata2) section.append(sectionMetadata2);

    section.append(document.createElement('hr'));

    const lhrail = createLeftHandRail( document,);
    console.log(lhrail);
    if (lhrail) section.append(lhrail);

    const divider = createDivider(document);
    if (divider) section.append(divider);

    const rightHR = createRightHandRail(document);
    if (rightHR) section.append(rightHR);

    const sectionMetadata3 = createSM(document);
    if(sectionMetadata3) section.append(sectionMetadata3);
  
    const meta = createMetadataBlock(document);
    if (meta) section.append(meta);
    
    main.innerHTML = '';
    main.append(section);
    return main;
  },
};
