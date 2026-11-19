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
};

/** Photo card linking to a service page. */
export function ServiceCard({ service, locale, heading: Heading = 'h3', brief = false }: Props) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="panel group flex h-full flex-col overflow-hidden rounded-card transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgb(0_68_74/0.6)]"
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          src={service.image.src}
          alt={service.image.alt[locale]}
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 85vw"
          quality={60}
          placeholder="blur"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
          style={{ objectPosition: service.image.position }}
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Heading className="text-[1.35rem] text-ink">{service.title[locale]}</Heading>
        <p className="mt-2 flex-1 text-muted">{brief ? service.tagline[locale] : service.summary[locale]}</p>
      </div>
    </Link>
  );
}
