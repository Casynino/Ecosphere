import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';

/** Mission and Vision side by side, each on its own panel. Used on the About page. */
export async function MissionVision() {
  const t = await getTranslations('company');
  const items = [
    { title: t('missionTitle'), body: t('mission') },
    { title: t('visionTitle'), body: t('vision') },
  ];

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
      {items.map((item, index) => (
        <article
          key={item.title}
          data-reveal
          style={{ '--reveal-delay': `${index * 60}ms` } as CSSProperties}
          className="panel rounded-card p-6 sm:p-10"
        >
          <h3 className="display-3">{item.title}</h3>
          <p className="mt-4 text-lg text-mist">{item.body}</p>
        </article>
      ))}
    </div>
  );
}
