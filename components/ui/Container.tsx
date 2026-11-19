import type { ReactNode } from 'react';

/** Centres content and keeps a comfortable gutter on small screens. */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}
