import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import logoColour from '@/public/brand/logo-color.png';
import logo from '@/public/brand/logo.png';
import { CtaLink } from '@/components/ui/CtaLink';
import { Container } from '@/components/ui/Container';
import type { Locale } from '@/content/types';

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

/**
 * Opening scene of the home page. The picture is the film behind the whole
 * site (components/layout/LivingBackground.tsx), seen clearly here.
 *
 * A visitor first sees a short opening (globals.css, "Opening of the home
 * page"): the logo on a plain screen, then the camera sweeps back from the
 * clouds on the volcano to the whole forest, and the headline comes into
 * focus at the foot.
 */
export async function HomeHero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'home.hero' });

  return (
    <>
      {/* The opening. Decorative: the same logo is in the header. */}
      <div className="intro" aria-hidden="true">
        <div className="intro-cover">
          <div className="intro-mark">
            {/* Colour logo on the pale screen (light theme), white logo on the dark one (dark theme).
                The white one is the same file and size as the header logo, so it is fetched once. */}
            <Image src={logoColour} alt="" sizes="150px" loading="eager" className="intro-logo-light h-14 w-auto" />
            <Image src={logo} alt="" sizes="150px" className="intro-logo-dark h-14 w-auto" />
            <span className="intro-line" />
          </div>
        </div>
      </div>

      <section className="has-intro on-dark relative isolate overflow-hidden text-white">
        {/* Shade under the header and behind the words; the foot of the picture sinks into the dark. */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(2_19_22)_0%,rgb(2_19_22/0.72)_22%,rgb(2_19_22/0.12)_58%,rgb(2_19_22/0.4)_100%)]" />

      <Container className="flex min-h-svh flex-col justify-end pb-10 pt-[calc(var(--header-h)+2rem)] sm:pb-14">
        <h1 className="rise-focus display-1 max-w-[17ch]">{t('title')}</h1>
        <div
          className="rise mt-6 flex flex-col gap-6 border-t border-white/25 pt-6 sm:mt-8 sm:flex-row sm:items-center sm:justify-between"
          style={delay(350)}
        >
          <p className="hidden max-w-md text-lg text-white/85 sm:block">{t('sub')}</p>
          <CtaLink href="/contact" className="sm:self-auto">
            {t('primaryCta')}
          </CtaLink>
        </div>
      </Container>
      </section>
    </>
  );
}
