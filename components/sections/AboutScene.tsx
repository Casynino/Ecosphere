import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { SceneTimeline } from '@/components/ui/SceneTimeline';

/**
 * "About" as a scene with no picture of its own: a frosted panel of words
 * stands over the moving forest behind the page, so scrolling through the
 * company statement, the mission and the vision is a flight forward.
 */
export async function AboutScene() {
  const t = await getTranslations();
  const title = 'display-2 lg:text-[3.25rem]';
  const body = 'mt-5 text-lg text-mist sm:text-xl';

  return (
    <section
      data-story
      data-steps={3}
      aria-labelledby="about-title"
      className="scene relative"
      style={{ '--steps': 3 } as CSSProperties}
    >
      {/* The dark foot of the opening film lifts away as the page begins. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[45svh] bg-[linear-gradient(to_bottom,#021316,rgb(2_19_22/0))]" aria-hidden="true" />

      <div className="scene-stage flex flex-col overflow-hidden">
        <Container className="flex flex-1 flex-col justify-end pb-6 pt-[calc(var(--header-h)+2rem)] sm:pb-10 [.scene:not(.is-pinned)_&]:py-24">
          <div className="panel max-w-3xl rounded-[24px] p-6 sm:p-10 lg:p-12">
            <div className="scene-stack is-top">
              <div data-i="0" className="scene-item">
                <h2 id="about-title" className={title}>
                  {t('home.about.title')}
                </h2>
                <p className={body}>{t('company.about')}</p>
              </div>
              <div data-i="1" className="scene-item">
                <h3 className={title}>{t('company.missionTitle')}</h3>
                <p className={body}>{t('company.mission')}</p>
              </div>
              <div data-i="2" className="scene-item">
                <h3 className={title}>{t('company.visionTitle')}</h3>
                <p className={body}>{t('company.vision')}</p>
              </div>
            </div>
            <ArrowLink href="/about" className="mt-6">
              {t('home.about.link')}
            </ArrowLink>
            <SceneTimeline labels={[t('nav.about'), t('company.missionTitle'), t('company.visionTitle')]} />
          </div>
        </Container>
      </div>
    </section>
  );
}
