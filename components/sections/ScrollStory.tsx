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
 * visitor scrolls through the four steps and the photograph behind them
 * changes. Without JavaScript (or with reduced motion) it is an ordinary
 * section listing the four steps side by side. Styles: globals.css (.story).
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
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(0_50_58/0.96)_0%,rgb(0_50_58/0.5)_48%,rgb(0_50_58/0.22)_100%),linear-gradient(100deg,rgb(0_50_58/0.82)_0%,rgb(0_50_58/0.08)_78%)]" />

        <Container className="flex flex-1 flex-col justify-between gap-12 py-14 sm:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow text-lime">{t('eyebrow')}</p>
            <h2 id="how-we-work" className="mt-3 text-3xl sm:text-4xl lg:text-5xl">
              {t('title')}
            </h2>
          </div>

          <div className="flex items-end justify-between gap-8">
            <ol className="story-steps grid flex-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <li key={step.key} className="story-step max-w-xl">
                  <p className="font-display text-5xl text-lime sm:text-6xl" aria-hidden="true">
                    0{index + 1}
                  </p>
                  <h3 className="mt-3 text-2xl sm:text-4xl">{t(`steps.${step.key}.title`)}</h3>
                  <p className="mt-3 text-lg text-white/85">{t(`steps.${step.key}.body`)}</p>
                </li>
              ))}
            </ol>
            {/* Step markers, only meaningful once the scene is pinned. */}
            <div className="hidden flex-col items-center gap-2 pb-2 [.is-pinned_&]:flex" aria-hidden="true">
              {steps.map((step) => (
                <span key={step.key} className="story-dot h-2.5 w-1.5 rounded-full bg-white/35" />
              ))}
            </div>
          </div>
        </Container>
        <span className="story-bar brand-bar absolute inset-x-0 bottom-0 h-1" aria-hidden="true" />
      </div>
    </section>
  );
}
