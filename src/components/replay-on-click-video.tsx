"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useRef } from "react";

type ReplayOnClickVideoProps = ComponentPropsWithoutRef<"video">;

export function ReplayOnClickVideo(props: ReplayOnClickVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <video
      ref={videoRef}
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = 0;
        void video.play();
      }}
    />
  );
}