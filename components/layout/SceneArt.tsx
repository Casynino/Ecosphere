import type { CSSProperties, ReactNode } from 'react';

/**
 * The picture behind every page: sunrise over a living landscape, drawn in
 * the colours of the Ecosphere logo (blue, cyan, teal, lime).
 *
 * From the back: sky, sun (moon in the dark theme), drifting cloud, a
 * snow-capped volcano, five ranges of forested hills with wind turbines and
 * a lake, acacia trees in front, and birds crossing the sky.
 *
 * Nothing is a photograph or a download. The hills and trees are worked out
 * from fixed seeds, so the server and the browser draw the same picture, and
 * the whole scene weighs a few kilobytes. Each range is its own layer, so
 * the browser can move them separately: they rise into place when the site
 * opens and sink at different speeds as the page is scrolled, which is what
 * gives the scene depth. Colours, motion and layout are in app/globals.css
 * under "The living landscape"; LivingBackground.tsx ties it to scrolling.
 *
 * All positions are in the picture's own units, 1600 wide by 900 high. On a
 * phone only the middle of the picture is on screen, so the sun, the
 * volcano, the turbines and two of the acacias sit in the middle.
 */

const W = 1600;
const H = 900;

const n1 = (value: number) => Math.round(value * 10) / 10;

/** A repeatable random sequence (the same numbers on the server and in the browser). */
function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/** Smooth noise along a line. */
function noise(seed: number) {
  const random = seeded(seed);
  const values = Array.from({ length: 256 }, () => random());
  return (x: number) => {
    const i = Math.floor(x);
    const f = x - i;
    const u = f * f * (3 - 2 * f);
    const a = values[i & 255];
    const b = values[(i + 1) & 255];
    return a + (b - a) * u;
  };
}

type Line = (x: number) => number;

/** The skyline of a range of hills. */
function ridge(seed: number, base: number, height: number, scale: number): Line {
  const broad = noise(seed);
  const mid = noise(seed + 7);
  const fine = noise(seed + 19);
  return (x) => base - height * (0.62 * broad(x / scale) + 0.28 * mid(x / (scale * 0.37)) + 0.1 * fine(x / (scale * 0.11)));
}

function fillBelow(line: Line, from = -40, to = W + 40) {
  let d = `M${from} ${H + 20}`;
  for (let x = from; x <= to; x += 12) d += `L${x} ${n1(line(x))}`;
  return `${d}L${to} ${H + 20}Z`;
}

