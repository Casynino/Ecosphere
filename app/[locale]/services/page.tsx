import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { PageHero } from '@/components/sections/PageHero';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { stock } from '@/content/media';
import { services } from '@/content/services';
import { getPageLocale, type LocaleParams } from '@/lib/locale';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale, namespace: 'services' });
  return pageMetadata({ locale, path: '/services', title: t('metaTitle'), description: t('metaDescription') });
}

export default async function ServicesPage({ params }: LocaleParams) {
  const locale = await getPageLocale(params);
  const t = await getTranslations();

  return (
    <>
      <PageHero
        locale={locale}
        photo={stock.forestCanopy}
        eyebrow={t('services.eyebrow')}
        title={t('services.title')}
        intro={t('services.intro')}
      />

      <section className="py-20 sm:py-28">
        <Container>
          <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <li key={service.slug} data-reveal style={{ '--reveal-delay': `${(index % 3) * 90}ms` } as CSSProperties}>
                <ServiceCard service={service} locale={locale} learnMore={t('common.learnMore')} withPhoto heading="h2" />
              </li>
            ))}
            <li data-reveal className="sm:col-span-2 lg:col-span-2">
              <div className="on-dark bg-hero flex h-full flex-col justify-center rounded-card p-7 text-white sm:p-10">
                <h2 className="text-2xl sm:text-3xl">{t('home.services.helpTitle')}</h2>
                <p className="mt-3 max-w-lg text-white/85">{t('home.services.helpBody')}</p>
                <div className="mt-6">
                  <ButtonLink href="/contact">
                    {t('home.services.helpCta')}
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </ButtonLink>
                </div>
              </div>
            </li>
          </ul>
        </Container>
      </section>

      <CtaBanner locale={locale} />
    </>
  );
}
