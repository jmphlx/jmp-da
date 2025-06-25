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

const createEmbed = (document, link) => {
  const cells = [
    ['embed'],
  ]
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
  pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com/content/dam/jmp/images/industry/chemical-image.png";

  cells.push(['background-image', pic]);
  cells.push(['Style', style]);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

const createColumns = (document, style) => {
  const cells = [
    ['columns (clm-50-50)'],
  ]

  cells.push(['','' ]);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

const createColumns2 = (document, style) => {
  const cells = [
    ['columns (text-grid, text-left)'],
  ]

  cells.push(['','' ]);
  cells.push(['','' ]);
  cells.push(['','' ]);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

const createListgroup = (document, style) => {
  const cells = [
    ['listgroup-fixed (listgroup-center)'],
  ]

  cells.push(['displayProperties','' ]);
  cells.push(['pages','' ]);
  cells.push(['emptyResultsMessage','Sorry, there are no resources at this time.' ]);
  cells.push(['columns','4' ]);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

const createROI = (document, style) => {
  const cells = [
    ['columns (roi-colors)'],
  ]

  const left = document.querySelector("div.styledcontainer.parbase div.container.brand-neutral-dark.roi-block div.par.parsys div.text.parbase.section div.roi-grid div.subhead-orangesicle");
  const middle = document.querySelector("div.styledcontainer.parbase div.container.brand-neutral-dark.roi-block div.par.parsys div.text.parbase.section div.roi-grid div.subhead-teal");
  const right = document.querySelector("div.styledcontainer.parbase div.container.brand-neutral-dark.roi-block div.par.parsys div.text.parbase.section div.roi-grid div.subhead-purple");

  cells.push([left.cloneNode(true),middle.cloneNode(true),right.cloneNode(true) ]);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

const createDoublSM3 = (document, style) => {
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
  cells.push(['layout', "2 column"]);
  cells.push(['Style', style]);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

const createContent = (document) => {
  // const body = 
  const content = document.createElement("div");

  // console.log(body);
  // console.log(body.children);

  const children = document.querySelectorAll("div.par.parsys div.styledcontainer.parbase");
;
  for (var i = 0; i < children.length; i++) {
    const kid = children[i].cloneNode(true);
    console.log(kid)



    if (kid.className === "styledcontainer parbase") {
      const peek = kid.firstElementChild;
      console.log(peek.className);
      if (peek.className === "container float-right aside "){
        const col2 = children[i+1].cloneNode(true);
        const blueBoy = createBlueColumns(document,kid, col2);
        content.append(blueBoy);
        i += 1;
        console.log(i);
      } else if (peek.className === "container compact aside "){
        const blueGirl = createBlueSection(document,peek);
        content.append(blueGirl);
      }else if (peek.className === "container  aside "){
        const accordion = createStyledAccordion(document,peek);
        content.append(accordion);
      }else if (peek.className === "container  library-item "){
        content.append(peek);
      };

    }else if (kid.className === "text parbase section"){
      if (kid.firstElementChild.className ==="boxed"){
        console.log("that top section");
        const topper = createTopper(document, kid);
        content.append(topper);
      } else if (kid.firstElementChild.firstElementChild){
        if (kid.firstElementChild.firstElementChild.tagName === "TABLE"){
          console.log("DREW LOOK WE DID IT WILD SUCCESS!!!!!");
          const myTable = createMyTable(document,kid.firstElementChild.firstElementChild.firstElementChild);
          content.append(myTable);
        }else{content.append(kid);};

      }else{
        console.log("regular text");
        content.append(kid);
      };
    } else if (kid.className === "image parbase section"){
      const pic = document.createElement("img");
      console.log("the image");
      if (kid.children[1].firstElementChild.hasAttribute("data-asset")){
        pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com" +kid.children[1].firstElementChild.getAttribute("data-asset");
      } else {
        pic.src = "https://www.jmp.com" + originPic.getAttribute("src");
      }
      content.append(pic);
      if (kid.children[1].children[1]){
        const caption = createCaption(document,kid.children[1].children[1].innerText);
        content.append(caption);
      };
    }else if (kid.className === "accordion parbase"){
      const accordion = createAccordion(document,kid);
      content.append(accordion);
    } else if (kid.className === "lightbox section"){
      if (kid.firstElementChild.className === "screenshot "){
        const pic = document.createElement("img");
        console.log("the image");
        const originPic = kid.querySelectorAll("span[data-cmp-src]");
        console.log(kid);
        console.log(originPic);
        pic.src = "https://www.jmp.com" + originPic[0].getAttribute("data-cmp-src");
        content.append(pic);
        console.log(pic);
      }else if (kid.firstElementChild.className === "video "){
        const placeholder = kid.querySelectorAll("iframe[src]");
        console.log("THIS IS THE VIDEO");
        console.log(placeholder);
        const link = placeholder[0].getAttribute("src");
        const embed = createEmbed(document,link);
        content.append(embed);
      };
    };

  };

  

  return(content);
};


const createMyTable = (document,section) => {
  const cells = [['table (table, striped)'],];

  console.log(section);


  const content = [];
  const children = section.children
  for (var i = 0; i < children.length; i++) {
    const myRow = []
    const row = children[i];
    const inCells = row.children;
    for (let cell of inCells){
      myRow.push(cell.innerText);
    };
    cells.push(myRow);
  };



  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};

const createStyledAccordion = (document, section) => {
  const cells = [['accordion (skp-blue-accordion)'],];

  let accordion = null;

  if (section.children[1].firstElementChild.className === "accordionwrapper parbase"){
    accordion = section.children[1].firstElementChild.firstElementChild.firstElementChild.firstElementChild;
  }else {
    console.log("this should have ran ");
    accordion = section.children[1];
  };
  
  const header = accordion.children[0];
  const title = document.createElement("h3");
  const style = document.createElement("b");
  style.innerText = header.innerText;
  title.append(style);

  const summary = accordion.children[1];
  const children = summary.firstElementChild.children;
  const content = document.createElement("div");
  for (var i = 0; i < children.length; i++) {
    const kid = children[i].cloneNode(true);
    if (kid.className === "text parbase section"){
        content.append(kid);
    } else if (kid.className === "image parbase section"){
      const pic = document.createElement("img");
      console.log("the image");
      if (kid.children[1].firstElementChild.hasAttribute("data-asset")){
        pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com" +kid.children[1].firstElementChild.getAttribute("data-asset");
      } else {
        pic.src = "https://www.jmp.com" + originPic.getAttribute("src");
      }
      content.append(pic);
      if (kid.children[1].children[1]){
        const caption = document.createElement("p");
        const italics = document.createElement("i");
        italics.innerText = kid.children[1].children[1].innerText;
        caption.append(italics);
        content.append(caption);
      };
    };
  };

  const output = [title,content];
  cells.push(output);

  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};

const createAccordion = (document, section) => {
  const cells = [['accordion (skp-blue-accordion)'],];

  const accordion = section
  
  const header = accordion.children[0];
  const title = document.createElement("h3");
  const style = document.createElement("b");
  style.innerText = header.innerText;
  title.append(style);

  const summary = accordion.children[1];
  const children = summary.firstElementChild.children;
  const content = document.createElement("div");
  for (var i = 0; i < children.length; i++) {
    const kid = children[i].cloneNode(true);
    if (kid.className === "text parbase section"){
        content.append(kid);
    } else if (kid.className === "image parbase section"){
      const pic = document.createElement("img");
      console.log("the image");
      if (kid.children[1].firstElementChild.hasAttribute("data-asset")){
        pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com" +kid.children[1].firstElementChild.getAttribute("data-asset");
      } else {
        pic.src = "https://www.jmp.com" + originPic.getAttribute("src");
      }
      content.append(pic);
      if (kid.children[1].children[1]){
        const caption = document.createElement("p");
        const italics = document.createElement("i");
        italics.innerText = kid.children[1].children[1].innerText;
        caption.append(italics);
        content.append(caption);
      };
    };
  };

  const output = [title,content];
  cells.push(output);

  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};



const createBlueSection = (document, stuff) => {
  const cells = [['columns (skp-blue-column, no-gray-border)'],];

  const content = document.createElement("div");
  const children = stuff.children[1].children;
  for (var i = 0; i < children.length; i++) {
    const kid = children[i].cloneNode(true);
    if (kid.className === "text parbase section"){
        content.append(kid);
    } else if (kid.className === "image parbase section"){
      const pic = document.createElement("img");
      console.log("the image");
      if (kid.children[1].firstElementChild.hasAttribute("data-asset")){
        pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com" +kid.children[1].firstElementChild.getAttribute("data-asset");
      } else {
        pic.src = "https://www.jmp.com" + originPic.getAttribute("src");
      }
      content.append(pic);
      if (kid.children[1].children[1]){

        const caption = document.createElement("p");
        const italics = document.createElement("i");
        italics.innerText = kid.children[1].children[1].innerText;
        caption.append(italics);
        content.append(caption);
      };
    };
  };

  const output = [content];
  cells.push(output);

  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};

const createCaption = (document, text) => {
  const cells = [['columns (figure, text-center)'],];
  const caption = document.createElement("p");
  const italics = document.createElement("i");
  italics.innerText = text;
  caption.append(italics);

  const content = [caption];
  cells.push(content);

  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};

const createTopper = (document, section) => {
  const cells = [['columns (box-shadow)'],];

  const content = [section];
  cells.push(content);

  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};


const createBlueColumns = (document, col1,col2) => {
  const cells = [['styled-columns (blue-aside)'],]
  cells.push(["column-blue","column-2"]);
  const leftCol = document.createElement("div");

  const kids = col1.firstElementChild.children[1].children;

  for (let el of kids) {
    if (el.className === "text parbase section"){
      leftCol.append(el.cloneNode(true));
    }  else if (el.className === "videoBrightcove section"){
      const link = el.firstElementChild.firstElementChild.getAttribute("data-video-id");
      const anchor = document.createElement('a');
      anchor.href = link;
      anchor.innerText = link;
      leftCol.append(anchor);
    };
  };

  console.log(leftCol);

  cells.push([leftCol,col2]);

  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);

};


export default {
  transformDOM: ({ document }) => {
    const main = document.querySelector('main');
    //create the container div/section
    const section = document.createElement('div');
    const sectionBreak = document.createElement('hr');
    // fixLinks(document);

    const highlight = document.querySelector('div.styledcontainer.parbase div.container.transom.branding-jmp.feathered-overlay div.par.parsys');
    // console.log(highlight.innerText.trim().replaceAll(" ","-").replaceAll(":","").toLowerCase());
    let title = null;
    if (highlight) {
      title = highlight.cloneNode(true)
      title.className = "";
    };
    
    if (highlight) section.append(title);


    const topSectionMeta = createDoublSM(document, 'blue-purple-gradient, background-image-narrow, text-light, button-light, text-75');
    if(topSectionMeta) section.append(topSectionMeta);

    section.append(document.createElement('hr'));

    const blurb = document.querySelector("div.styledcontainer.parbase div.container.segment.first div.par.parsys div.text.parbase.section div");
    const blurbKid = blurb.cloneNode(true);
    blurbKid.className = "";

    section.append(blurbKid);

    const section2 = createSM(document, 'text-center, gray, section-padding-xsmall');
    if(section2) section.append(section2);

    section.append(document.createElement('hr'));

    const column1 = createColumns(document);
    section.append(column1);

    const column2 = createColumns(document);
    section.append(column2);

    const column3 = createColumns(document);
    section.append(column3);

    const column4 = createColumns(document);
    section.append(column4);




    const section3 = createSM(document, 'block-padding-large, text-vertical-center, text-large');
    if(section3) section.append(section3);

    section.append(document.createElement('hr'));

    const roi = createROI(document);
    section.append(roi);

    const stories = document.querySelector("div.styledcontainer.parbase div.container.brand-neutral-dark.roi-block div.par.parsys div.text.parbase.section div.pivot");
    const link = stories.cloneNode(true);
    link.className = "";
    section.append(link);

    const section4 = createSM(document, 'brand-neutral-dark, text-center, block-padding-small, text-link-light, button-center');
    if(section4) section.append(section4);

    section.append(document.createElement('hr'));

    const capabilities = document.querySelector(" div.par.parsys div.text.parbase.section div h2");
    section.append(capabilities.cloneNode(true));

    const column5 = createColumns2(document);
    section.append(column5);

    const learn  = document.querySelector("div.sub-capability-cards p a");
    section.append(learn.cloneNode(true));

    const section5 = createSM(document, 'text-center, text-link, button-center, section-padding-small');
    if(section5) section.append(section5);

    section.append(document.createElement('hr'));


    const empower = document.querySelector("div.styledcontainer.parbase div.container.tile-3 div.par.parsys div.text.parbase.section div h2");
    section.append(empower.cloneNode(true));

    const listgroup = createListgroup(document);
    section.append(listgroup);

    const resources = document.querySelector("div.styledcontainer.parbase div.container.tile-3 div.par.parsys div.text.parbase.section div.sub-capability-cards p a");
    section.append(resources.cloneNode(true));

    const section6 = createSM(document, 'text-link, heading-center, gray, section-padding-xsmall, button-center');
    if(section6) section.append(section6);

    section.append(document.createElement('hr'));
    
    const discoveries = document.querySelector("div.styledcontainer.parbase div.container.transom.branding-jmp div.par.parsys div.text.parbase.section div.dark-button-center");
    const buttons  = discoveries.cloneNode(true);
    buttons.className = "";
    section.append(buttons);


    const sectionMetadata = createDoublSM3(document, 'blue-purple-gradient, text-light, text-center, button-light, background-image, button-center, section-padding-xsmall');
    if(sectionMetadata) section.append(sectionMetadata);

    
    const meta = createMetadataBlock(document);
    if (meta) section.append(meta);
    
    main.innerHTML = '';
    main.append(section);
    return main;
  },
};
