'use client';

import { useEffect, useRef } from 'react';
import cloudsSmall from '@/public/images/earth/clouds-small.jpg';
import clouds from '@/public/images/earth/clouds.jpg';
import daySmall from '@/public/images/earth/day-small.jpg';
import day from '@/public/images/earth/day.jpg';
import nightSmall from '@/public/images/earth/night-small.jpg';
import night from '@/public/images/earth/night.jpg';

// A live, slowly turning Earth drawn with WebGL (no 3D library needed).
// One small shader paints the sphere from three NASA maps: the daytime
// surface, the city lights at night and the clouds. The view stays over
// Africa, sways gently, turns a little as the visitor scrolls, and a
// marker pulses on Dar es Salaam.
//
// It pauses when off screen or when the tab is hidden, draws a single
// still frame for visitors who prefer reduced motion, and simply stays
// invisible if WebGL or the images are unavailable.

const DEG = Math.PI / 180;
/** Where the camera looks: over East and Central Africa. */
const CENTER = { lon: 28 * DEG, lat: 3 * DEG };
/** Dar es Salaam. */
const MARKER = { lon: 39.28 * DEG, lat: -6.8 * DEG };
/** Direction of the sunlight, as seen by the viewer (x right, y up, z towards the viewer). */
const SUN = [0.6, 0.36, 0.71];
/** Radius of the globe as a share of half the canvas; the rest is the glow. */
const RADIUS = 0.84;

