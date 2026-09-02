'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/** Still poster with optional 5s Higgsfield loop. Falls back to the photo if the mp4 is missing. */
export function CinematicMedia({
  image,
  video,
  alt,
  autoPlay = false,
  playing,
  sizes,
  priority = false,
}: {
  image: string;
  video?: string;
  alt: string;
  autoPlay?: boolean;
  playing?: boolean;
  sizes: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [useVideo, setUseVideo] = useState(Boolean(video));

  useEffect(() => {
    const el = ref.current;
    if (!el || !useVideo) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      el.pause();
      return;
    }

    if (autoPlay || playing) {
      void el.play().catch(() => setUseVideo(false));
      return;
    }

    el.pause();
    el.currentTime = 0;
  }, [autoPlay, playing, useVideo]);

  if (!useVideo || !video) {
    return (
      <Image src={image} alt={alt} fill sizes={sizes} className="object-cover" priority={priority} />
    );
  }

  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full object-cover"
      poster={image}
      src={video}
      muted
      loop
      playsInline
      preload="metadata"
      onError={() => setUseVideo(false)}
      aria-label={alt}
    />
  );
}
