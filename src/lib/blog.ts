import { randomUUID } from "crypto";
import { eq, desc, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogPost } from "@/lib/schema";

export type BlogPost = typeof blogPost.$inferSelect;
export type NewBlogPost = typeof blogPost.$inferInsert;

export type BlogPostWithAuthor = BlogPost & {
  authorName: string;
};

/**
 * Format a date string to Spanish locale (es-AR)
 */
export function formatBlogDate(dateStr: string | Date): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Get all published posts (for public blog page)
 */
export async function getPublishedPosts(limit = 12): Promise<BlogPostWithAuthor[]> {
  const { user } = await import("@/lib/schema");

  const rows = await db
    .select({
      id: blogPost.id,
      slug: blogPost.slug,
      title: blogPost.title,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      featuredImageUrl: blogPost.featuredImageUrl,
      authorId: blogPost.authorId,
      status: blogPost.status,
      publishedAt: blogPost.publishedAt,
      createdAt: blogPost.createdAt,
      updatedAt: blogPost.updatedAt,
      authorName: user.name,
    })
    .from(blogPost)
    .leftJoin(user, eq(blogPost.authorId, user.id))
    .where(eq(blogPost.status, "published"))
    .orderBy(desc(blogPost.publishedAt))
    .limit(limit);

  return rows.map((r) => ({ ...r, authorName: r.authorName ?? "Fitzroya Desarrollos" }));
}

/**
 * Get a single published post by slug (for public blog post page)
 */
export async function getPublishedPostBySlug(slug: string): Promise<BlogPostWithAuthor | null> {
  const { user } = await import("@/lib/schema");

  const rows = await db
    .select({
      id: blogPost.id,
      slug: blogPost.slug,
      title: blogPost.title,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      featuredImageUrl: blogPost.featuredImageUrl,
      authorId: blogPost.authorId,
      status: blogPost.status,
      publishedAt: blogPost.publishedAt,
      createdAt: blogPost.createdAt,
      updatedAt: blogPost.updatedAt,
      authorName: user.name,
    })
    .from(blogPost)
    .leftJoin(user, eq(blogPost.authorId, user.id))
    .where(and(eq(blogPost.slug, slug), eq(blogPost.status, "published")))
    .limit(1);

  if (!rows[0]) return null;
  return { ...rows[0], authorName: rows[0].authorName ?? "Fitzroya Desarrollos" };
}

/**
 * Get all published post slugs (for sitemap + generateStaticParams)
 */
export async function getAllPublishedSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: blogPost.slug })
    .from(blogPost)
    .where(eq(blogPost.status, "published"));

  return rows.map((r) => r.slug);
}

// ─── Admin functions ──────────────────────────────────────────────────────────

/**
 * Get all posts regardless of status (for admin panel)
 */
export async function getAllPosts(): Promise<BlogPostWithAuthor[]> {
  const { user } = await import("@/lib/schema");

  const rows = await db
    .select({
      id: blogPost.id,
      slug: blogPost.slug,
      title: blogPost.title,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      featuredImageUrl: blogPost.featuredImageUrl,
      authorId: blogPost.authorId,
      status: blogPost.status,
      publishedAt: blogPost.publishedAt,
      createdAt: blogPost.createdAt,
      updatedAt: blogPost.updatedAt,
      authorName: user.name,
    })
    .from(blogPost)
    .leftJoin(user, eq(blogPost.authorId, user.id))
    .orderBy(desc(blogPost.createdAt));

  return rows.map((r) => ({ ...r, authorName: r.authorName ?? "Fitzroya Desarrollos" }));
}

/**
 * Get a single post by ID (for admin edit form)
 */
export async function getPostById(id: string): Promise<BlogPost | null> {
  const rows = await db.select().from(blogPost).where(eq(blogPost.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new blog post
 */
export async function createPost(data: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImageUrl?: string;
  authorId: string;
  status: "draft" | "published";
}): Promise<BlogPost> {
  const id = randomUUID();
  const now = new Date();

  const [created] = await db
    .insert(blogPost)
    .values({
      id,
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt ?? null,
      content: data.content,
      featuredImageUrl: data.featuredImageUrl ?? null,
      authorId: data.authorId,
      status: data.status,
      publishedAt: data.status === "published" ? now : null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return created!;
}

/**
 * Update an existing blog post
 */
export async function updatePost(
  id: string,
  data: {
    title?: string;
    slug?: string;
    excerpt?: string | null;
    content?: string;
    featuredImageUrl?: string | null;
    status?: "draft" | "published";
  }
): Promise<BlogPost | null> {
  const existing = await getPostById(id);
  if (!existing) return null;

  // Set publishedAt when first publishing
  const publishedAt =
    data.status === "published" && existing.status === "draft"
      ? new Date()
      : existing.publishedAt;

  const [updated] = await db
    .update(blogPost)
    .set({
      ...data,
      publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(blogPost.id, id))
    .returning();

  return updated ?? null;
}

/**
 * Delete a blog post
 */
export async function deletePost(id: string): Promise<void> {
  await db.delete(blogPost).where(eq(blogPost.id, id));
}
