import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';

/** Mission and Vision side by side, each under a thin rule. Used on the About page. */
export async function MissionVision() {
  const t = await getTranslations('company');
  const items = [
    { title: t('missionTitle'), body: t('mission') },
    { title: t('visionTitle'), body: t('vision') },
  ];

  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-16">
      {items.map((item, index) => (
        <article
          key={item.title}
          data-reveal
          style={{ '--reveal-delay': `${index * 60}ms` } as CSSProperties}
          className="border-t border-snow/20 pt-6"
        >
          <h3 className="display-3">{item.title}</h3>
          <p className="mt-4 text-lg text-mist">{item.body}</p>
        </article>
      ))}
    </div>
  );
}
