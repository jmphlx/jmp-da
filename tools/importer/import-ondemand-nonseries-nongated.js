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

const createEmbed = (document, video) => {
  const cells = [
    ['embed'],
  ]
  const lhText = document.querySelector('div.parsys_column.cq-colctrl-lt8-c1 div.styledcontainer.parbase div.container.shaded.rounded.bordered div.par.parsys div.videoBrightcove.section');
  console.log("LOOK HERE IT SHOULD BE THE VIDEO ID");
  

  const link = video.firstElementChild.firstElementChild.getAttribute("data-video-id");
  console.log(link);


  const anchor = document.createElement('a');
  anchor.href = link;
  anchor.innerText = link;
  cells.push([anchor]);

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
  pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com/content/dam/jmp/images/data-viz/jmp-data-viz-city-background.png";

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


const createLeftHandRail = (document) => {
  const column = document.querySelectorAll("div.parsys_column.cq-colctrl-lt8 div.parsys_column.cq-colctrl-lt8-c0")[0];
  column.className = "";
  console.log("DREW LOOK HERE")
  console.log(column);
  const content = document.createElement("div");
  const children = column.children;
  console.log("DREW LOOK HERE");
  console.log(column);
  console.log(children);

  for (var i = 0; i < children.length; i++) {
    console.log(children[i]);
    if (children[i].className === "text parbase section") {
      console.log("just text");
      let doohikey = children[i].cloneNode(true);
      content.append(doohikey);
      console.log(children);
    };

    if (children[i].className === "textimage parbase section") {
      console.log("text and image");
      let speaker = createInlineSpeaker(document,children[i]);
      content.append(speaker);
    };

    if (children[i].className === "videoBrightcove section") {
      console.log("video");
      let speaker = createEmbed(document, children[i]);
      content.append(speaker);
    };

    if (children[i].className === "horizontalline parbase section") {
      content.append(createInternalDivider(document));
    };
  };
  return content;

};

const createInlineSpeaker = (document, column) => {
  const cells = [['columns (image-float, image-size-medium, block-top-padding-small)'],]
  const content = document.createElement("div");
  
  console.log(column.firstElementChild.firstElementChild.firstElementChild);

  

  const pic = document.createElement("img");

  const originPic = column.firstElementChild.firstElementChild.firstElementChild;
  console.log("this is the pic");
  console.log(originPic);
  if (originPic.hasAttribute("data-asset")){
    pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com" +originPic.getAttribute("data-asset");
  } else {
    pic.src = "https://www.jmp.com" + originPic.getAttribute("src");
  }

  console.log(pic);

  content.append(pic);
  const paragraphs = column.firstElementChild.children;
  const thingy = paragraphs[1].cloneNode(true);
  console.log("this should be the text")
  console.log(paragraphs[1]);
  content.append(thingy);
  cells.push([content]);

  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
  };

const createSpeaker = (document, speaker) => {
  const cells = [['columns (image-size-small, block-top-padding-small)'],]
  const paragraphs = speaker.children;
  const pic = document.createElement("img");
  const originPic = paragraphs[0].firstElementChild;
  if (originPic.hasAttribute("data-asset")){
    pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com" +originPic.getAttribute("data-asset");
  } else {
    pic.src = "https://www.jmp.com" + originPic.getAttribute("src");
  }

  
  // pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com" + paragraphs[0].firstElementChild.getAttribute("data-asset");

  
  console.log(pic);

  cells.push([pic,paragraphs[1]]);

  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
  };

const createFinalSpeaker = (document, speaker) => {
  const cells = [['columns (image-size-small, block-top-padding-small, block-padding-small)'],]
  const paragraphs = speaker.children;
  const pic = document.createElement("img");
  pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com" + paragraphs[0].firstElementChild.getAttribute("data-asset");

  
  console.log(pic);

  cells.push([pic,paragraphs[1]]);

  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
  };

const createRighthandRail = (document) => {
  const column = document.querySelector("div.parsys_column.cq-colctrl-lt8 div.parsys_column.cq-colctrl-lt8-c1");
  column.className = "";
  console.log("DREW LOOK HERE")
  console.log(column);
  const content = document.createElement("div");
  const children = column.children;
  console.log("DREW LOOK HERE");
  console.log(column);
  console.log(children);

  for (var i = 0; i < children.length; i++) {
    console.log(children[i]);
    if (children[i].className === "text parbase section") {
      console.log("just text");
      let doohikey = children[i].cloneNode(true);
      content.append(doohikey);
      console.log(children);
    };

    if (children[i].className === "textimage parbase section") {
      console.log("text and image");
      let speaker = createInlineSpeaker(document,children[i]);
      content.append(speaker);
    };

    if (children[i].className === "videoBrightcove section") {
      console.log("video");
      let speaker = createEmbed(document, children[i]);
      content.append(speaker);
    };

    if (children[i].className === "horizontalline parbase section") {
      content.append(createInternalDivider(document));
    };

    if (children[i].className === "btn parbase") {
      content.append(createButtonLink(document));
    };
  };
  return content;

};

const createButtonLink = (document) => {
  const cells = [
    ['columns (button-center)'],
  ]
  const anchor = document.createElement('a');
  anchor.href = "/en/software/collaborative-analytics-software";
  anchor.innerText = "About JMP Live";
  cells.push([anchor]);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};


export default {
  transformDOM: ({ document }) => {
    const main = document.querySelector('main');
    //create the container div/section
    const section = document.createElement('div');
    const sectionBreak = document.createElement('hr');
    
    
    const subheader = document.createElement('h6');
    subheader.innerText = "ON-DEMAND WEBINAR";
    if (subheader) section.append(subheader);

    const highlight = document.querySelector('div.container.marquee div.par.parsys div.text.parbase.section div h1');
    console.log(highlight.innerText.trim().replaceAll(" ","-").replaceAll(":","").toLowerCase());
    highlight.classList.remove("nametag");
    if (highlight) section.append(highlight);


    const topSectionMeta = createDoublSM(document, 'purple-orange-gradient, background-image, text-light, section-padding-small');
    if(topSectionMeta) section.append(topSectionMeta);

    section.append(document.createElement('hr'));


    const fragment = createFragment(document, `https://main--jmp-da--jmphlx.hlx.live/fragments/en/resources/resource-back-button`);
    if (fragment) section.append(fragment);

    const sectionMetadata = createSM(document, 'text-link-back, section-padding-none, section-top-padding-small');
    if(sectionMetadata) section.append(sectionMetadata);

    section.append(document.createElement('hr'));

    

    const lhrail = createLeftHandRail( document);
    console.log(lhrail)
    if (lhrail) section.append(lhrail);

    // const internalDivider = createInternalDivider(document);
    // if (internalDivider) section.append(internalDivider);
    

    const divider = createDivider(document);
    if (divider) section.append(divider);


    const hubspot = createRighthandRail(document);
    if (hubspot) section.append(hubspot);
    
    const sectionMetadata3 = createDoublSM2(document, 'columns-60-40, section-top-padding-small, section-padding-large, form-content-right');
    if(sectionMetadata3) section.append(sectionMetadata3);
  
    const meta = createMetadataBlock(document);
    if (meta) section.append(meta);
    
    main.innerHTML = '';
    main.append(section);
    return main;
  },
};
