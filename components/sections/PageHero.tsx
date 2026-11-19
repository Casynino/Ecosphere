import Image from 'next/image';
import type { ReactNode } from 'react';
import { Swirl } from '@/components/graphics/Swirl';
import { Container } from '@/components/ui/Container';
import type { Photo } from '@/content/media';
import type { Locale } from '@/content/types';

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  /** Optional photograph behind the heading. */
  photo?: Photo;
  locale: Locale;
  children?: ReactNode;
};

/** Dark teal banner with the page's single H1. Used on every inner page. */
export function PageHero({ eyebrow, title, intro, photo, locale, children }: Props) {
  return (
    <section data-scroll className="on-dark bg-hero relative isolate overflow-hidden text-white">
      {photo && (
        <>
          <div className="parallax absolute inset-0 -z-20">
            <Image
              src={photo.src}
              alt={photo.alt[locale]}
              fill
              preload
              sizes="100vw"
              quality={60}
              placeholder="blur"
              className="hero-zoom object-cover"
              style={{ objectPosition: photo.position }}
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(0_50_58/0.96)_0%,rgb(0_68_74/0.88)_45%,rgb(0_68_74/0.5)_100%)]" />
        </>
      )}
      <Swirl globe className="spin-slow pointer-events-none absolute -right-28 -top-24 -z-10 w-[26rem] opacity-25 sm:w-[32rem]" />
      <Container className="py-16 sm:py-20 lg:py-24">
        {eyebrow && (
          <p className="eyebrow rise text-lime" style={{ '--delay': '60ms' } as React.CSSProperties}>
            {eyebrow}
          </p>
        )}
        <h1 className="rise-solid mt-4 max-w-3xl text-4xl sm:text-5xl lg:text-[3.4rem]">{title}</h1>
        {intro && (
          <p className="rise mt-5 max-w-2xl text-lg text-white/85" style={{ '--delay': '160ms' } as React.CSSProperties}>
            {intro}
          </p>
        )}
        {children}
      </Container>
    </section>
  );
}
