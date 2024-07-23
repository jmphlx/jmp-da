import {Page, test, expect} from '@playwright/test';
import {getComparator} from 'playwright-core/lib/utils';
import {unlink, writeFile} from 'fs/promises';


function getScreenshotPath(testPath: string, suffix) {
  const title = testPath.replace(/[/]/g, '-');
  return `./screenshots/${(title.toLowerCase())}-${suffix}.png`;
}

/**
 * Wait for all images on document to be loaded.
 *
 * @param page {page}
 * @param timeout {number}: how many milliseconds to wait until reject and cancel the execution.
 * @param tickrate {number}: how many milliseconds to wait until recheck all images again.
 * @returns {Promise}
 *   A promise which resolve when all img on document gets fetched.
 *   The promise get rejected if it reach the @timeout time to execute.
 *
 *  Based on https://stackoverflow.com/a/51652947/79461
 */
async function allImagesLoaded(page, timeout = 15 * 1000, tickrate = 250) {
  const images = await page.locator('img').all();
  const startTime = new Date().getTime();

  return new Promise((resolve, reject) => {

    function checkImages() {
      const currentTime = new Date().getTime();

      if (currentTime - startTime > timeout) {
        reject({
          message: `CheckImgReadyTimeoutException: images taking to loong to load.`
        });
      }

      if (images.every(img => img.evaluate(el => el.complete))) {
        resolve(images);
      } else {
        setTimeout(checkImages, tickrate);
      }
    }

    checkImages();
  });
}

async function loadAndScreenshot(page: Page, url: string, testPath: string, suffix: string) {
  // load page and wait for network to be idle
  await page.goto(url, {waitUntil: 'networkidle'});
  // just to be sure, wait until footer is loaded
  //await page.locator('footer div.footer.block[data-block-status="loaded"]').waitFor();
  // to be extra sure, also wait until all images are loaded
  await allImagesLoaded(page);

  return await page.screenshot({
    path: getScreenshotPath(testPath, suffix),
    fullPage: true
  });
}

for (let testPath of process.env.TEST_PATHS.split(/\s+/g)) {
  testPath = testPath.trim();
  if (!testPath) continue;

  test(`${testPath}`, async ({page}, testInfo) => {
    const urlMain = `https://${process.env.DOMAIN_MAIN}${testPath}`;
    const urlBranch = `https://${process.env.DOMAIN_BRANCH}${testPath}`;

    const beforeImage = await loadAndScreenshot(page, urlMain, testPath, "main");
    const afterImage = await loadAndScreenshot(page, urlBranch, testPath, "branch");

    const comparator = getComparator('image/png');
    const result = comparator(beforeImage, afterImage, {
      maxDiffPixelRatio: 0.01,
    });

    if (result && result.errorMessage) {
      await writeFile(getScreenshotPath(testPath, 'diff'), result.diff);

      // print markdown summary to console
      const markdownSummary = ` - **${testPath}** ([main](${urlMain}) vs [branch](${urlBranch}))<br>`;
      console.log(markdownSummary);
      testInfo.attachments.push({
        name: getScreenshotPath(testPath, 'diff'),
        contentType: `image/png`,
        path: getScreenshotPath(testPath, 'diff')
      });
      throw new Error(markdownSummary);
    } else {
      // if there is no difference, delete the images to save space in the artifact
      await unlink(getScreenshotPath(testPath, 'main'));
      await unlink(getScreenshotPath(testPath, 'branch'));
    }
  })

}