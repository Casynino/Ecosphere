'use client';

import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { buttonClass } from '@/components/ui/ButtonLink';
import { navItems } from '@/content/site';
import { Link, usePathname } from '@/i18n/navigation';

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Row of links shown in the header on wide screens. */
export function DesktopNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <nav aria-label={t('mainNav')} className="hidden nav:block">
      <ul className="flex items-center gap-0.5">
        {navItems.map((item) => (
          <li key={item.key}>
            <Link
              href={item.href}
              aria-current={isActive(pathname, item.href) ? 'page' : undefined}
              className="rounded-full px-3 py-2 text-[0.95rem] font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white aria-[current=page]:text-lime"
            >
              {t(item.key)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Hamburger button and drop-down menu for phones and tablets. */
export function MobileMenu() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  // Remember the page the menu was opened on. After any navigation the
  // pathname no longer matches, so the menu is closed without extra code.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenedOn(null);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <div className="nav:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? t('closeMenu') : t('openMenu')}
        onClick={() => setOpenedOn(open ? null : pathname)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-teal-darkest shadow-2xl"
      >
        <nav aria-label={t('mainNav')} className="mx-auto max-w-7xl px-5 pb-6 pt-3 sm:px-8">
          <ul>
            {navItems.map((item) => (
              <li key={item.key} className="border-b border-white/10">
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                  onClick={() => setOpenedOn(null)}
                  className="block py-3.5 font-display text-xl text-white aria-[current=page]:text-lime"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" onClick={() => setOpenedOn(null)} className={buttonClass('lime', 'mt-5 w-full')}>
            {t('cta')}
          </Link>
        </nav>
      </div>
    </div>
  );
}
