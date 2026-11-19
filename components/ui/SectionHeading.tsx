import type { ReactNode } from 'react';

type Props = {
  title: string;
  /** Supporting line. Hidden on phones to keep small screens uncluttered. */
  intro?: string;
  /** Optional link shown level with the title, on the right. */
  action?: ReactNode;
  id?: string;
};

/** Section title that rises into place as it scrolls into view. */
export function SectionHeading({ title, intro, action, id }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
      <div className="max-w-3xl">
        <div data-reveal="mask">
          <h2 id={id} className="display-3 text-snow">
            {title}
          </h2>
        </div>
        {intro && (
          <p data-reveal className="mt-4 hidden text-lg text-mist sm:block">
            {intro}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 sm:pb-1">{action}</div>}
    </div>
  );
}
