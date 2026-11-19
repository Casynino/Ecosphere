import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { Container } from '@/components/ui/Container';
import { SceneTimeline } from '@/components/ui/SceneTimeline';
import { photos, stock } from '@/content/media';

// One photograph per step, in order.
const steps = [
  { key: 'assess', photo: photos.cranesAndSkyline },
  { key: 'advise', photo: photos.siteBriefing },
  { key: 'implement', photo: stock.plantingSeedling },
  { key: 'sustain', photo: stock.kilimanjaro },
] as const;

/**
 * "How we work" as a scene: the photograph changes, one very large word
 * names the step, and a timeline along the bottom shows how far along
 * the visitor is.
 */
export async function ScrollStory() {
  const t = await getTranslations('home.how');

  return (
    <section
      data-story
      data-steps={steps.length}
      aria-labelledby="how-we-work"
      className="scene text-white"
      style={{ '--steps': steps.length } as CSSProperties}
    >
      <div className="scene-stage relative isolate flex flex-col overflow-hidden">
        <div className="absolute inset-0 -z-20" aria-hidden="true">
          {steps.map((step, index) => (
            <div key={step.key} data-i={index} className="scene-layer">
              <Image src={step.photo.src} alt="" fill sizes="100vw" quality={60} className="object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(2_19_22/0.95)_0%,rgb(2_19_22/0.3)_46%,rgb(2_19_22/0.55)_82%,rgb(2_19_22)_100%)]" />

        <Container className="flex flex-1 flex-col justify-between gap-12 pb-8 pt-[calc(var(--header-h)+2rem)] [.scene:not(.is-pinned)_&]:py-24">
          <h2 id="how-we-work" className="display-3 max-w-xl">
            {t('title')}
          </h2>

          <div>
            <ol className="scene-stack sm:[.scene:not(.is-pinned)_&]:grid-cols-2">
              {steps.map((step, index) => (
                <li
                  key={step.key}
                  data-i={index}
                  className="scene-item lg:[.is-pinned_&]:flex lg:[.is-pinned_&]:items-end lg:[.is-pinned_&]:justify-between lg:[.is-pinned_&]:gap-10"
                >
                  <h3 className="font-display text-3xl font-normal tracking-[-0.03em] [.is-pinned_&]:display-1">
                    {t(`steps.${step.key}.title`)}
                  </h3>
                  <p className="mt-3 max-w-xs text-lg text-white/90 lg:[.is-pinned_&]:mb-3 lg:[.is-pinned_&]:mt-0 lg:[.is-pinned_&]:shrink-0">
                    {t(`steps.${step.key}.body`)}
                  </p>
                </li>
              ))}
            </ol>
            <SceneTimeline labels={steps.map((step) => t(`steps.${step.key}.title`))} />
          </div>
        </Container>
      </div>
    </section>
  );
}
