import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Photo } from '@/components/ui/Photo';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { stock } from '@/content/media';
import type { Locale } from '@/content/types';

const steps = ['assess', 'advise', 'implement', 'sustain'] as const;

/** "How we work": one wide photograph and the four steps beneath it, all on one panel. */
export async function HowSection({ locale }: { locale: Locale }) {
  const t = await getTranslations('home.how');

  return (
    <section className="py-10 lg:py-14">
      <Container>
        <div className="grid items-end gap-6 lg:grid-cols-2 lg:gap-16">
          <SectionHeading title={t('title')} />
          <div data-reveal>
            <Photo
              photo={stock.plantingSeedling}
              locale={locale}
              sizes="(min-width: 1024px) 560px, 92vw"
              className="aspect-[16/9] shadow-[0_24px_50px_-30px_rgb(6_40_45/0.6)]"
            />
          </div>
        </div>
        <ol className="mt-5 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step} data-reveal className="panel statement rounded-card p-5 sm:p-6">
              <h3 className="text-xl font-extrabold tracking-[-0.03em] text-snow">{t(`steps.${step}.title`)}</h3>
              <p className="mt-2 text-mist">{t(`steps.${step}.body`)}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
