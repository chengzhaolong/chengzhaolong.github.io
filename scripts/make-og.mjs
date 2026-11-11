// 把 public/og-image.svg 栅格化成 1200×630 的 PNG（社交平台不认 SVG）。
// 用法：npm run og
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const src = `${root}public/og-image.svg`;
const out = `${root}public/og-image.png`;

const svg = await readFile(src);
const png = await sharp(svg, { density: 144 })
  .resize(1200, 630, { fit: 'cover' })
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(out, png);
console.log(`✓ og-image.png 已生成（${(png.length / 1024).toFixed(0)} KB）`);
