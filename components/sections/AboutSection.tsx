import { getTranslations } from 'next-intl/server';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { Photo } from '@/components/ui/Photo';
import { photos, stock } from '@/content/media';
import type { Locale } from '@/content/types';

/**
 * About, on the home page: one panel with the company statement beside
 * three photographs, then the mission and the vision side by side.
 */
export async function AboutSection({ locale }: { locale: Locale }) {
  const t = await getTranslations();
  const statements = [
    { title: t('company.missionTitle'), body: t('company.mission') },
    { title: t('company.visionTitle'), body: t('company.vision') },
  ];

  return (
    <section className="relative pb-10 pt-20 lg:pb-14 lg:pt-28">
      {/* The dark foot of the opening film lifts away as the page begins. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[36svh] bg-[linear-gradient(to_bottom,#021316,rgb(2_19_22/0))]" aria-hidden="true" />

      <Container className="relative">
        <div data-reveal className="panel rounded-[24px] p-6 sm:p-10 lg:p-14">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="display-3">{t('home.about.title')}</h2>
              <p className="mt-5 text-lg text-mist">{t('company.about')}</p>
              <ArrowLink href="/about" className="mt-6">
                {t('home.about.link')}
              </ArrowLink>
            </div>
            <div className="grid grid-cols-5 gap-3 sm:gap-4">
              <Photo
                photo={photos.drawingsReview}
                locale={locale}
                sizes="(min-width: 1024px) 320px, 55vw"
                className="col-span-3 aspect-[4/5]"
              />
              <div className="col-span-2 grid grid-rows-2 gap-3 sm:gap-4">
                <Photo photo={photos.teamOnWharf} locale={locale} sizes="(min-width: 1024px) 210px, 36vw" className="min-h-0" />
                <Photo photo={stock.handsSoil} locale={locale} sizes="(min-width: 1024px) 210px, 36vw" className="min-h-0" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 md:grid-cols-2">
          {statements.map((item) => (
            <article key={item.title} data-reveal className="panel rounded-[24px] p-6 sm:p-10">
              <h3 className="display-3">{item.title}</h3>
              <p className="mt-4 text-mist">{item.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
