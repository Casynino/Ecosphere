import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { LeaderCard } from '@/components/cards/LeaderCard';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { MissionVision } from '@/components/sections/MissionVision';
import { PageHero } from '@/components/sections/PageHero';
import { Container } from '@/components/ui/Container';
import { ScrollWords } from '@/components/ui/ScrollWords';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { leaders } from '@/content/leadership';
import { photos, stock } from '@/content/media';
import { getPageLocale, type LocaleParams } from '@/lib/locale';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale, namespace: 'about' });
  return pageMetadata({ locale, path: '/about', title: t('metaTitle'), description: t('metaDescription') });
}

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await getPageLocale(params);
  const t = await getTranslations();

  return (
    <>
      <PageHero
        locale={locale}
        photo={stock.kilimanjaro}
        eyebrow={t('about.eyebrow')}
        title={t('about.title')}
        intro={t('about.intro')}
      />

      <section className="py-20 sm:py-28">
        <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow={t('about.companyTitle')} title={t('home.about.title')} />
            <ScrollWords text={t('company.about')} className="mt-7 font-display text-2xl leading-snug sm:text-[1.75rem]" />
          </div>
          <div data-scroll className="relative pb-12 pl-8 sm:pl-14">
            <div data-reveal="right" className="relative aspect-[4/3] overflow-hidden rounded-card">
              <Image
                src={photos.teamAtHarbour.src}
                alt={photos.teamAtHarbour.alt[locale]}
                fill
                sizes="(min-width: 1024px) 560px, 90vw"
                placeholder="blur"
                className="object-cover"
              />
            </div>
            <div className="drift absolute bottom-0 left-0 w-[42%] overflow-hidden rounded-card border-[6px] border-background shadow-[0_24px_50px_-24px_rgb(0_68_74/0.6)]">
              <div className="relative aspect-[4/5]">
                <Image
                  src={stock.plantingSeedling.src}
                  alt={stock.plantingSeedling.alt[locale]}
                  fill
                  sizes="(min-width: 1024px) 240px, 40vw"
                  placeholder="blur"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
        <Container className="mt-16 sm:mt-20">
          <MissionVision />
        </Container>
      </section>

      <section id="leadership" className="border-t border-line bg-white py-20 sm:py-28">
        <Container>
          <div data-reveal>
            <SectionHeading
              eyebrow={t('about.leadershipEyebrow')}
              title={t('about.leadershipTitle')}
              intro={t('about.leadershipIntro')}
            />
          </div>
          <ul className="mt-12 grid gap-6 lg:grid-cols-2">
            {leaders.map((leader, index) => (
              <li key={leader.slug} data-reveal style={{ '--reveal-delay': `${(index % 2) * 110}ms` } as CSSProperties}>
                <LeaderCard
                  leader={leader}
                  locale={locale}
                  photoAlt={t('leadership.photoAlt', { name: leader.name })}
                  focusLabel={t('leadership.focusLabel')}
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBanner locale={locale} />
    </>
  );
}
