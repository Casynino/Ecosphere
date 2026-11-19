import { site } from '@/content/site';
import { siteUrl } from './seo';

const organizationId = `${siteUrl}/#organization`;

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: `${site.address.street}, ${site.address.district}`,
  addressLocality: site.address.city,
  addressCountry: site.address.countryCode,
};

/** Organization + LocalBusiness data, printed once on every page. */
export function organizationJsonLd(description: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: site.name,
        alternateName: site.shortName,
        url: siteUrl,
        logo: `${siteUrl}/brand/logo-color.png`,
        slogan: 'We Are The Solution',
        description,
        email: site.email,
        telephone: site.phone.e164,
        address: postalAddress,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: site.phone.e164,
          email: site.email,
          availableLanguage: ['English', 'Swahili'],
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${siteUrl}/#localbusiness`,
        name: site.name,
        url: siteUrl,
        image: `${siteUrl}/brand/og.png`,
        description,
        email: site.email,
        telephone: site.phone.e164,
        address: postalAddress,
        areaServed: { '@type': 'Country', name: 'Tanzania' },
        parentOrganization: { '@id': organizationId },
      },
    ],
  };
}

export function serviceJsonLd(service: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    serviceType: service.name,
    description: service.description,
    url: service.url,
    provider: { '@id': organizationId },
    areaServed: { '@type': 'Country', name: 'Tanzania' },
  };
}

export function articleJsonLd(article: { title: string; description: string; url: string; date: string; locale: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    inLanguage: article.locale,
    mainEntityOfPage: article.url,
    author: { '@id': organizationId },
    publisher: { '@id': organizationId },
  };
}
