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
  const allServices = <ArrowLink href="/services">{t('services.allServices')}</ArrowLink>;

  return (
    <section className="py-10 lg:py-14">
      <Container>
        <div className="panel rounded-[24px] p-2 pt-6 sm:p-8 lg:hidden">
          <div className="px-4 sm:px-0">
            <SectionHeading title={t('home.services.title')} action={allServices} />
          </div>
          <div data-reveal className="mt-4 sm:mt-8">
            <ServiceList services={services} locale={locale} brief bare />
          </div>
        </div>

        <div data-reveal className="panel relative hidden min-h-[36rem] overflow-hidden rounded-[24px] lg:block">
          <div className="flex min-h-[36rem] w-1/2 flex-col p-12 xl:p-14">
            <h2 className="display-3">{t('home.services.title')}</h2>
            <ol className="svc-list mt-8">
              {services.map((service) => (
                <li key={service.slug} className="svc-row">
                  <Link
                    href={`/services/${service.slug}`}
                    className="svc-name block py-1 font-display text-[1.625rem] leading-[1.2] tracking-[-0.02em] xl:text-[1.875rem]"
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
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(2_19_22/0.88)_0%,rgb(2_19_22/0.25)_45%,rgb(2_19_22/0)_70%)]" />
                    <p className="absolute inset-x-0 bottom-0 p-10 text-lg text-white">{service.summary[locale]}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-auto pt-8">{allServices}</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
