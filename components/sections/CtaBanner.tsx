import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { stock } from '@/content/media';
import { site } from '@/content/site';
import type { Locale } from '@/content/types';

/** Closing call to action: a large photo panel floating over the page. */
export async function CtaBanner({ locale }: { locale: Locale }) {
  const t = await getTranslations();

  return (
    <section className="pb-20 pt-6 sm:pb-28">
      <Container>
        <div
          data-scroll
          data-reveal="zoom"
          className="on-dark relative isolate overflow-hidden rounded-[28px] bg-teal-darkest text-white shadow-[0_40px_80px_-40px_rgb(0_50_58/0.8)]"
        >
          <div className="absolute inset-0 -z-20">
            <Image
              src={stock.riverAerial.src}
              alt={stock.riverAerial.alt[locale]}
              fill
              sizes="(min-width: 1280px) 1216px, 100vw"
              placeholder="blur"
              className="parallax object-cover"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(0_36_42/0.86)_0%,rgb(0_36_42/0.7)_100%)] lg:bg-[linear-gradient(90deg,rgb(0_36_42/0.92)_0%,rgb(0_36_42/0.7)_48%,rgb(0_36_42/0.12)_100%)]" />
          <div className="max-w-3xl px-6 py-14 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
            <p className="eyebrow text-lime">{t('common.tagline')}</p>
            <h2 className="mt-4 text-3xl sm:text-[2.7rem]">{t('home.cta.title')}</h2>
            <p className="mt-5 max-w-2xl text-lg text-white/90">{t('home.cta.body')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/contact">
                {t('common.requestConsultation')}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </ButtonLink>
              <a
                href={`tel:${site.phone.e164}`}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/45 px-6 py-3 font-bold transition-colors hover:bg-white/10"
              >
                {site.phone.display}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
