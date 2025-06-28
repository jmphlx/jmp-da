import { test, expect } from '@playwright/test';
import { Page, Response } from '@playwright/test';

test('capture the target URL after redirection', async ({ page }: { page: Page }) => {
  const initialURL = 'https://example.com/redirecting-page'; // Replace with the URL you are testing
  let finalURL: string | null = null;

  // Listen for network responses
  page.on('response', (response: Response) => {
    // Check if the response indicates a redirect
    if (response.status() >= 300 && response.status() < 400) {
      const locationHeader = response.headers()['location'];
      if (locationHeader) {
        finalURL = locationHeader;
      }
    }
  });

  // Navigate to the initial URL
  await page.goto(initialURL, { waitUntil: 'networkidle' });

  // Wait for all network activity to settle
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Additional wait for any lingering async operations

  // If no final URL found from the redirects, attempt to fetch the final URL from the page
  if (!finalURL) {
    finalURL = page.url();
  }

  // Log or assert the final URL
  console.log('Captured final URL:', finalURL);

  // Assert the final URL if needed
  // Replace with the expected final URL
  //expect(finalURL).toBe('https://expected-final-destination.com');
});
