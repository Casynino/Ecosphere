// Company details used across the site (header, footer, contact page, SEO data).
// Edit here and every page updates.

export const site = {
  name: 'Ecosphere Solutions Limited',
  shortName: 'Ecosphere Solutions',
  // The client will switch to a domain email later: set NEXT_PUBLIC_CONTACT_EMAIL
  // in the environment, or change the fallback below.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'intecosphere.solutions@gmail.com',
  phone: {
    display: '+255 753 440 471',
    e164: '+255753440471',
  },
  whatsappUrl: 'https://wa.me/255753440471',
  address: {
    street: 'Plot 1040, Haile Selassie Road',
    district: 'Masaki',
    city: 'Dar es Salaam',
    country: 'Tanzania',
    countryCode: 'TZ',
  },
  mapEmbedUrl:
    'https://www.google.com/maps?q=Plot+1040,+Haile+Selassie+Road,+Masaki,+Dar+es+Salaam,+Tanzania&z=15&output=embed',
  mapLinkUrl:
    'https://www.google.com/maps/search/?api=1&query=Plot+1040%2C+Haile+Selassie+Road%2C+Masaki%2C+Dar+es+Salaam',
} as const;

/** Main navigation. `key` matches a label in messages/*.json under "nav". */
export const navItems = [
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'sectors', href: '/sectors' },
  { key: 'projects', href: '/projects' },
  { key: 'leadership', href: '/leadership' },
  { key: 'news', href: '/news' },
  { key: 'contact', href: '/contact' },
] as const;
