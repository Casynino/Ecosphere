import { getTranslations } from 'next-intl/server';
import { CtaLink } from '@/components/ui/CtaLink';
import { Container } from '@/components/ui/Container';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <section className="on-dark bg-hero text-white">
      <Container className="pb-28 pt-[calc(var(--header-h)+7rem)] text-center sm:pb-36">
        <p className="font-display text-7xl text-accent">404</p>
        <h1 className="mt-4 text-4xl sm:text-5xl">{t('title')}</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-white/85">{t('body')}</p>
        <CtaLink href="/" className="mt-8 self-center">
          {t('home')}
        </CtaLink>
      </Container>
    </section>
  );
}
