import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import type { Photo } from '@/content/media';
import type { Locale } from '@/content/types';

type Props = {
  title: string;
  intro?: string;
  /** Photograph behind the heading. Without one the banner is plain dark teal. */
  photo?: Photo;
  locale: Locale;
  children?: ReactNode;
};

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

/** Photo banner with the page's single H1. Used on every inner page. */
export function PageHero({ title, intro, photo, locale, children }: Props) {
  return (
    <section
      data-scroll
      className="on-dark relative isolate overflow-hidden text-white"
    >
      {photo && (
        // The photo fades out at the bottom, so it dissolves into the misty page behind it.
        <div className="absolute inset-0 -z-10 bg-[#021316] [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]">
          <div className="parallax absolute inset-0">
            <Image
              src={photo.src}
              alt={photo.alt[locale]}
              fill
              preload
              // The banner sits under a dark shade, so phones can take a smaller, lighter file.
              sizes="(max-width: 768px) 80vw, 100vw"
              quality={45}
              placeholder="blur"
              className="hero-zoom object-cover"
              style={{ objectPosition: photo.position }}
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_36_42/0.84)_0%,rgb(0_36_42/0.66)_60%,rgb(0_36_42/0.2)_100%)] lg:bg-[linear-gradient(90deg,rgb(0_36_42/0.9)_0%,rgb(0_36_42/0.62)_45%,rgb(0_36_42/0.08)_82%)]" />
        </div>
      )}
      <Container className={`flex flex-col pt-[calc(var(--header-h)+4rem)] ${photo ? 'min-h-[68svh] justify-end pb-[17svh]' : 'pb-10'}`}>
        <h1 className="rise-solid display-2 max-w-4xl">{title}</h1>
        {intro && (
          <p className="rise mt-5 max-w-xl text-lg text-white/85 sm:text-xl" style={delay(200)}>
            {intro}
          </p>
        )}
        {children}
      </Container>
    </section>
  );
}
