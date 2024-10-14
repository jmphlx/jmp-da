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
    const bookPubDate = jcrContent.listingPageTitle;
    const tags = jcrContent["cq:tags"];
    const bookAuthor = jcrContent["jcr:description"];
    const bookTypeTitle = jcrContent["navTitle"];
    
    // parse the tags
    const bookType = [];
    var bookUserLvl;
    var bookCourse;
    tags.forEach((tag) => {
        //console.log(tag);
        if (tag.includes('type')){ bookType.push(tag.split('/')[2]); }
        if (tag.includes('user-level')){bookUserLvl = tag.split('/')[1]; }
        if (tag.includes('topic')) {  bookCourse = tag.split('/')[2]; }
      }); 
    // create our image
    const img = document.createElement('img');
    img.src = image;
    console.log(img);
    const bookReleaseDate = jcrContent.releaseDate;
    meta['redirectTarget'] = jcrContent.redirectTarget;
    meta["Title"] = title;
    meta["Image"] = img;
    meta["Description"] = displayDesc;
    meta["bookPublishDate"] = bookPubDate;
    meta["bookType"] = bookType;
    meta["userLevel"] = bookUserLvl;
    meta["bookCourse"] = bookCourse;
    meta["releaseDate"] = bookReleaseDate;
    meta["bookAuthor"] = bookAuthor;
    meta["bookTypeTitle"] = bookTypeTitle;

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
