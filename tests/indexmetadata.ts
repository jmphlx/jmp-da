import { chromium, Page } from 'playwright';

(async () => {
  // Launch a new Chromium browser instance
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to the target webpage
  await page.goto('https://edge-www.jmp.com/en/customer-stories/murata-electronics');

  // Extract metadata from the page
  const metadata = await extractAllMetadata(page);

  console.log('Metadata:', metadata);

  // Close the browser
  await browser.close();
})();

// Function to extract all metadata
async function extractAllMetadata(page: Page): Promise<{ [key: string]: string | null }> {
  return page.evaluate(() => {
    const metaTags = Array.from(document.querySelectorAll('meta'));
    const metaData: { [key: string]: string | null } = {};

    metaTags.forEach(tag => {
      const name = (tag.getAttribute('name') || tag.getAttribute('property')) ?? '';
      const content = tag.getAttribute('content');
      if (name) {
        metaData[name] = content;
      }
    });

    // Extract Open Graph (OG) metadata
    const ogMetaTags = Array.from(document.querySelectorAll('meta[property^="og:"]'));
    ogMetaTags.forEach(tag => {
      const property = tag.getAttribute('property') ?? '';
      const content = tag.getAttribute('content');
      if (property) {
        metaData[property] = content;
      }
    });

    // Extract JSON-LD data
    const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    jsonLdScripts.forEach(script => {
      const jsonData = script.textContent;
      if (jsonData) {
        try {
          metaData['json-ld'] = JSON.parse(jsonData);
        } catch (error) {
          metaData['json-ld'] = 'Invalid JSON-LD data';
        }
      }
    });

    return metaData;
  });
}
