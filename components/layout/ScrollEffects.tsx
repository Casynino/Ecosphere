'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * The scroll-driven touches on the site, in one small script. The page
 * itself always scrolls normally; nothing is pinned or stepped.
 *
 * 1. Reveal: `[data-reveal]` elements below the screen are hidden, then
 *    shown as they scroll into view.
 * 2. Progress: every `[data-scroll]` block gets a CSS variable `--p`
 *    (0 to 1) that the stylesheet uses for parallax and similar effects.
 *
 * Nothing runs for visitors who prefer reduced motion, and the page reads
 * normally without JavaScript. The styles are in app/globals.css.
 */
export function ScrollEffects() {
  const pathname = usePathname();

  // The opening of the home page plays once per visit (globals.css). After
  // it, or when the visit started on another page, it is switched off so
  // returning to the home page shows the page straight away.
  useEffect(() => {
    const done = () => {
      document.documentElement.dataset.intro = 'done';
    };
    if (!document.querySelector('.intro')) return done();
    const timer = window.setTimeout(done, 3800);
    return () => window.clearTimeout(timer);
  }, []);

  // The header gains its backing once the page is scrolled. This is not
  // motion, so it runs for everyone.
  useEffect(() => {
    const header = document.querySelector('.site-header');
    const update = () => header?.toggleAttribute('data-scrolled', window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // 1. Reveal on scroll.
    const revealer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.remove('reveal-pending');
            revealer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    for (const element of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
      if (element.getBoundingClientRect().top > window.innerHeight * 0.92) {
        element.classList.add('reveal-pending');
        revealer.observe(element);
      }
    }

    // 2. Scroll progress. Only blocks near the screen are measured.
    const active = new Set<HTMLElement>();
    const watcher = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) active.add(element);
          else active.delete(element);
        }
      },
      { rootMargin: '15% 0px' },
    );
    document.querySelectorAll<HTMLElement>('[data-scroll]').forEach((element) => watcher.observe(element));

    let frame = 0;
    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      // Read every position first, then write, to avoid layout thrashing.
      const blocks = [...active].map((element) => {
        const rect = element.getBoundingClientRect();
        return { element, progress: clamp((viewport - rect.top) / (viewport + rect.height)) };
      });
      for (const { element, progress } of blocks) element.style.setProperty('--p', progress.toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      revealer.disconnect();
      watcher.disconnect();
    };
  }, [pathname]);

  return null;
}
