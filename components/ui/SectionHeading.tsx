type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  /** "dark" for headings placed on a dark teal background. */
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  id?: string;
};

export function SectionHeading({ eyebrow, title, intro, tone = 'light', align = 'left', id }: Props) {
  const dark = tone === 'dark';
  const centred = align === 'center';

  return (
    <div className={centred ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && (
        <p className={`eyebrow ${dark ? 'text-lime' : 'text-teal'} ${centred ? 'justify-center' : ''}`}>{eyebrow}</p>
      )}
      <h2 id={id} className={`mt-3 text-3xl sm:text-4xl ${dark ? 'text-white' : 'text-ink'}`}>
        {title}
      </h2>
      {intro && <p className={`mt-4 text-lg ${dark ? 'text-white/80' : 'text-muted'}`}>{intro}</p>}
    </div>
  );
}
