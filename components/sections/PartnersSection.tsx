import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { collaborators, partners } from '@/content/partners';

/** Partners and collaborators: the organisations' names, in two groups. */
export async function PartnersSection({ className = 'py-10 lg:py-14' }: { className?: string }) {
  const t = await getTranslations('home.partners');
  const groups = [
    { label: t('partners'), names: partners },
    { label: t('collaborators'), names: collaborators },
  ];

  return (
    <section className={className}>
      <Container>
        <SectionHeading title={t('title')} />
        <div className="mt-5 grid gap-3 sm:mt-8 sm:gap-5 md:grid-cols-2">
          {groups.map((group) => (
            <div key={group.label} data-reveal className="panel statement rounded-card p-5 sm:p-7">
              <h3 className="text-sm font-bold text-accent">{group.label}</h3>
              <ul className="mt-2 divide-y divide-snow/10">
                {group.names.map((name) => (
                  <li key={name} className="py-3 text-lg font-bold leading-snug tracking-[-0.02em] text-snow last:pb-0">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
