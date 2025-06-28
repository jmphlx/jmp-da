import { test, expect } from '@playwright/test';

test('Accordion block should decorate rows into <details> structure', async ({ page }) => {

  await page.setContent(`
    <html>
      <head>
        <style>
          summary > p, .accordion-item-body > p {
            display: block;
          }
        </style>
      </head>
      <body>
        <div id="accordion">
          <div>
            <div>Label 1</div>
            <div>Body 1</div>
          </div>
          <div>
            <div>Label 2</div>
            <div>Body 2</div>
          </div>
        </div>
      </body>
    </html>
  `);

  // Inject the decorate function into the browser context
  await page.evaluate(() => {
    function hasWrapper(el: Element): boolean {
      return !!el.firstElementChild &&
        window.getComputedStyle(el.firstElementChild).display === 'block';
    }

    function decorate(block: Element) {
      [...block.children].forEach((row) => {
        const label = row.children[0];
        const summary = document.createElement('summary');
        summary.className = 'accordion-item-label';
        summary.append(...label.childNodes);
        if (!hasWrapper(summary)) {
          summary.innerHTML = '<p>' + summary.innerHTML + '</p>';
        }

        const body = row.children[1];
        body.className = 'accordion-item-body';
        if (!hasWrapper(body)) {
          body.innerHTML = '<p>' + body.innerHTML + '</p>';
        }

        const details = document.createElement('details');
        details.className = 'accordion-item';
        details.append(summary, body);
        row.replaceWith(details);
      });
    }

    const block = document.getElementById('accordion');
    if (block) {
      decorate(block);
    }
  });

  // Assertions
  const items = page.locator('details.accordion-item');
  await expect(items).toHaveCount(2);

  await expect(items.nth(0).locator('summary')).toHaveText(/Label 1/);
  await expect(items.nth(0).locator('.accordion-item-body')).toHaveText(/Body 1/);

  await expect(items.nth(1).locator('summary')).toHaveText(/Label 2/);
  await expect(items.nth(1).locator('.accordion-item-body')).toHaveText(/Body 2/);
});
