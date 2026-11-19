import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import type { Sector } from '@/content/sectors';
import type { Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';

/** Photo card for a sector, linking to its section on the Sectors page. */
export function SectorCard({ sector, locale }: { sector: Sector; locale: Locale }) {
  return (
    <Link
      href={`/sectors#${sector.slug}`}
      className="group relative isolate flex aspect-[5/3] flex-col justify-end overflow-hidden rounded-card p-6 text-white sm:aspect-[4/5] lg:aspect-[3/4]"
    >
      <Image
        src={sector.image.src}
        alt={sector.image.alt[locale]}
        fill
        sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
        placeholder="blur"
        className="-z-20 object-cover transition-transform duration-700 group-hover:scale-[1.08]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(0_50_58/0.96)_0%,rgb(0_50_58/0.6)_45%,rgb(0_50_58/0.1)_100%)]"
      />
      <span className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-teal">
        <Icon name={sector.icon} className="h-6 w-6" />
      </span>
      <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/50 transition-colors duration-300 group-hover:border-lime group-hover:bg-lime group-hover:text-teal-darkest">
        <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="text-2xl">{sector.name[locale]}</h3>
      <p className="mt-2 text-[0.95rem] leading-snug text-white/85">{sector.short[locale]}</p>
    </Link>
  );
}
