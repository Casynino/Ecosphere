import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <section className="on-dark bg-hero text-white">
      <Container className="py-28 text-center sm:py-36">
        <p className="font-display text-7xl text-lime">404</p>
        <h1 className="mt-4 text-4xl sm:text-5xl">{t('title')}</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-white/85">{t('body')}</p>
        <ButtonLink href="/" className="mt-8">
          {t('home')}
        </ButtonLink>
      </Container>
    </section>
  );
}
