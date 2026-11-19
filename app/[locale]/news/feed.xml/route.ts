import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getAllNews } from '@/lib/news';
import { absoluteUrl } from '@/lib/seo';

// RSS feed, one per language: /news/feed.xml and /sw/news/feed.xml.
// Built once at deploy time. Placeholder drafts are left out.
export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return new Response('Not found', { status: 404 });

  const t = await getTranslations({ locale, namespace: 'news' });
  const articles = (await getAllNews(locale)).filter((article) => !article.placeholder);

  const items = articles
    .map((article) => {
      const url = absoluteUrl(locale, `/news/${article.slug}`);
      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <description>${escapeXml(article.excerpt)}</description>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(t('feedTitle'))}</title>
    <link>${absoluteUrl(locale, '/news')}</link>
    <description>${escapeXml(t('metaDescription'))}</description>
    <language>${locale}</language>
    <atom:link href="${absoluteUrl(locale, '/news/feed.xml')}" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
