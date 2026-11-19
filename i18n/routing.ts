import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'sw'],
  defaultLocale: 'en',
  // English lives at "/", Swahili at "/sw".
  localePrefix: 'as-needed',
  // The URL alone decides the language: no browser sniffing and no cookie,
  // so pages cache well and no cookie notice is needed.
  localeDetection: false,
  localeCookie: false,
  // hreflang links are set in page metadata and the sitemap instead.
  alternateLinks: false,
});
