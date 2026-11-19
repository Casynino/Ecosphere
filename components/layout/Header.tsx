import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { buttonClass } from '@/components/ui/ButtonLink';
import { Link } from '@/i18n/navigation';
import logo from '@/public/brand/logo.png';
import { LanguageSwitcher } from './LanguageSwitcher';
import { DesktopNav, MobileMenu } from './SiteNav';

export async function Header() {
  const t = await getTranslations('nav');

  return (
    <header className="site-header on-dark fixed inset-x-0 top-0 z-40 text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-5 sm:px-8 nav:h-[4.5rem] nav:gap-6">
        <Link href="/" aria-label={t('home')} className="shrink-0">
          <Image src={logo} alt="Ecosphere Solutions" preload sizes="150px" className="h-10 w-auto nav:h-[3.1rem]" />
        </Link>

        <DesktopNav />

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <div className="hidden sm:block">
            <Link href="/contact" className={buttonClass('lime', '', 'sm')}>
              {t('cta')}
            </Link>
          </div>
          <MobileMenu />
        </div>
      </div>
      {/* Fills from left to right as the visitor scrolls down the page. */}
      <span aria-hidden="true" data-page-progress className="scroll-meter brand-bar absolute inset-x-0 bottom-0 h-[3px]" />
    </header>
  );
}
