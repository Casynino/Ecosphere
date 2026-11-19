import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { LeaderPreviewCard } from '@/components/cards/LeaderCard';
import { SectorCard } from '@/components/cards/SectorCard';
import { ServiceList } from '@/components/cards/ServiceCard';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { HomeHero } from '@/components/sections/HomeHero';
import { MissionVision } from '@/components/sections/MissionVision';
import { ScrollStory } from '@/components/sections/ScrollStory';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { PhotoMarquee } from '@/components/ui/Marquee';
import { ScrollWords } from '@/components/ui/ScrollWords';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { leaders } from '@/content/leadership';
import { fieldGallery, photos, stock, type Photo } from '@/content/media';
import { sectors } from '@/content/sectors';
import { services } from '@/content/services';
import type { Locale } from '@/content/types';
import { getPageLocale, type LocaleParams } from '@/lib/locale';
import { pageMetadata } from '@/lib/seo';

const stagger = (index: number) => ({ '--reveal-delay': `${index * 50}ms` }) as CSSProperties;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({ locale, title: t('titleDefault'), description: t('description'), absoluteTitle: true });
}

/** One photo of the About mosaic, filling whatever box it is given. */
function Tile({ photo, locale, className, sizes }: { photo: Photo; locale: Locale; className: string; sizes: string }) {
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

// Every section uses the same rhythm: 64px above and below on phones,
// 96px on larger screens, and 32-40px between a title and its content.
const section = 'py-16 lg:py-24';
const below = 'mt-8 lg:mt-10';

export default async function HomePage({ params }: LocaleParams) {
  const locale = await getPageLocale(params);
  const t = await getTranslations();

  return (
    <>
      <HomeHero locale={locale} />

      {/* About: words on the left, photos on the right, then mission and vision */}
      <section className={section}>
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading title={t('home.about.title')} />
              <ScrollWords text={t('company.about')} className="mt-5 text-lg leading-relaxed" />
              <ArrowLink href="/about" className="mt-6">
                {t('home.about.link')}
              </ArrowLink>
            </div>
            <div data-reveal className="grid grid-cols-5 gap-3 sm:gap-4 lg:col-span-7">
              <Tile
                photo={photos.drawingsReview}
                locale={locale}
                className="col-span-3 aspect-[4/5]"
                sizes="(min-width: 1024px) 420px, 60vw"
              />
              <div className="col-span-2 grid grid-rows-2 gap-3 sm:gap-4">
                <Tile photo={photos.teamOnWharf} locale={locale} className="min-h-0" sizes="(min-width: 1024px) 280px, 40vw" />
                <Tile photo={stock.handsSoil} locale={locale} className="min-h-0" sizes="(min-width: 1024px) 280px, 40vw" />
              </div>
            </div>
          </div>
          <div className="mt-10 lg:mt-16">
            <MissionVision />
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className={section}>
        <Container>
          <SectionHeading
            title={t('home.services.title')}
            intro={t('home.services.intro')}
            action={<ArrowLink href="/services">{t('services.allServices')}</ArrowLink>}
          />
          <div data-reveal className={below}>
            <ServiceList services={services} locale={locale} brief />
          </div>
        </Container>
      </section>

      {/* Sectors: four photo tiles; on wide screens the one under the pointer opens */}
      <section className={section}>
        <Container>
          <SectionHeading
            title={t('home.sectors.title')}
            intro={t('home.sectors.intro')}
            action={<ArrowLink href="/sectors">{t('home.sectors.link')}</ArrowLink>}
          />
          <ul className={`sector-panels grid grid-cols-2 gap-3 sm:gap-4 lg:flex lg:h-[30rem] ${below}`}>
            {sectors.map((sector, index) => (
              <li key={sector.slug} data-reveal style={stagger(index)} className="min-w-0">
                <SectorCard sector={sector} locale={locale} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* How we work: pinned scroll story */}
      <ScrollStory />

      {/* In the field: moving strip of the team's own photos */}
      <section className={`overflow-hidden ${section}`}>
        <Container>
          <SectionHeading
            title={t('home.field.title')}
            intro={t('home.field.body')}
            action={<ArrowLink href="/projects">{t('home.field.link')}</ArrowLink>}
          />
        </Container>
        <div className={below}>
          <PhotoMarquee photos={fieldGallery} locale={locale} />
        </div>
      </section>

      {/* Leadership */}
      <section className="pb-16 lg:pb-24">
        <Container>
          <SectionHeading
            title={t('home.leadership.title')}
            action={<ArrowLink href="/leadership">{t('home.leadership.link')}</ArrowLink>}
          />
          <ul className={`grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 ${below}`}>
            {leaders.map((leader, index) => (
              <li key={leader.slug} data-reveal style={stagger(index)}>
                <LeaderPreviewCard leader={leader} photoAlt={t('leadership.photoAlt', { name: leader.name })} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBanner locale={locale} />
    </>
  );
}
