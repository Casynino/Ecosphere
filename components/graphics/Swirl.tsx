import { useId } from 'react';

/**
 * Abstract swirl drawn from the shapes and colours of the logo.
 * Decorative only. Set `globe` to draw the dotted sphere in the centre.
 */
export function Swirl({ className = '', globe = false }: { className?: string; globe?: boolean }) {
  const id = useId();
  const ref = (name: string) => `url(#${id}-${name})`;

  return (
    <svg viewBox="0 0 600 600" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-outer`} x1="0.1" y1="0.9" x2="0.9" y2="0.1">
          <stop offset="0" stopColor="#8cc63f" />
          <stop offset="0.6" stopColor="#3b79b8" />
          <stop offset="1" stopColor="#3b79b8" />
        </linearGradient>
        <linearGradient id={`${id}-middle`} x1="0" y1="0.2" x2="1" y2="0.8">
          <stop offset="0" stopColor="#3b79b8" />
          <stop offset="1" stopColor="#5ec3d6" />
        </linearGradient>
        <linearGradient id={`${id}-inner`} x1="0.9" y1="0.1" x2="0.1" y2="0.9">
          <stop offset="0" stopColor="#5ec3d6" />
          <stop offset="1" stopColor="#8cc63f" />
        </linearGradient>
        <pattern id={`${id}-dots`} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="3" fill="#5ec3d6" />
        </pattern>
        <radialGradient id={`${id}-fade`} cx="0.38" cy="0.34" r="0.75">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.15" />
        </radialGradient>
        <mask id={`${id}-sphere`}>
          <circle cx="300" cy="300" r="96" fill={ref('fade')} />
        </mask>
      </defs>
      {/* Each crescent is a circle with an off-centre circle cut out of it. */}
      <g fillRule="evenodd">
        <path
          fill={ref('outer')}
          d="M8 300a292 292 0 1 0 584 0a292 292 0 1 0 -584 0ZM78 312a240 240 0 1 0 480 0a240 240 0 1 0 -480 0Z"
        />
        <path
          fill={ref('middle')}
          opacity="0.92"
          d="M78 300a222 222 0 1 0 444 0a222 222 0 1 0 -444 0ZM106 312a180 180 0 1 0 360 0a180 180 0 1 0 -360 0Z"
        />
        <path
          fill={ref('inner')}
          opacity="0.85"
          d="M138 300a162 162 0 1 0 324 0a162 162 0 1 0 -324 0ZM176 290a132 132 0 1 0 264 0a132 132 0 1 0 -264 0Z"
        />
      </g>
      {globe && <circle cx="300" cy="300" r="96" fill={ref('dots')} mask={ref('sphere')} />}
    </svg>
  );
}
