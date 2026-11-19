import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import type { Service } from '@/content/services';
import type { Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';

type Props = {
  service: Service;
  locale: Locale;
  learnMore: string;
  withPhoto?: boolean;
  /** Heading level, so the page outline stays in order. */
  heading?: 'h2' | 'h3';
};

/** Card linking to a service page. `withPhoto` adds the service photo on top. */
export function ServiceCard({ service, locale, learnMore, withPhoto = false, heading: Heading = 'h3' }: Props) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-[0_22px_40px_-24px_rgb(0_68_74/0.55)]"
    >
      {withPhoto && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={service.image.src}
            alt={service.image.alt[locale]}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            placeholder="blur"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            style={{ objectPosition: service.image.position }}
          />
        </div>
      )}
      <div className={`flex flex-1 flex-col p-6 sm:p-7 ${withPhoto ? 'pt-0' : ''}`}>
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-teal transition-colors duration-300 group-hover:bg-teal group-hover:text-white ${
            withPhoto ? 'relative -mt-6 border-4 border-white bg-white shadow-sm' : ''
          }`}
        >
          <Icon name={service.icon} className="h-6 w-6" />
        </span>
        <Heading className="mt-4 text-[1.35rem] text-ink">{service.title[locale]}</Heading>
        <p className="mt-2 flex-1 text-muted">{service.summary[locale]}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 font-bold text-teal">
          {learnMore}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
