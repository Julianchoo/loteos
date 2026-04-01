import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllPosts, formatBlogDate } from "@/lib/blog";

export default async function AdminBlogPage() {
  const posts = await getAllPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Posts del blog</h1>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground border rounded-lg">
          <p className="text-lg">Todavía no hay posts.</p>
          <p className="text-sm mt-1">Creá el primero haciendo clic en &quot;Nuevo post&quot;.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-xs">
                    <div className="truncate">{post.title}</div>
                    <div className="text-xs text-muted-foreground truncate">/blog/{post.slug}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.status === "published" ? "default" : "secondary"}>
                      {post.status === "published" ? "Publicado" : "Borrador"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatBlogDate(post.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {post.status === "published" && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank" title="Ver post">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/admin/blog/${post.id}/edit`} title="Editar">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeletePostButton postId={post.id} postTitle={post.title} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
