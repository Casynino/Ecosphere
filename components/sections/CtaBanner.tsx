import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { stock } from '@/content/media';
import type { Locale } from '@/content/types';

/**
 * Closing scene: a river through forest, seen from the air. It arrives as
 * a framed picture and widens to fill the screen (globals.css, .closing-frame).
 */
export async function CtaBanner({ locale }: { locale: Locale }) {
  const t = await getTranslations();

  return (
    <section data-scroll>
      <div className="closing-frame relative isolate flex min-h-[88svh] items-end overflow-hidden bg-teal-darkest text-white">
        <div className="absolute inset-0 -z-20">
          <Image
            src={stock.riverAerial.src}
            alt={stock.riverAerial.alt[locale]}
            fill
            sizes="100vw"
            quality={60}
            placeholder="blur"
            className="parallax object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(2_19_22/0.94)_0%,rgb(2_19_22/0.5)_55%,rgb(2_19_22/0.25)_100%)]" />
        <Container className="pb-14 pt-32 sm:pb-20">
          <h2 className="display-2 max-w-4xl">{t('home.cta.title')}</h2>
          <p className="mt-6 hidden max-w-xl text-lg text-white/85 sm:block">{t('home.cta.body')}</p>
          <ButtonLink href="/contact" className="mt-8">
            {t('common.requestConsultation')}
          </ButtonLink>
        </Container>
      </div>
    </section>
  );
}
