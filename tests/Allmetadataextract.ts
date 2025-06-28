import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// List of URLs to scrape
const urls = [
  'https://edge-www.jmp.com/en/customer-stories/murata-electronics',
  'https://edge-www.jmp.com/en/customer-stories/murata-electronics1',
];

// Function to extract metadata from a single URL
async function extractMetadata(url: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  const metadata = await page.evaluate(() => {
    // Convert HTMLCollection to array
    const metaElements: HTMLMetaElement[] = Array.from(document.getElementsByTagName('meta'));
    const metaData: { [key: string]: string } = {};

    metaElements.forEach(metaElement => {
      const name = metaElement.getAttribute('name');
      const property = metaElement.getAttribute('property');
      const content = metaElement.getAttribute('content') || '';

      if (name) {
        metaData[`name:${name}`] = content;
      } else if (property) {
        metaData[`property:${property}`] = content;
      }
    });

    return metaData;
  });

  await browser.close();
  return metadata;
}

// Main function to process multiple URLs and write to file
(async () => {
  const results: { [url: string]: { [key: string]: string } } = {};

  for (const url of urls) {
    console.log(`Processing ${url}...`);
    const metadata = await extractMetadata(url);
    results[url] = metadata;
  }

  // Define the output file path
  const outputPath = path.join(__dirname, 'metadata.txt');
  
  // Format the output data
  const outputData = Object.entries(results).map(([url, metadata]) => {
    const metadataLines = Object.entries(metadata).map(([key, value]) => {
      return `  ${key}: ${value}`;
    }).join('\n');
    return `${url}\n${metadataLines}`;
  }).join('\n\n');

  // Write the formatted data to the file
  fs.writeFileSync(outputPath, outputData, 'utf-8');
  console.log(`Metadata written to ${outputPath}`);
})();
