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

// Social share image (1200 x 630): the picture people see when the link is
// shared on WhatsApp, Facebook, LinkedIn or X. The opening photograph of the
// site with the logo and the headline. Kept as a light JPEG, because some
// apps skip preview pictures that are slow to fetch.
const ogLogo = await render(reversed, FULL, 400).png().toBuffer();
const ogPhoto = await sharp('public/images/stock/hero-savanna.jpg')
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .toBuffer();
const ogShade = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="side" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#021316" stop-opacity="0.86"/>
      <stop offset="0.55" stop-color="#021316" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#021316" stop-opacity="0.12"/>
    </linearGradient>
    <linearGradient id="foot" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.35" stop-color="#021316" stop-opacity="0"/>
      <stop offset="1" stop-color="#021316" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#side)"/>
  <rect width="1200" height="630" fill="url(#foot)"/>
  <text x="72" y="430" font-family="Baskerville, Georgia, serif" font-size="74" fill="#ffffff">We are the solution</text>
  <text x="72" y="512" font-family="Baskerville, Georgia, serif" font-size="74" fill="#ffffff">for a healthier planet.</text>
  <rect x="72" y="546" width="56" height="2" fill="#8cc63f"/>
  <text x="146" y="556" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="25" fill="#d8ebe6">Environmental consultancy · Dar es Salaam, Tanzania</text>
</svg>`);
await sharp(ogPhoto)
  .composite([
    { input: ogShade, top: 0, left: 0 },
    { input: ogLogo, top: 60, left: 72 },
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(`${OUT}/og.jpg`);

console.log('Brand assets written to', OUT);
