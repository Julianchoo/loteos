import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";

/**
 * Verifies the request has an authenticated admin session.
 * Queries the DB directly since BetterAuth doesn't expose custom fields in the session.
 * Returns the session if admin, null otherwise.
 */
export async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const [dbUser] = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!dbUser || dbUser.role !== "admin") return null;
  return session;
}
