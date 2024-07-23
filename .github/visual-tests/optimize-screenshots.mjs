import sharp from "sharp";
import * as path from "path";
import {readdirSync, unlinkSync} from "fs";

// list files in the directory 'snapshots'
const snapshots = readdirSync("screenshots");

snapshots
  .filter(file => file.endsWith(".png"))
  .forEach(async (file) => {
    const filepath = path.join("screenshots", file);
    const newFilepath = filepath.replace(".png", ".webp");

    await sharp(filepath, {})
      .resize({width: 400})
      .webp({quality: 80})
      .toFile(newFilepath);

    // remove the original file
    unlinkSync(filepath);
  });

