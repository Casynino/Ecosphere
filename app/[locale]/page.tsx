import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LeaderPreviewCard } from '@/components/cards/LeaderCard';
import { AboutSection } from '@/components/sections/AboutSection';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { FieldShowcase } from '@/components/sections/FieldShowcase';
import { HomeHero } from '@/components/sections/HomeHero';
import { HowSection } from '@/components/sections/HowSection';
import { NewsSection } from '@/components/sections/NewsSection';
import { PartnersSection } from '@/components/sections/PartnersSection';
import { SectorsSection } from '@/components/sections/SectorsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
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

// The home page scrolls normally from top to bottom. Headings sit straight
// on the sky of the living landscape; text that needs it sits on light glass.
export default async function HomePage({ params }: LocaleParams) {
  const locale = await getPageLocale(params);
  const t = await getTranslations();

  return (
    <>
      <HomeHero locale={locale} />
      <AboutSection locale={locale} />
      <ServicesSection locale={locale} />
      <SectorsSection locale={locale} />
      <HowSection locale={locale} />
      <FieldShowcase locale={locale} />
      <NewsSection locale={locale} />

      {/* Leadership */}
      <section className="py-10 lg:py-14">
        <Container>
            <SectionHeading
              title={t('home.leadership.title')}
              action={<ArrowLink href="/leadership">{t('home.leadership.link')}</ArrowLink>}
            />
            <ul data-reveal className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-8 sm:grid-cols-3 sm:gap-x-6">
              {leaders.map((leader) => (
                <li key={leader.slug}>
                  <LeaderPreviewCard leader={leader} photoAlt={t('leadership.photoAlt', { name: leader.name })} />
                </li>
              ))}
            </ul>
        </Container>
      </section>

      <PartnersSection className="pb-16 pt-10 lg:pb-24 lg:pt-14" />

      <CtaBanner locale={locale} />
    </>
  );
}
