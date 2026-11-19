import { ArrowDown, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { Swirl } from '@/components/graphics/Swirl';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { stock } from '@/content/media';
import { sectors } from '@/content/sectors';
import { getService } from '@/content/services';
import type { Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

// Three services shown as floating cards beside the headline (desktop only).
const featured = [
  { slug: 'environmental-conservation', position: 'left-0 top-[6%]', wait: 0 },
  { slug: 'compliance-advocacy', position: 'right-0 top-[40%]', wait: 1800 },
  { slug: 'community-engagement', position: 'bottom-[5%] left-[9%]', wait: 3400 },
];

export async function HomeHero({ locale }: { locale: Locale }) {
  const t = await getTranslations('home.hero');

  return (
    <section data-scroll className="on-dark relative isolate overflow-hidden bg-teal-darkest text-white">
      {/* Photograph, with a teal wash so the text stays readable. */}
      <div className="parallax absolute inset-0 -z-20">
        <Image
          src={stock.greenHills.src}
          alt={stock.greenHills.alt[locale]}
          fill
          preload
          sizes="100vw"
          quality={60}
          placeholder="blur"
          className="hero-zoom object-cover object-[62%_50%]"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(0_50_58/0.96)_0%,rgb(0_68_74/0.86)_40%,rgb(0_68_74/0.3)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-[linear-gradient(to_top,var(--color-teal-darkest),transparent)]" />

      <Container className="grid items-center gap-10 pb-24 pt-14 sm:pt-20 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-[1.12fr_0.88fr] lg:pb-28 lg:pt-16">
        <div>
          <p className="eyebrow rise text-lime" style={delay(80)}>
            {t('eyebrow')}
          </p>
          <h1 className="rise-solid mt-5 text-[2.6rem] leading-[1.06] sm:text-6xl lg:text-[4.4rem]">{t('title')}</h1>
          <p className="rise mt-6 max-w-xl text-lg text-white/85 sm:text-xl" style={delay(200)}>
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
          <ul aria-label={t('tagsLabel')} className="rise mt-10 flex flex-wrap gap-2.5" style={delay(440)}>
            {sectors.map((sector) => (
              <li key={sector.slug}>
                <Link
                  href={`/sectors#${sector.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-teal-darkest/50 px-4 py-2 text-[0.95rem] font-semibold transition-colors hover:border-lime hover:text-lime"
                >
                  <Icon name={sector.icon} className="h-4 w-4 text-lime" />
                  {sector.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Swirl from the logo with floating service cards. */}
        <div className="relative hidden aspect-square lg:block">
          <Swirl globe className="spin-slow absolute inset-[6%] h-[88%] w-[88%] opacity-95" />
          {featured.map(({ slug, position, wait }, index) => {
            const service = getService(slug)!;
            return (
              <div key={slug} className={`rise absolute ${position}`} style={delay(500 + index * 160)}>
                <Link
                  href={`/services/${slug}`}
                  className="float flex w-[17rem] items-center gap-3.5 rounded-2xl bg-white p-3 pr-5 text-ink shadow-[0_24px_50px_-20px_rgb(0_30_36/0.8)] transition-colors hover:bg-background"
                  style={delay(wait)}
                >
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={service.image.src}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                      style={{ objectPosition: service.image.position }}
                    />
                  </span>
                  <span>
                    <span className="block font-bold leading-tight">{service.title[locale]}</span>
                    <span className="mt-0.5 block text-sm leading-snug text-muted">{service.tagline[locale]}</span>
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </Container>

      <ArrowDown className="float absolute bottom-7 left-1/2 hidden h-6 w-6 -translate-x-1/2 text-white/70 lg:block" aria-hidden="true" />
    </section>
  );
}
