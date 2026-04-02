import { getAllPublishedSlugs } from "@/lib/blog";
import type { MetadataRoute } from "next";

function toHttps(url: string): string {
  if (url.startsWith("http://") && !url.includes("localhost")) {
    return url.replace("http://", "https://");
  }
  return url;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = toHttps(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/proyectos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/proyectos/jardines-de-arroyo`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/proyectos/san-nicolas`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/proyectos/guernica`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllPublishedSlugs();
    blogRoutes = slugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB unavailable — sitemap still works without blog posts
  }

  return [...staticRoutes, ...blogRoutes];
}
