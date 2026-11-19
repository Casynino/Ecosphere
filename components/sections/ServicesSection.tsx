import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ServiceList } from '@/components/cards/ServiceCard';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { services } from '@/content/services';
import type { Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';

/**
 * The seven services on the home page.
 * Wide screens: one panel with the names on the left and a large picture
 * on the right. Pointing at a name shows that service's picture and
 * description (globals.css, "Services panel"); the first shows by default.
 * Phones and tablets: a simple list, each with a small picture.
 */
export async function ServicesSection({ locale }: { locale: Locale }) {
  const t = await getTranslations();

  return (
    <section className="py-10 lg:py-14">
      <Container>
        <SectionHeading title={t('home.services.title')} action={<ArrowLink href="/services">{t('services.allServices')}</ArrowLink>} />

        {/* Phones and tablets: a compact list. */}
        <div data-reveal className="panel mt-5 rounded-card px-1 py-1 sm:mt-8 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none lg:hidden">
          <ServiceList services={services} locale={locale} brief bare />
        </div>

        {/* Wide screens: names beside one large picture. */}
        <div data-reveal className="panel relative mt-8 hidden min-h-[30rem] overflow-hidden rounded-card lg:block">
          <div className="flex min-h-[30rem] w-1/2 flex-col justify-center p-10 xl:p-12">
            <ol className="svc-list">
              {services.map((service) => (
                <li key={service.slug} className="svc-row">
                  <Link
                    href={`/services/${service.slug}`}
                    className="svc-name block py-1.5 text-[1.5rem] font-extrabold leading-[1.2] tracking-[-0.035em] xl:text-[1.75rem]"
                  >
                    {service.title[locale]}
                  </Link>
                  <div className="svc-media on-dark absolute inset-y-0 right-0 w-1/2">
                    <Image
                      src={service.image.src}
                      alt=""
                      fill
                      sizes="620px"
                      quality={60}
                      className="object-cover"
                      style={{ objectPosition: service.image.position }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(5_42_48/0.9)_0%,rgb(5_42_48/0.25)_45%,rgb(5_42_48/0)_70%)]" />
                    <p className="absolute inset-x-0 bottom-0 p-10 text-lg text-white">{service.summary[locale]}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
