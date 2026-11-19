import { Rss } from 'lucide-react';
import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { PageHero } from '@/components/sections/PageHero';
import { Container } from '@/components/ui/Container';
import { PlaceholderBadge } from '@/components/ui/Placeholder';
import { stock } from '@/content/media';
import { Link } from '@/i18n/navigation';
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

      <section className="py-16 lg:py-24">
        <Container>
          {hasPlaceholders && (
            <p className="mb-10 rounded-2xl border border-dashed border-teal/50 bg-teal/5 p-4 font-semibold text-teal">
              {t('news.placeholderNotice')}
            </p>
          )}

          <ul className="grid gap-6 md:grid-cols-2">
            {articles.map((article, index) => (
              <li key={article.slug} data-reveal style={{ '--reveal-delay': `${(index % 2) * 100}ms` } as CSSProperties}>
                <Link
                  href={`/news/${article.slug}`}
                  className="panel group flex h-full flex-col rounded-card p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgb(0_68_74/0.6)] sm:p-8"
                >
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <time dateTime={article.date} className="font-semibold text-muted">
                      {format.dateTime(new Date(article.date), { dateStyle: 'long' })}
                    </time>
                    {article.placeholder && <PlaceholderBadge label={t('common.placeholder')} />}
                  </div>
                  <h2 className="mt-3 text-2xl text-ink">{article.title}</h2>
                  <p className="mt-3 flex-1 text-muted">{article.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>

          <a
            href={localePath(locale, '/news/feed.xml')}
            className="mt-12 inline-flex items-center gap-2 font-bold text-teal hover:text-teal-dark"
          >
            <Rss className="h-5 w-5" aria-hidden="true" />
            {t('news.rss')}
          </a>
        </Container>
      </section>
    </>
  );
}
