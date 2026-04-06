interface ParallaxBackgroundProps {
  src: string;
  alt?: string;
  priority?: boolean;
}

/**
 * Fixed parallax background — the image stays fixed to the viewport
 * while content scrolls over it (CSS background-attachment: fixed).
 */
export function ParallaxBackground({ src, priority }: ParallaxBackgroundProps) {
  return (
    <>
      {priority && (
        <link rel="preload" as="image" href={src} fetchPriority="high" />
      )}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${src})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </>
  );
}
