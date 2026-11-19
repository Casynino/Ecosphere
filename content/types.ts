export type Locale = 'en' | 'sw';

/** A piece of content written in every language the site supports. */
export type Localized<T = string> = Record<Locale, T>;

export type IconName =
  | 'leaf'
  | 'trees'
  | 'users'
  | 'flask'
  | 'scale'
  | 'graduation'
  | 'handshake'
  | 'pickaxe'
  | 'flame'
  | 'sprout'
  | 'truck';

export type SectorSlug = 'mining' | 'oil-gas' | 'agriculture' | 'transport';
