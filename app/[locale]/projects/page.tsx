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

  return (
    <>
      <PageHero
        locale={locale}
        photo={photos.teamAtHarbour}
        title={t('projects.title')}
        intro={t('projects.intro')}
      />

      {/* Photo gallery */}
      <section className="py-16 lg:py-24">
        <Container>
          <SectionHeading title={t('projects.galleryTitle')} intro={t('projects.galleryIntro')} />
          <ul className="mt-12 grid grid-flow-dense grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {fieldGallery.map((photo, index) => (
              <li
                key={photo.src.src}
                data-reveal="zoom"
                style={{ '--reveal-delay': `${(index % 4) * 80}ms` } as CSSProperties}
                className={`group relative overflow-hidden rounded-card ${
                  photo.shape === 'landscape' ? 'col-span-2 aspect-[4/3] lg:aspect-[3/2]' : 'aspect-[3/4]'
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt[locale]}
                  fill
                  sizes={photo.shape === 'landscape' ? '(min-width: 1024px) 620px, 85vw' : '(min-width: 1024px) 300px, 45vw'}
                  quality={60}
                  placeholder="blur"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  style={{ objectPosition: photo.position }}
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Video clips: the video file is only fetched when the visitor presses play */}
      <section className="on-dark bg-hero py-20 text-white sm:py-28">
        <Container>
          <SectionHeading title={t('projects.videosTitle')} intro={t('projects.videosIntro')} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-3">
            {fieldVideos.map((video, index) => (
              <li key={video.src} data-reveal style={{ '--reveal-delay': `${index * 110}ms` } as CSSProperties}>
                <figure className="mx-auto max-w-[19rem]">
                  <LazyVideo
                    src={video.src}
                    poster={video.poster}
                    label={t('projects.videoLabel', { title: video.title[locale] })}
                  />
                  <figcaption className="mt-3 text-center font-semibold">{video.title[locale]}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Case studies (placeholders until real projects are supplied) */}
      <section className="py-16 lg:py-24">
        <Container>
          <SectionHeading title={t('projects.caseStudiesTitle')} intro={t('projects.caseStudiesIntro')} />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {projects.map((project, index) => (
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
                        <MapPin className="h-4 w-4 text-lime" aria-hidden="true" />
                        <dd className="text-mist">{project.location[locale]}</dd>
                      </div>
                    </dl>
                    <p className="mt-4 text-mist">{project.summary[locale]}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBanner locale={locale} />
    </>
  );
}
