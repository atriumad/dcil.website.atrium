"use client";

import { useState } from "react";

/** Looping hero video over the poster. The video stays hidden until it is actually playing, so a blocked autoplay (Low Power Mode, data saver) leaves the poster instead of the clip's first frame. */
export function HeroVideo({ poster }: { poster: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <>
      <video
        className={playing ? "sg-hero-video is-playing" : "sg-hero-video"}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-hidden="true"
        onPlaying={() => setPlaying(true)}
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
    </>
  );
}
