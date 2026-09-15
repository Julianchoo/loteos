import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fitzroya Desarrollos",
    short_name: "Fitzroya",
    description:
      "Fitzroya Desarrollos — proyectos y desarrollos inmobiliarios.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2FBC5B",
    icons: [
      {
        src: "/images/logo-icon/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/logo-icon/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
