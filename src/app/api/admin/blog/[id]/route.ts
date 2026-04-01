import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPostById, updatePost, deletePost } from "@/lib/blog";

async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  if ((session.user as { role?: string }).role !== "admin") return null;
  return session;
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) {
    return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, slug, excerpt, content, featuredImageUrl, status } = body;

  const statusValue: "draft" | "published" | undefined =
    status === "published" ? "published" : status === "draft" ? "draft" : undefined;

  const updateData: Parameters<typeof updatePost>[1] = {
    title: title?.trim(),
    slug: slug?.trim(),
    excerpt: excerpt?.trim() ?? null,
    content,
    featuredImageUrl: featuredImageUrl?.trim() ?? null,
  };
  if (statusValue !== undefined) updateData.status = statusValue;

  const updated = await updatePost(id, updateData);

  if (!updated) {
    return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) {
    return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
  }

  await deletePost(id);
  return NextResponse.json({ success: true });
}
