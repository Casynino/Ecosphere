import Image from 'next/image';
import type { CSSProperties } from 'react';
import { stock } from '@/content/media';

const speed = (seconds: number) => ({ '--mist-speed': `${seconds}s` }) as CSSProperties;

/**
 * The scene behind every page: a misty forest that glides as you scroll,
 * bands of drifting mist, and a few birds that cross the screen on the
 * way down. Purely decorative, so it is hidden from screen readers.
 * Styles and motion: globals.css ("Living background").
 */
export function LivingBackground() {
  return (
    <div data-page-progress aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <Image
        src={stock.mistyCanopy.src}
        alt=""
        fill
        sizes="100vw"
        quality={60}
        fetchPriority="low"
        className="living-photo object-cover object-bottom"
      />
      {/* Soft wash that keeps text readable over the photograph. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(246_249_247/0.93)_0%,rgb(246_249_247/0.84)_55%,rgb(246_249_247/0.58)_100%)]" />
      <div className="mist top-[30%] h-[44vh] opacity-80" style={speed(110)} />
      <div className="mist top-[58%] h-[38vh] opacity-70 [animation-direction:reverse]" style={speed(150)} />
      <svg
        viewBox="0 0 220 110"
        className="birds absolute left-0 top-[46vh] w-28 text-teal-dark/55 sm:w-40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g>
          <path d="M96 44q11-14 22 0q11-14 22 0" />
          <path d="M40 70q8-10 16 0q8-10 16 0" />
          <path d="M152 78q8-10 16 0q8-10 16 0" />
          <path d="M8 96q6-8 12 0q6-8 12 0" />
          <path d="M186 22q6-8 12 0q6-8 12 0" />
        </g>
      </svg>
    </div>
  );
}
