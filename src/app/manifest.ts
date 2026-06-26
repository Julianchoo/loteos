import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Agentic Coding Boilerplate",
    short_name: "Agentic",
    description:
      "Complete agentic coding boilerplate with authentication, database, AI integration, and modern tooling",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
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
