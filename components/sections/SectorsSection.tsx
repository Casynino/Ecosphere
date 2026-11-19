import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { sectors } from '@/content/sectors';
import type { Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';

/**
 * The four sectors as pictures, each linking to its section on the Sectors
 * page. Wide screens: side by side, the one under the pointer opens wider
 * and shows a line of text (globals.css, "Sector pictures"). Phones: two by two.
 */
export async function SectorsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations('home.sectors');

  return (
    <section className="py-10 lg:py-14">
      <Container>
        <div className="panel rounded-[24px] p-6 sm:p-10 lg:p-14">
          <SectionHeading title={t('title')} intro={t('intro')} action={<ArrowLink href="/sectors">{t('link')}</ArrowLink>} />
          <ul data-reveal className="sector-panes mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-10 lg:flex lg:h-[26rem]">
            {sectors.map((sector) => (
              <li key={sector.slug}>
                <Link
                  href={`/sectors#${sector.slug}`}
                  className="on-dark relative isolate flex aspect-[4/5] h-full flex-col justify-end overflow-hidden rounded-card p-4 text-white sm:p-6 lg:aspect-auto"
                >
                  <Image
                    src={sector.image.src}
                    alt={sector.image.alt[locale]}
                    fill
                    sizes="(min-width: 1024px) 640px, 50vw"
                    quality={60}
                    placeholder="blur"
                    className="-z-20 object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(2_19_22/0.9)_0%,rgb(2_19_22/0.3)_50%,rgb(2_19_22/0.05)_100%)]"
                  />
                  <h3 className="whitespace-nowrap font-display text-xl font-normal tracking-[-0.02em] sm:text-[1.75rem]">
                    {sector.name[locale]}
                  </h3>
                  <p className="sector-text mt-2 hidden max-w-md leading-snug text-white/90 sm:block lg:min-w-72">
                    {sector.short[locale]}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
