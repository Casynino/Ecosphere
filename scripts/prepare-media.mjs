// Copies the chosen client photos and video clips into /public, web-ready:
// photos are auto-rotated, resized and stripped of metadata (including GPS);
// videos are trimmed to short clips, compressed and exported WITHOUT sound.
// Needs ffmpeg for the videos. Run: node scripts/prepare-media.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE = 'VIDEO & PICS ';

const photos = {
  '19ee689b-bdf2-445c-99b3-34a170620593.JPG': 'team-on-wharf.jpg',
  '258db07e-de16-4331-983c-103bb4bd8082.JPG': 'site-briefing.jpg',
  '25e6d9f4-75d1-40d9-92ca-259864ddfb6c.JPG': 'cranes-and-skyline.jpg',
  '3931384c-53f6-485b-b5b6-d2a27af27fa6.JPG': 'team-at-harbour.jpg',
  '3098de50-5c1f-4a01-a77b-a37e3b1ec7bd.JPG': 'site-walk.jpg',
  '02e88da6-1649-448b-8ddf-7659b522552d.JPG': 'drawings-review.jpg',
  'e9531452-1e68-4f97-8c07-103020354a1a.JPG': 'drawings-review-2.jpg',
  'f9e4e667-0e1c-44c6-9309-adbcb61a7a64.JPG': 'team-site-office.jpg',
  'a64d9e7b-b71e-4f44-8ae0-c8f742fc5642.JPG': 'site-meeting.jpg',
  '954deff7-be9b-479b-9201-42202c6fd608.JPG': 'team-wharf-wide.jpg',
};

// Leadership portraits, cropped to an upright 4:5 frame from the top so the face is kept.
const portraits = {
  '8bc095e5-2723-405c-b846-6602b4121700 2.JPG': 'norga-komba.jpg',
  '5695071e-14e3-49cc-96c7-1e8873be37c2 2.JPG': 'ian-komba.jpg',
};

// Second batch from the client: photos and documents for the news articles.
const NEW_SOURCE = 'new photos and pdf ';
// Pictures for news articles, saved whole.
const newsPhotos = {
  '0643ec83-c5af-4a68-a9fd-1c0b574c7a77.JPG': 'violet-mushi-seminar.jpg',
  '1aa065f7-adb4-4273-854b-e5432f5e8568.JPG': 'norga-komba-appointment.jpg',
  '799e2bec-9d9c-4075-aff3-5a90a1f894fb.JPG': 'phewa-dialogue-talk.jpg',
  '57b9fb10-4808-4160-b996-7f1ddec879e4.JPG': 'phewa-dialogue-group.jpg',
  '23a6ad5b-56f2-4006-ac95-bddbf66d43b5.JPG': 'khalid-taimur-akram.jpg',
  '90e2c2e7-f6f3-48d3-9700-f384f5712d77.JPG': 'phewa-dialogue-meeting.jpg',
  'd1419c41-f29f-4698-9591-b57c84b73886.JPG': 'norga-komba-khalid-akram.jpg',
  '2d102ac3-9863-471f-87d6-b1b739a505fa.JPG': 'focac-legal-forum-delegation.jpg',
  '0c4829cb-8e34-4155-9151-7ecfcfdb6bea.JPG': 'focac-legal-forum-podium.jpg',
  'f054caf3-7807-4287-a372-3af85b995adc.JPG': 'focac-legal-forum-programme.jpg',
  '5d07d4a5-f097-47d4-b89d-614c00da77ee.JPG': 'tanzania-embassy-beijing.jpg',
  '1190dde2-57bd-45c7-b764-341004c0a69a.JPG': 'community-with-shared-future-book.jpg',
};

// News pictures cut out of a wider photo: [source file, left, top, width, height, output name].
const newsCrops = [['44d5059f-f88c-4f5e-8cc8-19ddcefedddc.JPG', 700, 620, 1220, 915, 'violet-mushi-session.jpg']];

