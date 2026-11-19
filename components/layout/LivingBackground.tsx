'use client';

import { useEffect, useRef } from 'react';

// The background behind every page: the contour lines of a survey map,
// drawn faintly on the dark page. The land they describe shifts slowly on
// its own and slides as the page is scrolled, so the page always feels as
// if it is moving over terrain. It leans a little with the mouse.
//
// One small WebGL shader draws it (no library, nothing to download). It
// starts only after the page has loaded, runs at a low frame rate and
// pauses in a hidden tab. Without WebGL the page is plain dark; for
// visitors who prefer reduced motion it is one still frame.

const VERTEX = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

const FRAGMENT = `
precision highp float;
uniform vec2 uSize;
uniform float uTime;   // seconds
uniform float uFly;    // how far the map has moved: time plus the page's scroll
uniform vec2 uLook;    // the pointer, -1..1, eased

float hash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.02 + vec2(17.1, 9.2); a *= 0.5; } return s / 0.9375; }

void main() {
  vec2 uv = gl_FragCoord.xy / uSize;
  vec2 p = vec2((uv.x - 0.5) * uSize.x / uSize.y, uv.y - 0.5);

  // The height of the land at this point. A second field pushes the first
  // about, which gives ridges and valleys instead of even lumps.
  vec2 q = p * 1.3 + vec2(uLook.x * 0.02, -uFly);
  vec2 push = vec2(fbm(q * 0.8 + uTime * 0.008), fbm(q * 0.8 - uTime * 0.006 + 5.2)) - 0.5;
  float height = fbm(q + 0.9 * push);

  // A contour line wherever the height crosses a level; every fourth is stronger.
  float level = height * 18.0;
  float width = fwidth(level) + 0.0001;
  float line = 1.0 - smoothstep(0.5, 1.5, abs(fract(level - 0.5) - 0.5) / width);
  float major = 1.0 - smoothstep(0.5, 1.7, abs(fract(level / 4.0 - 0.5) - 0.5) * 4.0 / width);

  vec3 color = vec3(0.008, 0.075, 0.086);                           // the page's night colour
  color += vec3(0.0, 0.026, 0.03) * smoothstep(0.4, 0.75, height);  // higher ground is a shade lighter
  color += vec3(0.37, 0.76, 0.84) * (line * 0.05 + major * 0.045);
  color *= 1.0 - 0.3 * dot(p, p);                                   // a little darker at the edges
  color += (hash(gl_FragCoord.xy + uTime) - 0.5) / 255.0;           // a grain of noise stops banding
  gl_FragColor = vec4(color, 1.0);
}`;

export function LivingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    // The lines need to know how fast the height changes from pixel to pixel.
    if (!canvas || !gl || !gl.getExtension('OES_standard_derivatives')) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, `#extension GL_OES_standard_derivatives : enable\n${FRAGMENT}`));
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
    const uLook = uniform('uLook');

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // One canvas pixel per screen point, and never more than about a megapixel.
    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const scale = Math.min(1, Math.sqrt(1_000_000 / Math.max(1, width * height)));
      const w = Math.max(2, Math.round(width * scale));
      const h = Math.max(2, Math.round(height * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uSize, w, h);
    };

    let frame = 0;
    let last = 0;
    let time = 0;
    let scroll = window.scrollY / Math.max(1, window.innerHeight);
    let scrollTo = scroll;
    const look = [0, 0];
    const lookTo = [0, 0];

    const draw = (dt: number) => {
      time += dt;
      // Everything eases, so a flick of the scroll wheel is a glide, not a jump.
      const ease = still ? 1 : 1 - Math.exp(-dt * 3.2);
      scroll += (scrollTo - scroll) * ease;
      look[0] += (lookTo[0] - look[0]) * ease;
      look[1] += (lookTo[1] - look[1]) * ease;
      gl.uniform1f(uTime, time);
      gl.uniform1f(uFly, time * 0.004 + scroll * 0.16);
      gl.uniform2f(uLook, look[0], look[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.dataset.live = 'true';
    };
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      // Thirty frames a second while the page is being scrolled or the pointer moves;
      // ten is plenty for the slow drift in between, and it spares the battery.
      const moving = Math.abs(scrollTo - scroll) > 0.0005 || Math.abs(lookTo[0] - look[0]) > 0.002;
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
    const onVisible = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!document.hidden && !still) frame = requestAnimationFrame(loop);
    };

    // Wait until the page itself has loaded, so the background never competes with it.
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      resize();
      draw(0);
      if (still) return;
      frame = requestAnimationFrame(loop);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('pointermove', onMove, { passive: true });
    };
    const wait = window.setTimeout(start, document.readyState === 'complete' ? 300 : 1800);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
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
    </div>
  );
}
