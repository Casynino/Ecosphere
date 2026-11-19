export type Locale = 'en' | 'sw';

/** A piece of content written in every language the site supports. */
export type Localized<T = string> = Record<Locale, T>;

export type SectorSlug = 'mining' | 'oil-gas' | 'agriculture' | 'transport';
