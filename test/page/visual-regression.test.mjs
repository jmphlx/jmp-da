// At the top of visual-regression.test.js
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';
import { expect } from '@esm-bundle/chai';

// Wrap in an async IIFE when run via `node`
(async () => {
  const BASELINE_URL = 'http://main--jmp-da--jmphlx.aem.page/en/home';
  const BRANCH_NAME = process.env.GIT_BRANCH || 'feature-test';
  const PREVIEW_URL = `http://${BRANCH_NAME.replace(/\//g, '-') }--jmp-da--jmphlx.aem.page/en/home`;

  const SCREENSHOT_DIR = './test/screenshots';
  if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  async function capture(page, url, name) {
    await page.goto(url, { waitUntil: 'networkidle' });
    const buffer = await page.screenshot({ fullPage: true });
    fs.writeFileSync(path.join(SCREENSHOT_DIR, `${name}.png`), buffer);
    return buffer;
  }

  function compareScreenshots(baseline, preview) {
    const img1 = PNG.sync.read(baseline);
    const img2 = PNG.sync.read(preview);
    const { width, height } = img1;
    const diff = new PNG({ width, height });
    const diffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
    fs.writeFileSync(path.join(SCREENSHOT_DIR, 'diff.png'), PNG.sync.write(diff));
    return diffPixels / (width * height);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log(`🌐 Baseline: ${BASELINE_URL}`);
  console.log(`🌐 Preview : ${PREVIEW_URL}`);

  const baselineBuffer = await capture(page, BASELINE_URL, 'baseline');
  const previewBuffer = await capture(page, PREVIEW_URL, 'preview');
  const diffRatio = compareScreenshots(baselineBuffer, previewBuffer);

  console.log(`🔍 Pixel difference: ${(diffRatio * 100).toFixed(2)}%`);
  expect(diffRatio).to.be.lessThan(0.01, 'Visual differences exceed 1% threshold');

  await browser.close();
})();
