import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Photo } from '@/components/ui/Photo';
import { stock } from '@/content/media';
import type { Locale } from '@/content/types';

const steps = ['assess', 'advise', 'implement', 'sustain'] as const;

/** "How we work": one wide photograph and the four steps beneath it, all on one panel. */
export async function HowSection({ locale }: { locale: Locale }) {
  const t = await getTranslations('home.how');

  return (
    <section className="py-10 lg:py-14">
      <Container>
        <div data-reveal className="panel rounded-[24px] p-6 sm:p-10 lg:p-14">
          <div className="grid items-end gap-8 lg:grid-cols-2 lg:gap-14">
            <h2 className="display-3">{t('title')}</h2>
            <Photo
              photo={stock.plantingSeedling}
              locale={locale}
              sizes="(min-width: 1024px) 560px, 92vw"
              className="aspect-[16/9]"
            />
          </div>
          <ol className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {steps.map((step) => (
              <li key={step} className="border-t border-snow/20 pt-5">
                <h3 className="font-display text-2xl font-normal tracking-[-0.02em]">{t(`steps.${step}.title`)}</h3>
                <p className="mt-2 text-mist">{t(`steps.${step}.body`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
