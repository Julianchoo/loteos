import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";

export const CRM_ROLES = ["admin", "comercial"] as const;
export type CrmRole = (typeof CRM_ROLES)[number];

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function isCrmRole(role: string | null | undefined): role is CrmRole {
  return CRM_ROLES.includes(role as CrmRole);
}

/**
 * Returns the logged-in user with its role read from the DB
 * (BetterAuth sessions don't expose custom fields reliably).
 */
export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const [dbUser] = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: dbUser?.role ?? "user",
  };
}

/** CRM API guard: admin or comercial. */
export async function requireApiCrm(): Promise<AuthUser | NextResponse> {
  const authUser = await getAuthenticatedUser();
  if (!authUser) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!isCrmRole(authUser.role)) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }
  return authUser;
}

/** CRM API guard: admin only. */
export async function requireApiAdmin(): Promise<AuthUser | NextResponse> {
  const authUser = await getAuthenticatedUser();
  if (!authUser) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (authUser.role !== "admin") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }
  return authUser;
}

export function isErrorResponse(result: AuthUser | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
