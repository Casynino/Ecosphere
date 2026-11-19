/** Small label that marks content the client still has to supply. */
export function PlaceholderBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-dashed border-teal/50 bg-teal/5 px-2.5 py-0.5 text-xs font-bold text-teal">
      {label}
    </span>
  );
}

/** Stands in for a photo that has not been supplied yet. */
export function ImagePlaceholder({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center border border-dashed border-teal/40 bg-[repeating-linear-gradient(135deg,rgb(0_94_100/0.05)_0_14px,transparent_14px_28px)] text-sm font-semibold text-teal ${className}`}
    >
      {label}
    </div>
  );
}
