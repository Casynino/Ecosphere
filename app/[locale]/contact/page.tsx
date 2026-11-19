import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { ContactForm } from '@/components/contact/ContactForm';
import { WhatsAppIcon } from '@/components/layout/WhatsAppButton';
import { PageHero } from '@/components/sections/PageHero';
import { Container } from '@/components/ui/Container';
import { stock } from '@/content/media';
import { services } from '@/content/services';
import { site } from '@/content/site';
import { getPageLocale, type LocaleParams } from '@/lib/locale';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale, namespace: 'contact' });
  return pageMetadata({ locale, path: '/contact', title: t('metaTitle'), description: t('metaDescription') });
}

function Detail({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="panel flex gap-4 rounded-card p-5">
      <span className="mt-1 shrink-0 text-teal">{icon}</span>
      <div>
        <p className="text-sm font-bold text-teal">{label}</p>
        <div className="mt-0.5 text-ink">{children}</div>
      </div>
    </li>
  );
}

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await getPageLocale(params);
  const t = await getTranslations('contact');
  const messages = await getMessages();
  const { address } = site;

  return (
    <>
      <PageHero locale={locale} photo={stock.darAerial} eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
          <div>
            <h2 className="text-2xl sm:text-3xl">{t('detailsTitle')}</h2>
            <ul className="mt-6 space-y-4">
              <Detail icon={<MapPin className="h-5 w-5" aria-hidden="true" />} label={t('address')}>
                <address className="not-italic">
                  {address.street}, {address.district},<br />
                  {address.city}, {address.country}
                </address>
              </Detail>
              <Detail icon={<Phone className="h-5 w-5" aria-hidden="true" />} label={t('phone')}>
                <a href={`tel:${site.phone.e164}`} className="font-semibold hover:text-teal">
                  {site.phone.display}
                </a>
              </Detail>
              <Detail icon={<Mail className="h-5 w-5" aria-hidden="true" />} label={t('email')}>
                <a href={`mailto:${site.email}`} className="break-all font-semibold hover:text-teal">
                  {site.email}
                </a>
              </Detail>
              <Detail icon={<WhatsAppIcon className="h-5 w-5" />} label={t('whatsapp')}>
                <a
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:text-teal"
                >
                  {t('whatsappCta')}
                </a>
              </Detail>
            </ul>
          </div>

          <div className="panel rounded-[28px] p-6 sm:p-10">
            <h2 className="text-2xl sm:text-3xl">{t('formTitle')}</h2>
            <div className="mt-7">
              {/* The form runs in the browser, so it gets its own strings. */}
              <NextIntlClientProvider messages={{ contactForm: messages.contactForm }}>
                <ContactForm services={services.map((service) => ({ value: service.slug, label: service.title[locale] }))} />
              </NextIntlClientProvider>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl sm:text-3xl">{t('mapTitle')}</h2>
            <a
              href={site.mapLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-teal hover:text-teal-dark"
            >
              {t('openMap')}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <iframe
            src={site.mapEmbedUrl}
            title={t('mapFrameTitle')}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="mt-8 h-[26rem] w-full rounded-[28px] border border-white shadow-[0_24px_60px_-36px_rgb(0_68_74/0.45)]"
          />
        </Container>
      </section>
    </>
  );
}
