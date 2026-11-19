import Image from 'next/image';
import type { CSSProperties } from 'react';
import { stock } from '@/content/media';

const speed = (seconds: number) => ({ '--mist-speed': `${seconds}s` }) as CSSProperties;

/**
 * The scene behind every page: a misty forest that glides as you scroll,
 * with bands of drifting mist. Purely decorative, so it is hidden from
 * screen readers.
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
    </div>
  );
}
