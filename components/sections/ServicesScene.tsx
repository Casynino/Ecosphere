import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { services } from '@/content/services';
import type { Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';

/**
 * The seven services as a scene. Wide screens: the list of names on the
 * left, with the current one lit, and a large picture on the right that
 * changes with it. Phones: the picture, then the current name and a line.
 */
export async function ServicesScene({ locale }: { locale: Locale }) {
  const t = await getTranslations();

  return (
    <section
      data-story
      data-steps={services.length}
      aria-labelledby="services-title"
      className="scene"
      style={{ '--steps': services.length, '--step': '46svh' } as CSSProperties}
    >
      <div className="scene-stage relative flex flex-col overflow-hidden">
        <Container className="grid flex-1 content-center gap-6 pb-8 pt-[calc(var(--header-h)+1rem)] lg:grid-cols-12 lg:items-center lg:gap-16 [.scene:not(.is-pinned)_&]:py-24">
          <div className="lg:col-span-5">
            <h2 id="services-title" className="display-3">
              {t('home.services.title')}
            </h2>
            <ol className="mt-10 hidden space-y-2 lg:block">
              {services.map((service, index) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    data-i={index}
                    className="svc-name block font-display text-[1.75rem] leading-[1.15] tracking-[-0.02em] xl:text-[2.125rem]"
                  >
                    {service.title[locale]}
                  </Link>
                </li>
              ))}
            </ol>
            <div className="mt-10 hidden lg:block">
              <ArrowLink href="/services">{t('services.allServices')}</ArrowLink>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card bg-teal-darkest lg:aspect-[5/4] lg:max-h-[66svh]" aria-hidden="true">
              {services.map((service, index) => (
                <div key={service.slug} data-i={index} className="scene-layer">
                  <Image
                    src={service.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 720px, 100vw"
                    quality={60}
                    className="object-cover"
                    style={{ objectPosition: service.image.position }}
                  />
                </div>
              ))}
            </div>
            <div className="scene-stack is-top mt-5">
              {services.map((service, index) => (
                <div key={service.slug} data-i={index} className="scene-item">
                  <p className="font-display text-[1.75rem] leading-tight tracking-[-0.02em] lg:hidden">{service.title[locale]}</p>
                  <p className="mt-2 text-mist sm:hidden">{service.tagline[locale]}</p>
                  <p className="mt-2 hidden max-w-xl text-lg text-mist sm:block lg:mt-0">{service.summary[locale]}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 lg:hidden">
              <ArrowLink href="/services">{t('services.allServices')}</ArrowLink>
            </div>
          </div>
        </Container>
        <span className="scene-bar absolute inset-x-0 bottom-0 hidden h-[3px] bg-lime [.is-pinned_&]:block" aria-hidden="true" />
      </div>
    </section>
  );
}
