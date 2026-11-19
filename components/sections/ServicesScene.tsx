import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { services } from '@/content/services';
import type { Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';

/**
 * The seven services as a scene, on one frosted panel so the words are
 * easy to read over the moving background. Wide screens: the names on the
 * left with the current one lit and its description beneath, and a picture
 * filling the right half of the panel that changes with it. Phones: the
 * picture on top, then the current name and a line.
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
      <div className="scene-stage flex flex-col overflow-hidden">
        <Container className="flex flex-1 flex-col justify-center pb-6 pt-[calc(var(--header-h)+1rem)] [.scene:not(.is-pinned)_&]:py-24">
          <div className="panel relative grid overflow-hidden rounded-[24px] lg:min-h-[min(40rem,74svh)] lg:grid-cols-2">
            {/* The picture: on top on phones, the right half of the panel on wide screens. */}
            <div className="relative aspect-[16/10] bg-teal-darkest lg:order-2 lg:aspect-auto" aria-hidden="true">
              {services.map((service, index) => (
                <div key={service.slug} data-i={index} className="scene-layer">
                  <Image
                    src={service.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 620px, 100vw"
                    quality={60}
                    className="object-cover"
                    style={{ objectPosition: service.image.position }}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col p-6 sm:p-8 lg:p-12">
              <h2 id="services-title" className="display-3">
                {t('home.services.title')}
              </h2>

              <ol className="mt-8 hidden space-y-1.5 lg:block">
                {services.map((service, index) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      data-i={index}
                      className="svc-name block font-display text-[1.625rem] leading-[1.2] tracking-[-0.02em] xl:text-[1.875rem]"
                    >
                      {service.title[locale]}
                    </Link>
                  </li>
                ))}
              </ol>

              <div className="scene-stack is-top mt-5 lg:mt-8 lg:border-t lg:border-snow/15 lg:pt-6">
                {services.map((service, index) => (
                  <div key={service.slug} data-i={index} className="scene-item">
                    <p className="font-display text-[1.625rem] leading-tight tracking-[-0.02em] lg:hidden">{service.title[locale]}</p>
                    <p className="mt-2 text-mist sm:hidden">{service.tagline[locale]}</p>
                    <p className="mt-2 hidden text-mist sm:block lg:mt-0">{service.summary[locale]}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 lg:mt-auto lg:pt-6">
                <ArrowLink href="/services">{t('services.allServices')}</ArrowLink>
              </div>
            </div>

            <span className="scene-bar absolute inset-x-0 bottom-0 hidden h-[3px] bg-lime [.is-pinned_&]:block" aria-hidden="true" />
          </div>
        </Container>
      </div>
    </section>
  );
}
