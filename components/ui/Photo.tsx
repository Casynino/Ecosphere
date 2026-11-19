import Image from 'next/image';
import type { Photo as PhotoData } from '@/content/media';
import type { Locale } from '@/content/types';

type Props = {
  photo: PhotoData;
  locale: Locale;
  /** How wide the picture is shown, for the browser to pick the right file size. */
  sizes: string;
  /** Shape and size of the frame, for example "aspect-[4/3]". */
  className: string;
};

/** A photograph cropped to fill a rounded frame. */
export function Photo({ photo, locale, sizes, className }: Props) {
  return (
    <div className={`relative overflow-hidden rounded-card ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt[locale]}
        fill
        sizes={sizes}
        quality={60}
        placeholder="blur"
        className="object-cover"
        style={{ objectPosition: photo.position }}
      />
    </div>
  );
}
