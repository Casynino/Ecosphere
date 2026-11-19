import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { Photo } from '@/content/media';
import type { Locale } from '@/content/types';

type TrackStyle = CSSProperties & { '--marquee-duration'?: string; '--marquee-gap'?: string };

/**
 * A strip of photographs that moves sideways without stopping. The second
 * copy only exists to make the loop seamless, so it is hidden from screen
 * readers. It pauses on hover and stands still for reduced-motion users.
 */
export function PhotoMarquee({ photos, locale }: { photos: Photo[]; locale: Locale }) {
  const style: TrackStyle = { '--marquee-duration': '70s', '--marquee-gap': '1rem' };

  const track = (copy: boolean) => (
    <ul className="marquee-track" style={style} aria-hidden={copy || undefined}>
      {photos.map((photo) => (
        <li
          key={photo.src.src}
          className={`relative h-48 shrink-0 overflow-hidden rounded-card sm:h-72 ${
            photo.shape === 'portrait' ? 'w-36 sm:w-52' : 'w-64 sm:w-96'
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
