import { ArrowRight } from 'lucide-react';
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
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { PhotoMarquee, WordMarquee } from '@/components/ui/Marquee';
import { ScrollWords } from '@/components/ui/ScrollWords';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { leaders } from '@/content/leadership';
import { fieldGallery, photos, stock } from '@/content/media';
import { sectors } from '@/content/sectors';
import { services } from '@/content/services';
import { Link } from '@/i18n/navigation';
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

      {/* Moving strip of service names */}
      <div className="on-dark border-y border-white/10 bg-teal-darkest py-5">
        <WordMarquee items={services.map((service) => service.title[locale])} label={t('nav.services')} />
      </div>

      {/* About */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={t('home.about.eyebrow')} title={t('home.about.title')} />
          <div className="mt-12 grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div data-scroll className="relative pb-12 pr-8 sm:pr-14">
              <div data-reveal="left" className="relative aspect-[4/3] overflow-hidden rounded-card">
                <Image
                  src={photos.teamOnWharf.src}
                  alt={photos.teamOnWharf.alt[locale]}
                  fill
                  sizes="(min-width: 1024px) 560px, 90vw"
                  placeholder="blur"
                  className="object-cover"
                />
              </div>
              <div className="drift absolute bottom-0 right-0 w-[42%] overflow-hidden rounded-card border-[6px] border-background shadow-[0_24px_50px_-24px_rgb(0_68_74/0.6)]">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={stock.handsSoil.src}
                    alt={stock.handsSoil.alt[locale]}
                    fill
                    sizes="(min-width: 1024px) 240px, 40vw"
                    placeholder="blur"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div>
              <ScrollWords text={t('company.about')} className="font-display text-2xl leading-snug sm:text-[1.9rem]" />
              <ButtonLink href="/about" variant="outlineDark" className="mt-8">
                {t('home.about.link')}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
          <div className="mt-16 sm:mt-20">
            <MissionVision />
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="border-y border-line bg-white py-20 sm:py-28">
        <Container>
          <div data-reveal>
            <SectionHeading
              eyebrow={t('home.services.eyebrow')}
              title={t('home.services.title')}
              intro={t('home.services.intro')}
            />
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <li key={service.slug} data-reveal style={stagger(index % 3)}>
                <ServiceCard service={service} locale={locale} learnMore={t('common.learnMore')} />
              </li>
            ))}
            <li data-reveal style={stagger(1)} className="sm:col-span-2 lg:col-span-2">
              <div className="on-dark bg-hero relative flex h-full flex-col justify-center overflow-hidden rounded-card p-7 text-white sm:p-9">
                <h3 className="text-2xl sm:text-3xl">{t('home.services.helpTitle')}</h3>
                <p className="mt-3 max-w-lg text-white/85">{t('home.services.helpBody')}</p>
                <div className="mt-6">
                  <ButtonLink href="/contact">
                    {t('home.services.helpCta')}
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </ButtonLink>
                </div>
              </div>
            </li>
          </ul>
        </Container>
      </section>

      {/* Sectors */}
      <section className="py-20 sm:py-28">
        <Container>
          <div data-reveal>
            <SectionHeading
              eyebrow={t('home.sectors.eyebrow')}
              title={t('home.sectors.title')}
              intro={t('home.sectors.intro')}
            />
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {sectors.map((sector, index) => (
              <li key={sector.slug} data-reveal="zoom" style={stagger(index, 110)}>
                <SectorCard sector={sector} locale={locale} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* How we work: pinned scroll story */}
      <ScrollStory />

      {/* In the field: moving strip of the team's own photos */}
      <section className="overflow-hidden py-20 sm:py-28">
        <Container>
          <div data-reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow={t('home.field.eyebrow')}
              title={t('home.field.title')}
              intro={t('home.field.body')}
            />
            <Link
              href="/projects"
              className="group inline-flex shrink-0 items-center gap-2 font-bold text-teal hover:text-teal-dark"
            >
              {t('home.field.link')}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" aria-hidden="true" />
            </Link>
          </div>
        </Container>
        <div className="mt-12">
          <PhotoMarquee photos={fieldGallery} locale={locale} />
        </div>
      </section>

      {/* Leadership preview */}
      <section className="border-t border-line bg-white py-20 sm:py-28">
        <Container>
          <div data-reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow={t('home.leadership.eyebrow')} title={t('home.leadership.title')} />
            <Link
              href="/leadership"
              className="group inline-flex shrink-0 items-center gap-2 font-bold text-teal hover:text-teal-dark"
            >
              {t('home.leadership.link')}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" aria-hidden="true" />
            </Link>
          </div>
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
