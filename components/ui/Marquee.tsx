import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { Photo } from '@/content/media';
import type { Locale } from '@/content/types';

type TrackStyle = CSSProperties & { '--marquee-duration'?: string; '--marquee-gap'?: string };

/**
 * A strip of words that moves sideways without stopping. The second copy
 * only exists to make the loop seamless, so it is hidden from screen readers.
 * It pauses on hover and stands still for reduced-motion users.
 */
export function WordMarquee({ items, label }: { items: string[]; label: string }) {
  const style: TrackStyle = { '--marquee-duration': '48s', '--marquee-gap': '2.25rem' };

  const track = (copy: boolean) => (
    <ul className="marquee-track" style={style} aria-hidden={copy || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-9 whitespace-nowrap font-display text-2xl text-white/90 sm:text-[1.7rem]">
          {item}
          <span className="h-2 w-2 rounded-full bg-lime" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee" role="group" aria-label={label}>
      {track(false)}
      {track(true)}
    </div>
  );
}

/** The same moving strip, made of photographs. */
export function PhotoMarquee({ photos, locale }: { photos: Photo[]; locale: Locale }) {
  const style: TrackStyle = { '--marquee-duration': '70s', '--marquee-gap': '1.25rem' };

  const track = (copy: boolean) => (
    <ul className="marquee-track" style={style} aria-hidden={copy || undefined}>
      {photos.map((photo) => (
        <li
          key={photo.src.src}
          className={`relative h-56 shrink-0 overflow-hidden rounded-card sm:h-72 ${
            photo.shape === 'portrait' ? 'w-40 sm:w-52' : 'w-72 sm:w-96'
          }`}
        >
          <Image
            src={photo.src}
            alt={copy ? '' : photo.alt[locale]}
            fill
            sizes="(min-width: 640px) 384px, 288px"
            placeholder="blur"
            className="object-cover"
            style={{ objectPosition: photo.position }}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee">
      {track(false)}
      {track(true)}
    </div>
  );
}
