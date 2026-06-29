"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
type LazyVideoProps = {
  src: string;
  poster: string;
  className?: string;
  videoClassName?: string;
  label?: string;
};

export function LazyVideo({
  src,
  poster,
  className,
  videoClassName,
  label = "Reproducir video",
}: LazyVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (isLoaded) {
    return (
      <video
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        preload="metadata"
        className={videoClassName}
      />
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => setIsLoaded(true)}
      className={cn(
        "group relative block overflow-hidden bg-muted text-white",
        className
      )}
    >
      <Image
        src={poster}
        alt=""
        fill
        sizes="(max-width: 1024px) 90vw, 340px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-black/25" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg transition-transform duration-200 group-hover:scale-105">
          <Play className="ml-1 size-7 fill-current" />
        </span>
      </span>
    </button>
  );
}
