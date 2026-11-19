'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { usePathname } from '@/i18n/navigation';
import poster from '@/public/images/stock/hero-savanna.jpg';

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** Screens of scrolling that carry the camera from one end of the flight to the other. */
const FLIGHT_SCREENS = 8;

/**
 * The film behind every page: a drone flight low over green East African
 * savanna towards a volcano wrapped in cloud.
 *
 * - Scrolling flies the camera. The film does not play by itself: its
 *   position follows the page (down = forward, up = back), so the trees
 *   pass underneath as the visitor reads. The page itself scrolls normally.
 * - On the home page the picture is seen clearly at the top (it is the
 *   opening picture) and mists over as the visitor scrolls down to the
 *   text. On every other page it is misted from the start, so text stays
 *   easy to read. The mist is the "veil" (--wash in globals.css: pale in
 *   the light theme, dark in the dark theme).
 * - The still picture (the first frame of the flight) is on screen straight
 *   away. The film is only fetched after the page has loaded, and it is
 *   skipped (the still stays) for visitors on a data saver or 2G connection
 *   and for those who prefer reduced motion. Phones get a smaller, upright
 *   cut of the same flight.
 *
 * The two film files are encoded with a key frame every 8 frames so that
 * jumping to any moment is quick (see IMAGE_CREDITS.md for the command).
 * It lives in the layout, so it carries on from page to page.
 */
export function LivingBackground() {
  const home = usePathname() === '/';
  const moveRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // The flight: the film's position follows the scroll position.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const network = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    const frugal = network?.saveData || /2g$/.test(network?.effectiveType ?? '');
    if (frugal || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ready = false;
    let target = 0; // where the scroll position says the film should be (seconds)
    let current = 0; // where it is, easing towards the target
    let frame = 0;

    const tick = () => {
      frame = 0;
      if (!ready) return;
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.02) current = target;
      // Never queue a second jump while the first is still being drawn.
      if (!video.seeking && Math.abs(video.currentTime - current) > 0.04) video.currentTime = current;
      // At the very start the sharper still picture is shown instead.
      video.style.opacity = current > 0.05 ? '1' : '0';
      if (current !== target || video.seeking) frame = requestAnimationFrame(tick);
    };
    const follow = () => {
      if (ready) target = clamp(window.scrollY / (window.innerHeight * FLIGHT_SCREENS)) * (video.duration - 0.2);
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onReady = () => {
      ready = true;
      video.pause();
      follow();
      current = target;
    };
    const begin = () => {
      video.src = window.innerWidth < 768 ? '/videos/flight-mobile.mp4' : '/videos/flight.mp4';
      video.load();
      // Some phones only keep frames available once the film has started
      // playing; start it and stop it straight away.
      video.play().then(() => video.pause(), () => {});
    };

    video.addEventListener('loadeddata', onReady, { once: true });
    window.addEventListener('scroll', follow, { passive: true });
    window.addEventListener('resize', follow);
    // Fetched only once the page itself has finished loading, so it never
    // slows down the first view.
    if (document.readyState === 'complete') begin();
    else window.addEventListener('load', begin, { once: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('load', begin);
      window.removeEventListener('scroll', follow);
      window.removeEventListener('resize', follow);
      video.removeEventListener('loadeddata', onReady);
    };
  }, []);

  // The veil (home page only) and a slight push-in, both tied to scrolling.
  useEffect(() => {
    const move = moveRef.current;
    const veil = veilRef.current;
    if (!move || !veil) return;

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      const screen = window.innerHeight;
      const scrolled = window.scrollY;
      // Clear at the top of the home page, fully misted one screen down.
      if (home) veil.style.opacity = clamp((scrolled - screen * 0.25) / (screen * 0.6)).toFixed(3);
      if (!still) move.style.setProperty('--s', clamp(scrolled / (screen * FLIGHT_SCREENS)).toFixed(4));
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
      veil.style.opacity = '';
    };
  }, [home]);

  return (
    <div aria-hidden="true" data-home={home || undefined} className="site-film fixed inset-0 -z-10 overflow-hidden bg-night">
      <div ref={moveRef} className="site-film-move absolute inset-0">
        <Image
          src={poster}
          alt=""
          fill
          preload={home}
          fetchPriority={home ? 'high' : 'low'}
          sizes="(max-width: 768px) 80vw, 100vw"
          quality={60}
          placeholder="blur"
          className="object-cover object-[42%_50%]"
        />
        <video
          ref={videoRef}
          muted
          playsInline
          preload="none"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover object-[42%_50%] opacity-0 transition-opacity duration-500"
        />
      </div>
      <div ref={veilRef} className="site-film-veil absolute inset-0" />
    </div>
  );
}
