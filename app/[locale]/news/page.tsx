import { Rss } from 'lucide-react';
import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import { NewsCard } from '@/components/cards/NewsCard';
import { PageHero } from '@/components/sections/PageHero';
import { Container } from '@/components/ui/Container';
import { stock } from '@/content/media';
import { getPageLocale, type LocaleParams } from '@/lib/locale';
import { getAllNews } from '@/lib/news';
import { localePath, pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale, namespace: 'news' });
  const articles = await getAllNews(locale);

  const metadata = pageMetadata({
    locale,
    path: '/news',
    title: t('metaTitle'),
    description: t('metaDescription'),
    // Keep the page out of search results while it only holds placeholder drafts.
    noindex: articles.every((article) => article.placeholder),
  });

  return {
    ...metadata,
    alternates: { ...metadata.alternates, types: { 'application/rss+xml': localePath(locale, '/news/feed.xml') } },
  };
}

export default async function NewsPage({ params }: LocaleParams) {
  const locale = await getPageLocale(params);
  const t = await getTranslations();
  const format = await getFormatter();
  const articles = await getAllNews(locale);
  const hasPlaceholders = articles.some((article) => article.placeholder);

  return (
    <>
      <PageHero
        locale={locale}
        photo={stock.rainforestMist}
        title={t('news.title')}
        intro={t('news.intro')}
      />

      <section className="py-12 lg:py-20">
        <Container>
          {hasPlaceholders && (
            <p className="mb-10 rounded-2xl border border-dashed border-accent/50 bg-accent/10 p-4 font-semibold text-accent">
              {t('news.placeholderNotice')}
            </p>
          )}

          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article.slug} data-reveal>
                <NewsCard
                  article={article}
                  heading="h2"
                  dateLabel={article.hideDate ? null : format.dateTime(new Date(article.date), { dateStyle: 'long' })}
                  placeholderLabel={t('common.placeholder')}
                />
              </li>
            ))}
          </ul>

          <a
            href={localePath(locale, '/news/feed.xml')}
            className="mt-10 inline-flex items-center gap-2 font-bold text-accent hover:text-snow"
          >
            <Rss className="h-5 w-5" aria-hidden="true" />
            {t('news.rss')}
          </a>
        </Container>
      </section>
    </>
  );
}
