import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';

const base = 'inline-flex items-center justify-center gap-2 rounded-lg text-center font-bold leading-tight transition-colors';

const sizes = {
  md: 'min-h-12 px-6 py-3 text-base',
  sm: 'min-h-11 px-5 py-2.5 text-[0.95rem]',
} as const;

const variants = {
  lime: 'bg-lime text-teal-darkest hover:bg-lime-dark',
  teal: 'bg-teal text-white hover:bg-teal-dark',
  outlineLight: 'border border-white/40 text-white hover:bg-white/10',
  outlineDark: 'border border-teal/30 bg-white text-teal hover:border-teal hover:bg-teal/5',
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
