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
  anchor.href = 'https://main--jmp-da--jmphlx.hlx.live/fragments/en/bio-nav';
  anchor.innerText = 'https://main--jmp-da--jmphlx.hlx.live/fragments/en/bio-nav';
  cells.push([anchor]);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};

const createBio = (document) => {
  const doc = {};
  const cells = [
    ['columns (clm-25-75)'],
  ]
  //grab hero image
  
  const lhText = document.querySelector('div.par.parsys div.textimage.parbase.section div.authorbio div');
  // console.log(lhText);
  if (lhText){
    console.log("Tad Look here");
    console.log(lhText);
    const pic = document.createElement("img");
    const url = lhText.querySelectorAll("div[dat-asset]");
    console.log("this is the url");
    console.log(url);
    if (lhText.firstElementChild.hasAttribute("data-asset")){
      pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com" +lhText.firstElementChild.getAttribute("data-asset");
      console.log("has data asset");
      console.log(pic);
    } else {
      pic.src = "https://www.jmp.com" + lhText.firstElementChild.getAttribute("src");
      console.log("has src");
    }

    const rhText = document.querySelector('div.par.parsys div.textimage.parbase.section div.authorbio div.text');
    console.log(rhText);

    cells.push([pic, rhText]);
  };
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};

const createBio2 = (document) => {
  const doc = {};
  const cells = [
    ['columns (clm-25-75)'],
  ]
  //grab hero image
  
  const lhText = document.querySelector('div.par.parsys div.textimage.parbase.section div div');
  // console.log(lhText);
  console.log("Tad Look here");
  console.log(lhText);
  const pic = document.createElement("img");
  const url = lhText.querySelectorAll("div[dat-asset]");
  console.log(url);
  if (lhText.firstElementChild.hasAttribute("data-asset")){
    pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com" +lhText.firstElementChild.getAttribute("data-asset");
  } else {
    pic.src = "https://www.jmp.com" + lhText.getAttribute("src");
  }

  const rhText = document.querySelector('div.par.parsys div.textimage.parbase.section div div.text');
  console.log(rhText);

  cells.push([pic, rhText]);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);
};



const createTitle = (document) => {
  const title = document.querySelectorAll('.container div.par.parsys div.text.parbase.section');
  console.log(title)
  if (title.length > 1) {
    title[1].querySelector('h3').outerHTML = "<h1>" + title[1].querySelector('h3').innerHTML + '</h1>';
    title[1].querySelector('h4').outerHTML = "<h6>" + title[1].querySelector('h4').innerHTML + '</h6>';
    console.log("DREW LOOK HERE");
    console.log(title);
    title[1].className = "";
  } else {
    const check = title[0].querySelector('h3') !== null;
    if (check) {
      title[0].querySelector('h3').outerHTML = "<h1>" + title[0].querySelector('h3').innerHTML + '</h1>';
      title[0].querySelector('h4').outerHTML = "<h6>" + title[0].querySelector('h4').innerHTML + '</h6>';
      console.log("DREW LOOK HERE");
      console.log(title);
      title[0].className = "";
    } else {
      title[0].querySelector('h2').outerHTML = "<h6>" + title[0].querySelector('h2').innerHTML + '</h6>';
      console.log("DREW LOOK HERE");
      console.log(title);
      title[0].className = "";
    };
    
  };

  
  return title[title.length-1];
  };


const createSM = (document) => {
  const cells = [
    ['section-metadata'],
  ]

  const pic = document.createElement('img');
  pic.src = "https://publish-p107857-e1299068.adobeaemcloud.com/content/dam/jmp/images/design/data-visualization-illustrations/bubble-plot-wide-01.png";

  cells.push(['background-image',pic]);
  cells.push(['Style', 'purple-blue-gradient, light-text, place-background-image,']);
  console.log(cells);
  if (cells.length > 1) return WebImporter.DOMUtils.createTable(cells, document);  
};

const createSM2 = (document) => {
  const cells = [
    ['section-metadata'],
  ]

  cells.push(['Style', 'block-margin-large']);
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

    const sectionMetadata = createSM(document);
    if(sectionMetadata) section.append(sectionMetadata);

    section.append(document.createElement('hr'));

    const title = createTitle(document);
    if (title) section.append(title);

    const bio = createBio(document);
    console.log("bio create");
    if (bio) {section.append(bio)} else {section.append(createBio2(document))};

    const sectionMetadata2 = createSM2(document);
    if(sectionMetadata2) section.append(sectionMetadata2);

    section.append(sectionBreak);
  
    const meta = createMetadataBlock(document);
    if (meta) section.append(meta);
    
    main.innerHTML = '';
    main.append(section);
    return main;
  },
};
