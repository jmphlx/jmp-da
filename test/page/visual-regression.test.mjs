import { chromium } from 'playwright';
import { expect } from '@esm-bundle/chai';
import { capture, compareScreenshots } from './visual-helpers.mjs';

const BASE = 'http://main--jmp-da--jmphlx.aem.page';
const BRANCH = process.env.GIT_BRANCH || 'feature-test';
const PREVIEW = `http://${BRANCH.replace(/\//g, '-') }--jmp-da--jmphlx.aem.page`;

const pages = [
  '/en/home',
  '/en/partners',
  '/en/software/data-analysis-software',
  '/en/download-jmp-free-trial',
  '/en/resources/resource-listings/featured',
  '/en/events/americas',
  '/en/online-statistics-course',
  '/en/statistics-knowledge-portal',
  '/en/company/contact',
];

describe('Visual Regression', () => {
  let browser;
  let page;

  before(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  after(async () => {
    await browser.close();
  });

  for (const route of pages) {
    it(`should visually match ${route}`, async () => {
      const baselineUrl = `${BASE}${route}`;
      const previewUrl  = `${PREVIEW}${route}`;

      console.log(`\n🌐 Comparing ${baselineUrl} vs ${previewUrl}`);

      const baseline = await capture(page, baselineUrl, `${route.replace(/\//g, '_')}`);
      const preview  = await capture(page, previewUrl, `${route.replace(/\//g, '_')}`);

      const diffRatio = compareScreenshots(
        baseline,
        preview,
        `${route.replace(/\//g, '_')}-diff`
      );

      console.log(`🔍 ${route}: ${(diffRatio * 100).toFixed(2)}% diff`);
      expect(diffRatio).to.be.lessThan(0.01, 'Visual differences exceed 1% threshold');
    });
  }
});
