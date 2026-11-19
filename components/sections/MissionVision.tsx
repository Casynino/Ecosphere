import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';

/** The Mission and Vision cards, shared by the Home and About pages. */
export async function MissionVision() {
  const t = await getTranslations('company');
  const cards = [
    { title: t('missionTitle'), body: t('mission') },
    { title: t('visionTitle'), body: t('vision') },
  ];

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
      {cards.map((card, index) => (
        <article
          key={card.title}
          data-reveal
          style={{ '--reveal-delay': `${index * 60}ms` } as CSSProperties}
          className="panel rounded-card p-6 sm:p-8"
        >
          <h3 className="text-lg text-teal sm:text-xl">{card.title}</h3>
          <p className="mt-3 text-muted">{card.body}</p>
        </article>
      ))}
    </div>
  );
}
