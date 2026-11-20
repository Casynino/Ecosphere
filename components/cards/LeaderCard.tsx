import { ArrowRight, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import type { Leader } from '@/content/leadership';
import type { Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';

/** Portrait area: the person's photo, or their initials until a photo is added. */
function Portrait({ leader, alt, className, sizes }: { leader: Leader; alt: string; className: string; sizes: string }) {
  return (
    <div className={`relative overflow-hidden bg-teal-dark ${className}`}>
      {leader.photo ? (
        <Image src={leader.photo} alt={alt} fill sizes={sizes} placeholder="blur" className="object-cover object-top" />
      ) : (
        // Placeholder until a photo is added in content/leadership.ts.
        <span aria-hidden="true" className="flex h-full w-full items-center justify-center font-display text-4xl text-white/85 sm:text-5xl">
          {leader.initials}
        </span>
      )}
    </div>
  );
}

/**
 * Portrait with the name, for the Home page. The whole card opens the
 * person's profile on the Leadership page (bio and focus areas).
 * Phones: one row per person, a small portrait beside the name and an arrow.
 * Wider screens: the portrait with the name beneath it, the directors side by side.
 */
export function LeaderPreviewCard({ leader, photoAlt }: { leader: Leader; photoAlt: string }) {
  return (
    <Link
      href={`/leadership#${leader.slug}`}
      className="group flex items-center gap-4 max-sm:panel max-sm:rounded-card max-sm:p-3 sm:block"
    >
      <div className="relative w-20 shrink-0 overflow-hidden rounded-xl sm:w-auto sm:rounded-card">
        <Portrait
          leader={leader}
          alt={photoAlt}
          className="aspect-[4/5] transition-transform duration-700 ease-glide group-hover:scale-[1.04]"
          sizes="(min-width: 640px) 360px, 80px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-base leading-snug text-snow transition-colors group-hover:text-accent sm:mt-4 sm:text-lg">
          {leader.name}
          <ArrowRight
            className="ml-1.5 hidden h-4 w-4 align-[-0.125em] text-accent transition-transform duration-300 ease-glide group-hover:translate-x-1 sm:inline"
            aria-hidden="true"
          />
        </h3>
        <p className="mt-1 text-sm leading-snug text-mist sm:text-[0.9375rem]">{leader.title}</p>
      </div>
      <ChevronRight className="h-[18px] w-[18px] shrink-0 text-mist sm:hidden" strokeWidth={1.5} aria-hidden="true" />
    </Link>
  );
}

/** Full card with portrait, bio and focus areas. */
export function LeaderCard({
  leader,
  locale,
  photoAlt,
  focusLabel,
  heading: Heading = 'h3',
}: {
  leader: Leader;
  locale: Locale;
  photoAlt: string;
  focusLabel: string;
  /** Heading level, so the page outline stays in order. */
  heading?: 'h2' | 'h3';
}) {
  // Phones: a small portrait beside the name, then the text underneath.
  // Wider screens: the portrait fills the left side of the card.
  return (
    <article
      id={leader.slug}
      className="panel grid h-full grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 overflow-hidden rounded-card p-5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:grid-rows-[auto_1fr] sm:gap-x-0 sm:p-0"
    >
      <Portrait
        leader={leader}
        alt={photoAlt}
        className="aspect-[4/5] self-start rounded-xl sm:row-span-2 sm:aspect-auto sm:h-full sm:self-stretch sm:rounded-none"
        sizes="(min-width: 640px) 208px, 88px"
      />
      <div className="self-center sm:self-auto sm:px-8 sm:pt-8">
        <Heading className="font-sans text-lg font-semibold leading-snug tracking-normal text-snow sm:text-xl">{leader.name}</Heading>
        <p className="mt-1 text-[0.9375rem] font-semibold leading-snug text-accent sm:text-base">{leader.title}</p>
      </div>
      <div className="col-span-2 mt-4 break-words sm:col-span-1 sm:col-start-2 sm:px-8 sm:pb-8">
        <p className="text-mist">{leader.bio[locale]}</p>
        <p className="mt-5 text-sm font-semibold text-snow">{focusLabel}</p>
        {/* One per line, so nothing is squeezed or cut on a narrow screen. */}
        <ul className="mt-1 space-y-0.5 text-[0.9375rem] text-mist">
          {leader.focus[locale].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
