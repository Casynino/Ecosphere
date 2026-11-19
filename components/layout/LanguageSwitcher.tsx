'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

/** EN | SW toggle. Keeps the visitor on the same page in the other language. */
export function LanguageSwitcher() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label={t('language')}
      className="flex items-center rounded-full border border-white/25 p-0.5 text-sm font-bold"
    >
      {routing.locales.map((code) => (
        <Link
          key={code}
          href={pathname}
          locale={code}
          hrefLang={code}
          lang={code}
          aria-current={code === locale ? 'true' : undefined}
          className="rounded-full px-2.5 py-1.5 text-white/80 transition-colors hover:text-white aria-[current=true]:bg-white aria-[current=true]:text-teal-darkest"
        >
          {code.toUpperCase()}
          {/* Full language name for screen readers. */}
          <span className="sr-only"> {t(`switchTo.${code}`)}</span>
        </Link>
      ))}
    </div>
  );
}
