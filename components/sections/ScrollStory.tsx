import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { Container } from '@/components/ui/Container';
import { photos, stock } from '@/content/media';

// One photograph per step, in order.
const steps = [
  { key: 'assess', photo: photos.cranesAndSkyline },
  { key: 'advise', photo: photos.siteBriefing },
  { key: 'implement', photo: stock.plantingSeedling },
  { key: 'sustain', photo: stock.kilimanjaro },
] as const;

/**
 * "How we work" told as a scroll story. The scene stays pinned while the
 * visitor scrolls: the photograph changes, one large word names the step,
 * and a thin timeline along the bottom shows how far along they are.
 * Without JavaScript (or with reduced motion) it is an ordinary section
 * listing the four steps. Styles: globals.css (.story).
 */
export async function ScrollStory() {
  const t = await getTranslations('home.how');

  return (
    <section
      data-story
      data-steps={steps.length}
      aria-labelledby="how-we-work"
      className="story on-dark bg-teal-darkest text-white"
      style={{ '--steps': steps.length } as CSSProperties}
    >
      <div className="story-stage relative isolate flex flex-col overflow-hidden">
        <div className="absolute inset-0 -z-20" aria-hidden="true">
          {steps.map((step) => (
            <div key={step.key} className="story-layer">
              <Image src={step.photo.src} alt="" fill sizes="100vw" quality={60} className="object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(0_36_42/0.92)_0%,rgb(0_36_42/0.3)_46%,rgb(0_36_42/0.5)_100%)]" />

        <Container className="flex flex-1 flex-col justify-between gap-12 pb-8 pt-12 sm:pt-16">
          <div className="max-w-xl">
            <p className="eyebrow text-lime">{t('eyebrow')}</p>
            <h2 id="how-we-work" className="mt-2 text-2xl sm:text-3xl">
              {t('title')}
            </h2>
          </div>

          <div>
            <ol className="story-steps grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <li
                  key={step.key}
                  className="story-step lg:[.is-pinned_&]:flex lg:[.is-pinned_&]:items-end lg:[.is-pinned_&]:justify-between lg:[.is-pinned_&]:gap-10"
                >
                  <h3 className="text-3xl [.is-pinned_&]:text-5xl sm:[.is-pinned_&]:text-7xl lg:[.is-pinned_&]:text-[6rem] lg:[.is-pinned_&]:leading-[0.95]">
                    {t(`steps.${step.key}.title`)}
                  </h3>
                  <p className="mt-3 max-w-xs text-lg text-white/90 lg:[.is-pinned_&]:mb-3 lg:[.is-pinned_&]:mt-0 lg:[.is-pinned_&]:shrink-0">
                    {t(`steps.${step.key}.body`)}
                  </p>
                </li>
              ))}
            </ol>

            {/* Timeline, shown once the scene is pinned. */}
            <div className="mt-8 hidden [.is-pinned_&]:block" aria-hidden="true">
              <div className="relative h-px bg-white/30">
                <span className="story-bar brand-bar absolute inset-x-0 -top-px h-[3px]" />
              </div>
              <ul className="mt-3 grid grid-cols-4 gap-2 text-xs font-semibold text-white/55 sm:text-sm">
                {steps.map((step) => (
                  <li key={step.key} className="story-label">
                    {t(`steps.${step.key}.title`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
