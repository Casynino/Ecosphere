import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { PageHero } from '@/components/sections/PageHero';
import { Container } from '@/components/ui/Container';
import { stock } from '@/content/media';
import { sectors } from '@/content/sectors';
import { services } from '@/content/services';
import { Link } from '@/i18n/navigation';
import { getPageLocale, type LocaleParams } from '@/lib/locale';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale, namespace: 'sectors' });
  return pageMetadata({ locale, path: '/sectors', title: t('metaTitle'), description: t('metaDescription') });
}

export default async function SectorsPage({ params }: LocaleParams) {
  const locale = await getPageLocale(params);
  const t = await getTranslations('sectors');

  return (
    <>
      <PageHero locale={locale} photo={stock.mangroveAerial} eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />

      <div className="py-8 sm:py-14">
        {sectors.map((sector, index) => {
          const flipped = index % 2 === 1;
          const applicable = services.filter((service) => service.sectors.includes(sector.slug));

          return (
            <section key={sector.slug} id={sector.slug} aria-labelledby={`${sector.slug}-title`} className="py-10 sm:py-14">
              <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div
                  data-scroll
                  data-reveal={flipped ? 'right' : 'left'}
                  className={`relative aspect-[4/3] overflow-hidden rounded-card ${flipped ? 'lg:order-2' : ''}`}
                >
                  <Image
                    src={sector.image.src}
                    alt={sector.image.alt[locale]}
                    fill
                    sizes="(min-width: 1024px) 600px, 92vw"
                    placeholder="blur"
                    className="parallax object-cover"
                  />
                </div>

                <div data-reveal>
                  <p className="font-display text-xl text-teal" aria-hidden="true">
                    0{index + 1}
                  </p>
                  <h2 id={`${sector.slug}-title`} className="mt-1 text-3xl sm:text-4xl">
                    {sector.name[locale]}
                  </h2>
                  <h3 className="mt-6 font-sans text-sm font-bold text-teal">{t('challengeTitle')}</h3>
                  <p className="mt-2 text-lg text-ink/85">{sector.challenge[locale]}</p>
                  <h3 className="mt-7 font-sans text-sm font-bold text-teal">{t('servicesTitle')}</h3>
                  <ul className="mt-3 flex flex-wrap gap-2.5">
                    {applicable.map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/services/${service.slug}`}
                          className="panel group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.95rem] font-semibold text-ink transition-colors hover:text-teal"
                        >
                          {service.title[locale]}
                          <ArrowRight className="h-4 w-4 text-teal transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Container>
            </section>
          );
        })}
      </div>

      <CtaBanner locale={locale} />
    </>
  );
}
