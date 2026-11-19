import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ServiceList } from '@/components/cards/ServiceCard';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { PageHero } from '@/components/sections/PageHero';
import { Container } from '@/components/ui/Container';
import { CtaLink } from '@/components/ui/CtaLink';
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
        photo={stock.cloudForest}
        title={t('services.title')}
        intro={t('services.intro')}
      />

      <section className="py-16 lg:py-24">
        <Container>
          <ServiceList services={services} locale={locale} heading="h2" />
          <div data-reveal className="on-dark bg-hero mt-6 rounded-card p-6 text-white sm:mt-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl">{t('home.services.helpTitle')}</h2>
            <p className="mt-3 max-w-lg text-white/85">{t('home.services.helpBody')}</p>
            <CtaLink href="/contact" className="mt-6">
              {t('home.services.helpCta')}
            </CtaLink>
          </div>
        </Container>
      </section>

      <CtaBanner locale={locale} />
    </>
  );
}
