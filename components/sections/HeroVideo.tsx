'use client';

import Image, { type StaticImageData } from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Props = {
  /** Still picture shown first (and instead of the video where the video is skipped). */
  poster: StaticImageData;
  alt: string;
};

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

/**
 * Moving background for the home page: drone footage that loops silently.
 *
 * The still picture is on screen straight away. The video is only fetched
 * after the page has loaded, fades in once it is playing, and pauses when
 * scrolled away.
 * It is skipped entirely (the still picture stays) for visitors on a data
 * saver or 2G connection and for those who prefer reduced motion.
 * Phones get a smaller, upright cut of the same footage.
 */
export function HeroVideo({ poster, alt }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const network = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    const frugal = network?.saveData || /2g$/.test(network?.effectiveType ?? '');
    if (frugal || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const start = () => {
      video.play().catch(() => {
        // Autoplay can be refused (for example in low-power mode); the picture stays.
      });
    };
    const onPlaying = () => setPlaying(true);

    video.addEventListener('playing', onPlaying);

    // The film is fetched only once the page itself has finished loading,
    // so it never slows down the first view. It then plays while on screen.
    let watcher: IntersectionObserver | undefined;
    const begin = () => {
      video.src = window.innerWidth < 768 ? '/videos/hero-mobile.mp4' : '/videos/hero.mp4';
      watcher = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) start();
        else video.pause();
      });
      watcher.observe(video);
    };
    if (document.readyState === 'complete') begin();
    else window.addEventListener('load', begin, { once: true });

    return () => {
      window.removeEventListener('load', begin);
      video.removeEventListener('playing', onPlaying);
      watcher?.disconnect();
    };
  }, []);

  return (
    <>
      <Image
        src={poster}
        alt={alt}
        fill
        preload
        sizes="(max-width: 768px) 80vw, 100vw"
        quality={60}
        placeholder="blur"
        className="object-cover object-[42%_50%]"
      />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        className={`absolute inset-0 h-full w-full object-cover object-[42%_50%] transition-opacity duration-1000 ${
          playing ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  );
}
