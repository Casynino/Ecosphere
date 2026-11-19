import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { PageHero } from '@/components/sections/PageHero';
import { JsonLd } from '@/components/seo/JsonLd';
import { Container } from '@/components/ui/Container';
import { CtaLink } from '@/components/ui/CtaLink';
import { PlaceholderBadge } from '@/components/ui/Placeholder';
import { getSector } from '@/content/sectors';
import { getService, services } from '@/content/services';
import { site } from '@/content/site';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getPageLocale } from '@/lib/locale';
import { absoluteUrl, pageMetadata } from '@/lib/seo';
import { serviceJsonLd } from '@/lib/structured-data';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => services.map((service) => ({ locale, slug: service.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const service = getService((await params).slug);
  if (!service) return {};
  return pageMetadata({
    locale,
    path: `/services/${service.slug}`,
    title: service.title[locale],
    description: service.summary[locale],
  });
}

export default async function ServicePage({ params }: Props) {
  const locale = await getPageLocale(params);
  const service = getService((await params).slug);
  if (!service) notFound();

  const t = await getTranslations();
  const title = service.title[locale];
  const included = service.included?.[locale];
  const others = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: title,
          description: service.summary[locale],
          url: absoluteUrl(locale, `/services/${service.slug}`),
        })}
      />

      <PageHero
        locale={locale}
        photo={service.image}
        title={title}
        intro={service.summary[locale]}
        back={{ href: '/services', label: t('services.allServices') }}
      />

      <section className="py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div className="panel rounded-card p-6 sm:p-10">
            <p className="font-display text-2xl leading-snug text-snow sm:text-[1.75rem]">{service.intro[locale]}</p>

            <div className="mt-12" data-reveal>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl sm:text-3xl">{t('services.includedTitle')}</h2>
                {!included && <PlaceholderBadge label={t('common.placeholder')} />}
              </div>
              <ul className="mt-5 divide-y divide-snow/10 border-y border-snow/10">
                {(included ?? [1, 2, 3].map((number) => t('services.includedPlaceholder', { number }))).map((item) => (
                  <li key={item} className={`py-4 ${included ? 'text-snow' : 'text-mist'}`}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12" data-reveal>
              <h2 className="text-2xl sm:text-3xl">{t('services.sectorsTitle')}</h2>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-lg">
                {service.sectors.map((slug) => (
                  <li key={slug}>
                    <Link href={`/sectors#${slug}`} className="font-semibold text-accent underline underline-offset-4 hover:text-snow">
                      {getSector(slug).name[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="on-dark bg-hero overflow-hidden rounded-card text-white">
              <div className="p-7 sm:p-8">
                <h2 className="text-2xl">{t('services.requestTitle', { service: title })}</h2>
                <p className="mt-3 text-white/85">{t('services.requestBody')}</p>
                <CtaLink href={{ pathname: '/contact', query: { service: service.slug } }} className="mt-6">
                  {t('services.requestService')}
                </CtaLink>
                <p className="mt-6 text-white/85">
                  <a href={`tel:${site.phone.e164}`} className="font-bold underline-offset-4 hover:underline">
                    {site.phone.display}
                  </a>
                </p>
              </div>
            </div>
          </aside>
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container>
          <div className="panel rounded-card p-6 sm:p-10">
            <h2 className="text-2xl sm:text-3xl">{t('services.otherServices')}</h2>
            <ul className="mt-4 divide-y divide-snow/10 sm:mt-8 sm:grid sm:grid-cols-3 sm:gap-6 sm:divide-y-0">
              {others.map((item) => (
                <li key={item.slug}>
                  <ServiceCard service={item} locale={locale} brief />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
