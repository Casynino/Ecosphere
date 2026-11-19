import Image from 'next/image';
import type { Leader } from '@/content/leadership';
import type { Locale } from '@/content/types';

function Avatar({ leader, alt, size }: { leader: Leader; alt: string; size: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-32 w-32 text-4xl' : 'h-24 w-24 text-3xl';

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full bg-[linear-gradient(140deg,#00444a,#005e64)] ring-4 ring-white ${box}`}>
      {leader.photo ? (
        <Image src={leader.photo} alt={alt} fill sizes="128px" placeholder="blur" className="object-cover object-top" />
      ) : (
        // Placeholder until a photo is added in content/leadership.ts.
        <span aria-hidden="true" className="flex h-full w-full items-center justify-center font-display text-white">
          {leader.initials}
        </span>
      )}
    </div>
  );
}

/** Short card for the Home page preview. */
export function LeaderPreviewCard({ leader, photoAlt }: { leader: Leader; photoAlt: string }) {
  return (
    <article className="panel flex h-full flex-col items-center rounded-card p-7 text-center">
      <Avatar leader={leader} alt={photoAlt} size="md" />
      <h3 className="mt-5 text-xl text-ink">{leader.name}</h3>
      <p className="mt-1.5 text-[0.95rem] leading-snug text-muted">{leader.title}</p>
    </article>
  );
}

/** Full card with focus areas and bio. */
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
    <article id={leader.slug} className="panel flex h-full flex-col gap-6 rounded-card p-7 sm:flex-row sm:p-8">
      <Avatar leader={leader} alt={photoAlt} size="lg" />
      <div>
        <Heading className="text-2xl text-ink">{leader.name}</Heading>
        <p className="mt-1 font-bold text-teal">{leader.title}</p>
        <p className="mt-4 text-muted">{leader.bio[locale]}</p>
        <p className="mt-5 text-sm font-bold text-ink">{focusLabel}</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {leader.focus[locale].map((item) => (
            <li key={item} className="rounded-full bg-background px-3 py-1 text-sm font-semibold text-teal ring-1 ring-line">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
