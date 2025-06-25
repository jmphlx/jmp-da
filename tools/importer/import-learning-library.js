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

const createTopic = (document) => {
  const doc = {};
  const cells = [
    ['columns (clm-33-66)'],
  ]
  
  const lhText = document.querySelector('div.parsys_column.cq-colctrl-lt14 div.parsys_column.cq-colctrl-lt14-c0');


  var children = lhText.children;
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    if (child.className === "horizontalline parbase section") {
      child.replaceWith(document.createElement('hr'));
    };
    // Do stuff
  }

  // console.log(lhText);
  console.log("Tad Look here");
  console.log(lhText);
  // lhText.firstElementChild.setAttribute('data-asset',"https://www.jmp.com" + lhText.firstElementChild.getAttribute("data-asset"));
  // lhText.firstElementChild.firstElementChild.setAttribute('src',lhText.firstElementChild.getAttribute("data-asset"));

  // console.log(lhText.innerHTML);

  const rhDiv = document.createElement("div");
  rhDiv.append(document.createElement('hr'));
  const rhText = document.querySelector('div.parsys_column.cq-colctrl-lt14-c1');
  var children = rhText.children;
  console.log(children);

  if (children[0].className === "text parbase section") {
    rhDiv.append(children[0]);
    const paragraph = document.createElement("h3");
    const link = document.createElement("a");
    console.log(children);
    link.innerText = children[0].firstElementChild.firstElementChild.getAttribute("data-video-id");
    link.href = children[0].firstElementChild.firstElementChild.getAttribute("data-video-id");
    paragraph.append(link);
    rhDiv.append(paragraph);
    console.log(link);
    console.log("DREW LOOK HERE");
    console.log(rhText);
    console.log(paragraph);
    console.log(rhDiv);
  };

  if (children[0].className === "horizontalline parbase section") {
    rhDiv.append(children[1]);
    const paragraph = document.createElement("p");
    const link = document.createElement("a");
    console.log(children);
    link.innerText = children[1].firstElementChild.firstElementChild.getAttribute("data-video-id");
    link.href = children[1].firstElementChild.firstElementChild.getAttribute("data-video-id");
    paragraph.append(link);
    rhDiv.append(paragraph);
    console.log("DREW LOOK HERE");
    console.log(rhText);
    console.log(paragraph);
    console.log(rhDiv);
  };
  

  cells.push([lhText, rhDiv]);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
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


const createSM = (document, style) => {
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

    const fragment = createFragment(document, 'https://main--jmp-da--jmphlx.hlx.live/fragments/en/learning-library/mini-nav');
    if (fragment) section.append(fragment);

    const sectionMetadata = createSM(document, 'blue-purple-gradient, subnav-compact, light-nav');
    if(sectionMetadata) section.append(sectionMetadata);

    section.append(document.createElement('hr'));

    const title = createTitle(document);
    if (title) section.append(title);

    const sectionMetadata2 = createSM(document, 'section-padding-none');
    if(sectionMetadata2) section.append(sectionMetadata2);

    section.append(document.createElement('hr'));

    const bio = createTopic(document);
    if (bio) section.append(bio);

    const sectionMetadata3 = createSM(document, 'section-padding-medium');
    if(sectionMetadata3) section.append(sectionMetadata3);

    section.append(sectionBreak);

    const fragment2 = createFragment(document, 'https://main--jmp-da--jmphlx.hlx.live/fragments/en/learning-library/pdf-bundle');
    if (fragment2) section.append(fragment2);

    const sectionMetadata4 = createSM(document, 'text-center, button-center, gray');
    if(sectionMetadata4) section.append(sectionMetadata4);
  
    const meta = createMetadataBlock(document);
    if (meta) section.append(meta);
    
    main.innerHTML = '';
    main.append(section);
    return main;
  },
};
