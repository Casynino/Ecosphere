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
    <div role="group" aria-label={t('language')} className="flex items-center gap-1 text-[0.95rem] font-bold">
      {routing.locales.map((code) => (
        <Link
          key={code}
          href={pathname}
          locale={code}
          hrefLang={code}
          lang={code}
          aria-current={code === locale ? 'true' : undefined}
          className="px-1.5 py-2 text-white/60 transition-colors hover:text-snow aria-[current=true]:text-white"
        >
          {code.toUpperCase()}
          {/* Full language name for screen readers. */}
          <span className="sr-only"> {t(`switchTo.${code}`)}</span>
        </Link>
      ))}
    </div>
  );
}
