import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllPosts, createPost, generateSlug } from "@/lib/blog";

async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  if ((session.user as { role?: string }).role !== "admin") return null;
  return session;
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await getAllPosts();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, excerpt, content, featuredImageUrl, status } = body;

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "El título es requerido" }, { status: 400 });
  }
  if (!content && content !== "") {
    return NextResponse.json({ error: "El contenido es requerido" }, { status: 400 });
  }

  const finalSlug = (slug && typeof slug === "string" && slug.trim())
    ? slug.trim()
    : generateSlug(title);

  const post = await createPost({
    title: title.trim(),
    slug: finalSlug,
    excerpt: excerpt?.trim() || undefined,
    content: content ?? "",
    featuredImageUrl: featuredImageUrl?.trim() || undefined,
    authorId: session.user.id,
    status: status === "published" ? "published" : "draft",
  });

  return NextResponse.json(post, { status: 201 });
}
