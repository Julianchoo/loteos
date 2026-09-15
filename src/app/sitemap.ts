import { getVisibleProjects } from "@/lib/actions/project-actions";
import { getAllPublishedSlugs } from "@/lib/blog";
import { siteUrl } from "@/lib/seo";
import type { MetadataRoute } from "next";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/proyectos`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/nosotros`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/financiacion/calculadora-cuotas`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
  ];

  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: projects } = await getVisibleProjects();
    projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/proyectos/${project.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
  } catch {
    projectRoutes = [];
  }

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllPublishedSlugs();
    blogRoutes = slugs.map((slug) => ({ url: `${baseUrl}/blog/${slug}`, changeFrequency: "monthly" as const, priority: 0.7 }));
  } catch {
    blogRoutes = [];
  }

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
