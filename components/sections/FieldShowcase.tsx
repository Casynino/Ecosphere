import { getTranslations } from 'next-intl/server';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { Photo } from '@/components/ui/Photo';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { photos } from '@/content/media';
import type { Locale } from '@/content/types';

// Three site photographs of the same shape, so they sit in one even row.
const row = [photos.siteBriefing, photos.teamOnWharf, photos.cranesAndSkyline];

/** "On site with our team": a heading and one tidy row of three photographs, on a panel. */
export async function FieldShowcase({ locale }: { locale: Locale }) {
  const t = await getTranslations('home.field');

  return (
    <section className="py-10 lg:py-14">
      <Container>
        <div className="panel rounded-[24px] p-6 sm:p-10 lg:p-14">
          <SectionHeading title={t('title')} intro={t('body')} action={<ArrowLink href="/projects">{t('link')}</ArrowLink>} />
          <ul data-reveal className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-10 lg:grid-cols-3">
            {row.map((photo, index) => (
              <li key={photo.src.src} className={index === 0 ? 'col-span-2 lg:col-span-1' : ''}>
                <Photo
                  photo={photo}
                  locale={locale}
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 92vw"
                  className={index === 0 ? 'aspect-[16/10] lg:aspect-[4/3]' : 'aspect-[4/3]'}
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
