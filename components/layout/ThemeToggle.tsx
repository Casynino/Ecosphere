'use client';

import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSyncExternalStore } from 'react';

// The site opens in the light theme. Pressing the button switches to the
// dark theme and remembers the choice in this browser. The theme is the
// data-theme attribute on <html>; the colours are in app/globals.css. A tiny
// script in the layout applies a remembered choice before the page is drawn.

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
};
const isDark = () => document.documentElement.dataset.theme === 'dark';

export function ThemeToggle() {
  const t = useTranslations('nav');
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const toggle = () => {
    if (dark) delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = 'dark';
    try {
      window.localStorage.setItem('theme', dark ? 'light' : 'dark');
    } catch {
      // Storage can be blocked (private windows); the choice then lasts for this visit.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('theme')}
      aria-pressed={dark}
      className="flex h-11 w-9 items-center justify-center text-white/75 transition-colors duration-150 hover:text-white"
    >
      {dark ? (
        <Sun className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
      )}
    </button>
  );
}
