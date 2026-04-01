import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    })
    .from(user)
    .orderBy(user.createdAt);

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as { name?: string; email?: string; password?: string; role?: string };
  const { name, email, password, role } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
  }
  if (!email || typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "El email es requerido" }, { status: 400 });
  }
  if (!password || typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
  }
  if (role && role !== "user" && role !== "admin") {
    return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
  }

  // Create user via BetterAuth (handles password hashing)
  const result = await auth.api.signUpEmail({
    body: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    },
  });

  if (!result || !result.user) {
    return NextResponse.json({ error: "No se pudo crear el usuario" }, { status: 500 });
  }

  // Mark email as verified and set role since this is admin-created
  await db
    .update(user)
    .set({
      emailVerified: true,
      role: role === "admin" ? "admin" : "user",
    })
    .where(eq(user.id, result.user.id));

  return NextResponse.json({ success: true, userId: result.user.id }, { status: 201 });
}
