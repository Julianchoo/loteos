import { siteUrl } from "@/lib/seo";
import type { MetadataRoute } from "next";


export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteUrl;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/profile", "/chat/", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
