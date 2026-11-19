import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import type { Service } from '@/content/services';
import type { Locale } from '@/content/types';
import { Link } from '@/i18n/navigation';

type Props = {
  service: Service;
  locale: Locale;
  /** Heading level, so the page outline stays in order. */
  heading?: 'h2' | 'h3';
  /** Show the few-word tagline instead of the full summary. */
  brief?: boolean;
  /** The double-width card: it has room for the full summary from tablets up. */
  wide?: boolean;
};

/**
 * Link to a service page. On phones it is a compact row (small photo,
 * name, short line) meant to sit in a list; from tablets up it becomes a
 * card with the photo on top. See ServiceList for the wrapper.
 */
export function ServiceCard({ service, locale, heading: Heading = 'h3', brief = false, wide = false }: Props) {
  const text = 'mt-0.5 text-[0.9375rem] leading-snug text-mist sm:mt-2 sm:leading-normal';

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full items-center gap-4 p-4 transition-colors duration-150 sm:panel sm:flex-col sm:items-stretch sm:gap-0 sm:overflow-hidden sm:rounded-card sm:p-0 sm:hover:border-accent/30"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-44 sm:w-full sm:rounded-none">
        <Image
          src={service.image.src}
          alt={service.image.alt[locale]}
          fill
          sizes="(min-width: 1024px) 600px, (min-width: 640px) 50vw, 64px"
          quality={60}
          placeholder="blur"
          className="object-cover"
          style={{ objectPosition: service.image.position }}
        />
      </div>
      <div className="min-w-0 flex-1 sm:p-6">
        <Heading className="font-sans text-[1.0625rem] font-semibold leading-snug tracking-normal text-snow transition-colors duration-150 group-hover:text-accent sm:text-lg">
          {service.title[locale]}
        </Heading>
        {brief && wide ? (
          <>
            <p className={`${text} sm:hidden`}>{service.tagline[locale]}</p>
            <p className={`${text} hidden max-w-md sm:block`}>{service.summary[locale]}</p>
          </>
        ) : (
          <p className={text}>{brief ? service.tagline[locale] : service.summary[locale]}</p>
        )}
      </div>
      <ChevronRight className="h-[18px] w-[18px] shrink-0 text-mist sm:hidden" strokeWidth={1.5} aria-hidden="true" />
    </Link>
  );
}

/**
 * The seven services. Phones: one white list with dividers. Tablets and
 * up: a grid of cards where the first card is double width, so seven
 * cards fill the rows exactly (2 + 1 + 1, then 4).
 */
export function ServiceList({
  services,
  locale,
  heading,
  brief,
  bare = false,
}: Omit<Props, 'service' | 'wide'> & { services: Service[]; /** Leave out the list's own panel (when it already sits on one). */ bare?: boolean }) {
  return (
    <ul
      className={`divide-y divide-snow/10 sm:grid sm:grid-cols-2 sm:gap-6 sm:divide-y-0 lg:grid-cols-4 ${
        bare
          ? ''
          : 'panel overflow-hidden rounded-card sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none sm:backdrop-filter-none'
      }`}
    >
      {services.map((service, index) => (
        <li key={service.slug} className={index === 0 ? 'sm:col-span-2' : ''}>
          <ServiceCard service={service} locale={locale} heading={heading} brief={brief} wide={index === 0} />
        </li>
      ))}
    </ul>
  );
}
