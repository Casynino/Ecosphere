import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { sectors } from '@/content/sectors';
import type { Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';

/**
 * The four sectors as a scene: four pictures fill the screen side by side
 * (stacked on phones) and the current one opens wide as the visitor scrolls.
 * Each picture links to its section on the Sectors page.
 */
export async function SectorsScene({ locale }: { locale: Locale }) {
  const t = await getTranslations('home.sectors');

  return (
    <section
      data-story
      data-steps={sectors.length}
      aria-labelledby="sectors-title"
      className="scene"
      style={{ '--steps': sectors.length, '--step': '52svh' } as CSSProperties}
    >
      <div className="scene-stage flex flex-col overflow-hidden [.scene:not(.is-pinned)_&]:py-24">
        <Container className="pb-5 pt-[calc(var(--header-h)+1rem)] [.scene:not(.is-pinned)_&]:pt-0">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-2">
            <h2 id="sectors-title" className="display-3">
              {t('title')}
            </h2>
            <ArrowLink href="/sectors">{t('link')}</ArrowLink>
          </div>
        </Container>

        <ul className="flex min-h-0 flex-1 flex-col gap-2 px-2 pb-2 lg:flex-row [.scene:not(.is-pinned)_&]:min-h-[80svh]">
          {sectors.map((sector, index) => (
            <li key={sector.slug} data-i={index} className="sector-pane">
              <Link
                href={`/sectors#${sector.slug}`}
                className="relative isolate flex h-full flex-col justify-end overflow-hidden rounded-[14px] p-5 text-white sm:p-8"
              >
                <Image
                  src={sector.image.src}
                  alt={sector.image.alt[locale]}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  quality={60}
                  placeholder="blur"
                  className="-z-20 object-cover"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(2_19_22/0.9)_0%,rgb(2_19_22/0.25)_55%,rgb(2_19_22/0.05)_100%)]"
                />
                <span aria-hidden="true" className="sector-shade absolute inset-0 -z-10 bg-night/55" />
                <h3 className="sector-name whitespace-nowrap font-display text-[1.75rem] font-normal leading-none tracking-[-0.02em] lg:text-2xl">
                  {sector.name[locale]}
                </h3>
                <p className="sector-text mt-3 hidden max-w-md text-lg leading-snug text-white/90 sm:block lg:[.is-pinned_&]:min-w-80">
                  {sector.short[locale]}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
