// Copies the chosen client photos and video clips into /public, web-ready:
// photos are auto-rotated, resized and stripped of metadata (including GPS);
// videos are trimmed to short clips, compressed and exported WITHOUT sound.
// Needs ffmpeg for the videos. Run: node scripts/prepare-media.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
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
};

// Leadership portraits, cropped to an upright 4:5 frame from the top so the face is kept.
const portraits = {
  '8bc095e5-2723-405c-b846-6602b4121700 2.JPG': 'norga-komba.jpg',
  '5695071e-14e3-49cc-96c7-1e8873be37c2 2.JPG': 'ian-komba.jpg',
};

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
