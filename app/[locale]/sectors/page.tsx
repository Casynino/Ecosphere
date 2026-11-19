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
      <PageHero locale={locale} photo={stock.mangroveAerial} title={t('title')} intro={t('intro')} />

      {/* One picture card per sector: the photograph fills the card and the
          words sit on its darkened side (under the photograph on phones). */}
      <div className="py-10 sm:py-16">
        <Container className="space-y-5 sm:space-y-8">
          {sectors.map((sector) => {
            const applicable = services.filter((service) => service.sectors.includes(sector.slug));

            return (
              <section
                key={sector.slug}
                id={sector.slug}
                aria-labelledby={`${sector.slug}-title`}
                data-reveal
                className="on-dark relative isolate scroll-mt-24 overflow-hidden rounded-card bg-[#021316] text-white"
              >
                <div className="relative aspect-[16/10] lg:absolute lg:inset-0 lg:-z-10 lg:aspect-auto">
                  <Image
                    src={sector.image.src}
                    alt={sector.image.alt[locale]}
                    fill
                    sizes="(min-width: 1280px) 1200px, 94vw"
                    placeholder="blur"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgb(2_19_22/0.95)_0%,rgb(2_19_22/0.86)_36%,rgb(2_19_22/0.12)_70%)] lg:block" />
                </div>

                <div className="p-6 sm:p-8 lg:flex lg:min-h-[31rem] lg:max-w-[35rem] lg:flex-col lg:justify-end lg:p-12">
                  <h2 id={`${sector.slug}-title`} className="display-3">
                    {sector.name[locale]}
                  </h2>
                  <p className="mt-4 text-white/85 sm:text-lg">{sector.challenge[locale]}</p>
                  <h3 className="mt-6 font-sans text-sm font-bold text-accent">{t('servicesTitle')}</h3>
                  <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                    {applicable.map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/services/${service.slug}`}
                          className="inline-flex min-h-8 items-center font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-accent"
                        >
                          {service.title[locale]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </Container>
      </div>

      <CtaBanner locale={locale} />
    </>
  );
}
