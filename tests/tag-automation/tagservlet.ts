import { chromium, BrowserContext, Response } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context: BrowserContext = await browser.newContext();
  const page = await context.newPage();

  
  context.on('response', async (response: Response) => {
    if (response.url().includes('tagsservlet')) {
      try {
        const json: any = await response.json();

        const productTag = findProductTag(json);
        if (productTag) {
          console.log('Extracted Product Tag:\n', JSON.stringify(productTag, null, 2));
        } else {
          console.log('Product tag not found.');
        }
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    }
  });

 
  await page.goto('https://www.jmp.com/services/tagsservlet');
  await page.waitForTimeout(3000); 
  await browser.close();
})();

function findProductTag(data: any): any | null {
  if (typeof data !== 'object' || data === null) return null;

  // Direct match
  if (data['jcr:title'] === 'Product') {
    return data;
  }

  
  if (Array.isArray(data)) {
    for (const item of data) {
      const result = findProductTag(item);
      if (result) return result;
    }
  } else {
    for (const key of Object.keys(data)) {
      const result = findProductTag(data[key]);
      if (result) return result;
    }
  }

  return null;
}