const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${n1(cx - rx)} ${n1(cy)}a${n1(rx)} ${n1(ry)} 0 1 0 ${n1(2 * rx)} 0a${n1(rx)} ${n1(ry)} 0 1 0 ${n1(-2 * rx)} 0Z`;

/**
 * Round-crowned trees standing along a skyline. Returned in strips across
 * the picture (one path per strip) rather than as one enormous path, which
 * lets the browser draw only the strips a part of the screen needs.
 */
function trees(line: Line, seed: number, count: number, min: number, max: number) {
  const random = seeded(seed);
  const strips: string[] = Array.from({ length: 9 }, () => '');
  for (let i = 0; i < count; i++) {
    let d = '';
    const x = random() * (W + 60) - 30;
    const size = min + random() * (max - min);
    const ground = line(x);
    const crown = ground - size * 0.6;
    const blobs = 1 + Math.floor(random() * 3);
    for (let b = 0; b < blobs; b++) {
      const r = size * (0.42 + random() * 0.3);
      d += ellipse(x + (random() - 0.5) * size * 0.8, crown - random() * size * 0.28, r, r * 0.92);
    }
    // Trunks only where a tree is large enough for one to show.
    if (size > 10) d += `M${n1(x - size * 0.06)} ${n1(ground + 3)}L${n1(x - size * 0.04)} ${n1(crown)}L${n1(x + size * 0.04)} ${n1(crown)}L${n1(x + size * 0.06)} ${n1(ground + 3)}Z`;
    strips[Math.min(8, Math.max(0, Math.floor((x + 30) / 185)))] += d;
  }
  return strips.filter(Boolean);
}

/** An umbrella acacia: a forked trunk under flat pads of leaves. */
function acacia(x: number, ground: number, height: number, spread: number) {
  const top = ground - height;
  const fork = ground - height * 0.5;
  return (
    `M${n1(x - 6)} ${n1(ground + 6)}L${n1(x - 3)} ${n1(fork)}L${n1(x - spread * 0.58)} ${n1(top + 12)}L${n1(x - spread * 0.5)} ${n1(top + 5)}` +
    `L${n1(x + 1)} ${n1(fork - height * 0.08)}L${n1(x + spread * 0.5)} ${n1(top + 7)}L${n1(x + spread * 0.58)} ${n1(top + 14)}L${n1(x + 5)} ${n1(fork + height * 0.06)}L${n1(x + 7)} ${n1(ground + 6)}Z` +
    ellipse(x, top, spread, spread * 0.17) +
    ellipse(x - spread * 0.46, top + 9, spread * 0.52, spread * 0.12) +
    ellipse(x + spread * 0.5, top + 7, spread * 0.5, spread * 0.12) +
    ellipse(x + spread * 0.08, top - spread * 0.1, spread * 0.62, spread * 0.12)
  );
}

// ---- The picture, worked out once ----

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// The volcano: broad shoulders, a flat, slightly broken rim.
const rim = noise(41);
const volcano: Line = (x) => 552 - 214 * Math.pow(smooth(520, 722, x) * (1 - smooth(828, 1076, x)), 0.9) - 7 * rim(x / 17);
const snowLine: Line = (x) => 392 + 26 * rim(x / 21 + 9) - 10 * rim(x / 6 + 3);

const volcanoPath = fillBelow(volcano, 500, 1096);

/** Gullies running down from the rim: thin wedges of shadow that give the cone its shape. */
const gullies = [
  [632, 9],
  [684, 17],
  [748, 7],
  [796, 13],
  [866, 8],
  [912, 15],
]
  .map(([x, width]) => {
    const top = volcano(x) + 10;
    const lean = (x - 772) * 0.46;
    return `M${x} ${n1(top)}L${n1(x + lean - width)} 552L${n1(x + lean + width)} 552Z`;
  })
  .join('');
const snowPath = (() => {
  const xs: number[] = [];
  for (let x = 600; x <= 980; x += 5) if (volcano(x) < snowLine(x) - 2) xs.push(x);
  const up = xs.map((x) => `${x} ${n1(volcano(x))}`).join('L');
  const down = xs
    .slice()
    .reverse()
    .map((x) => `${x} ${n1(snowLine(x))}`)
    .join('L');
  return `M${up}L${down}Z`;
})();

const range1 = ridge(3, 548, 62, 260);
const range2 = ridge(11, 594, 60, 205);
const range3 = ridge(23, 642, 56, 180);
const range4 = ridge(37, 714, 62, 150);
const front = ridge(53, 772, 78, 240);

/** Each range: its skyline, then the trees along it. */
const paths = {
  range1: [fillBelow(range1)],
  range2: [fillBelow(range2), ...trees(range2, 12, 84, 4, 8)],
  range3: [fillBelow(range3), ...trees(range3, 24, 62, 7, 13)],
  range4: [fillBelow(range4), ...trees(range4, 38, 50, 13, 24)],
  front: [
    fillBelow(front),
    ...trees(front, 54, 18, 16, 30),
    ...[
      [588, 118, 86],
      [1034, 104, 78],
      [150, 128, 94],
      [1386, 112, 84],
      [1530, 84, 62],
      [352, 76, 56],
    ].map(([x, height, spread]) => acacia(x, front(x), height, spread)),
  ],
};

/** The paths of one range, all in one colour. */
function Range({ d, fill }: { d: string[]; fill: string }) {
  return (
    <g style={fill.startsWith('url') ? undefined : { fill }} fill={fill.startsWith('url') ? fill : undefined}>
      {d.map((path, index) => (
        <path key={index} d={path} />
      ))}
    </g>
  );
}

/** Wind turbines along the second range: [x, height of the tower]. */
const turbines = [
  [652, 60],
  [700, 48],
  [738, 38],
  [1196, 44],
  [318, 50],
].map(([x, height]) => ({ x, height, foot: range2(x) + 2 }));

const BIRD = 'M1 7Q6 0 11 6Q16 0 21 7';

/** One flock: [x offset, y offset, size] for each bird. */
const flock = [
  [0, 0, 1],
  [34, 14, 0.8],
  [58, -8, 0.9],
  [96, 10, 0.7],
  [128, -2, 0.85],
  [170, 18, 0.65],
];

const pct = (value: number, of: number) => `${n1((value / of) * 100)}%`;

function Layer({ sink, order, className = '', children }: { sink: number; order: number; className?: string; children: ReactNode }) {
  return (
    <div className={`scene-layer ${className}`} style={{ '--sink': `${sink}%`, '--i': order } as CSSProperties}>
      <div className="scene-rise">{children}</div>
    </div>
  );
}

function Art({ children }: { children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" focusable="false">
      {children}
    </svg>
  );
}

export function SceneArt() {
  return (
    <div className="scene-stage">
      <div className="scene-day" />
      <div className="scene-stars" />

      {/* Sun by day, moon by night. It climbs as the page is scrolled. */}
      <Layer sink={-26} order={0} className="scene-sunrise">
        <div className="scene-sun" style={{ left: pct(930, W), top: pct(428, H) }}>
          <span className="scene-sun-rays" />
          <span className="scene-sun-glow" />
          <span className="scene-sun-disc" />
        </div>
      </Layer>

      <div className="scene-clouds">
        {[
          { top: 13, width: 26, time: 210, start: -0.15 },
          { top: 24, width: 18, time: 160, start: -0.55 },
          { top: 31, width: 22, time: 260, start: -0.8 },
          { top: 8, width: 15, time: 190, start: -0.38 },
          { top: 36, width: 14, time: 140, start: -0.05 },
        ].map((cloud) => (
          <span
            key={cloud.top}
            className="scene-cloud"
            style={{ top: `${cloud.top}%`, width: `${cloud.width}%`, animationDuration: `${cloud.time}s`, animationDelay: `${cloud.start * cloud.time}s` }}
          >
            <i />
            <i />
            <i />
            <i />
          </span>
        ))}
      </div>

      <Layer sink={35} order={1} className="scene-far">
        <Art>
          <defs>
            <linearGradient id="scene-volcano" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0.35" style={{ stopColor: 'var(--volcano-1)' }} />
              <stop offset="0.62" style={{ stopColor: 'var(--volcano-2)' }} />
            </linearGradient>
            <linearGradient id="scene-volcano-light" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0.1" style={{ stopColor: 'var(--volcano-shadow)', stopOpacity: 0.55 }} />
              <stop offset="0.5" style={{ stopColor: 'var(--volcano-shadow)', stopOpacity: 0 }} />
              <stop offset="0.62" style={{ stopColor: 'var(--volcano-glow)', stopOpacity: 0 }} />
              <stop offset="0.86" style={{ stopColor: 'var(--volcano-glow)', stopOpacity: 0.55 }} />
            </linearGradient>
            <linearGradient id="scene-snow-shade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0.3" style={{ stopColor: 'var(--volcano-1)', stopOpacity: 0.3 }} />
              <stop offset="1" style={{ stopColor: 'var(--volcano-1)', stopOpacity: 0 }} />
            </linearGradient>
            <linearGradient id="scene-volcano-haze" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: 'var(--range-1)', stopOpacity: 0 }} />
              <stop offset="1" style={{ stopColor: 'var(--range-1)', stopOpacity: 0.85 }} />
            </linearGradient>
          </defs>
          <path d={volcanoPath} fill="url(#scene-volcano)" />
          <clipPath id="scene-volcano-shape">
            <path d={volcanoPath} />
          </clipPath>
          <g clipPath="url(#scene-volcano-shape)">
            <path d={gullies} style={{ fill: 'var(--volcano-shadow)', fillOpacity: 0.32 }} />
            {/* Shadow on the side away from the sun, warm light on the side facing it. */}
            <rect x="480" y="300" width="640" height="270" fill="url(#scene-volcano-light)" />
            <path d={snowPath} style={{ fill: 'var(--snow)' }} />
            <rect x="480" y="300" width="290" height="140" fill="url(#scene-snow-shade)" />
            {/* The foot of the mountain fades into haze. */}
            <rect x="480" y="470" width="640" height="90" fill="url(#scene-volcano-haze)" />
          </g>
        </Art>
      </Layer>

      {/* Two flocks cross the sky, one behind the other. */}
      <div className="scene-birds">
        {[
          { top: 27, time: 58, start: -0.36, size: 1 },
          { top: 17, time: 84, start: -0.7, size: 0.7 },
        ].map((group) => (
          <span key={group.top} className="scene-flock" style={{ top: `${group.top}%`, animationDuration: `${group.time}s`, animationDelay: `${group.start * group.time}s` }}>
            {flock.map(([x, y, size], index) => (
              <svg
                key={x}
                viewBox="0 0 22 9"
                focusable="false"
                style={{ left: `${x * group.size}px`, top: `${y * group.size}px`, width: `${22 * size * group.size}px`, animationDelay: `${-index * 0.17}s` }}
              >
                <path d={BIRD} />
              </svg>
            ))}
          </span>
        ))}
      </div>

      <Layer sink={27} order={2}>
        <Art>
          <Range d={paths.range1} fill="var(--range-1)" />
        </Art>
      </Layer>

      <Layer sink={33} order={3}>
        <Art>
          <Range d={paths.range2} fill="var(--range-2)" />
        </Art>
        {turbines.map((turbine) => (
          <span
            key={turbine.x}
            className="scene-turbine"
            style={{ left: pct(turbine.x, W), top: pct(turbine.foot - turbine.height, H), height: pct(turbine.height, H) }}
          >
            <svg
              className="scene-blades"
              viewBox="-50 -50 100 100"
              focusable="false"
              // The rotor is a little wider than the tower is tall; the tower is 0.24% of the picture wide.
              style={{ width: `${Math.round(((turbine.height * 1.2) / (W * 0.0024)) * 100)}%`, animationDuration: `${5 + (turbine.x % 4)}s` }}
            >
              {[0, 120, 240].map((angle) => (
                <path key={angle} d="M-2.4 0L0 -46L2.4 0Z" transform={`rotate(${angle})`} />
              ))}
              <circle r="3.4" />
            </svg>
          </span>
        ))}
      </Layer>

      <Layer sink={42} order={4}>
        <Art>
          <defs>
            <linearGradient id="scene-lake" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" style={{ stopColor: 'var(--lake-2)' }} />
              <stop offset="0.55" style={{ stopColor: 'var(--lake-1)' }} />
              <stop offset="1" style={{ stopColor: 'var(--lake-2)' }} />
            </linearGradient>
          </defs>
          <Range d={paths.range3} fill="var(--range-3)" />
          <ellipse cx="880" cy="676" rx="300" ry="15" fill="url(#scene-lake)" />
        </Art>
        {/* Light on the water. */}
        {[790, 846, 902, 958, 1010].map((x, index) => (
          <span key={x} className="scene-glint" style={{ left: pct(x, W), top: pct(671 + (index % 2) * 5, H), animationDelay: `${-index * 0.9}s` }} />
        ))}
      </Layer>

      <Layer sink={52} order={5}>
        <Art>
          <defs>
            {/* Measured in the picture's own units, so the trees take the same colour as the hill under them. */}
            <linearGradient id="scene-range-4" gradientUnits="userSpaceOnUse" x1="0" y1="630" x2="0" y2="800">
              <stop offset="0.1" style={{ stopColor: 'var(--range-4a)' }} />
              <stop offset="0.95" style={{ stopColor: 'var(--range-4b)' }} />
            </linearGradient>
          </defs>
          <Range d={paths.range4} fill="url(#scene-range-4)" />
        </Art>
      </Layer>

      <Layer sink={66} order={6}>
        <Art>
          <defs>
            <linearGradient id="scene-front" gradientUnits="userSpaceOnUse" x1="0" y1="660" x2="0" y2="900">
              <stop offset="0.1" style={{ stopColor: 'var(--front-1)' }} />
              <stop offset="1" style={{ stopColor: 'var(--front-2)' }} />
            </linearGradient>
          </defs>
          <Range d={paths.front} fill="url(#scene-front)" />
        </Art>
        {/* Motes of light drifting up from the trees (fireflies at night). */}
        {[560, 640, 720, 800, 880, 960, 1040, 300, 1280, 1440].map((x, index) => (
          <span
            key={x}
            className="scene-mote"
            style={{ left: pct(x + (index % 3) * 14, W), top: pct(700 + (index % 4) * 22, H), animationDuration: `${7 + (index % 5)}s`, animationDelay: `${-index * 1.3}s` }}
          />
        ))}
      </Layer>

      <div className="scene-mist" />
      {/* Shade behind the home page headline; it clears as the view lifts. */}
      <div className="scene-shade" />
    </div>
  );
}
