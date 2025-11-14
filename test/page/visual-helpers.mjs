import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import path from 'path';

export const SCREENSHOT_DIR = './test/screenshots';
if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

export async function capture(page, url, name) {
  await page.goto(url, { waitUntil: 'networkidle' });
  const buffer = await page.screenshot({ fullPage: true });
  fs.writeFileSync(path.join(SCREENSHOT_DIR, `${name}.png`), buffer);
  return buffer;
}

export function compareScreenshots(baseline, preview, name = 'diff') {
  const img1 = PNG.sync.read(baseline);
  const img2 = PNG.sync.read(preview);
  const { width, height } = img1;
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
  fs.writeFileSync(path.join(SCREENSHOT_DIR, `${name}.png`), PNG.sync.write(diff));
  return diffPixels / (width * height);
}
