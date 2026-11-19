import type { ReactNode } from 'react';

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  /** "dark" for headings placed on a dark background. */
  tone?: 'light' | 'dark';
  /** Optional link shown to the right of the heading on wide screens. */
  action?: ReactNode;
  id?: string;
};

/** Section title that rises into place as it scrolls into view. */
export function SectionHeading({ eyebrow, title, intro, tone = 'light', action, id }: Props) {
  const dark = tone === 'dark';

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <p className={`eyebrow ${dark ? 'text-lime' : 'text-teal'}`}>{eyebrow}</p>}
        <div data-reveal="mask" className={eyebrow ? 'mt-2' : ''}>
          <h2 id={id} className={`text-[2.1rem] sm:text-5xl ${dark ? 'text-white' : 'text-ink'}`}>
            {title}
          </h2>
        </div>
        {intro && (
          <p data-reveal className={`mt-4 text-lg ${dark ? 'text-white/85' : 'text-ink/80'}`}>
            {intro}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
