import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, User, ArrowLeft } from "lucide-react";
import { getPostBySlug, getAllPostSlugs, formatWPDate } from "@/lib/wordpress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt.replace(/<[^>]*>/g, "").slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt.replace(/<[^>]*>/g, "").slice(0, 160),
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: post.featuredImage
        ? [{ url: post.featuredImage.node.sourceUrl }]
        : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      "@type": "Person",
      name: post.author.node.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Fitzroya Desarrollos",
    },
    ...(post.featuredImage && {
      image: post.featuredImage.node.sourceUrl,
    }),
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

          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.nodes.map((cat) => (
              <Badge key={cat.slug} variant="secondary">
                {cat.name}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {post.author.node.name}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatWPDate(post.date)}
            </span>
          </div>
        </div>

        {post.featuredImage && (
          <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-10">
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title}
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
