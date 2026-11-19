import type { ReactNode } from 'react';

type Props = {
  title: string;
  /** Supporting line. Hidden on phones to keep small screens uncluttered. */
  intro?: string;
  /** "dark" for headings placed on a dark background. */
  tone?: 'light' | 'dark';
  /** Optional link shown level with the title, on the right. */
  action?: ReactNode;
  id?: string;
};

/** Section title that rises into place as it scrolls into view. */
export function SectionHeading({ title, intro, tone = 'light', action, id }: Props) {
  const dark = tone === 'dark';

  return (
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
      <div className="max-w-2xl">
        <div data-reveal="mask">
          <h2 id={id} className={`text-[1.875rem] sm:text-[2.5rem] ${dark ? 'text-white' : 'text-ink'}`}>
            {title}
          </h2>
        </div>
        {intro && (
          <p data-reveal className={`mt-3 hidden text-lg sm:block ${dark ? 'text-white/85' : 'text-muted'}`}>
            {intro}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 sm:pb-1">{action}</div>}
    </div>
  );
}
