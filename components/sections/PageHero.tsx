import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import type { Photo } from '@/content/media';
import type { Locale } from '@/content/types';

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  /** Photograph behind the heading. Without one the banner is plain dark teal. */
  photo?: Photo;
  locale: Locale;
  children?: ReactNode;
};

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

/** Photo banner with the page's single H1. Used on every inner page. */
export function PageHero({ eyebrow, title, intro, photo, locale, children }: Props) {
  return (
    <section
      data-scroll
      className={`on-dark relative isolate overflow-hidden text-white ${photo ? '' : 'bg-hero'}`}
    >
      {photo && (
        // The photo fades out at the bottom, so it dissolves into the misty page behind it.
        <div className="absolute inset-0 -z-10 bg-teal-darkest [mask-image:linear-gradient(to_bottom,black_62%,transparent_100%)]">
          <div className="parallax absolute inset-0">
            <Image
              src={photo.src}
              alt={photo.alt[locale]}
              fill
              preload
              sizes="100vw"
              placeholder="blur"
              className="hero-zoom object-cover"
              style={{ objectPosition: photo.position }}
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_36_42/0.84)_0%,rgb(0_36_42/0.66)_60%,rgb(0_36_42/0.2)_100%)] lg:bg-[linear-gradient(90deg,rgb(0_36_42/0.9)_0%,rgb(0_36_42/0.62)_45%,rgb(0_36_42/0.08)_82%)]" />
        </div>
      )}
      <Container className={`flex flex-col justify-center pt-16 sm:pt-20 ${photo ? 'min-h-[58svh] pb-[20svh]' : 'pb-16 sm:pb-20'}`}>
        {eyebrow && (
          <p className="eyebrow rise text-lime" style={delay(60)}>
            {eyebrow}
          </p>
        )}
        <h1 className="rise-solid mt-4 max-w-4xl text-[2.5rem] leading-[1.06] sm:text-6xl lg:text-7xl">{title}</h1>
        {intro && (
          <p className="rise mt-5 max-w-2xl text-lg text-white/90 sm:text-xl" style={delay(160)}>
            {intro}
          </p>
        )}
        {children}
      </Container>
    </section>
  );
}
