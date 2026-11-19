import { Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Swirl } from '@/components/graphics/Swirl';
import { navItems, site } from '@/content/site';
import { Link } from '@/i18n/navigation';
import logo from '@/public/brand/logo.png';
import { WhatsAppIcon } from './WhatsAppButton';

export async function Footer() {
  const t = await getTranslations();
  const { address } = site;

  return (
    <footer className="on-dark relative overflow-hidden bg-teal-darkest text-white">
      <Swirl className="pointer-events-none absolute -bottom-40 -right-32 w-[30rem] opacity-[0.07]" />
      <div className="brand-bar h-1" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.3fr] lg:py-16">
        <div>
          <Image src={logo} alt="Ecosphere Solutions" sizes="190px" className="h-14 w-auto" />
          <p className="mt-5 max-w-sm text-white/75">{t('footer.description')}</p>
          <p className="mt-4 font-display text-xl text-lime">{t('common.tagline')}</p>
        </div>

        <nav aria-label={t('footer.footerNav')}>
          <h2 className="font-sans text-sm font-bold text-sky">{t('footer.quickLinks')}</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 md:grid-cols-1">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className="inline-block py-1.5 text-white/85 transition-colors hover:text-lime">
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-sm font-bold text-sky">{t('footer.contactTitle')}</h2>
          <ul className="mt-4 space-y-3.5 text-white/85">
            <li className="flex gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-lime" aria-hidden="true" />
              <address className="not-italic">
                {address.street}, {address.district},<br />
                {address.city}, {address.country}
              </address>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-lime" aria-hidden="true" />
              <a href={`tel:${site.phone.e164}`} className="transition-colors hover:text-lime">
                {site.phone.display}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-lime" aria-hidden="true" />
              <a href={`mailto:${site.email}`} className="break-all transition-colors hover:text-lime">
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <WhatsAppIcon className="mt-1 h-5 w-5 shrink-0 text-lime" />
              <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-lime">
                {t('contact.whatsappCta')}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-6 text-sm text-white/70 sm:px-8">
          {t('footer.rights', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
