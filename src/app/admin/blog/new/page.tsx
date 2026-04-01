import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { Button } from "@/components/ui/button";

export default function NewBlogPostPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Nuevo post</h1>
      </div>
      <BlogPostForm />
    </div>
  );
}
