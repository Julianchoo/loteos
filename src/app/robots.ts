import type { MetadataRoute } from "next";

function toHttps(url: string): string {
  if (url.startsWith("http://") && !url.includes("localhost")) {
    return url.replace("http://", "https://");
  }
  return url;
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = toHttps(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/profile/", "/chat/", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
