import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { CtaLink } from '@/components/ui/CtaLink';
import { Container } from '@/components/ui/Container';
import { stock } from '@/content/media';
import type { Locale } from '@/content/types';
import { HeroVideo } from './HeroVideo';

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

/**
 * Opening scene of the home page: drone footage over green East African
 * savanna fills the screen. It opens like a window growing to full size
 * (globals.css, .hero-window) while the headline rises in at the foot.
 */
export async function HomeHero({ locale }: { locale: Locale }) {
  const t = await getTranslations('home.hero');

  return (
    <section data-scroll className="relative isolate overflow-hidden text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden bg-night">
        <div className="parallax absolute inset-0">
          <HeroVideo poster={stock.heroSavanna.src} alt={stock.heroSavanna.alt[locale]} />
        </div>
        {/* Shade under the header and behind the words; the foot of the picture sinks into the dark page. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(2_19_22)_0%,rgb(2_19_22/0.72)_22%,rgb(2_19_22/0.12)_58%,rgb(2_19_22/0.4)_100%)]" />
        <div className="hero-window" aria-hidden="true" />
      </div>

      <Container className="flex min-h-svh flex-col justify-end pb-10 pt-[calc(var(--header-h)+2rem)] sm:pb-14">
        <h1 className="rise-solid display-1 max-w-[17ch]">{t('title')}</h1>
        <div
          className="rise mt-6 flex flex-col gap-6 border-t border-white/25 pt-6 sm:mt-8 sm:flex-row sm:items-center sm:justify-between"
          style={delay(350)}
        >
          <p className="hidden max-w-md text-lg text-white/85 sm:block">{t('sub')}</p>
          <CtaLink href="/contact" className="self-start sm:self-auto">
            {t('primaryCta')}
          </CtaLink>
        </div>
      </Container>
    </section>
  );
}
