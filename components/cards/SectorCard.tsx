import Image from 'next/image';
import type { Sector } from '@/content/sectors';
import type { Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';

/**
 * Photo tile for a sector, linking to its section on the Sectors page.
 * Phones show the name only; larger screens add one line. On wide screens
 * the home page lets the tile under the pointer grow (globals.css, .sector-panels).
 */
export function SectorCard({ sector, locale }: { sector: Sector; locale: Locale }) {
  return (
    <Link
      href={`/sectors#${sector.slug}`}
      className="group relative isolate flex aspect-[4/5] h-full flex-col justify-end overflow-hidden rounded-card p-4 text-white sm:p-6 lg:aspect-auto"
    >
      <Image
        src={sector.image.src}
        alt={sector.image.alt[locale]}
        fill
        sizes="(min-width: 1024px) 720px, 50vw"
        quality={60}
        placeholder="blur"
        className="-z-20 object-cover"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(0_36_42/0.9)_0%,rgb(0_36_42/0.3)_50%,rgb(0_36_42/0.05)_100%)]"
      />
      <h3 className="whitespace-nowrap text-lg sm:text-2xl">{sector.name[locale]}</h3>
      <p className="sector-text mt-1.5 hidden max-w-md text-[0.9375rem] leading-snug text-white/90 sm:block lg:min-w-72">
        {sector.short[locale]}
      </p>
    </Link>
  );
}
