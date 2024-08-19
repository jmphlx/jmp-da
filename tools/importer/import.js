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

const createHero = (document) => {
  const doc = {};
  const cells = [
    ['columns (video-story-hero)'],
  ]
  //grab hero image
  const heroCss = '#content div#page-content.par div#par div.par.parsys div.styledcontainer.parbase div.container.article-template.article-title div.par.parsys div.parsys_column.cq-colctrl-lt0';
  const hero = document.querySelector(heroCss);
  const lhText = document.querySelector('div.parsys_column.cq-colctrl-lt9 div.parsys_column.cq-colctrl-lt9-c0 div.image.parbase.section div');
  // console.log(lhText);
  console.log("Tad Look here");
  console.log(lhText);
  lhText.firstElementChild.setAttribute('data-asset',"https://www.jmp.com" + lhText.firstElementChild.getAttribute("data-asset"));
  lhText.firstElementChild.firstElementChild.setAttribute('src',lhText.firstElementChild.getAttribute("data-asset"));

  console.log(lhText.innerHTML);
  const rhText = document.querySelector('div.container.article div.par.parsys div.text.parbase.section');
  // console.log(rhText);
  rhText.querySelector('h2').outerHTML = "<p>" + rhText.querySelector('h2').innerHTML + '</p>'
  rhText.querySelector('h6').innerText = "Success Story"
  console.log("here!!!! here!!!!!!");
  console.log(rhText.querySelector('h2'));
  cells.push([rhText, lhText]);
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
  const newDiv = document.createElement("div");
  const tableHeading = document.querySelectorAll('.text.parbase.section tr');
  // console.log(tableHeading);
  tableHeading.forEach((el) => {
    const myh4 = el.querySelector('th');
    const h4 = document.createElement('h4');
    h4.innerHTML = myh4.innerHTML;
    // console.log(h4.innerText);
    newDiv.appendChild(h4);

    const tableText = el.querySelector('td');
    const myP = document.createElement('p');
    myP.innerText = tableText.innerText;
    // console.log(myP.innerText);

    newDiv.appendChild(myP);
    // console.log(newDiv);
  });
  return newDiv;
  };

const createRightHandRail = (document) => {
  const newDiv = document.createElement("div");

  const paragraphs = document.querySelectorAll('.container.article .par.parsys .text.parbase.section div:has(p)');
  paragraphs.forEach((el) => {
    // console.log('This is the header');
    // console.log(el.innerHTML);
    const header = el.querySelector('h3');

    if (header) {
      const myHeader = document.createElement('h3');
      myHeader.innerHTML = header.innerHTML;
      // console.log('Header Ran');
      // console.log(myHeader.innerText);
      newDiv.appendChild(myHeader);
    }
    
    const p = el.querySelectorAll('p');
    p.forEach((elem) => {
      const myP = document.createElement('p');
      myP.innerHTML = elem.innerHTML;
      // console.log('p ran');
      // console.log(myP.innerText);
      newDiv.appendChild(myP);
    });
  });
  
  // console.log(newDiv.innerText);
  return newDiv;
};

const createButtonLink = (document) => {
  const button = document.querySelector(' div.trial-button p span.button a');
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
  
  console.log(cells);
  /* disclaimer = document.querySelector('');
  if (disclaimer) {
    //cells.push([]);
  }*/
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
    console.log("Fragment returned");
    console.log(fragment);
    if (fragment) section.append(fragment);

    section.append(":search:")

    const vidHero = createHero(document);
    if (vidHero) section.append(vidHero);

    section.append(document.createElement('hr'));

    const lhrail = createLeftHandRail( document,);
    if (lhrail) section.append(lhrail);

    const divider = createDivider(document);
    if (divider) section.append(divider);

    const rightHR = createRightHandRail(document);
    if (rightHR) section.append(rightHR);

    const button = createButtonLink(document);
    if (button) section.append(button);

    const disclaimer = createDisclaimer(document);
    if (disclaimer) section.append(disclaimer);

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
