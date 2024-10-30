// IMPORTER FOR PARTNER ITEMS // 
/* eslint-disable */
const createMetadataBlock = (document) => {
    const meta = {};
    //constants
    const JMPEdgeURL = "https://edge-www.jmp.com";
    //parse json
    const jsonDoc = document.querySelector("pre");
    const pageObj = JSON.parse(jsonDoc.innerHTML);
    const jcrContent = pageObj["jcr:content"];
    const title = jcrContent["jcr:title"];
    const image = JMPEdgeURL + jcrContent.image.fileReference;
    const displayDesc = jcrContent["jcr:title"];
    const tags = jcrContent["cq:tags"];
    
    // parse the tags
    const partnerType = [];
    var partnerCountry;
    
    tags.forEach((tag) => {
        //console.log(tag);
        if (tag.includes('partners')){ partnerType.push(tag.split('/')[1]); }
        if (tag.includes('user-level')){bookUserLvl = tag.split('/')[1]; }
        if (tag.includes('country')) {partnerCountry = tag.split(':')[1]; }
      }); 
    
    meta["redirectTarget"] = jcrContent.redirectTarget; //OK
    meta["Title"] = title; //OK 
    meta["Description"] = jcrContent.subtitle;
    meta["partnerType"] = partnerType;
    meta["country"] = partnerCountry;


    console.log(meta);
    const metaBlock = WebImporter.Blocks.getMetadataBlock(document, meta);
    //returning the meta object might be usefull to other rules
    return metaBlock;
};

export default {
    transformDOM: ({ document }) => {
        console.log(document);
        const meta = createMetadataBlock(document);
        const main = document.createElement('main');
        main.innerHTML = '';
        const section = document.createElement('div');
        section.append(meta);
        main.append(section);
        console.log(main);
        return main;
    },
};
