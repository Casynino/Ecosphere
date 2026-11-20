import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/sections/PageHero';
import { JsonLd } from '@/components/seo/JsonLd';
import { Container } from '@/components/ui/Container';
import { PlaceholderBadge } from '@/components/ui/Placeholder';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getPageLocale } from '@/lib/locale';
import { getArticle, getNewsSlugs } from '@/lib/news';
import { absoluteUrl, pageMetadata } from '@/lib/seo';
import { articleJsonLd } from '@/lib/structured-data';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getNewsSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const article = await getArticle(locale, (await params).slug);
  if (!article) return {};

  return pageMetadata({
    locale,
    path: `/news/${article.slug}`,
    title: article.title,
    description: article.excerpt,
    type: 'article',
    noindex: article.placeholder,
    image: article.cover && {
      url: article.cover.src,
      width: article.cover.width,
      height: article.cover.height,
      alt: article.coverAlt ?? article.title,
    },
  });
}

export default async function ArticlePage({ params }: Props) {
  const locale = await getPageLocale(params);
  const article = await getArticle(locale, (await params).slug);
  if (!article) notFound();

  const t = await getTranslations();
  const format = await getFormatter();
  const { Content } = article;

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.excerpt,
          url: absoluteUrl(locale, `/news/${article.slug}`),
          date: article.date,
          locale,
        })}
      />

      <PageHero locale={locale} title={article.title} back={{ href: '/news', label: t('news.back') }}>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-snow/85">
          {!article.hideDate && (
            <time dateTime={article.date}>{format.dateTime(new Date(article.date), { dateStyle: 'long' })}</time>
          )}
          {article.placeholder && (
            <span className="rounded-full border border-dashed border-accent px-2.5 py-0.5 text-xs font-bold text-accent">
              {t('common.placeholder')}
            </span>
          )}
        </div>
      </PageHero>

      <article className="pb-16 lg:pb-24">
        <Container className="max-w-4xl">
          <div className="panel overflow-hidden rounded-card">
          {article.cover &&
            (article.coverWhole ? (
              <Image
                src={article.cover}
                alt={article.coverAlt ?? ''}
                preload
                sizes="(min-width: 896px) 832px, 100vw"
                placeholder="blur"
                className="h-auto w-full"
              />
            ) : (
              <div className="relative aspect-[16/9]">
                <Image
                  src={article.cover}
                  alt={article.coverAlt ?? ''}
                  fill
                  preload
                  sizes="(min-width: 896px) 832px, 100vw"
                  placeholder="blur"
                  className="object-cover"
                  style={{ objectPosition: article.coverPosition }}
                />
              </div>
            ))}
          <div className="p-6 sm:p-12">
          {article.placeholder && (
            <div className="mb-2">
              <PlaceholderBadge label={t('common.placeholder')} />
            </div>
          )}
          <Content />
          <Link
            href="/news"
            className="group mt-14 inline-flex items-center gap-2 font-bold text-accent hover:text-snow"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            {t('news.back')}
          </Link>
          </div>
          </div>
        </Container>
      </article>
    </>
  );
}
