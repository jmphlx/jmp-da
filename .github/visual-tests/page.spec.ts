import {test, expect} from '@playwright/test';


test(`Sample test`, async ({page}, testInfo) => {
  const urlMain = `https://${process.env.DOMAIN_MAIN}/en/sandbox/laurel/aem-168`;

  await page.goto(urlMain, {waitUntil: 'networkidle'});

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/AEM-168/);
});

/**
 * Test Subnav Block
 * Expect the current page to have the active class
 * on the button and dropdown option.
 */
test(`Subnav Block`, async ({page}, testInfo) => {
  const urlMain = `https://${process.env.DOMAIN_MAIN}/en/sandbox/laurel/subnav/medical`;

  await page.goto(urlMain, {waitUntil: 'networkidle'});

  await expect(page).toHaveTitle(/Medicine/);
  const topNavButton = page.getByText('By IndustryAll');
  await expect(topNavButton).toHaveAttribute('class', /active/);

  await topNavButton.click();
  await expect(topNavButton).toHaveAttribute('class', /is-open/);

  const subNavLink = await page.locator('li').filter({ hasText: /^Medical Devices$/ })
  await expect(subNavLink).toHaveAttribute('class', /active/);
});