// A certificate supplied as a one-page PDF, shown in a news article: [source file, output name].
// The strip at the foot of the scan (the scanner app's stamp) is cut off. Needs pdftocairo (poppler).
const certificates = [['New Doc 10-11-2025 07.40.pdf', 'violet-mushi-certificate.jpg']];

// Portraits cut out of a wider photo: [source file, left, top, width, height, output name].
const portraitCrops = [['44d5059f-f88c-4f5e-8cc8-19ddcefedddc.JPG', 930, 760, 900, 1125, 'violet-mushi.jpg']];

// [source file, start (s), length (s), output name]
const clips = [
  ['e2108f53-8a3c-4f7a-b895-849fe0a8d54c.MP4', 100, 18, 'on-site-discussion'],
  ['e8c9058e-1b8f-4f6a-a489-0c85e03c0513.MP4', 24, 16, 'site-briefing'],
  ['f4f6468a-d63b-4414-815a-9b5928150449.MP4', 4.5, 7.5, 'site-walk'],
];

mkdirSync('public/images/field', { recursive: true });
mkdirSync('public/images/leadership', { recursive: true });
mkdirSync('public/videos', { recursive: true });

for (const [source, output] of Object.entries(photos)) {
  await sharp(path.join(SOURCE, source))
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join('public/images/field', output));
}

for (const [source, output] of Object.entries(portraits)) {
  const image = sharp(path.join(SOURCE, source)).rotate();
  const { width } = await image.metadata();
  const side = Math.min(width, 720);
  await image
    .resize({ width: side, height: Math.round(side * 1.25), fit: 'cover', position: 'north' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join('public/images/leadership', output));
}

for (const [source, left, top, width, height, output] of portraitCrops) {
  // Rotate first (phone photos carry their orientation as a tag), then cut.
  const upright = await sharp(path.join(NEW_SOURCE, source)).rotate().toBuffer();
  await sharp(upright)
    .extract({ left, top, width, height })
    .resize({ width: 720, height: 900, fit: 'cover' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join('public/images/leadership', output));
}

mkdirSync('public/images/news', { recursive: true });

for (const [source, output] of Object.entries(newsPhotos)) {
  await sharp(path.join(NEW_SOURCE, source))
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join('public/images/news', output));
}

for (const [source, left, top, width, height, output] of newsCrops) {
  const upright = await sharp(path.join(NEW_SOURCE, source)).rotate().toBuffer();
  await sharp(upright)
    .extract({ left, top, width, height })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join('public/images/news', output));
}

for (const [source, output] of certificates) {
  const page = path.join('public/images/news', '.certificate');
  execFileSync('pdftocairo', ['-jpeg', '-r', '150', '-singlefile', path.join(NEW_SOURCE, source), page]);
  const scan = sharp(`${page}.jpg`);
  const { width, height } = await scan.metadata();
  await scan
    .extract({ left: 0, top: 0, width, height: Math.round(height * 0.93) })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join('public/images/news', output));
  rmSync(`${page}.jpg`);
}

for (const [source, start, length, name] of clips) {
  const input = path.join(SOURCE, source);
  const video = `public/videos/${name}.mp4`;
  execFileSync('ffmpeg', [
    '-v', 'error', '-y', '-ss', String(start), '-t', String(length), '-i', input,
    '-an', '-vf', 'fps=30,scale=360:640', '-c:v', 'libx264', '-profile:v', 'main',
    '-pix_fmt', 'yuv420p', '-crf', '30', '-maxrate', '650k', '-bufsize', '1300k', '-preset', 'slow', '-movflags', '+faststart', video,
  ]);
  execFileSync('ffmpeg', [
    '-v', 'error', '-y', '-ss', '1', '-i', video, '-frames:v', '1', '-q:v', '4', `public/videos/${name}.jpg`,
  ]);
}

console.log('Media written to public/images/field, public/images/leadership and public/videos');
