import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { stock } from '@/content/media';
import type { Locale } from '@/content/types';

/** Closing call to action: a photo panel with one question and one button. */
export async function CtaBanner({ locale }: { locale: Locale }) {
  const t = await getTranslations();

  return (
    <section className="pb-16 lg:pb-24">
      <Container>
        <div data-scroll data-reveal className="on-dark relative isolate overflow-hidden rounded-card bg-teal-darkest text-white">
          <div className="absolute inset-0 -z-20">
            <Image
              src={stock.riverAerial.src}
              alt={stock.riverAerial.alt[locale]}
              fill
              sizes="(min-width: 1280px) 1216px, 100vw"
              quality={60}
              placeholder="blur"
              className="parallax object-cover"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(0_36_42/0.88)_0%,rgb(0_36_42/0.72)_100%)] lg:bg-[linear-gradient(90deg,rgb(0_36_42/0.92)_0%,rgb(0_36_42/0.7)_50%,rgb(0_36_42/0.1)_100%)]" />
          <div className="max-w-2xl p-6 py-12 sm:p-12 lg:p-16">
            <h2 className="text-[1.875rem] sm:text-[2.5rem]">{t('home.cta.title')}</h2>
            <p className="mt-4 hidden text-lg text-white/85 sm:block">{t('home.cta.body')}</p>
            <ButtonLink href="/contact" className="mt-8">
              {t('common.requestConsultation')}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
