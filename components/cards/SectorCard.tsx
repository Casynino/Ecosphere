import Image from 'next/image';
import type { Sector } from '@/content/sectors';
import type { Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';

/**
 * Photo panel for a sector, linking to its section on the Sectors page.
 * It fills whatever space its list item gives it; on wide screens the
 * home page lets the panel under the pointer grow (globals.css, .sector-panels).
 */
export function SectorCard({ sector, locale }: { sector: Sector; locale: Locale }) {
  return (
    <Link
      href={`/sectors#${sector.slug}`}
      className="group relative isolate flex h-full min-h-60 flex-col justify-end overflow-hidden rounded-card p-6 text-white"
    >
      <Image
        src={sector.image.src}
        alt={sector.image.alt[locale]}
        fill
        sizes="(min-width: 1024px) 720px, 100vw"
        placeholder="blur"
        className="-z-20 object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(0_36_42/0.92)_0%,rgb(0_36_42/0.4)_45%,rgb(0_36_42/0.1)_100%)]"
      />
      <h3 className="whitespace-nowrap text-[1.7rem]">{sector.name[locale]}</h3>
      <p className="sector-text mt-2 max-w-md text-[0.98rem] leading-snug text-white/90 lg:min-w-72">{sector.short[locale]}</p>
    </Link>
  );
}
