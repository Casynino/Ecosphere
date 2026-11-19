import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { stock } from '@/content/media';
import { site } from '@/content/site';
import type { Locale } from '@/content/types';

/** Closing call to action over a forest photograph. */
export async function CtaBanner({ locale }: { locale: Locale }) {
  const t = await getTranslations();

  return (
    <section data-scroll className="on-dark relative isolate overflow-hidden bg-teal-darkest text-white">
      <div className="absolute inset-0 -z-20">
        <Image
          src={stock.riverForest.src}
          alt={stock.riverForest.alt[locale]}
          fill
          sizes="100vw"
          quality={60}
          placeholder="blur"
          className="parallax object-cover"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(95deg,rgb(0_50_58/0.95)_0%,rgb(0_68_74/0.85)_50%,rgb(0_68_74/0.45)_100%)]" />
      <Container className="py-20 sm:py-28">
        <div className="max-w-3xl" data-reveal>
          <p className="eyebrow text-lime">{t('common.tagline')}</p>
          <h2 className="mt-4 text-3xl sm:text-[2.6rem]">{t('home.cta.title')}</h2>
          <p className="mt-5 max-w-2xl text-lg text-white/85">{t('home.cta.body')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/contact">
              {t('common.requestConsultation')}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </ButtonLink>
            <a
              href={`tel:${site.phone.e164}`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-6 py-3 font-bold transition-colors hover:bg-white/10"
            >
              {site.phone.display}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
