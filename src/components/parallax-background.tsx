interface ParallaxBackgroundProps {
  src: string;
  alt?: string;
  priority?: boolean;
}

/**
 * Fixed parallax background — the image stays fixed to the viewport
 * while content scrolls over it (CSS background-attachment: fixed).
 */
export function ParallaxBackground({ src }: ParallaxBackgroundProps) {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${src})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}
