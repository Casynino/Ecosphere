import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';

const base =
  'inline-flex items-center justify-center gap-2 rounded-[10px] text-center font-semibold leading-tight transition-colors duration-150';

const sizes = {
  md: 'min-h-12 px-6 py-3 text-base',
  sm: 'min-h-10 px-4 py-2 text-[0.9375rem]',
} as const;

const variants = {
  lime: 'bg-lime text-teal-darkest hover:bg-lime-dark',
  teal: 'bg-teal text-white hover:bg-teal-dark',
  outlineLight: 'border border-white/40 text-white hover:bg-white/10',
  outlineDark: 'border border-ink/15 bg-white text-ink hover:border-teal hover:text-teal',
} as const;

export type ButtonVariant = keyof typeof variants;

export function buttonClass(variant: ButtonVariant = 'lime', className = '', size: keyof typeof sizes = 'md') {
  return `${base} ${sizes[size]} ${variants[variant]} ${className}`;
}

type Props = ComponentProps<typeof Link> & { variant?: ButtonVariant };

/** A link styled as a button. Lime is the main call to action. */
export function ButtonLink({ variant = 'lime', className = '', ...props }: Props) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}
