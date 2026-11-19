import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { photos, type Photo } from '@/content/media';
import type { Locale } from '@/content/types';

// Two rows of the team's own site photographs.
const rows: Photo[][] = [
  [photos.siteBriefing, photos.drawingsReview, photos.cranesAndSkyline, photos.siteWalk, photos.teamOnWharf],
  [photos.teamAtHarbour, photos.teamSiteOffice, photos.siteMeeting, photos.drawingsReview2, photos.teamWharfWide],
];

/** Field photographs in two rows that slide in opposite directions as the page scrolls. */
export async function FieldRows({ locale }: { locale: Locale }) {
  const t = await getTranslations('home.field');

  return (
    <section data-scroll className="overflow-hidden py-20 lg:py-32">
      <Container>
        <SectionHeading title={t('title')} action={<ArrowLink href="/projects">{t('link')}</ArrowLink>} />
      </Container>
      <div className="mt-10 space-y-3 sm:space-y-4 lg:mt-14">
        {rows.map((row, index) => (
          <ul
            key={index}
            className="field-row flex w-max gap-3 sm:gap-4"
            style={{ '--dir': index === 0 ? 1 : -1 } as CSSProperties}
          >
            {row.map((photo) => (
              <li
                key={photo.src.src}
                className={`relative h-[max(24vw,11rem)] shrink-0 overflow-hidden rounded-card ${
                  photo.shape === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]'
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt[locale]}
                  fill
                  sizes="(min-width: 1024px) 32vw, 240px"
                  quality={60}
                  placeholder="blur"
                  className="object-cover"
                  style={{ objectPosition: photo.position }}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
