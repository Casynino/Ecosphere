import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';

/** The Mission and Vision panels, shared by the Home and About pages. */
export async function MissionVision() {
  const t = await getTranslations('company');
  const cards = [
    { title: t('missionTitle'), body: t('mission') },
    { title: t('visionTitle'), body: t('vision') },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {cards.map((card, index) => (
        <article
          key={card.title}
          data-reveal
          style={{ '--reveal-delay': `${index * 130}ms` } as CSSProperties}
          className="panel rounded-card p-7 sm:p-10"
        >
          <h3 className="text-3xl text-teal">{card.title}</h3>
          <p className="mt-4 text-lg text-ink/85">{card.body}</p>
        </article>
      ))}
    </div>
  );
}
