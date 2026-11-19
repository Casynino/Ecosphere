// Builds the logo PNGs, favicon and social share image from the client's logo PDF.
// Needs poppler (`brew install poppler`) for `pdftocairo`. Run: npm run brand:assets
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const PDF = 'Logo_Ecosphere-Solutions.pdf';
const OUT = 'public/brand';
const tmp = mkdtempSync(path.join(tmpdir(), 'ecosphere-logo-'));
mkdirSync(OUT, { recursive: true });

// Page 1 = colour logo on white, page 2 = reversed logo on teal.
function pageSvg(page) {
  const file = path.join(tmp, `p${page}.svg`);
  execFileSync('pdftocairo', ['-svg', '-f', String(page), '-l', String(page), PDF, file]);
  // Drop the full-page background rectangle so the artwork sits on transparency.
  return readFileSync(file, 'utf8')
    .split('\n')
    .filter((line) => !(line.startsWith('<path') && line.includes('d="M 0.589844 594.058594 L 841.191406')))
    .join('\n');
}

// Re-frame the SVG on a region of the page (in PDF points) and rasterise it.
function render(svg, [x, y, w, h], widthPx) {
  const framed = svg.replace(
    /<svg([^>]*?)width="[^"]*" height="[^"]*" viewBox="[^"]*"/,
    `<svg$1width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}"`,
  );
  return sharp(Buffer.from(framed), { density: (72 * widthPx) / w }).resize({ width: widthPx });
}

const FULL = [110, 176, 630, 222]; // swirl + wordmark
const MARK = [107, 176, 222, 222]; // swirl only

const colour = pageSvg(1);
const reversed = pageSvg(2);

await render(reversed, FULL, 720).png({ compressionLevel: 9 }).toFile(`${OUT}/logo.png`);
await render(colour, FULL, 720).png({ compressionLevel: 9 }).toFile(`${OUT}/logo-color.png`);
await render(colour, MARK, 256).png({ compressionLevel: 9 }).toFile(`${OUT}/icon.png`);

const mark = await render(colour, MARK, 140).png().toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#ffffff' } })
  .composite([{ input: mark, gravity: 'centre' }])
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/apple-icon.png`);

// Social share image (1200 x 630).
const ogLogo = await render(reversed, FULL, 640).png().toBuffer();
const ogBackground = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#00444a"/><stop offset="0.6" stop-color="#00323a"/><stop offset="1" stop-color="#005e64"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#8cc63f"/><stop offset="0.55" stop-color="#3b79b8"/><stop offset="1" stop-color="#5ec3d6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="618" width="1200" height="12" fill="url(#bar)"/>
  <text x="600" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="46" fill="#ffffff">We Are The Solution.</text>
  <text x="600" y="530" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="#bfe3e8">Environmental consultancy · Dar es Salaam, Tanzania</text>
</svg>`);
await sharp(ogBackground)
  .composite([{ input: ogLogo, top: 110, left: 280 }])
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/og.png`);

console.log('Brand assets written to', OUT);
