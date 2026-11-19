import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { LeaderPreviewCard } from '@/components/cards/LeaderCard';
import { SectorCard } from '@/components/cards/SectorCard';
import { ServiceCard } from '@/components/cards/ServiceCard';
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
import { fieldGallery, photos, stock } from '@/content/media';
import { sectors } from '@/content/sectors';
import { services } from '@/content/services';
import { getPageLocale, type LocaleParams } from '@/lib/locale';
import { pageMetadata } from '@/lib/seo';

const stagger = (index: number, step = 90) => ({ '--reveal-delay': `${index * step}ms` }) as CSSProperties;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({ locale, title: t('titleDefault'), description: t('description'), absoluteTitle: true });
}

export default async function HomePage({ params }: LocaleParams) {
  const locale = await getPageLocale(params);
  const t = await getTranslations();

  return (
    <>
      <HomeHero locale={locale} />

      {/* About */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="panel rounded-[28px] p-6 sm:p-10 lg:p-14">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
              <div>
                <SectionHeading title={t('home.about.title')} />
                <ScrollWords text={t('company.about')} className="mt-7 font-display text-xl leading-snug sm:text-2xl" />
                <ArrowLink href="/about" className="mt-8">
                  {t('home.about.link')}
                </ArrowLink>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div data-reveal className="relative row-span-2 min-h-72 overflow-hidden rounded-card">
                  <Image
                    src={photos.drawingsReview.src}
                    alt={photos.drawingsReview.alt[locale]}
                    fill
                    sizes="(min-width: 1024px) 280px, 46vw"
                    placeholder="blur"
                    className="object-cover"
                    style={{ objectPosition: photos.drawingsReview.position }}
                  />
                </div>
                <div data-reveal style={stagger(1, 120)} className="relative aspect-[4/3] overflow-hidden rounded-card">
                  <Image
                    src={photos.teamOnWharf.src}
                    alt={photos.teamOnWharf.alt[locale]}
                    fill
                    sizes="(min-width: 1024px) 280px, 46vw"
                    placeholder="blur"
                    className="object-cover"
                  />
                </div>
                <div data-reveal style={stagger(2, 120)} className="relative aspect-[4/3] overflow-hidden rounded-card">
                  <Image
                    src={stock.handsSoil.src}
                    alt={stock.handsSoil.alt[locale]}
                    fill
                    sizes="(min-width: 1024px) 280px, 46vw"
                    placeholder="blur"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <MissionVision />
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            title={t('home.services.title')}
            intro={t('home.services.intro')}
            action={<ArrowLink href="/services">{t('services.allServices')}</ArrowLink>}
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <li key={service.slug} data-reveal style={stagger(index % 4)}>
                <ServiceCard service={service} locale={locale} brief />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Sectors: photo panels that open wider under the pointer */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            title={t('home.sectors.title')}
            intro={t('home.sectors.intro')}
            action={<ArrowLink href="/sectors">{t('home.sectors.link')}</ArrowLink>}
          />
          <ul className="sector-panels mt-12 flex flex-col gap-4 lg:h-[34rem] lg:flex-row">
            {sectors.map((sector, index) => (
              <li key={sector.slug} data-reveal="zoom" style={stagger(index, 110)} className="min-h-60 min-w-0">
                <SectorCard sector={sector} locale={locale} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* How we work: pinned scroll story */}
      <ScrollStory />

      {/* In the field: moving strip of the team's own photos */}
      <section className="overflow-hidden py-16 sm:py-24">
        <Container>
          <SectionHeading
            title={t('home.field.title')}
            intro={t('home.field.body')}
            action={<ArrowLink href="/projects">{t('home.field.link')}</ArrowLink>}
          />
        </Container>
        <div className="mt-12">
          <PhotoMarquee photos={fieldGallery} locale={locale} />
        </div>
      </section>

      {/* Leadership preview */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            title={t('home.leadership.title')}
            action={<ArrowLink href="/leadership">{t('home.leadership.link')}</ArrowLink>}
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
