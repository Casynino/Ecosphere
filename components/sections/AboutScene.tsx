import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { SceneTimeline } from '@/components/ui/SceneTimeline';
import { stock } from '@/content/media';

// One full-screen photograph per step: who we are, our mission, our vision.
const layers = [stock.cloudForest, stock.handsSoil, stock.kilimanjaro];

/**
 * "About" as a scene: the picture fills the screen and changes as the
 * visitor scrolls from the company statement to the mission and the vision.
 */
export async function AboutScene() {
  const t = await getTranslations();
  const body = 'mt-6 max-w-2xl text-lg text-white/85 sm:text-xl';

  return (
    <section
      data-story
      data-steps={layers.length}
      aria-labelledby="about-title"
      className="scene text-white"
      style={{ '--steps': layers.length } as CSSProperties}
    >
      <div className="scene-stage relative isolate flex flex-col overflow-hidden">
        <div className="absolute inset-0 -z-20" aria-hidden="true">
          {layers.map((photo, index) => (
            <div key={photo.src.src} data-i={index} className="scene-layer">
              <Image src={photo.src} alt="" fill sizes="100vw" quality={60} className="object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(2_19_22/0.96)_0%,rgb(2_19_22/0.62)_48%,rgb(2_19_22/0.45)_76%,rgb(2_19_22)_100%)]" />

        <Container className="flex flex-1 flex-col justify-end pb-8 pt-[calc(var(--header-h)+2rem)] [.scene:not(.is-pinned)_&]:py-24">
          <div className="scene-stack">
            <div data-i="0" className="scene-item">
              <h2 id="about-title" className="display-2 max-w-4xl">
                {t('home.about.title')}
              </h2>
              <p className={body}>{t('company.about')}</p>
            </div>
            <div data-i="1" className="scene-item">
              <h3 className="display-2">{t('company.missionTitle')}</h3>
              <p className={body}>{t('company.mission')}</p>
            </div>
            <div data-i="2" className="scene-item">
              <h3 className="display-2">{t('company.visionTitle')}</h3>
              <p className={body}>{t('company.vision')}</p>
            </div>
          </div>
          <ArrowLink href="/about" className="mt-6 self-start">
            {t('home.about.link')}
          </ArrowLink>
          <SceneTimeline labels={[t('nav.about'), t('company.missionTitle'), t('company.visionTitle')]} />
        </Container>
      </div>
    </section>
  );
}
