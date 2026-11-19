'use client';

import { useEffect, useRef } from 'react';
import cloudsSmall from '@/public/images/earth/clouds-small.jpg';
import clouds from '@/public/images/earth/clouds.jpg';
import dayLarge from '@/public/images/earth/day-large.jpg';
import day from '@/public/images/earth/day.jpg';
import nightLarge from '@/public/images/earth/night-large.jpg';
import night from '@/public/images/earth/night.jpg';

// The home page scene: the Earth seen from orbit, filling the whole hero.
//
// A single WebGL shader (no 3D library) paints the planet from three NASA
// maps: the daytime surface, the city lights at night and the clouds. The
// camera looks north across East Africa to the curved horizon, where the
// sun is rising. Everything moves a little: the planet turns (and turns
// further as the visitor scrolls), clouds drift, city lights flicker, the
// sunrise breathes and a marker pulses on Dar es Salaam.
//
// Opening: the first time the page is opened in a browser tab, the camera
// starts far out with the whole planet turning, dives towards East Africa
// and settles into the horizon view. When it has landed, the hero section
// gets data-intro="done" (the stylesheet uses it to stop delaying the text).
//
// It pauses when off screen or when the tab is hidden, draws one still
// frame for visitors who prefer reduced motion, and leaves the plain
// night-sky background in place if WebGL or the maps are unavailable.

const DEG = Math.PI / 180;
/** Dar es Salaam. */
const MARKER = { lon: 39.28 * DEG, lat: -6.8 * DEG };
/** Direction of the sun as the viewer sees it: low over the horizon, up and to the right. */
const SUN = [0.2, 0.62, -0.76];

/** Length of the opening dive, in seconds. */
const DIVE = 2.8;
/** Remembers, for this browser tab, that the opening has been seen. */
const SEEN = 'ecosphere-intro-seen';

const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/** How the planet is framed. Positions are shares of the hero's width and height. */
const FRAMING = {
  // Wide screens: a long, gentle horizon with its highest point right of centre.
  wide: { peakX: 0.56, peakY: 0.13, drop: 0.22, lon: 31 * DEG, lat: -65 * DEG },
  // Phones: the horizon sits below the headline, so the words stand in the night sky
  // and the planet, the sunrise and the marker are clear underneath.
  narrow: { peakX: 0.5, peakY: 0.4, drop: 0.05, lon: 30 * DEG, lat: -32 * DEG },
};

