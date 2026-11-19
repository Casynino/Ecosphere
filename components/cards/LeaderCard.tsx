import Image from 'next/image';
import type { Leader } from '@/content/leadership';
import type { Locale } from '@/content/types';

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

/** Portrait with the name beneath it, for the Home page. */
export function LeaderPreviewCard({ leader, photoAlt }: { leader: Leader; photoAlt: string }) {
  return (
    <article>
      <Portrait leader={leader} alt={photoAlt} className="aspect-[4/5] rounded-card" sizes="(min-width: 1024px) 300px, 50vw" />
      <h3 className="mt-4 text-base leading-snug text-snow sm:text-lg">{leader.name}</h3>
      <p className="mt-1 text-sm leading-snug text-mist sm:text-[0.9375rem]">{leader.title}</p>
    </article>
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
  return (
    <article id={leader.slug} className="panel grid h-full overflow-hidden rounded-card sm:grid-cols-[13rem_1fr]">
      <Portrait
        leader={leader}
        alt={photoAlt}
        className="aspect-[4/3] sm:aspect-auto sm:min-h-full"
        sizes="(min-width: 640px) 208px, 92vw"
      />
      <div className="p-5 sm:p-8">
        <Heading className="font-sans text-xl font-semibold leading-snug tracking-normal text-snow">{leader.name}</Heading>
        <p className="mt-1 font-semibold text-accent">{leader.title}</p>
        <p className="mt-4 text-mist">{leader.bio[locale]}</p>
        <p className="mt-5 text-sm font-semibold text-snow">{focusLabel}</p>
        <p className="mt-1 text-[0.9375rem] text-mist">{leader.focus[locale].join(' · ')}</p>
      </div>
    </article>
  );
}
