import Image from "next/image";
import Link from "next/link";
import { CalendarDays, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPosts, formatWPDate, type WPPost } from "@/lib/wordpress";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Consejos sobre lotes y desarrollos inmobiliarios",
  description:
    "Artículos sobre inversión en lotes, desarrollos inmobiliarios sustentables y consejos para comprar tu terreno en Buenos Aires.",
  openGraph: {
    title: "Blog | Fitzroya Desarrollos",
    description:
      "Consejos e información sobre inversión en lotes y desarrollos inmobiliarios en Buenos Aires.",
  },
};

export default async function BlogPage() {
  let posts: WPPost[] = [];
  try {
    const result = await getPosts(12);
    posts = result.nodes;
  } catch {
    posts = [];
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Consejos, novedades y todo lo que necesitás saber sobre inversión en
          lotes y desarrollos inmobiliarios.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <p className="text-lg">Aún no hay artículos publicados.</p>
          <p className="text-sm mt-2">Volvé pronto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                {post.featuredImage && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.categories.nodes.slice(0, 2).map((cat) => (
                      <Badge key={cat.slug} variant="secondary" className="text-xs">
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-sm text-muted-foreground line-clamp-3 mb-4"
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {formatWPDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author.node.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
