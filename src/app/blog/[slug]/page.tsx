import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublishedPostBySlug, getAllPublishedSlugs, formatBlogDate } from "@/lib/blog";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllPublishedSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: post.featuredImageUrl ? [{ url: post.featuredImageUrl }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Fitzroya Desarrollos",
    },
    ...(post.featuredImageUrl && { image: post.featuredImageUrl }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al blog
            </Link>
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {post.authorName}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatBlogDate(post.publishedAt ?? post.createdAt)}
            </span>
          </div>
        </div>

        {post.featuredImageUrl && (
          <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-10">
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div
          className="prose prose-neutral dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-lg prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </>
  );
}
