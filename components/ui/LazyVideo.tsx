'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
  src: string;
  poster: string;
  /** Text for the play button, for example "Play video: Site walk". */
  label: string;
};

/**
 * A video that costs nothing until it is played: the page shows a still
 * picture with a play button, and the video file is only fetched after
 * the visitor presses it. Kind to slow connections and data bundles.
 */
export function LazyVideo({ src, poster, label }: Props) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <video
        src={src}
        poster={poster}
        controls
        autoPlay
        muted
        loop
        playsInline
        aria-label={label}
        className="aspect-[9/16] w-full rounded-card bg-teal-darkest object-cover"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={label}
      className="group relative block aspect-[9/16] w-full overflow-hidden rounded-card bg-teal-darkest"
    >
      <Image
        src={poster}
        alt=""
        fill
        sizes="(min-width: 640px) 300px, 80vw"
        quality={60}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-teal-darkest/25 transition-colors group-hover:bg-teal-darkest/10">
        <Play className="h-14 w-14 fill-white text-white drop-shadow-[0_4px_18px_rgb(0_30_36/0.8)]" aria-hidden="true" />
      </span>
    </button>
  );
}
