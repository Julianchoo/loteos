interface ParallaxBackgroundProps {
  src: string;
  srcMobile?: string;
  alt?: string;
  priority?: boolean;
}

/**
 * Fixed parallax background — the image stays fixed to the viewport
 * while content scrolls over it (CSS background-attachment: fixed).
 * Accepts an optional srcMobile for a smaller image on narrow viewports.
 */
export function ParallaxBackground({ src, srcMobile, priority }: ParallaxBackgroundProps) {
  const mobileSrc = srcMobile ?? src;
  return (
    <>
      {priority && (
        <>
          <link rel="preload" as="image" href={mobileSrc} fetchPriority="high" media="(max-width: 767px)" />
          <link rel="preload" as="image" href={src} fetchPriority="high" media="(min-width: 768px)" />
        </>
      )}
      <style>{`
        .parallax-bg {
          background-image: url(${mobileSrc});
        }
        @media (min-width: 768px) {
          .parallax-bg {
            background-image: url(${src});
          }
        }
      `}</style>
      <div
        className="parallax-bg absolute inset-0"
        style={{
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </>
  );
}
