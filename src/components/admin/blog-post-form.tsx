"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BlogEditor } from "@/components/admin/blog-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { BlogPost } from "@/lib/blog";

interface BlogPostFormProps {
  post?: BlogPost;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter();
  const isEditing = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(post?.featuredImageUrl ?? "");
  const [status, setStatus] = useState<"draft" | "published">(
    (post?.status as "draft" | "published") ?? "draft"
  );
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  };

  const handleContentChange = useCallback((html: string) => {
    setContent(html);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("El título es requerido");
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `/api/admin/blog/${post!.id}` : "/api/admin/blog";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, excerpt, content, featuredImageUrl, status }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Error desconocido");
      }

      toast.success(isEditing ? "Post actualizado" : "Post creado");
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar el post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Título del post"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Resumen</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Breve descripción que aparece en la lista del blog (opcional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Contenido</Label>
            <BlogEditor content={content} onChange={handleContentChange} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-sm">Publicación</h3>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as "draft" | "published")}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear post"}
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-sm">SEO / URL</h3>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManuallyEdited(true);
                }}
                placeholder="mi-post-de-ejemplo"
              />
              <p className="text-xs text-muted-foreground">/blog/{slug || "slug-del-post"}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-sm">Imagen destacada</h3>

            <div className="space-y-2">
              <Label htmlFor="featuredImageUrl">URL de la imagen</Label>
              <Input
                id="featuredImageUrl"
                value={featuredImageUrl}
                onChange={(e) => setFeaturedImageUrl(e.target.value)}
                placeholder="https://... o subí desde el editor"
              />
              {featuredImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredImageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md border"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
