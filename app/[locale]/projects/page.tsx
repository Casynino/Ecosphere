import { MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { PageHero } from '@/components/sections/PageHero';
import { Container } from '@/components/ui/Container';
import { LazyVideo } from '@/components/ui/LazyVideo';
import { ImagePlaceholder, PlaceholderBadge } from '@/components/ui/Placeholder';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { fieldGallery, fieldVideos, photos } from '@/content/media';
import { projects } from '@/content/projects';
import { getPageLocale, type LocaleParams } from '@/lib/locale';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale, namespace: 'projects' });
  return pageMetadata({ locale, path: '/projects', title: t('metaTitle'), description: t('metaDescription') });
}

export default async function ProjectsPage({ params }: LocaleParams) {
  const locale = await getPageLocale(params);
  const t = await getTranslations();
  const caseStudies = projects.filter((project) => !project.placeholder);

  return (
    <>
      <PageHero
        locale={locale}
        photo={photos.teamAtHarbour}
        title={t('projects.title')}
        intro={t('projects.intro')}
      />

      {/* Photo gallery: equal square pictures on one panel */}
      <section className="py-12 lg:py-20">
        <Container>
          <div className="panel rounded-card p-5 sm:p-10">
            <SectionHeading title={t('projects.galleryTitle')} intro={t('projects.galleryIntro')} />
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-3">
              {fieldGallery.map((photo) => (
                <li key={photo.src.src} data-reveal className="relative aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={photo.src}
                    alt={photo.alt[locale]}
                    fill
                    sizes="(min-width: 1024px) 370px, 46vw"
                    quality={60}
                    placeholder="blur"
                    className="object-cover"
                    style={{ objectPosition: photo.position }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Video clips: the video file is only fetched when the visitor presses play */}
      <section>
        <Container>
          <div className="panel rounded-card p-5 sm:p-10">
          <SectionHeading title={t('projects.videosTitle')} intro={t('projects.videosIntro')} />
          <ul className="mt-6 grid gap-6 sm:mt-10 sm:grid-cols-3">
            {fieldVideos.map((video, index) => (
              <li key={video.src} data-reveal style={{ '--reveal-delay': `${index * 110}ms` } as CSSProperties}>
                <figure className="mx-auto max-w-[19rem]">
                  <LazyVideo
                    src={video.src}
                    poster={video.poster}
                    label={t('projects.videoLabel', { title: video.title[locale] })}
                  />
                  <figcaption className="mt-3 text-center font-semibold text-snow">{video.title[locale]}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
          </div>
        </Container>
      </section>

      {/* Case studies: shown once the client supplies real projects (content/projects.ts). */}
      {caseStudies.length > 0 && (
      <section className="py-12 lg:py-20">
        <Container>
          <div className="panel rounded-card p-5 sm:p-10">
          <SectionHeading title={t('projects.caseStudiesTitle')} intro={t('projects.caseStudiesIntro')} />
          <ul className="mt-6 grid gap-6 sm:mt-10 md:grid-cols-3">
            {caseStudies.map((project, index) => (
              <li key={project.slug} data-reveal style={{ '--reveal-delay': `${index * 100}ms` } as CSSProperties}>
                <article className="panel flex h-full flex-col overflow-hidden rounded-card">
                  {project.image ? (
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={project.image.src}
                        alt={project.image.alt[locale]}
                        fill
                        sizes="(min-width: 768px) 400px, 85vw"
                        quality={60}
                        placeholder="blur"
                        className="object-cover"
                        style={{ objectPosition: project.image.position }}
                      />
                    </div>
                  ) : (
                    <ImagePlaceholder label={t('common.photoPlaceholder')} className="aspect-[16/10]" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {project.placeholder && (
                      <div>
                        <PlaceholderBadge label={t('common.placeholder')} />
                      </div>
                    )}
                    <h3 className="mt-3 text-xl text-snow">{project.title[locale]}</h3>
                    <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                      <div className="flex gap-1.5">
                        <dt className="font-bold text-snow">{t('projects.sectorLabel')}:</dt>
                        <dd className="text-mist">{project.sector[locale]}</dd>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <dt className="sr-only">{t('projects.locationLabel')}</dt>
                        <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
                        <dd className="text-mist">{project.location[locale]}</dd>
                      </div>
                    </dl>
                    <p className="mt-4 text-mist">{project.summary[locale]}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
          </div>
        </Container>
      </section>
      )}

      <CtaBanner locale={locale} />
    </>
  );
}
