import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// Function to check HTTP response code for a single URL
const checkResponseCode = async (page: Page, url: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    // Response listener to capture the status code
    const onResponse = (response: any) => {
      if (response.url().startsWith(url)) {
        const statusCode = response.status();
        page.off('response', onResponse); // Remove listener after capturing response
        resolve(`Response code for ${url}: ${statusCode}`); // Resolve promise with status code message
      }
    };

    page.on('response', onResponse);

    // Navigate to the URL
    page.goto(url, { waitUntil: 'networkidle' })
      .then(() => {
        // Set a timeout to resolve if response is not captured
        setTimeout(() => {
          console.error(`No response captured for ${url}`);
          page.off('response', onResponse); // Remove listener
          resolve(`No response captured for ${url}`); // Resolve promise with no response message
        }, 10000); // 10-second timeout
      })
      .catch(reject);
  });
};

// Function to check multiple URLs
const checkMultipleUrls = async (urls: string[]): Promise<string[]> => {
  // Launch a single browser instance
  const browser: Browser = await chromium.launch();
  const page: Page = await browser.newPage();
  const results: string[] = [];

  // Check each URL
  for (const url of urls) {
    try {
      console.log(`Checking URL: ${url}`);
      const result = await checkResponseCode(page, url);
      results.push(result);
      // Add a delay between checks
      await page.waitForTimeout(2000); // 2-second delay
    } catch (error) {
      results.push(`Error checking URL ${url}: ${error}`);
    }
  }

  // Close the browser
  await browser.close();

  return results;
};

// List of URLs to check
const urls = [

'https://jmp.com/try',
'https://jmp.com/buy',
'https://jmp.com/jmp',
'https://jmp.com/pro',
'https://jmp.com/live',
'https://jmp.com/clinical',
'https://jmp.com/genomics',
'https://jmp.com/new',
'https://jmp.com/software',
'https://jmp.com/statisticalthinking',
'https://jmp.com/skp',
'https://jmp.com/foreword',
'https://jmp.com/gettingstarted',
'https://jmp.com/subscribe',
'https://jmp.com/mysubscription',
'https://jmp.com/optin',
'https://jmp.com/optout',
'https://jmp.com/workflow',
'https://jmp.com/org',
'https://jmp.com/capabilities',
'https://jmp.com/doe',
'https://jmp.com/quality',
'https://jmp.com/dataviz',
'https://jmp.com/chem',
'https://jmp.com/semiconductor',
'https://jmp.com/pharma',
'https://jmp.com/consumerproducts',
'https://jmp.com/innovation',
'https://jmp.com/events',
'https://jmp.com/customerstories',
'https://jmp.com/contact',
'https://jmp.com/about',
'https://jmp.com/careers',
'https://jmp.com/resources',
'https://jmp.com/resourcecenter',
'https://jmp.com/thirdpartysoftware',
'https://jmp.com/books',
'https://jmp.com/help',
'https://jmp.com/documentation',
'https://jmp.com/earlyadopter',
'https://jmp.com/administrator',
'https://jmp.com/discovery',
'https://jmp.com/mastering',
'https://jmp.com/welcome',
'https://jmp.com/newswire',
'https://jmp.com/support',
'https://jmp.com/system',
'https://jmp.com/qualitystatement',
'https://jmp.com/update',
'https://jmp.com/clinicalresources',
'https://jmp.com/review',
'https://community.jmp.com/learn',
'https://community.jmp.com/mastering',
'https://community.jmp.com/support',
'https://community.jmp.com/usergroups',
'https://community.jmp.com/discovery',
'https://jmp.com/academic',
'https://jmp.com/student',
'https://jmp.com/faculty',
'https://jmp.com/researcher',
'https://jmp.com/teach'





];

// Run the function in an async context
(async () => {
  try {
    console.log('Starting URL checks...');
    const results = await checkMultipleUrls(urls);
    console.log('Finished URL checks.');

    // Write results to a file
    const filePath = path.join(__dirname, 'url_aem_733.txt');
    fs.writeFileSync(filePath, results.join('\n'), 'utf8');
    console.log(`Results written to ${filePath}`);
  } catch (error) {
    console.error('Error:', error);
  }
})();
