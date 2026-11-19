/**
 * The line at the foot of a scene that fills as it is scrolled, with the
 * names of its steps underneath (hidden on phones). Pressing a name jumps
 * to that step. It only appears once the scene is pinned.
 */
export function SceneTimeline({ labels }: { labels: string[] }) {
  return (
    <div className="mt-8 hidden [.is-pinned_&]:block">
      <div className="relative h-px bg-snow/25">
        <span className="scene-bar absolute inset-x-0 -top-px h-[3px] bg-lime" aria-hidden="true" />
      </div>
      <ol
        className="mt-3 hidden gap-2 text-sm font-semibold sm:grid"
        style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}
      >
        {labels.map((label, index) => (
          <li key={label}>
            <button type="button" data-goto={index} data-i={index} className="scene-label text-left">
              {label}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
