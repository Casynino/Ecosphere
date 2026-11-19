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

/** Portrait card for the Home page preview. */
export function LeaderPreviewCard({ leader, photoAlt }: { leader: Leader; photoAlt: string }) {
  return (
    <article className="panel h-full overflow-hidden rounded-card">
      <Portrait leader={leader} alt={photoAlt} className="aspect-[4/5]" sizes="(min-width: 1024px) 300px, 50vw" />
      <div className="p-3 sm:p-5">
        <h3 className="text-[0.9375rem] leading-snug text-ink sm:text-lg">{leader.name}</h3>
        <p className="mt-1 text-[0.8125rem] leading-snug text-muted sm:text-[0.9375rem]">{leader.title}</p>
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
    <article id={leader.slug} className="panel grid h-full overflow-hidden rounded-card sm:grid-cols-[13rem_1fr]">
      <Portrait
        leader={leader}
        alt={photoAlt}
        className="aspect-[4/3] sm:aspect-auto sm:min-h-full"
        sizes="(min-width: 640px) 208px, 92vw"
      />
      <div className="p-5 sm:p-8">
        <Heading className="font-sans text-xl font-semibold leading-snug tracking-normal text-ink">{leader.name}</Heading>
        <p className="mt-1 font-semibold text-teal">{leader.title}</p>
        <p className="mt-4 text-muted">{leader.bio[locale]}</p>
        <p className="mt-5 text-sm font-semibold text-ink">{focusLabel}</p>
        <p className="mt-1 text-[0.9375rem] text-muted">{leader.focus[locale].join(' · ')}</p>
      </div>
    </article>
  );
}
