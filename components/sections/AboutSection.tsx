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
    <section className="pb-10 pt-10 lg:pb-14 lg:pt-16">
      <Container>
        {/* Words straight on the sky, pictures beside them. */}
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div data-reveal>
            <h2 className="display-3">{t('home.about.title')}</h2>
            <p className="mt-5 max-w-xl text-lg text-mist">{t('company.about')}</p>
            <ArrowLink href="/about" className="mt-6">
              {t('home.about.link')}
            </ArrowLink>
          </div>
          <div data-reveal className="grid grid-cols-5 gap-3 sm:gap-4">
            <Photo
              photo={photos.drawingsReview}
              locale={locale}
              sizes="(min-width: 1024px) 340px, 55vw"
              className="col-span-3 aspect-[4/5] shadow-[0_24px_50px_-30px_rgb(6_40_45/0.6)]"
            />
            <div className="col-span-2 grid grid-rows-2 gap-3 sm:gap-4">
              <Photo photo={photos.teamOnWharf} locale={locale} sizes="(min-width: 1024px) 220px, 36vw" className="min-h-0" />
              <Photo photo={stock.handsSoil} locale={locale} sizes="(min-width: 1024px) 220px, 36vw" className="min-h-0" />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:gap-5 md:grid-cols-2 lg:mt-14">
          {statements.map((item) => (
            <article key={item.title} data-reveal className="panel statement rounded-card p-5 sm:p-7">
              <h3 className="text-xl font-extrabold tracking-[-0.03em] text-snow sm:text-2xl">{item.title}</h3>
              <p className="mt-2.5 text-mist">{item.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
