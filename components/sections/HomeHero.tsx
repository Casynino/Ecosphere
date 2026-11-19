import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { Link } from '@/i18n/navigation';
import { EarthScene } from './EarthScene';

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

/**
 * Opening scene: the Earth seen from orbit at sunrise, filling the screen.
 * On the first visit the camera dives in from far out, and the words
 * arrive as it lands (their delays below match the dive in EarthScene).
 * The scene fades out at the bottom into the misty landscape that runs
 * behind every page.
 */
export async function HomeHero() {
  const t = await getTranslations('home.hero');

  return (
    <section data-scroll className="on-dark relative isolate overflow-hidden text-white">
      <div className="space absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_76%,transparent_100%)] lg:[mask-image:linear-gradient(to_bottom,black_66%,transparent_100%)]">
        <div className="stars absolute inset-0" aria-hidden="true" />
        <div className="stars stars-far absolute inset-0" aria-hidden="true" />

        {/* The Earth from orbit, filling the scene. */}
        <div className="globe-drift absolute inset-0">
          <EarthScene markerLabel={t('marker')} />
        </div>

        {/* Shade that keeps the words readable where they cross the planet. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(1_15_19/0.45)_0%,rgb(1_15_19/0)_46%)] lg:bg-[linear-gradient(90deg,rgb(1_15_19/0.72)_0%,rgb(1_15_19/0.4)_38%,rgb(1_15_19/0)_62%)]" />
      </div>
      <div className="mist -bottom-[10vh] -z-10 h-[32vh]" style={{ '--mist-speed': '70s' } as CSSProperties} aria-hidden="true" />

      {/* Phones show only the headline and one button; larger screens add the supporting lines. */}
      <Container className="flex min-h-svh flex-col justify-start pb-[26svh] pt-[calc(var(--header-h)+2.25rem)] lg:justify-center lg:pt-[calc(var(--header-h)+3rem)]">
        <div className="max-w-3xl">
          <p className="eyebrow rise hidden text-lime sm:block" style={delay(1700)}>
            {t('eyebrow')}
          </p>
          <h1 className="rise text-[2.55rem] leading-[1.05] sm:mt-5 sm:text-7xl lg:text-[5.4rem]" style={delay(1800)}>
            {t('title')}
          </h1>
          <p className="rise mt-6 hidden max-w-lg text-lg text-white/90 sm:block sm:text-xl" style={delay(1950)}>
            {t('sub')}
          </p>
          <div className="rise mt-7 flex flex-wrap items-center gap-x-8 gap-y-5 sm:mt-9" style={delay(2100)}>
            <ButtonLink href="/contact">
              {t('primaryCta')}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </ButtonLink>
            <Link
              href="/services"
              className="group hidden items-center gap-2 py-2 font-bold text-white transition-colors hover:text-lime sm:inline-flex"
            >
              {t('secondaryCta')}
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