const VERTEX = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT = `
precision highp float;
uniform vec2 uSize;
uniform float uTime;
uniform float uLon;
uniform float uLat;
uniform float uCloudShift;
uniform vec3 uSun;
uniform vec2 uMarker;
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uClouds;

const float PI = 3.14159265;
const float R = ${RADIUS.toFixed(2)};

// Turns a point on the visible sphere into a direction on the real globe.
vec3 toGlobe(vec3 n) {
  float a = -uLat;
  vec3 t = vec3(n.x, n.y * cos(a) - n.z * sin(a), n.y * sin(a) + n.z * cos(a));
  return vec3(t.x * cos(uLon) + t.z * sin(uLon), t.y, -t.x * sin(uLon) + t.z * cos(uLon));
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uSize) / (0.5 * min(uSize.x, uSize.y));
  float d = length(p);
  float pixel = 2.0 / min(uSize.x, uSize.y);
  vec3 air = vec3(0.37, 0.76, 0.84);

  // Soft glow of the atmosphere around the planet, brighter on the sunlit side.
  float sunSide = clamp(dot(normalize(vec3(p, 0.25)), uSun) * 0.6 + 0.55, 0.0, 1.0);
  float halo = exp(-max(d - R, 0.0) * 11.0) * 0.5 * sunSide;
  vec4 color = vec4(air * halo, halo);

  if (d < R) {
    vec3 n = vec3(p, sqrt(R * R - d * d)) / R;
    vec3 g = toGlobe(n);
    vec2 uv = vec2(atan(g.x, g.z) / (2.0 * PI) + 0.5, asin(clamp(g.y, -1.0, 1.0)) / PI + 0.5);

    vec3 dayColor = texture2D(uDay, uv).rgb;
    vec3 nightColor = texture2D(uNight, uv).rgb;
    float cloud = texture2D(uClouds, vec2(uv.x + uCloudShift, uv.y)).r;

    // 0 on the night side, 1 in full daylight, with a soft dawn in between.
    float light = smoothstep(-0.25, 0.55, dot(n, uSun));

    vec3 surface = pow(dayColor * (0.06 + 1.05 * light), vec3(0.92));
    float cityLights = max(nightColor.r - 0.2, 0.0) * 2.4 * (1.0 - light) * (1.0 - cloud * 0.7);
    surface += vec3(1.0, 0.78, 0.45) * cityLights;
    surface = mix(surface, vec3(0.12 + 0.95 * light), cloud * 0.82);
    surface += air * pow(1.0 - n.z, 2.6) * (0.18 + 0.75 * light);

    // Pulsing marker.
    vec3 m = vec3(cos(uMarker.y) * sin(uMarker.x), sin(uMarker.y), cos(uMarker.y) * cos(uMarker.x));
    float angle = acos(clamp(dot(g, m), -1.0, 1.0));
    float pulse = fract(uTime * 0.45);
    float core = smoothstep(0.02, 0.012, angle);
    float ring = smoothstep(0.012, 0.0, abs(angle - (0.022 + pulse * 0.085))) * (1.0 - pulse);
    surface = mix(surface, vec3(0.63, 0.84, 0.32), clamp(core + ring * 0.9, 0.0, 1.0));

    color = mix(color, vec4(surface, 1.0), smoothstep(R, R - pixel * 1.5, d));
  }

  gl_FragColor = color;
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function loadTexture(gl: WebGLRenderingContext, unit: number, src: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      resolve();
    };
    image.onerror = reject;
    image.src = src;
  });
}

export function EarthCanvas({ markerLabel }: { markerLabel: string }) {
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
    gl.uniform3fv(uniform('uSun'), SUN);
    gl.uniform2f(uniform('uMarker'), MARKER.lon, MARKER.lat);
    const uSize = uniform('uSize');
    const uTime = uniform('uTime');
    const uLon = uniform('uLon');
    const uLat = uniform('uLat');
    const uCloudShift = uniform('uCloudShift');

    // Phones get the lighter maps: about a quarter of the download.
    const small = window.innerWidth < 768;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const started = performance.now();
    let frame = 0;
    let ready = false;
    let onScreen = true;
    let stopped = false;

    const draw = (now: number) => {
      frame = 0;
      if (stopped || !ready) return;

      const side = canvas.clientWidth;
      const pixels = Math.round(side * Math.min(window.devicePixelRatio || 1, small ? 2 : 1.5));
      if (canvas.width !== pixels) {
        canvas.width = pixels;
        canvas.height = pixels;
        gl.viewport(0, 0, pixels, pixels);
      }

      const time = still ? 0 : (now - started) / 1000;
      const scrolled = Math.min(window.scrollY / window.innerHeight, 1.5);
      const lon = CENTER.lon + Math.sin(time * 0.11) * 0.3 + scrolled * 0.55;
      const lat = CENTER.lat + Math.sin(time * 0.07) * 0.05;

      gl.uniform2f(uSize, pixels, pixels);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uLon, lon);
      gl.uniform1f(uLat, lat);
      gl.uniform1f(uCloudShift, time * 0.0035);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // Keep the place name next to the marker (same maths as the shader, reversed).
      const mx = Math.cos(MARKER.lat) * Math.sin(MARKER.lon);
      const my = Math.sin(MARKER.lat);
      const mz = Math.cos(MARKER.lat) * Math.cos(MARKER.lon);
      const tx = mx * Math.cos(lon) - mz * Math.sin(lon);
      const tz = mx * Math.sin(lon) + mz * Math.cos(lon);
      const ny = my * Math.cos(lat) - tz * Math.sin(lat);
      const nz = my * Math.sin(lat) + tz * Math.cos(lat);
      const half = side / 2;
      label.style.transform = `translate(${half + tx * RADIUS * half}px, ${half - ny * RADIUS * half}px)`;
      label.style.opacity = nz > 0.25 ? '1' : '0';

      if (!still && onScreen && !document.hidden) frame = requestAnimationFrame(draw);
    };

    const play = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    Promise.all([
      loadTexture(gl, 0, small ? daySmall.src : day.src),
      loadTexture(gl, 1, small ? nightSmall.src : night.src),
      loadTexture(gl, 2, small ? cloudsSmall.src : clouds.src),
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
    <div className="relative aspect-square w-full">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="h-full w-full opacity-0 transition-opacity duration-[1600ms] data-[ready=true]:opacity-100"
      />
      <span
        ref={labelRef}
        aria-hidden="true"
        className="absolute left-0 top-0 opacity-0 transition-opacity duration-500"
      >
        <span className="ml-4 block -translate-y-1/2 whitespace-nowrap rounded-full bg-teal-darkest/75 px-3 py-1 text-xs font-bold text-white sm:text-sm">
          {markerLabel}
        </span>
      </span>
    </div>
  );
}
