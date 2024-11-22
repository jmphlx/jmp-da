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
  pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com/content/dam/jmp/images/events/statistically-speaking/statspeak-events-background.png";

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

const createHubspot = (document, redirectTarget) => {
  const cells = [
    ['hubspot'],
  ]
  const headline = document.createElement("h5")
  headline.innerText = "Register to view the keynote and panel discussion.";
  cells.push(['headline', headline]);
  cells.push(['region', "na1"]);
  cells.push(['Portal ID', "20983899"]);
  cells.push(['Form ID', "0c4fb313-4d9e-4f03-a46c-86c000e70171"]);
  cells.push(['lead source', "Webcast (On-Demand)"]);
  cells.push(['Last Action', "Webcast (On-Demand)"]);
  cells.push(['salesforce campaign id', "7017h0000016z4iAAA"]);
  cells.push(['redirectTarget', redirectTarget]);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

const createLeftHandRail = (document) => {
  const column = document.querySelectorAll("div.parsys_column.cq-colctrl-lt8 div.parsys_column.cq-colctrl-lt8-c0")[1];
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

    // if (i === 0) {
    //   content.append(createInternalDivider(document));
    // };
  };
  return content;

};

const createInlineSpeaker = (document) => {
  const cells = [['columns (image-float, image-size-medium, block-top-padding-small)'],]
  const content = document.createElement("div");
  const pic = document.createElement("img");

  const originPic = document.querySelector("div.par.parsys div.styledcontainer.parbase div.container.boxed.form-container div.par.parsys div.styledcontainer.parbase div.container div.par.parsys div.image.parbase.section div").firstElementChild;
  console.log("this is the pic");
  console.log(originPic);
  if (originPic.hasAttribute("data-asset")){
    pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com" +originPic.getAttribute("data-asset");
  } else {
    pic.src = "https://www.jmp.com" + originPic.getAttribute("src");
  }

  console.log(pic);

  content.append(pic);
  const paragraphs = document.querySelector("div.par.parsys div.styledcontainer.parbase div.container.boxed.form-container div.par.parsys div.styledcontainer.parbase div.container div.par.parsys div.text.parbase.section div");
  // const thingy = paragraphs[1].cloneNode(true);
  // console.log("this should be the text")
  // console.log(paragraphs[1]);
  console.log("This is the text in the first panel")
  console.log(paragraphs);

  const headers = paragraphs.querySelectorAll('h5');

  headers.forEach((elem) => {

    elem.outerHTML = "<h6><strong>" + elem.innerHTML + '</strong></h6>';
    console.log(elem);
  });
  content.append(paragraphs);
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

  console.log(pic);
  
  console.log(paragraphs[1]);

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

const createPanel = (document) => {
  const cells = [['columns (block-top-padding-small)'],]
  const text = document.querySelectorAll("div.par.parsys div.styledcontainer.parbase div.container.boxed div.par.parsys div.text.parbase.section");
  console.log("this is the text in the second panel");
  console.log(text[1]);

  const headers = text[1].querySelectorAll('h5');

  headers.forEach((elem) => {

    elem.outerHTML = "<h6><strong>" + elem.innerHTML + '</strong></h6>';
  });


  

  cells.push([text[1].cloneNode(true)]);

  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
  };

const createDiscussion = (document) => {
  const cells = [['columns (block-top-padding-small)'],]
  const text = document.querySelectorAll("div.par.parsys div.styledcontainer.parbase div.container.boxed div.par.parsys div.text.parbase.section");
  const content = document.createElement("div");
  console.log("DREW LOOK HERE");
  console.log(text);
  const headers = text[2].querySelectorAll('h3');

  headers.forEach((elem) => {

    elem.outerHTML = "<h6><strong>" + elem.innerHTML + '</strong></h6>';
  });
  content.append(text[2].cloneNode(true));

  const vid = document.querySelector("div.videoBrightcove.section");
  const vid2 = document.querySelector("div.brightcoveplayer.section div");

  const pic = document.querySelector("div.styledcontainer.parbase div.container.sub-container div.par.parsys div.image.parbase.section div");
  console.log(pic);
  console.log("this is vid2");
  console.log(vid2);
  if (vid){
    const link = vid.firstElementChild.firstElementChild.getAttribute("data-video-id");
    const anchor = document.createElement("a");
    anchor.href = link;
    anchor.innerText = link;
    console.log(anchor);
    content.append(anchor);
  } if (vid2) {
    const link = vid2.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.getAttribute("data-video-id");
    const anchor = document.createElement("a");
    anchor.href = link;
    anchor.innerText = link;
    console.log(anchor);
    content.append(anchor);
  } if (pic) {
    const image = document.createElement("img");
    if (pic.firstElementChild.hasAttribute("data-asset")){
      image.src = "https://publish-p107857-e1299068.adobeaemcloud.com" + pic.getAttribute("data-asset");
    } else {
      image.src = "https://www.jmp.com" + pic.firstElementChild.getAttribute("src");
      image.title = pic.firstElementChild.getAttribute("alt");
      console.log(image);

    }
    
    content.append(image);

  };
  

  cells.push([content]);


  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
  };

const createRighthandRail = (document) => {
  const column = document.querySelectorAll("div.parsys_column.cq-colctrl-lt8 div.parsys_column.cq-colctrl-lt8-c0 div.textimage.parbase.section");
  console.log(column);
  const content = document.createElement("div");
  
  for (var i = 1; i < column.length; i++) {
    if (i != (column.length-1)){
      let test = createSpeaker(document,column[i].firstElementChild);
      content.append(test);
    } else {
      let test = createFinalSpeaker(document,column[i].firstElementChild);
      content.append(test);
    };

  };


  return content;

};


export default {
  transformDOM: ({ document }) => {
    const main = document.querySelector('main');
    //create the container div/section
    const section = document.createElement('div');
    const sectionBreak = document.createElement('hr');

    console.log("import");
    
    
    const header = document.createElement('p');
    header.innerText = ":statistically-speaking-logo:";
    console.log(header);
    if (header) section.append(header);


    const topSectionMeta = createDoublSM(document, 'dark-blue, background-image, text-light, icon-xxxl, stat-speaking-header, opacity-80');
    if(topSectionMeta) section.append(topSectionMeta);

    section.append(document.createElement('hr'));


    const fragment = createFragment(document, `https://main--jmp-da--jmphlx.hlx.live/fragments/en/resources/resource-back-button`);
    if (fragment) section.append(fragment);

    const sectionMetadata = createSM(document, 'text-link-back, section-padding-none, section-top-padding-small');
    if(sectionMetadata) section.append(sectionMetadata);

    section.append(document.createElement('hr'));

    const subheader = document.createElement('h6');
    subheader.innerText = "ON-DEMAND WEBINAR";
    if (subheader) section.append(subheader);

    const highlight = document.querySelector('div.par.parsys div.text.parbase.section div h1');
    console.log(highlight.innerText.trim().replaceAll(" ","-").replaceAll(":","").toLowerCase());
    highlight.classList.remove("nametag");
    if (highlight) section.append(highlight);

    const lhrail = createInlineSpeaker( document);
    console.log(lhrail)
    if (lhrail) section.append(lhrail);

    // const internalDivider = createInternalDivider(document);
    // if (internalDivider) section.append(internalDivider);
    


    const rhRail = createPanel(document);
    if (rhRail) section.append(rhRail);

    const discussion = createDiscussion(document);
    if (discussion) section.append(discussion);

    const divider = createDivider(document);
    if (divider) section.append(divider);

    const embed = createEmbed(document);
    if (embed) section.append(embed);

    const redirectTarget = `/en/ondemand/technically-speaking/${highlight.innerText.trim().replaceAll(" ","-").replaceAll(":","").toLowerCase()}/watch`;

    const hubspot = createHubspot(document, redirectTarget);
    if (hubspot) section.append(hubspot);
    
    const sectionMetadata3 = createDoublSM2(document, 'columns-60-40, section-top-padding-small, section-padding-large');
    if(sectionMetadata3) section.append(sectionMetadata3);
  
    const meta = createMetadataBlock(document);
    if (meta) section.append(meta);
    
    main.innerHTML = '';
    main.append(section);
    return main;
  },
};
