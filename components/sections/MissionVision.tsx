import { Eye, Target } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

/** The Mission and Vision cards, shared by the Home and About pages. */
export async function MissionVision() {
  const t = await getTranslations('company');
  const cards = [
    { icon: Target, title: t('missionTitle'), body: t('mission') },
    { icon: Eye, title: t('visionTitle'), body: t('vision') },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {cards.map((card, index) => (
        <article
          key={card.title}
          data-reveal
          style={{ '--reveal-delay': `${index * 120}ms` } as React.CSSProperties}
          className="relative overflow-hidden rounded-card border border-line bg-white p-7 sm:p-9"
        >
          <span className="brand-bar absolute inset-x-0 top-0 h-1" aria-hidden="true" />
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal text-white">
            <card.icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-2xl text-ink">{card.title}</h3>
          <p className="mt-3 text-muted">{card.body}</p>
        </article>
      ))}
    </div>
  );
}
