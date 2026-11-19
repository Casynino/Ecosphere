'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';

const clamp = (value: number) => Math.min(1, Math.max(0, value));

type Scene = {
  story: HTMLElement;
  stage: HTMLElement;
  steps: number;
  parts: { element: HTMLElement; index: number }[];
  step: number;
};

/**
 * All scroll-driven movement on the site, in one small script:
 *
 * 1. Reveal: `[data-reveal]` elements below the screen are hidden, then
 *    shown as they scroll into view.
 * 2. Progress: every `[data-scroll]` block gets a CSS variable `--p`
 *    (0 to 1) that the stylesheet uses for parallax and similar effects.
 * 3. Scenes: a `[data-story]` section is pinned to the screen and stepped
 *    through as the visitor scrolls. Elements inside it marked `data-i="2"`
 *    get the classes is-active / is-on / is-past as step 2 comes and goes,
 *    and a `data-goto="2"` button scrolls to that step.
 *
 * Nothing runs for visitors who prefer reduced motion, and the page reads
 * normally without JavaScript. The styles are in app/globals.css.
 */
export function ScrollEffects() {
  const pathname = usePathname();

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

    // 3. Scenes.
    const setStep = (scene: Scene, step: number) => {
      if (scene.step === step) return;
      scene.step = step;
      scene.story.dataset.step = String(step);
      for (const { element, index } of scene.parts) {
        element.classList.toggle('is-active', index === step);
        element.classList.toggle('is-on', index <= step);
        element.classList.toggle('is-past', index < step);
      }
    };
    const scenes: Scene[] = [...document.querySelectorAll<HTMLElement>('[data-story]')].map((story) => ({
      story,
      stage: story.firstElementChild as HTMLElement,
      steps: Number(story.dataset.steps) || 1,
      parts: [...story.querySelectorAll<HTMLElement>('[data-i]')].map((element) => ({
        element,
        index: Number(element.dataset.i),
      })),
      step: -1,
    }));
    for (const scene of scenes) {
      scene.story.classList.add('is-pinned');
      setStep(scene, 0);
    }

    // A timeline button jumps to the middle of its step.
    const onClick = (event: MouseEvent) => {
      const button = (event.target as Element).closest<HTMLElement>('[data-goto]');
      const scene = button && scenes.find((item) => item.story.contains(button));
      if (!button || !scene) return;
      const distance = scene.story.offsetHeight - scene.stage.offsetHeight;
      const top = scene.story.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + ((Number(button.dataset.goto) + 0.5) / scene.steps) * distance, behavior: 'smooth' });
    };
    document.addEventListener('click', onClick);

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
      const stories = scenes.map((scene) => {
        const rect = scene.story.getBoundingClientRect();
        const distance = rect.height - scene.stage.offsetHeight;
        return { scene, near: rect.bottom > -viewport && rect.top < viewport * 2, progress: distance > 0 ? clamp(-rect.top / distance) : 0 };
      });

      for (const { element, progress } of blocks) element.style.setProperty('--p', progress.toFixed(4));
      for (const { scene, near, progress } of stories) {
        if (!near) continue;
        scene.story.style.setProperty('--p', progress.toFixed(4));
        setStep(scene, Math.min(scene.steps - 1, Math.floor(progress * scene.steps)));
      }
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
      document.removeEventListener('click', onClick);
      revealer.disconnect();
      watcher.disconnect();
      for (const scene of scenes) scene.story.classList.remove('is-pinned');
    };
  }, [pathname]);

  return null;
}
