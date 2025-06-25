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
const createFragment = (document) => {
  const cells = [
    ['fragment'],
  ]
  const anchor = document.createElement('a');
  anchor.href = 'https://main--jmp-da--jmphlx.hlx.live/fragments/en/resources/customer-stories-back-button';
  anchor.innerText = 'https://main--jmp-da--jmphlx.hlx.live/fragments/en/resources/customer-stories-back-button';
  cells.push([anchor]);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};

const createHero = (document) => {
  const doc = {};
  const cells = [
    ['columns (success-story-hero)'],
  ]
  //grab hero image
  const heroCss = '#content div#page-content.par div#par div.par.parsys div.styledcontainer.parbase div.container.article-template.article-title div.par.parsys div.parsys_column.cq-colctrl-lt0';
  const hero = document.querySelector(heroCss);
  if (hero){
    //grab right hand text 
    const rhText = hero.querySelector('#customer-story.container div.par.parsys div.text.parbase.section');
    const lefty = document.createElement("div");
    const lhText = document.createElement("img");
    const originPic = document.querySelector("div.parsys_column.cq-colctrl-lt0-c1 div.image.parbase.section div");
    if (originPic.firstElementChild.hasAttribute("data-asset")){
      lhText.src = "https://publish-p107857-e1299068.adobeaemcloud.com" +originPic.firstElementChild.getAttribute("data-asset");
    } else {
      lhText.src = "https://www.jmp.com" + originPic.firstElementChild.getAttribute("src");
    }
    console.log("pics");
    console.log(originPic);
    console.log(lhText);
    lefty.append(lhText);
    lefty.append(originPic.children[1]);

    // let images = lhText.getElementsByTagName("img");
    // console.log(images);
    // for (let el of images) {
    //   el.setAttribute('src',"https://www.jmp.com" + el.getAttribute("src"));
    // };
    cells.push([rhText, lhText]);
  }
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
  const lhRail = document.querySelector('div.parsys_column.cq-colctrl-lt1.cols-halfgutter div.parsys_column.cq-colctrl-lt1-c0');
  if (lhRail){
    const content = document.createElement("div");
    console.log(lhRail);
    const children = lhRail.children;
    for (var i = 0; i < children.length; i++) {
      const kid = children[i].cloneNode(true);
      console.log("this is kid " + i);
      console.log(kid)

      if (kid.className === "text parbase section"){
        content.append(kid);
      } else if (kid.className === "image parbase section"){
        const pic = document.createElement("img");
        console.log("the image");
        console.log(kid.children[1].firstElementChild);
        if (kid.children[1].firstElementChild.hasAttribute("data-asset")){
          console.log("we have a real data asset");
          pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com" +kid.children[1].firstElementChild.getAttribute("data-asset");
        } else {
          console.log("someone copy/pasted");
          pic.src = "https://www.jmp.com" + kid.children[1].firstElementChild.getAttribute("src");
        }
        content.append(pic);
        if (kid.children[1].children[1]){
          const caption = createCaption(document,kid.children[1].children[1].innerText);
          content.append(caption);
        };
      }
    

    
  }
  return content;
}
  //if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};

const createRightHandRail = (document) => {
  const rhRail = document.querySelector('div.parsys_column.cq-colctrl-lt1.cols-halfgutter div.parsys_column.cq-colctrl-lt1-c1 div.text.parbase.section div');
  if (rhRail){
   //console.log(rhRail.innerHTML);
   return rhRail;
  }
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
  cells.push(['Style', 'success-story-body, columns-25-75']);
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

    const vidHero = createHero(document);
    console.log(vidHero.innerText);
    if (vidHero) section.append(vidHero);

    section.append(document.createElement('hr'));

    const lhrail = createLeftHandRail( document,);
    console.log(lhrail);
    if (lhrail) section.append(lhrail);

    const divider = createDivider(document);
    if (divider) section.append(divider);

    const rightHR = createRightHandRail(document);
    if (rightHR) section.append(rightHR);

    const button = createButtonLink(document);
    if (button) section.append(button);

    const sectionMetadata = createSM(document);
    if(sectionMetadata) section.append(sectionMetadata);

    section.append(sectionBreak);
  
    const meta = createMetadataBlock(document);
    if (meta) section.append(meta);
    
    main.innerHTML = '';
    main.append(section);
    return main;
  },
};
