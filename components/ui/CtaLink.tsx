import { ArrowRight } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';

/**
 * The main call to action ("Let's talk").
 * Words only, in the heading typeface, on a fine line that fills with the
 * accent colour on hover. No button shape, on any screen size.
 */
export function CtaLink({ children, className = '', ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`cta-link group inline-flex min-h-11 items-center gap-3 self-start text-[1.5rem] font-extrabold leading-none tracking-[-0.03em] text-snow sm:text-[1.75rem] ${className}`}
      {...props}
    >
      <span>{children}</span>
      <ArrowRight
        className="h-6 w-6 text-accent transition-transform duration-300 ease-glide group-hover:translate-x-1.5"
        strokeWidth={1.25}
        aria-hidden="true"
      />
    </Link>
  );
}
