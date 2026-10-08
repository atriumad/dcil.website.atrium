"use client";

import { useRef, useState } from "react";

/** Looping hero video over the poster. The video stays hidden until it is actually playing, so a blocked autoplay (Low Power Mode, data saver) leaves the poster instead of the clip's first frame. The pause button satisfies WCAG 2.2.2. */
export function HeroVideo({ poster }: { poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  return (
    <>
      <video
        ref={ref}
        className={playing ? "sg-hero-video is-playing" : "sg-hero-video"}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-hidden="true"
        onPlaying={() => {
          setPlaying(true);
          setPaused(false);
        }}
        onPause={() => setPaused(true)}
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      {playing || paused ? (
        <button type="button" className="sg-hero-pause" onClick={toggle} aria-label={paused ? "Play background video" : "Pause background video"}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
            {paused ? <path d="M3 1.5v11l9-5.5z" /> : <path d="M2.5 1.5h3v11h-3zM8.5 1.5h3v11h-3z" />}
          </svg>
          <span>{paused ? "Play" : "Pause"}</span>
        </button>
      ) : null}
    </>
  );
}
