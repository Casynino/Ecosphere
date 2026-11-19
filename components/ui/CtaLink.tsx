import { ArrowRight } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';

/**
 * The main call to action ("Request a consultation").
 * Phones: plain words with a fine lime underline and an arrow, no button shape.
 * Tablets and up: the lime button.
 */
export function CtaLink({ children, className = '', ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`group inline-flex items-center gap-2 text-lg font-semibold text-white underline decoration-lime decoration-2 underline-offset-8 transition-colors duration-150 sm:min-h-12 sm:justify-center sm:rounded-[10px] sm:bg-lime sm:px-6 sm:py-3 sm:text-base sm:text-teal-darkest sm:no-underline sm:hover:bg-white ${className}`}
      {...props}
    >
      {children}
      <ArrowRight className="h-5 w-5 text-lime sm:hidden" strokeWidth={1.5} aria-hidden="true" />
    </Link>
  );
}
