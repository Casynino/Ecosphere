import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { stock } from '@/content/media';
import { sectors } from '@/content/sectors';
import type { Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

/** Full-screen opening scene: sunrise over a misty green landscape. */
export async function HomeHero({ locale }: { locale: Locale }) {
  const t = await getTranslations('home.hero');

  return (
    <section data-scroll className="on-dark relative isolate overflow-hidden text-white">
      {/* The scene fades out at the bottom, so it dissolves into the misty page behind it. */}
      <div className="absolute inset-0 -z-10 bg-teal-darkest [mask-image:linear-gradient(to_bottom,black_66%,transparent_100%)]">
        <div className="parallax absolute inset-0">
          <Image
            src={stock.sunriseMist.src}
            alt={stock.sunriseMist.alt[locale]}
            fill
            preload
            sizes="100vw"
            placeholder="blur"
            className="hero-zoom object-cover object-[50%_62%]"
          />
        </div>
        {/* Shade behind the text: from the top on phones, from the left on wide screens. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_36_42/0.82)_0%,rgb(0_36_42/0.62)_55%,rgb(0_36_42/0.1)_100%)] lg:bg-[linear-gradient(90deg,rgb(0_36_42/0.88)_0%,rgb(0_36_42/0.58)_42%,rgb(0_36_42/0)_76%)]" />
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
