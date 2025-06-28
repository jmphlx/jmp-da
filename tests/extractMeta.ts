import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// List of URLs to scrape
const urls = [
  'https://edge-www.jmp.com/en/software/why-jmp',
  'https://edge-www.jmp.com/en/software/why-jmp1',
];

// Function to extract Open Graph metadata
async function extractMetadata(url: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  const metadata = await page.evaluate(() => {
    const metaElements: HTMLMetaElement[] = Array.from(document.getElementsByTagName('meta'));
    const metaData: { [key: string]: string } = {};

    metaElements.forEach(metaElement => {
      const property = metaElement.getAttribute('property');
      const content = metaElement.getAttribute('content') || '';

      if (property === 'og:title' || property === 'og:image') {
        metaData[property] = content;
      }
    });

    return metaData;
  });

  await browser.close();
  return metadata;
}

// Main function to process multiple pages and write to file
(async () => {
  const results: { [url: string]: { [key: string]: string } } = {};

  for (const url of urls) {
    console.log(`Processing ${url}...`);
    results[url] = await extractMetadata(url);
  }

  // Write results to a file
  const outputPath = path.join(__dirname, 'metadata1.txt');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Metadata written to ${outputPath}`);
})();
