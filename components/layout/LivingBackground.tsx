'use client';

import { useEffect, useRef } from 'react';
import canopySmall from '@/public/images/textures/canopy-small.jpg';
import canopy from '@/public/images/textures/canopy.jpg';

// The scene behind every page: a flight over forest, with mist in the
// hollows, mountains on the horizon and cloud overhead. The camera drifts
// forward slowly on its own and flies further as the page is scrolled, so
// going down the page is flying forward: the forest and the cloud both come
// toward the reader. It leans a little with the mouse.
//
// It follows the theme: broad daylight in the light theme, the hour before
// sunrise in the dark theme, gliding from one to the other when switched.
//
// One small WebGL shader draws it (no library): a photograph of forest
// canopy laid out as the ground and seen in perspective. It is painted
// smaller than the screen and stretched, starts only after the page has
// loaded, runs at a low frame rate and pauses in a hidden tab.
//
// Nothing depends on it. Without WebGL the page is a plain colour; for
// visitors who prefer reduced motion it is one still frame.

const VERTEX = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

const FRAGMENT = `
precision highp float;
uniform vec2 uSize;
uniform float uTime;   // seconds
uniform float uFly;    // how far the camera has flown: time plus the page's scroll
uniform float uNight;  // 0 in the light theme (day), 1 in the dark theme (before sunrise)
uniform vec2 uLook;    // the pointer, -1..1, eased
uniform sampler2D uCanopy;

float hash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.02 + vec2(17.1, 9.2); a *= 0.5; } return s / 0.9375; }

void main() {
  vec2 uv = gl_FragCoord.xy / uSize;
  float aspect = uSize.x / uSize.y;
  float x = (uv.x - 0.5) * aspect;
  float horizon = 0.6 + uLook.y * 0.012; // measured up from the foot of the screen

  // The sky: pale blue by day; deep teal with a band of light on the horizon before sunrise.
  float up = clamp((uv.y - horizon) / (1.0 - horizon), 0.0, 1.0);
  vec3 skyLow = mix(vec3(0.84, 0.93, 0.97), vec3(0.33, 0.47, 0.48), uNight);
  vec3 skyTop = mix(vec3(0.27, 0.58, 0.88), vec3(0.015, 0.08, 0.095), uNight);
  vec3 color = mix(skyLow, skyTop, pow(up, mix(0.75, 0.55, uNight)));

  // Cloud overhead, seen in perspective: it comes toward us as we fly.
  if (uv.y > horizon) {
    float above = uv.y - horizon;
    float reach = 0.09 / (above + 0.02);
    vec2 sky = vec2(x * reach, reach + uFly * 1.5 + uTime * 0.008) * 1.15;
    float puff = fbm(sky + 0.7 * vec2(fbm(sky * 0.5 + 3.0), 0.0));
    float cloud = smoothstep(0.44, 0.7, puff) * smoothstep(0.0, 0.1, above);   // thins out towards the horizon
    // Thick cloud is bright on top and a little grey underneath, which gives it body.
    vec3 cloudColor = mix(mix(vec3(0.8, 0.87, 0.93), vec3(1.0), smoothstep(0.5, 0.82, puff)), vec3(0.2, 0.33, 0.36), uNight);
    color = mix(color, cloudColor, cloud * mix(0.92, 0.5, uNight));
  }

  // The sun: high and soft by day, just under the horizon before sunrise.
  vec2 sun = vec2(0.78, horizon + mix(0.2, 0.04, uNight));
  float toSun = length((uv - sun) * vec2(aspect, 1.0));
  color += mix(vec3(1.0, 0.96, 0.84) * 0.35, vec3(1.0, 0.8, 0.55) * 0.3, uNight) * exp(-toSun * mix(2.2, 3.0, uNight));

  // Two ranges of mountains on the horizon; the nearer one slides a little as we fly.
  float farRange = horizon + 0.02 + 0.17 * pow(fbm(vec2(x * 1.5 + 20.0, 1.0)), 1.6);
  float nearRange = horizon + 0.1 * pow(fbm(vec2(x * 2.6 + uFly * 0.06 + 7.0, 4.0)), 1.3);
  color = mix(color, mix(vec3(0.74, 0.85, 0.9), vec3(0.16, 0.29, 0.31), uNight), smoothstep(farRange + 0.004, farRange - 0.004, uv.y) * 0.9);
  color = mix(color, mix(vec3(0.56, 0.72, 0.68), vec3(0.07, 0.17, 0.18), uNight), smoothstep(nearRange + 0.004, nearRange - 0.004, uv.y) * 0.95);

  if (uv.y < horizon) {
    float below = horizon - uv.y;
    float distance = 0.12 / (below + 0.014);           // far at the horizon, near at the foot
    vec2 ground = vec2(x * distance + uLook.x * 0.03, distance + uFly);

    // The forest. Brighter crowns stand a little higher, which gives the canopy relief.
    vec2 at = ground * 3.4;
    at.y -= (dot(texture2D(uCanopy, at).rgb, vec3(0.333)) - 0.35) * 0.06;
    vec3 trees = texture2D(uCanopy, at).rgb * mix(vec3(0.98, 1.0, 0.9), vec3(0.42, 0.56, 0.46), uNight);

    // Broad patches of lighter and darker forest, so the photograph never looks repeated.
    trees *= mix(0.74, 1.2, fbm(ground * 0.4 + 4.0));
    // Sunlight on the canopy: a soft pool by day, first light on the far trees before sunrise.
    float under = exp(-abs(uv.x - sun.x) * aspect * 1.8);
    trees *= mix(0.94 + 0.22 * under, 0.9 + 0.5 * under * smoothstep(0.35, 0.0, below), uNight);

    // Mist lying in the hollows, drifting slowly.
    float mist = smoothstep(0.42, 0.74, fbm(ground * 0.55 + vec2(uTime * 0.012, -uTime * 0.007) + 9.0));
    vec3 land = mix(trees, mix(vec3(0.95, 0.97, 0.95), vec3(0.3, 0.44, 0.45), uNight), mist * mix(0.72, 0.6, uNight));

    // Everything fades into haze towards the horizon.
    color = mix(mix(vec3(0.82, 0.9, 0.89), vec3(0.24, 0.38, 0.39), uNight), land, smoothstep(0.0, 0.3, below));
  }

  vec2 v = uv - 0.5;
  color *= 1.0 - dot(v, v) * mix(0.1, 0.45, uNight);       // a little darker at the corners, as a lens is
  color += (hash(gl_FragCoord.xy + uTime) - 0.5) / 255.0;  // a grain of noise stops soft gradients banding
  gl_FragColor = vec4(color, 1.0);
}`;

