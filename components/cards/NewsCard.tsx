import Image from 'next/image';
import { PlaceholderBadge } from '@/components/ui/Placeholder';
import { Link } from '@/i18n/navigation';
import type { NewsEntry } from '@/lib/news';

type Props = {
  article: NewsEntry;
  /** The date as it should read, or null to leave it out. */
  dateLabel: string | null;
  placeholderLabel: string;
  heading?: 'h2' | 'h3';
};

/**
 * One news article in a list. Phones: a small picture beside the title.
 * Wider screens: a card with the picture on top and a short summary.
 */
export function NewsCard({ article, dateLabel, placeholderLabel, heading: Heading = 'h3' }: Props) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="panel group flex h-full gap-4 overflow-hidden rounded-card p-3 sm:flex-col sm:gap-0 sm:p-0"
    >
      <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-snow/5 sm:aspect-[16/10] sm:h-auto sm:w-full sm:rounded-none">
        {article.cover && (
          <Image
            src={article.cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 46vw, 112px"
            quality={60}
            placeholder="blur"
            className="object-cover transition-transform duration-700 ease-glide group-hover:scale-[1.04]"
            style={{ objectPosition: article.coverPosition }}
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center sm:justify-start sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-sm text-mist">
          {dateLabel && <time dateTime={article.date}>{dateLabel}</time>}
          {article.placeholder && <PlaceholderBadge label={placeholderLabel} />}
        </div>
        <Heading className="mt-1 line-clamp-3 text-base font-extrabold leading-snug tracking-[-0.02em] text-snow sm:mt-1.5 sm:text-lg">
          {article.title}
        </Heading>
        <p className="mt-2 line-clamp-3 hidden text-[0.9375rem] text-mist sm:block">{article.excerpt}</p>
      </div>
    </Link>
  );
}
