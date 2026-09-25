import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";

/**
 * Protected routes that require authentication.
 * These are also configured in src/proxy.ts for optimistic redirects.
 */
export const protectedRoutes = ["/chat", "/dashboard", "/profile", "/admin", "/crm"];

/**
 * Checks if the current request is authenticated.
 * Should be called in Server Components for protected routes.
 *
 * @returns The session object if authenticated
 * @throws Redirects to home page if not authenticated
 */
export async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return session;
}

/**
 * Checks if the current user is an admin.
 * Redirects comercial users to /crm and everyone else who is not an admin to home.
 *
 * @returns The session object if the user is an admin
 * @throws Redirects to home page if not authenticated or not admin
 */
export async function requireAdmin() {
  const session = await requireAuth();

  // Query DB directly — BetterAuth session doesn't expose custom fields
  const [dbUser] = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (dbUser?.role === "comercial") {
    redirect("/crm");
  }

  if (!dbUser || dbUser.role !== "admin") {
    redirect("/");
  }

  return session;
}

/**
 * Requires a CRM user (admin or comercial).
 * Users flagged with mustChangePassword are sent to /cambiar-password first.
 *
 * @returns The session plus the user's DB role
 */
export async function requireCrmUser() {
  const session = await requireAuth();

  const [dbUser] = await db
    .select({ role: user.role, mustChangePassword: user.mustChangePassword })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!dbUser || (dbUser.role !== "admin" && dbUser.role !== "comercial")) {
    redirect("/");
  }

  if (dbUser.mustChangePassword) {
    redirect("/cambiar-password");
  }

  return { session, role: dbUser.role as "admin" | "comercial" };
}

/**
 * Gets the current session without requiring authentication.
 * Returns null if not authenticated.
 *
 * @returns The session object or null
 */
export async function getOptionalSession() {
  return await auth.api.getSession({ headers: await headers() });
}

export async function isCurrentUserAdmin() {
  const session = await getOptionalSession();

  if (!session) {
    return false;
  }

  const [dbUser] = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  return dbUser?.role === "admin";
}

/**
 * Checks if a given path is a protected route.
 *
 * @param path - The path to check
 * @returns True if the path requires authentication
 */
export function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
}
