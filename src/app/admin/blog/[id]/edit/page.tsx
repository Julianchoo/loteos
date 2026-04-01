import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { Button } from "@/components/ui/button";
import { getPostById } from "@/lib/blog";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) notFound();

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Editar post</h1>
      </div>
      <BlogPostForm post={post} />
    </div>
  );
}
