import type { MetadataRoute } from 'next';
import { services } from '@/content/services';
import { routing } from '@/i18n/routing';
import { getAllNews } from '@/lib/news';
import { absoluteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Placeholder news drafts stay out of the sitemap until real articles exist.
  const published = (await getAllNews('en')).filter((article) => !article.placeholder);

  const paths = [
    '',
    '/about',
    '/services',
    ...services.map((service) => `/services/${service.slug}`),
    '/sectors',
    '/projects',
    '/leadership',
    '/contact',
    ...(published.length > 0 ? ['/news', ...published.map((article) => `/news/${article.slug}`)] : []),
  ];

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(locale, path),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.7,
      alternates: {
        languages: { en: absoluteUrl('en', path), sw: absoluteUrl('sw', path) },
      },
    })),
  );
}