export function LivingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!canvas || !gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
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
    const uSize = uniform('uSize');
    const uTime = uniform('uTime');
    const uFly = uniform('uFly');
    const uNight = uniform('uNight');
    const uLook = uniform('uLook');

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Painted at about 60% of the screen's size each way (never more than about
    // half a megapixel) and stretched.
    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const scale = Math.min(0.6, Math.sqrt(480_000 / Math.max(1, width * height)));
      const w = Math.max(2, Math.round(width * scale));
      const h = Math.max(2, Math.round(height * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uSize, w, h);
    };

    let ready = false;
    let frame = 0;
    let last = 0;
    let time = 0;
    let scroll = window.scrollY / Math.max(1, window.innerHeight);
    let scrollTo = scroll;
    const isNight = () => document.documentElement.dataset.theme === 'dark';
    let night = isNight() ? 1 : 0;
    let nightTo = night;
    const look = [0, 0];
    const lookTo = [0, 0];

    const draw = (dt: number) => {
      if (!ready) return;
      time += dt;
      // Everything eases, so a flick of the scroll wheel is a glide, not a jump.
      const ease = still ? 1 : 1 - Math.exp(-dt * 3.2);
      scroll += (scrollTo - scroll) * ease;
      look[0] += (lookTo[0] - look[0]) * ease;
      look[1] += (lookTo[1] - look[1]) * ease;
      night += (nightTo - night) * (still ? 1 : 1 - Math.exp(-dt * 2.2));
      gl.uniform1f(uTime, time);
      gl.uniform1f(uNight, night);
      gl.uniform1f(uFly, time * 0.01 + scroll * 0.22);
      gl.uniform2f(uLook, look[0], look[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.dataset.live = 'true';
    };
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      // Thirty frames a second while the page is being scrolled or the pointer moves;
      // ten is plenty for the slow drift in between, and it spares the battery.
      const moving =
        Math.abs(scrollTo - scroll) > 0.0005 ||
        Math.abs(lookTo[0] - look[0]) > 0.002 ||
        Math.abs(lookTo[1] - look[1]) > 0.002 ||
        Math.abs(nightTo - night) > 0.002;
      if (now - last < (moving ? 31 : 100)) return;
      const dt = Math.min(0.1, (now - (last || now)) / 1000);
      last = now;
      draw(dt);
    };

    const onScroll = () => {
      scrollTo = window.scrollY / Math.max(1, window.innerHeight);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      lookTo[0] = (event.clientX / window.innerWidth) * 2 - 1;
      lookTo[1] = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onResize = () => {
      resize();
      if (still) draw(0);
    };
    // The theme button changes data-theme on <html>; the scene glides to match.
    const themeWatch = new MutationObserver(() => {
      nightTo = isNight() ? 1 : 0;
      if (still) draw(0);
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const onVisible = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!document.hidden && !still && ready) frame = requestAnimationFrame(loop);
    };

    // Wait until the page itself has loaded, so the background never competes with it.
    // The forest photograph's size is a power of two, so it can repeat (mirrored, to hide
    // the joins) and use mipmaps, which keep the far forest from shimmering.
    let stopped = false;
    const start = () => {
      const image = new Image();
      // Phones get a smaller copy of the photograph.
      image.src = (window.innerWidth < 768 ? canopySmall : canopy).src;
      // decode() prepares the picture off the main thread, so handing it to the graphics card is quick.
      image
        .decode()
        .then(() => {
          if (stopped) return;
          gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
          ready = true;
          resize();
          draw(0);
          if (still) return;
          frame = requestAnimationFrame(loop);
          window.addEventListener('scroll', onScroll, { passive: true });
          window.addEventListener('pointermove', onMove, { passive: true });
        })
        .catch(() => {
          // Without the photograph the page keeps its plain background.
        });
    };
    const wait = window.setTimeout(start, document.readyState === 'complete' ? 600 : 2500);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      stopped = true;
      themeWatch.disconnect();
      window.clearTimeout(wait);
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-night">
      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-0 transition-opacity duration-1000 data-[live=true]:opacity-100"
      />
      {/* A veil in the page's colour that keeps text readable over the scene. */}
      <div className="absolute inset-0 [background-image:var(--wash)]" />
    </div>
  );
}
