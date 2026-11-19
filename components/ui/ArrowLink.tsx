import { ArrowRight } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';

/** Text link with an arrow that nudges forward on hover. */
export function ArrowLink({ children, className = '', ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`group inline-flex items-center gap-1.5 font-semibold text-accent transition-colors duration-150 hover:text-snow ${className}`}
      {...props}
    >
      {children}
      <ArrowRight
        className="h-[18px] w-[18px] transition-transform duration-150 group-hover:translate-x-1"
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </Link>
  );
}
