import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { photos, type Photo } from '@/content/media';
import type { Locale } from '@/content/types';

function Picture({ photo, locale, sizes, className }: { photo: Photo; locale: Locale; sizes: string; className: string }) {
  return (
    <div className={`relative overflow-hidden rounded-card ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt[locale]}
        fill
        sizes={sizes}
        quality={60}
        placeholder="blur"
        className="object-cover"
        style={{ objectPosition: photo.position }}
      />
    </div>
  );
}

/**
 * "On site with our team": three chosen photographs with room to breathe.
 * Wide screens: the words on the left, one large picture and two upright
 * ones on the right, which drift gently against each other as the page
 * scrolls (globals.css, .drift-a and .drift-b). Phones: the large picture,
 * then the two upright ones side by side.
 */
export async function FieldShowcase({ locale }: { locale: Locale }) {
  const t = await getTranslations('home.field');

  return (
    <section data-scroll className="py-20 lg:py-32">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4 lg:pt-6">
          <SectionHeading title={t('title')} intro={t('body')} />
          <ArrowLink href="/projects" className="mt-6">
            {t('link')}
          </ArrowLink>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:col-span-8">
          <div data-reveal className="col-span-2">
            <Picture
              photo={photos.siteBriefing}
              locale={locale}
              sizes="(min-width: 1024px) 800px, 100vw"
              className="aspect-[16/10]"
            />
          </div>
          <div data-reveal className="drift-a">
            <Picture
              photo={photos.drawingsReview}
              locale={locale}
              sizes="(min-width: 1024px) 390px, 50vw"
              className="aspect-[4/5]"
            />
          </div>
          <div data-reveal className="drift-b lg:mt-16">
            <Picture
              photo={photos.teamSiteOffice}
              locale={locale}
              sizes="(min-width: 1024px) 390px, 50vw"
              className="aspect-[4/5]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
