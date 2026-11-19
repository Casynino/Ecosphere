import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { stock } from '@/content/media';
import type { Locale } from '@/content/types';
import { HeroVideo } from './HeroVideo';

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

/**
 * Opening scene: drone footage flying over green East African savanna
 * towards a cloud-wrapped volcano, filling the screen behind the headline.
 * The scene fades out at the bottom into the misty landscape that runs
 * behind every page.
 */
export async function HomeHero({ locale }: { locale: Locale }) {
  const t = await getTranslations('home.hero');

  return (
    <section data-scroll className="on-dark relative isolate overflow-hidden text-white">
      <div className="absolute inset-0 -z-10 bg-teal-darkest [mask-image:linear-gradient(to_bottom,black_72%,transparent_100%)]">
        <div className="parallax absolute inset-0">
          <HeroVideo poster={stock.heroSavanna.src} alt={stock.heroSavanna.alt[locale]} />
        </div>
        {/* Shade behind the words: from the top on phones, from the left on wide screens. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_36_42/0.78)_0%,rgb(0_36_42/0.4)_48%,rgb(0_36_42/0)_100%)] lg:bg-[linear-gradient(90deg,rgb(0_36_42/0.82)_0%,rgb(0_36_42/0.45)_40%,rgb(0_36_42/0)_70%),linear-gradient(180deg,rgb(0_36_42/0.5)_0%,rgb(0_36_42/0)_30%)]" />
      </div>
      <div className="mist -bottom-[10vh] -z-10 h-[32vh]" style={{ '--mist-speed': '70s' } as CSSProperties} aria-hidden="true" />

      {/* Phones show only the headline and the button; larger screens add one supporting line. */}
      <Container className="flex min-h-svh flex-col justify-start pb-[26svh] pt-[calc(var(--header-h)+2.25rem)] lg:justify-center lg:pt-[calc(var(--header-h)+3rem)]">
        <div className="max-w-3xl">
          <h1 className="rise-solid text-[2.55rem] leading-[1.05] sm:text-7xl lg:text-[5.4rem]">{t('title')}</h1>
          <p className="rise mt-6 hidden max-w-lg text-lg text-white/90 sm:block sm:text-xl" style={delay(200)}>
            {t('sub')}
          </p>
          <div className="rise mt-7 sm:mt-9" style={delay(320)}>
            <ButtonLink href="/contact">{t('primaryCta')}</ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
