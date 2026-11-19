import Image from 'next/image';
import type { Leader } from '@/content/leadership';
import type { Locale } from '@/content/types';

/** Portrait area: the person's photo, or their initials until a photo is added. */
function Portrait({ leader, alt, className }: { leader: Leader; alt: string; className: string }) {
  return (
    <div className={`relative overflow-hidden bg-[linear-gradient(155deg,#00323a,#005e64)] ${className}`}>
      {leader.photo ? (
        <Image
          src={leader.photo}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
          placeholder="blur"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        // Placeholder until a photo is added in content/leadership.ts.
        <span aria-hidden="true" className="flex h-full w-full items-center justify-center font-display text-6xl text-white/90">
          {leader.initials}
        </span>
      )}
    </div>
  );
}

/** Portrait card for the Home page preview. */
export function LeaderPreviewCard({ leader, photoAlt }: { leader: Leader; photoAlt: string }) {
  return (
    <article className="panel group h-full overflow-hidden rounded-card">
      <Portrait leader={leader} alt={photoAlt} className="aspect-[4/5]" />
      <div className="p-5">
        <h3 className="text-xl text-ink">{leader.name}</h3>
        <p className="mt-1.5 text-[0.95rem] leading-snug text-muted">{leader.title}</p>
      </div>
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
    <article id={leader.slug} className="panel group grid h-full overflow-hidden rounded-card sm:grid-cols-[13rem_1fr]">
      <Portrait leader={leader} alt={photoAlt} className="aspect-[4/3] sm:aspect-auto sm:min-h-full" />
      <div className="p-6 sm:p-8">
        <Heading className="text-2xl text-ink">{leader.name}</Heading>
        <p className="mt-1 font-bold text-teal">{leader.title}</p>
        <p className="mt-4 text-muted">{leader.bio[locale]}</p>
        <p className="mt-5 text-sm font-bold text-ink">{focusLabel}</p>
        <p className="mt-1 text-[0.95rem] text-teal">{leader.focus[locale].join(' · ')}</p>
      </div>
    </article>
  );
}
