import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { Analytics } from '@/components/Analytics';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { LivingBackground } from '@/components/layout/LivingBackground';
import { SceneArt } from '@/components/layout/SceneArt';
import { ScrollEffects } from '@/components/layout/ScrollEffects';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { JsonLd } from '@/components/seo/JsonLd';
import { site } from '@/content/site';
import { routing } from '@/i18n/routing';
import { getPageLocale, type LocaleParams } from '@/lib/locale';
import { siteUrl } from '@/lib/seo';
import { organizationJsonLd } from '@/lib/structured-data';
import '../globals.css';

// One typeface for the whole site: Manrope. Headings use its heaviest weight,
// set tight (see app/globals.css); text uses the regular weights.
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(siteUrl),
    applicationName: site.shortName,
    title: { default: t('titleDefault'), template: `%s | ${site.shortName}` },
    description: t('description'),
    icons: { icon: '/brand/icon.png', apple: '/brand/apple-icon.png' },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: '#052a30',
};

export default async function LocaleLayout({ children, params }: LocaleParams & { children: ReactNode }) {
  const locale = await getPageLocale(params);
  const messages = await getMessages();
  const t = await getTranslations();

  return (
    <html lang={locale} className={manrope.variable} suppressHydrationWarning>
      <body className="font-sans">
        {/* Before anything is drawn: note that scripts run (the landscape then starts in full view on
            the home page) and apply a remembered dark theme, so the page never flashes. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.dataset.js='1';try{if(localStorage.getItem('theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}",
          }}
        />
        {/* Only the header strings are sent to the browser; pages are rendered on the server. */}
        <NextIntlClientProvider messages={{ nav: messages.nav }}>
          <a href="#main" className="skip-link">
            {t('common.skipToContent')}
          </a>
          {/* Without JavaScript the header cannot react to scrolling, so keep it solid. */}
          <noscript>
            <style>{'.site-header{background:#021316}'}</style>
          </noscript>
          <LivingBackground>
            <SceneArt />
          </LivingBackground>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <ScrollEffects />
        </NextIntlClientProvider>
        <JsonLd data={organizationJsonLd(t('meta.description'))} />
        <Analytics />
      </body>
    </html>
  );
}
