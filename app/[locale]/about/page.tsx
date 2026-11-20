import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { LeaderCard } from '@/components/cards/LeaderCard';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { PartnersSection } from '@/components/sections/PartnersSection';
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
        photo={stock.craterGreen}
        title={t('about.title')}
        intro={t('about.intro')}
      />

      <section className="py-16 lg:py-24">
        <Container>
          <div className="panel rounded-card p-6 sm:p-10 lg:p-14">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <SectionHeading title={t('home.about.title')} />
                <ScrollWords text={t('company.about')} className="mt-7 font-display text-xl leading-snug sm:text-2xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div data-reveal className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-card">
                  <Image
                    src={photos.teamAtHarbour.src}
                    alt={photos.teamAtHarbour.alt[locale]}
                    fill
                    sizes="(min-width: 1024px) 560px, 90vw"
                    placeholder="blur"
                    className="object-cover"
                  />
                </div>
                <div data-reveal className="relative aspect-[4/3] overflow-hidden rounded-card">
                  <Image
                    src={stock.plantingSeedling.src}
                    alt={stock.plantingSeedling.alt[locale]}
                    fill
                    sizes="(min-width: 1024px) 280px, 46vw"
                    placeholder="blur"
                    className="object-cover"
                  />
                </div>
                <div data-reveal className="relative aspect-[4/3] overflow-hidden rounded-card">
                  <Image
                    src={stock.kilimanjaro.src}
                    alt={stock.kilimanjaro.alt[locale]}
                    fill
                    sizes="(min-width: 1024px) 280px, 46vw"
                    placeholder="blur"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-6">
            <MissionVision />
          </div>
        </Container>
      </section>

      <section id="leadership" className="pb-16 lg:pb-24">
        <Container>
          <div className="panel rounded-card p-6 sm:p-10">
            <SectionHeading title={t('about.leadershipTitle')} intro={t('about.leadershipIntro')} />
          </div>
          <ul className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-2 lg:[&>li:last-child:nth-child(odd)]:col-span-2 lg:[&>li:last-child:nth-child(odd)]:w-[calc(50%-0.75rem)] lg:[&>li:last-child:nth-child(odd)]:justify-self-center">
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

      <PartnersSection className="pb-16 lg:pb-24" />

      <CtaBanner locale={locale} />
    </>
  );
}
