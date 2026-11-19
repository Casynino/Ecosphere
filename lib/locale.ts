import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Locale } from '@/content/types';
import { routing } from '@/i18n/routing';

export type LocaleParams = { params: Promise<{ locale: string }> };

/**
 * Reads and validates the [locale] part of the URL. Also tells next-intl the
 * language up front, which lets Next.js build the page as static HTML.
 */
export async function getPageLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return locale;
}
