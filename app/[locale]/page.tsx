import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { LeaderPreviewCard } from '@/components/cards/LeaderCard';
import { AboutScene } from '@/components/sections/AboutScene';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { FieldRows } from '@/components/sections/FieldRows';
import { HomeHero } from '@/components/sections/HomeHero';
import { ScrollStory } from '@/components/sections/ScrollStory';
import { SectorsScene } from '@/components/sections/SectorsScene';
import { ServicesScene } from '@/components/sections/ServicesScene';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { leaders } from '@/content/leadership';
import { getPageLocale, type LocaleParams } from '@/lib/locale';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({ locale, title: t('titleDefault'), description: t('description'), absoluteTitle: true });
}

// The home page is a film in chapters. Each "scene" fills the screen and
// changes as the visitor scrolls (see app/globals.css, "Scenes").
export default async function HomePage({ params }: LocaleParams) {
  const locale = await getPageLocale(params);
  const t = await getTranslations();

  return (
    <>
      <HomeHero locale={locale} />
      <AboutScene />
      <ServicesScene locale={locale} />
      <SectorsScene locale={locale} />
      <ScrollStory />
      <FieldRows locale={locale} />

      {/* Leadership */}
      <section className="pb-20 lg:pb-32">
        <Container>
          <SectionHeading
            title={t('home.leadership.title')}
            action={<ArrowLink href="/leadership">{t('home.leadership.link')}</ArrowLink>}
          />
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:mt-14 lg:grid-cols-4">
            {leaders.map((leader, index) => (
              <li key={leader.slug} data-reveal style={{ '--reveal-delay': `${index * 60}ms` } as CSSProperties}>
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
