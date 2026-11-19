'use client';

import { useEffect, useRef } from 'react';
import canopy from '@/public/images/textures/canopy.jpg';

// The scene behind every page: a quiet flight over forest in morning mist
// towards distant hills. The camera drifts forward slowly on its own and
// flies further as the page is scrolled, so going down the page is flying
// forward. It leans a little with the mouse.
//
// One small WebGL shader draws it (no library): a photograph of forest
// canopy laid out as the ground and seen in perspective, with drifting mist,
// haze towards the horizon, two ranges of hills and a soft sun. It is
// painted smaller than the screen and stretched, which keeps it cheap on
// phones; the slight softness suits the mist.
//
// Nothing depends on it. Without WebGL the plain gradient under the canvas
// stays; for visitors who prefer reduced motion it is one still frame.

const VERTEX = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

const FRAGMENT = `
precision highp float;
uniform vec2 uSize;
uniform float uTime;   // seconds
uniform float uFly;    // how far the camera has flown: time plus the page's scroll
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
  float horizon = 0.58 + uLook.y * 0.012; // measured up from the foot of the screen

  // Morning sky, with the sun low on the right.
  float up = clamp((uv.y - horizon) / (1.0 - horizon), 0.0, 1.0);
  vec3 color = mix(vec3(0.975, 0.98, 0.965), vec3(0.86, 0.93, 0.94), pow(up, 0.8));
  vec2 sun = vec2(0.8, horizon + 0.15);
  float toSun = length((uv - sun) * vec2(aspect, 1.0));
  color += vec3(1.0, 0.94, 0.8) * 0.22 * exp(-toSun * 2.4);

  // Two ranges of mountains on the horizon, pale with distance; the nearer one slides a little as we fly.
  float farRange = horizon + 0.02 + 0.17 * pow(fbm(vec2(x * 1.5 + 20.0, 1.0)), 1.6);
  float nearRange = horizon + 0.0 + 0.1 * pow(fbm(vec2(x * 2.6 + uFly * 0.06 + 7.0, 4.0)), 1.3);
  color = mix(color, vec3(0.8, 0.88, 0.89), smoothstep(farRange + 0.006, farRange - 0.006, uv.y) * 0.55);
  color = mix(color, vec3(0.7, 0.81, 0.79), smoothstep(nearRange + 0.006, nearRange - 0.006, uv.y) * 0.6);

  if (uv.y < horizon) {
    float below = horizon - uv.y;
    float distance = 0.12 / (below + 0.014);           // far at the horizon, near at the foot
    vec2 ground = vec2(x * distance + uLook.x * 0.03, distance + uFly);

    // The forest. Brighter crowns stand a little higher, which gives the canopy relief.
    vec2 at = ground * 3.4;
    at.y -= (dot(texture2D(uCanopy, at).rgb, vec3(0.333)) - 0.35) * 0.06;
    vec3 trees = texture2D(uCanopy, at).rgb;
    trees = mix(trees, vec3(0.8, 0.87, 0.8), 0.5);   // pale, as seen through morning air

    // Broad patches of lighter and darker forest, so the photograph never looks repeated.
    float patch = fbm(ground * 0.4 + 4.0);
    trees *= mix(0.9, 1.08, patch);
    trees *= 0.97 + 0.08 * exp(-abs(uv.x - sun.x) * aspect * 1.8);   // a touch brighter under the sun

    // Mist lying in the hollows, drifting slowly.
    float mist = smoothstep(0.3, 0.66, fbm(ground * 0.55 + vec2(uTime * 0.012, -uTime * 0.007) + 9.0));
    vec3 land = mix(trees, vec3(0.96, 0.975, 0.96), mist * 0.9);

    // Everything fades into haze towards the horizon.
    color = mix(vec3(0.9, 0.94, 0.925), land, smoothstep(0.0, 0.42, below));
  }

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
    const uLook = uniform('uLook');

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Painted at about half the screen's size each way (never more than about half a megapixel) and stretched.
    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const scale = Math.min(0.62, Math.sqrt(520_000 / Math.max(1, width * height)));
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
      gl.uniform1f(uTime, time);
      gl.uniform1f(uFly, time * 0.008 + scroll * 0.24);
      gl.uniform2f(uLook, look[0], look[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.dataset.live = 'true';
    };
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      // Thirty frames a second while the page is being scrolled or the pointer moves;
      // twelve is plenty for the slow drift in between, and it spares the battery.
      const moving =
        Math.abs(scrollTo - scroll) > 0.0005 || Math.abs(lookTo[0] - look[0]) > 0.002 || Math.abs(lookTo[1] - look[1]) > 0.002;
      if (now - last < (moving ? 31 : 80)) return;
      const dt = Math.min(0.1, (now - (last || now)) / 1000);
      last = now;
      draw(dt);
    };
    const once = () => {
      resize();
      draw(0);
    };

    // The forest photograph. Its size is a power of two, so it can repeat (mirrored, to hide the joins)
    // and use mipmaps, which keep the far forest from shimmering.
    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
      ready = true;
      once();
    };
    image.src = canopy.src;

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
      if (still) once();
    };
    const onVisible = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!document.hidden && !still) frame = requestAnimationFrame(loop);
    };

    resize();
    if (!still) {
      frame = requestAnimationFrame(loop);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('pointermove', onMove, { passive: true });
    }
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_bottom,#dbeaec_0%,#f1f5f0_42%,#cfdfcf_100%)]"
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-0 transition-opacity duration-1000 data-[live=true]:opacity-100"
      />
      {/* Soft wash that keeps the scene quiet behind the page. */}
      <div className="absolute inset-0 bg-background/30" />
    </div>
  );
}
