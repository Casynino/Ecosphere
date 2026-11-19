'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * All scroll-driven movement on the site, in one small script:
 *
 * 1. Reveal: `[data-reveal]` elements below the screen are hidden, then
 *    shown as they scroll into view.
 * 2. Progress: every `[data-scroll]` block gets a CSS variable `--p`
 *    (0 to 1) that the stylesheet uses for parallax and similar effects.
 * 3. Story: a `[data-story]` section is pinned to the screen and stepped
 *    through its stages as the visitor scrolls.
 * 4. Page progress: `[data-page-progress]` elements get `--page` (0 at the top
 *    of the page, 1 at the bottom). The living background and the thin bar
 *    under the header use it.
 *
 * Nothing runs for visitors who prefer reduced motion, and the page reads
 * normally without JavaScript.
 */
export function ScrollEffects() {
  const pathname = usePathname();

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

    // 2-4. Scroll progress. Only blocks near the screen are measured.
    const stories = [...document.querySelectorAll<HTMLElement>('[data-story]')];
    stories.forEach((story) => story.classList.add('is-pinned'));
    const pageTargets = [...document.querySelectorAll<HTMLElement>('[data-page-progress]')];
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
      const scenes = stories.map((story) => {
        const stage = story.firstElementChild as HTMLElement;
        const rect = story.getBoundingClientRect();
        const top = parseFloat(getComputedStyle(stage).top) || 0;
        const distance = rect.height - stage.offsetHeight;
        return { story, progress: distance > 0 ? clamp((top - rect.top) / distance) : 0 };
      });
      const scrollable = document.documentElement.scrollHeight - viewport;
      const page = scrollable > 0 ? clamp(window.scrollY / scrollable).toFixed(4) : '0';

      for (const { element, progress } of blocks) element.style.setProperty('--p', progress.toFixed(4));
      for (const { story, progress } of scenes) {
        const steps = Number(story.dataset.steps) || 1;
        story.style.setProperty('--p', progress.toFixed(4));
        story.dataset.step = String(Math.min(steps - 1, Math.floor(progress * steps)));
      }
      for (const target of pageTargets) target.style.setProperty('--page', page);
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
      stories.forEach((story) => story.classList.remove('is-pinned'));
    };
  }, [pathname]);

  return null;
}