const VERTEX = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT = `
precision highp float;
uniform vec2 uCenter;      // centre of the planet, in canvas pixels (y up)
uniform float uRadius;     // its radius, in canvas pixels
uniform vec2 uMarkerAt;    // the marker, in canvas pixels (y up); x is negative while it is out of view
uniform float uScale;      // canvas pixels per screen pixel
uniform float uTime;
uniform float uLon;
uniform float uLat;
uniform vec3 uSun;
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uClouds;

const float PI = 3.14159265;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float sum = 0.0, amp = 0.5;
  for (int i = 0; i < 5; i++) { sum += amp * noise(p); p *= 2.03; amp *= 0.5; }
  return sum;
}

// Turns a point on the visible sphere into a direction on the real globe.
vec3 toGlobe(vec3 n) {
  float a = -uLat;
  vec3 t = vec3(n.x, n.y * cos(a) - n.z * sin(a), n.y * sin(a) + n.z * cos(a));
  return vec3(t.x * cos(uLon) + t.z * sin(uLon), t.y, -t.x * sin(uLon) + t.z * cos(uLon));
}

// 1 over sea and lakes, 0 over land (the map's water is always bluer than its land).
float water(vec2 uv) {
  vec3 c = texture2D(uDay, uv).rgb;
  return smoothstep(0.0, 0.09, c.b - max(c.r, c.g) * 0.92);
}

void main() {
  vec2 p = (gl_FragCoord.xy - uCenter) / uRadius;
  float d = length(p);
  vec3 air = vec3(0.3, 0.78, 0.95);
  vec3 dawn = vec3(1.0, 0.74, 0.45);

  // Where the sun meets the horizon, and how close this pixel is to it (in screen pixels).
  vec2 sunrise = normalize(uSun.xy);
  float toSun = length(p - sunrise) * uRadius / uScale;
  float breathe = 0.92 + 0.08 * sin(uTime * 0.6);
  float flare = (exp(-toSun / 46.0) * 1.1 + exp(-toSun / 190.0) * 0.5 + exp(-toSun / 620.0) * 0.22) * breathe;

  // Bright line of atmosphere along the horizon, with a wide soft glow above it.
  float above = max(d - 1.0, 0.0) * uRadius / uScale;
  float nearSun = exp(-toSun / 560.0);
  float halo = exp(-above / 7.0) * (0.45 + 0.55 * nearSun) + exp(-above / 46.0) * 0.3 + exp(-above / 190.0) * 0.1;
  vec3 haloColor = mix(air, dawn, nearSun * 0.7);
  vec4 color = vec4(haloColor * halo + dawn * flare, clamp(halo + flare, 0.0, 1.0));

  if (d < 1.0) {
    vec3 n = vec3(p, sqrt(1.0 - d * d));
    vec3 g = toGlobe(n);
    vec2 uv = vec2(atan(g.x, g.z) / (2.0 * PI) + 0.5, asin(clamp(g.y, -1.0, 1.0)) / PI + 0.5);

    vec3 map = texture2D(uDay, uv).rgb;
    float sea = water(uv);

    // Richer colour than the raw satellite map: deep blue water, greener land.
    float grey = dot(map, vec3(0.299, 0.587, 0.114));
    vec3 land = mix(vec3(grey), map, 1.5) * vec3(0.92, 1.08, 0.86);
    vec3 ocean = mix(map, vec3(0.02, 0.2, 0.42), 0.55) * (0.75 + 0.5 * fbm(uv * vec2(700.0, 350.0) + uTime * 0.03));
    vec3 ground = mix(land, ocean, sea);

    // 0 at night, 1 in full daylight, with a long soft dawn in between.
    float light = smoothstep(-0.3, 0.5, dot(n, uSun));
    float glowHere = exp(-toSun / 680.0);

    vec3 moonlit = ground * vec3(0.38, 0.62, 1.0) * 0.34;
    vec3 sunlit = ground * (0.2 + 1.05 * light);
    vec3 surface = mix(moonlit, sunlit, light);

    // Thin glowing coastlines, strongest on the night side. The sampling step is a
    // couple of screen pixels, so the line stays fine however large the planet is.
    float edge = 2.0 * uScale / (uRadius * 2.0 * PI);
    float coast = abs(water(uv + vec2(edge, 0.0)) - water(uv - vec2(edge, 0.0)))
      + abs(water(uv + vec2(0.0, edge * 2.0)) - water(uv - vec2(0.0, edge * 2.0)));
    surface += vec3(0.3, 0.85, 1.0) * clamp(coast, 0.0, 1.0) * (0.12 + 0.5 * (1.0 - light));

    float step = 0.0009;
    // City lights with a soft bloom, flickering, fading out as day arrives.
    float lights = max(texture2D(uNight, uv).r - 0.2, 0.0) * 1.6;
    lights += max(texture2D(uNight, uv + vec2(step, 0.0)).r - 0.2, 0.0) * 0.5;
    lights += max(texture2D(uNight, uv - vec2(step, 0.0)).r - 0.2, 0.0) * 0.5;
    lights += max(texture2D(uNight, uv + vec2(0.0, step * 2.0)).r - 0.2, 0.0) * 0.5;
    lights += max(texture2D(uNight, uv - vec2(0.0, step * 2.0)).r - 0.2, 0.0) * 0.5;
    float flicker = 0.8 + 0.2 * sin(uTime * 1.7 + hash(floor(uv * vec2(1400.0, 700.0))) * 6.283);

    // Clouds: the satellite map decides where they are, fine noise gives them crisp edges.
    vec2 cuv = vec2(uv.x + uTime * 0.0014, uv.y);
    float cover = texture2D(uClouds, cuv).r * 0.4
      + (texture2D(uClouds, cuv + vec2(0.003, 0.0)).r + texture2D(uClouds, cuv - vec2(0.003, 0.0)).r
      + texture2D(uClouds, cuv + vec2(0.0, 0.006)).r + texture2D(uClouds, cuv - vec2(0.0, 0.006)).r) * 0.15;
    float wisps = fbm(cuv * vec2(300.0, 150.0) + vec2(uTime * 0.012, 0.0));
    float cloud = smoothstep(0.4, 0.78, cover * 0.8 + wisps * 0.5 - 0.06);

    surface += vec3(1.0, 0.78, 0.42) * lights * (1.0 - light) * (1.0 - cloud * 0.8) * flicker * 1.5;

    vec3 cloudColor = mix(vec3(0.1, 0.16, 0.26), mix(dawn, vec3(1.0), smoothstep(0.3, 0.85, light)), smoothstep(0.02, 0.5, light));
    surface = mix(surface, cloudColor, cloud * 0.9);

    // Haze that thickens towards the horizon, warm where the sun is coming up.
    float rim = pow(1.0 - n.z, 3.2);
    surface += mix(vec3(0.05, 0.3, 0.52), mix(air, dawn, glowHere * 0.8), light) * rim * 1.1;
    surface += dawn * glowHere * rim * 0.55 * breathe;

    // Pulsing marker, drawn in screen pixels so it stays a true circle.
    if (uMarkerAt.x >= 0.0) {
      float away = length(gl_FragCoord.xy - uMarkerAt) / uScale;
      float pulse = fract(uTime * 0.45);
      float core = smoothstep(7.0, 5.0, away);
      float ring = smoothstep(2.4, 0.0, abs(away - (9.0 + pulse * 30.0))) * (1.0 - pulse);
      surface = mix(surface, vec3(0.63, 0.84, 0.32), clamp(core + ring * 0.9, 0.0, 1.0));
    }

    color = mix(color, vec4(surface + dawn * flare * 0.55, 1.0), smoothstep(1.0, 1.0 - 1.5 / uRadius, d));
  }

  gl_FragColor = color;
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

/** Downloads a map and hands it to the graphics card. Decoding happens off the main thread where the browser allows it. */
async function loadTexture(gl: WebGLRenderingContext, unit: number, src: string) {
  let source: TexImageSource;
  let flip = true;

  if ('createImageBitmap' in window) {
    const blob = await (await fetch(src)).blob();
    source = await createImageBitmap(blob, { imageOrientation: 'flipY' });
    flip = false;
  } else {
    source = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flip);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

export function EarthScene({ markerLabel }: { markerLabel: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const label = labelRef.current;
    const gl = canvas?.getContext('webgl', { alpha: true, antialias: false });
    if (!canvas || !label || !gl) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // One large triangle that covers the whole canvas.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    gl.uniform1i(uniform('uDay'), 0);
    gl.uniform1i(uniform('uNight'), 1);
    gl.uniform1i(uniform('uClouds'), 2);
    const sunLength = Math.hypot(SUN[0], SUN[1], SUN[2]);
    gl.uniform3f(uniform('uSun'), SUN[0] / sunLength, SUN[1] / sunLength, SUN[2] / sunLength);
    const uCenter = uniform('uCenter');
    const uRadius = uniform('uRadius');
    const uMarkerAt = uniform('uMarkerAt');
    const uScale = uniform('uScale');
    const uTime = uniform('uTime');
    const uLon = uniform('uLon');
    const uLat = uniform('uLat');

    // Large screens get the sharper maps; phones a lighter set.
    const large = window.innerWidth >= 1024;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = canvas.closest('section');
    const started = performance.now();
    let frame = 0;
    let ready = false;
    let onScreen = true;
    let stopped = false;

    // Skip the opening dive if it has been seen in this tab, or if motion is unwanted.
    let seen = still;
    try {
      seen = seen || window.sessionStorage.getItem(SEEN) === 'yes';
    } catch {
      // Storage can be blocked (private windows); the dive simply plays again.
    }
    let diveFrom = seen ? -1 : 0; // time the dive began; -1 once it is over
    const land = () => {
      diveFrom = -1;
      hero?.setAttribute('data-intro', 'done');
      try {
        window.sessionStorage.setItem(SEEN, 'yes');
      } catch {
        // See above.
      }
    };
    if (seen) land();

    const draw = (now: number) => {
      frame = 0;
      if (stopped || !ready) return;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      // Full resolution is not needed for a soft scene like this; it keeps phones and laptops cool.
      const ratio = Math.min(window.devicePixelRatio || 1, width >= 1024 ? 1 : 1.5);
      if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      // Final framing: size the planet so its horizon peaks at (peakX, peakY)
      // and falls by "drop" at the far edge of the screen.
      const view = width >= 1024 ? FRAMING.wide : FRAMING.narrow;
      const finalPeakX = width * view.peakX;
      const reach = Math.max(finalPeakX, width - finalPeakX);
      const drop = height * view.drop;
      const finalRadius = (reach * reach + drop * drop) / (2 * drop);

      // Opening dive: 0 = far out with the whole planet in view, 1 = landed.
      let arrival = 1;
      if (diveFrom >= 0) {
        if (diveFrom === 0) diveFrom = now;
        const progress = Math.min((now - diveFrom) / 1000 / DIVE, 1);
        arrival = easeInOut(progress);
        if (progress === 1) land();
      }
      const farRadius = Math.min(width, height) * 0.3;
      // Zooming looks even when the size grows by the same ratio each moment.
      const radius = Math.exp(lerp(Math.log(farRadius), Math.log(finalRadius), arrival));
      const centerX = lerp(width * (width >= 1024 ? 0.66 : 0.5), finalPeakX, arrival);
      const centerY = lerp(height * 0.5 - farRadius, height * view.peakY, arrival) + radius;

      const time = still ? 0 : (now - started) / 1000;
      const scrolled = Math.min(window.scrollY / window.innerHeight, 1.5);
      const lon = view.lon - (1 - arrival) * 1.9 + Math.sin(time * 0.08) * 0.07 * arrival + scrolled * 0.3;
      const lat = lerp(10 * DEG, view.lat, arrival) + Math.sin(time * 0.05) * 0.015 * arrival;

      // Where the marker sits on screen (same maths as the shader, reversed).
      const mx = Math.cos(MARKER.lat) * Math.sin(MARKER.lon);
      const my = Math.sin(MARKER.lat);
      const mz = Math.cos(MARKER.lat) * Math.cos(MARKER.lon);
      const tx = mx * Math.cos(lon) - mz * Math.sin(lon);
      const tz = mx * Math.sin(lon) + mz * Math.cos(lon);
      const ny = my * Math.cos(lat) - tz * Math.sin(lat);
      const nz = my * Math.sin(lat) + tz * Math.cos(lat);
      const markerX = centerX + tx * radius;
      const markerY = centerY - ny * radius;
      const markerShown = nz > 0.2;

      gl.uniform2f(uCenter, centerX * ratio, (height - centerY) * ratio);
      gl.uniform1f(uRadius, radius * ratio);
      gl.uniform2f(uMarkerAt, markerShown ? markerX * ratio : -1, (height - markerY) * ratio);
      gl.uniform1f(uScale, ratio);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uLon, lon);
      gl.uniform1f(uLat, lat);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // Keep the place name next to the marker.
      label.style.transform = `translate(${markerX}px, ${markerY}px)`;
      label.style.opacity = markerShown && arrival === 1 ? '1' : '0';

      if (!still && onScreen && !document.hidden) frame = requestAnimationFrame(draw);
    };

    const play = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    Promise.all([
      loadTexture(gl, 0, large ? dayLarge.src : day.src),
      loadTexture(gl, 1, large ? nightLarge.src : night.src),
      loadTexture(gl, 2, large ? clouds.src : cloudsSmall.src),
    ])
      .then(() => {
        if (stopped) return;
        ready = true;
        canvas.dataset.ready = 'true';
        play();
      })
      .catch(() => {
        // Without the maps the hero keeps its plain night-sky background.
      });

    const watcher = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) play();
    });
    watcher.observe(canvas);
    document.addEventListener('visibilitychange', play);
    window.addEventListener('resize', play);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      watcher.disconnect();
      document.removeEventListener('visibilitychange', play);
      window.removeEventListener('resize', play);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="h-full w-full opacity-0 transition-opacity duration-[1800ms] data-[ready=true]:opacity-100"
      />
      <span ref={labelRef} aria-hidden="true" className="absolute left-0 top-0 hidden opacity-0 transition-opacity duration-500 sm:block">
        <span className="ml-4 block -translate-y-1/2 whitespace-nowrap text-sm font-bold text-white [text-shadow:0_1px_10px_rgb(0_20_26/0.95)]">
          {markerLabel}
        </span>
      </span>
    </div>
  );
}
