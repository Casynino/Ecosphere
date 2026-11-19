import type { CSSProperties } from 'react';

/**
 * A statement whose words turn from grey to ink as it scrolls up the screen.
 * The colour change is done in globals.css (.scroll-words).
 */
export function ScrollWords({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ');

  return (
    <p data-scroll className={`scroll-words ${className}`} style={{ '--n': words.length } as CSSProperties}>
      {words.map((word, index) => (
        <span key={index} style={{ '--i': index } as CSSProperties}>
          {word}{' '}
        </span>
      ))}
    </p>
  );
}
