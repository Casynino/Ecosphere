import { ArrowRight } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';

/** Text link with an arrow that nudges forward on hover. */
export function ArrowLink({ children, className = '', ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`group inline-flex items-center gap-2 font-bold text-teal transition-colors hover:text-teal-dark ${className}`}
      {...props}
    >
      {children}
      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
    </Link>
  );
}
