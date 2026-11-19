import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { sectors, type Sector } from '@/content/sectors';
import type { Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';

/** Tall photo card for a sector, linking to its section on the Sectors page. */
export function SectorCard({ sector, locale }: { sector: Sector; locale: Locale }) {
  const position = `${String(sectors.indexOf(sector) + 1).padStart(2, '0')} / ${String(sectors.length).padStart(2, '0')}`;

  return (
    <Link
      href={`/sectors#${sector.slug}`}
      className="group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-card p-6 text-white"
    >
      <Image
        src={sector.image.src}
        alt={sector.image.alt[locale]}
        fill
        sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 80vw"
        placeholder="blur"
        className="-z-20 object-cover transition-transform duration-[900ms] group-hover:scale-[1.08]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(0_36_42/0.94)_0%,rgb(0_36_42/0.45)_42%,rgb(0_36_42/0.12)_100%)]"
      />
      <span className="absolute left-6 top-5 text-sm font-semibold tabular-nums text-white/90" aria-hidden="true">
        {position}
      </span>
      <ArrowUpRight
        className="absolute right-5 top-5 h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-lime"
        aria-hidden="true"
      />
      <h3 className="text-[1.7rem]">{sector.name[locale]}</h3>
      <p className="mt-2 text-[0.95rem] leading-snug text-white/90">{sector.short[locale]}</p>
    </Link>
  );
}
