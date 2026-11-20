import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { LeaderCard } from '@/components/cards/LeaderCard';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { PageHero } from '@/components/sections/PageHero';
import { Container } from '@/components/ui/Container';
import { leaders } from '@/content/leadership';
import { stock } from '@/content/media';
import { getPageLocale, type LocaleParams } from '@/lib/locale';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale, namespace: 'leadership' });
  return pageMetadata({ locale, path: '/leadership', title: t('metaTitle'), description: t('metaDescription') });
}

export default async function LeadershipPage({ params }: LocaleParams) {
  const locale = await getPageLocale(params);
  const t = await getTranslations('leadership');

  return (
    <>
      <PageHero locale={locale} photo={stock.sunriseMist} title={t('title')} intro={t('intro')} />

      <section className="py-16 lg:py-24">
        <Container>
          <ul className="grid gap-4 sm:gap-6 lg:grid-cols-2 lg:[&>li:last-child:nth-child(odd)]:col-span-2 lg:[&>li:last-child:nth-child(odd)]:w-[calc(50%-0.75rem)] lg:[&>li:last-child:nth-child(odd)]:justify-self-center">
            {leaders.map((leader, index) => (
              <li key={leader.slug} data-reveal style={{ '--reveal-delay': `${(index % 2) * 110}ms` } as CSSProperties}>
                <LeaderCard
                  leader={leader}
                  locale={locale}
                  photoAlt={t('photoAlt', { name: leader.name })}
                  focusLabel={t('focusLabel')}
                  heading="h2"
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
