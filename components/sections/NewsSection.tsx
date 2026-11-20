import { getFormatter, getTranslations } from 'next-intl/server';
import { NewsCard } from '@/components/cards/NewsCard';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Locale } from '@/content/types';
import { getAllNews } from '@/lib/news';

/** The three latest news articles, on the home page. */
export async function NewsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations();
  const format = await getFormatter();
  const latest = (await getAllNews(locale)).slice(0, 3);
  if (latest.length === 0) return null;

  return (
    <section className="py-10 lg:py-14">
      <Container>
        <SectionHeading title={t('home.news.title')} action={<ArrowLink href="/news">{t('news.back')}</ArrowLink>} />
        <ul className="mt-5 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-5">
          {latest.map((article) => (
            <li key={article.slug} data-reveal>
              <NewsCard
                article={article}
                dateLabel={article.hideDate ? null : format.dateTime(new Date(article.date), { dateStyle: 'long' })}
                placeholderLabel={t('common.placeholder')}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
