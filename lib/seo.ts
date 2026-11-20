import type { Metadata } from 'next';
import { site } from '@/content/site';
import type { Locale } from '@/content/types';
import { routing } from '@/i18n/routing';

/**
 * Public address of the site, without a trailing slash. An address set
 * without "https://" (for example "www.example.com") is accepted too.
 */
export const siteUrl = (() => {
  const address = (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    'http://localhost:3000'
  ).replace(/\/+$/, '');
  return /^https?:\/\//.test(address) ? address : `https://${address}`;
})();

/** Path of a page in one language: "/about" in English, "/sw/about" in Swahili. */
export function localePath(locale: Locale, path = '') {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  return `${prefix}${path}` || '/';
}

export function absoluteUrl(locale: Locale, path = '') {
  return `${siteUrl}${localePath(locale, path)}`;
}

/** hreflang map for a page that exists in every language. */
export function languageAlternates(path = '') {
  return {
    en: localePath('en', path),
    sw: localePath('sw', path),
    'x-default': localePath('en', path),
  };
}

type PageMeta = {
  locale: Locale;
  /** Page path without the language prefix, for example "/about". Empty for home. */
  path?: string;
  title: string;
  description: string;
  /** Use the title as it is, without adding "| Ecosphere Solutions". */
  absoluteTitle?: boolean;
  /** Keep placeholder pages out of search engines. */
  noindex?: boolean;
  type?: 'website' | 'article';
  /** Picture shown when the page is shared; the site's share picture when left out. */
  image?: { url: string; width: number; height: number; alt: string };
};

const ogImage = { url: '/brand/og.jpg', type: 'image/jpeg', width: 1200, height: 630, alt: `${site.shortName}: We Are The Solution` };

/** Title, description, canonical URL, hreflang, Open Graph and Twitter tags for a page. */
export function pageMetadata({
  locale,
  path = '',
  title,
  description,
  absoluteTitle = false,
  noindex = false,
  type = 'website',
  image,
}: PageMeta): Metadata {
  const shareImage = image ?? ogImage;
  const url = localePath(locale, path);
  const socialTitle = absoluteTitle ? title : `${title} | ${site.shortName}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type,
      title: socialTitle,
      description,
      url,
      siteName: site.shortName,
      locale: locale === 'sw' ? 'sw_TZ' : 'en_GB',
      images: [shareImage],
    },
    twitter: { card: 'summary_large_image', title: socialTitle, description, images: [shareImage.url] },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
