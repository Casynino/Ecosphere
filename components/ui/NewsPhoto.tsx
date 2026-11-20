import Image, { type StaticImageData } from 'next/image';
import type { ReactNode } from 'react';

type Props = {
  src: StaticImageData;
  alt: string;
  caption?: string;
  /**
   * Leave out to show the whole picture at its own shape. In a NewsPhotoRow,
   * "upright" or "landscape" crops the pictures to one shape so the row lines up.
   * "narrow" shows a tall picture (a book cover, a document) at a modest width.
   */
  shape?: 'upright' | 'landscape' | 'narrow';
};

/** A picture inside a news article (used in content/news/*.mdx). */
export function NewsPhoto({ src, alt, caption, shape }: Props) {
  const cropped = shape === 'upright' || shape === 'landscape';

  return (
    <figure className={`mt-8 ${shape === 'narrow' ? 'mx-auto max-w-xs' : ''}`}>
      {cropped ? (
        <div className={`relative overflow-hidden rounded-xl ${shape === 'upright' ? 'aspect-[3/4]' : 'aspect-[3/2]'}`}>
          <Image src={src} alt={alt} fill sizes="(min-width: 768px) 400px, 92vw" placeholder="blur" className="object-cover" />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          sizes={shape === 'narrow' ? '320px' : '(min-width: 896px) 800px, 92vw'}
          placeholder="blur"
          className="h-auto w-full rounded-xl"
        />
      )}
      {caption && <figcaption className="mt-2 text-sm text-mist">{caption}</figcaption>}
    </figure>
  );
}

/** Two pictures side by side (one above the other on phones). */
export function NewsPhotoRow({ children }: { children: ReactNode }) {
  return <div className="mt-8 grid gap-4 sm:grid-cols-2 [&>figure]:mt-0">{children}</div>;
}
