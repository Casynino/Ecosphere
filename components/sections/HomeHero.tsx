import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { sectors } from '@/content/sectors';
import type { Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';
import { EarthCanvas } from './EarthCanvas';

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

/**
 * Opening scene: a live, slowly turning Earth in a night sky, with the
 * headline beside it. The scene fades out at the bottom so the planet
 * appears to rise out of the misty landscape that runs behind every page.
 */
export async function HomeHero({ locale }: { locale: Locale }) {
  const t = await getTranslations('home.hero');

  return (
    <section data-scroll className="on-dark relative isolate overflow-hidden text-white">
      <div className="space absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_66%,transparent_100%)]">
        <div className="stars absolute inset-0" aria-hidden="true" />
        <div className="stars stars-far absolute inset-0" aria-hidden="true" />

        {/* The planet: large and to the right on wide screens, rising from below on phones. */}
        <div className="absolute left-1/2 top-[48%] w-[150vw] -translate-x-1/2 sm:w-[105vw] lg:left-auto lg:right-[-9vw] lg:top-1/2 lg:w-[min(108svh,70vw)] lg:translate-x-0 lg:-translate-y-[47%]">
          <div className="globe-drift">
            <EarthCanvas markerLabel={t('marker')} />
          </div>
        </div>

        {/* Shade that keeps the words readable where they cross the planet. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(1_15_19/0.72)_0%,rgb(1_15_19/0.5)_55%,rgb(1_15_19/0)_100%)] lg:bg-[linear-gradient(90deg,rgb(1_15_19/0.88)_0%,rgb(1_15_19/0.5)_36%,rgb(1_15_19/0)_58%)]" />
      </div>
      <div className="mist -bottom-[10vh] -z-10 h-[32vh]" style={{ '--mist-speed': '70s' } as CSSProperties} aria-hidden="true" />

      <Container className="flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center pb-[27svh] pt-14 sm:pt-20">
        <div className="max-w-3xl">
          <p className="eyebrow rise text-lime" style={delay(80)}>
            {t('eyebrow')}
          </p>
          <h1 className="rise-solid mt-5 text-[2.8rem] leading-[1.04] sm:text-7xl lg:text-[5.4rem]">{t('title')}</h1>
          <p className="rise mt-6 max-w-xl text-lg text-white/90 sm:text-xl" style={delay(200)}>
            {t('sub')}
          </p>
          <div className="rise mt-9 flex flex-col gap-3 sm:flex-row" style={delay(320)}>
            <ButtonLink href="/contact">
              {t('primaryCta')}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/services" variant="outlineLight">
              {t('secondaryCta')}
            </ButtonLink>
          </div>
          <ul aria-label={t('tagsLabel')} className="rise mt-9 flex flex-wrap gap-2.5" style={delay(440)}>
            {sectors.map((sector) => (
              <li key={sector.slug}>
                <Link
                  href={`/sectors#${sector.slug}`}
                  className="inline-flex rounded-full border border-white/40 bg-teal-darkest/45 px-4 py-2 text-[0.95rem] font-semibold transition-colors hover:border-lime hover:text-lime"
                >
                  {sector.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
