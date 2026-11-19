'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from '@/i18n/navigation';

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Holds the living landscape (SceneArt.tsx) behind every page and ties it
 * to scrolling.
 *
 * On the home page the whole landscape is in view at the top. As the
 * visitor scrolls the first screen, the view lifts: the hills sink out of
 * the frame, nearer ones faster, the sun climbs and the sky turns to clear
 * day, leaving a bright, calm sky behind the text. `--s` carries that
 * progress (0 = landscape, 1 = sky) to the stylesheet. Every other page
 * starts in the sky, and so does the home page without JavaScript.
 *
 * It lives in the layout, so it carries on from page to page. The page
 * itself always scrolls normally.
 */
export function LivingBackground({ children }: { children: ReactNode }) {
  const home = usePathname() === '/';
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !home) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const lifted = clamp(window.scrollY / (window.innerHeight * 0.6)).toFixed(4);
      scene.style.setProperty('--s', lifted);
      // The headline fades out with it (globals.css, .hero-copy).
      document.querySelector<HTMLElement>('.has-intro')?.style.setProperty('--s', lifted);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      scene.style.removeProperty('--s');
    };
  }, [home]);

  return (
    <div ref={sceneRef} aria-hidden="true" data-home={home || undefined} className="scene">
      {children}
    </div>
  );
}
