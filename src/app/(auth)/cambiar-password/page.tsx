import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { ForcedPasswordChangeForm } from "@/components/auth/forced-password-change-form";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { requireAuth } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CambiarPasswordPage() {
  const session = await requireAuth();

  const [dbUser] = await db
    .select({ mustChangePassword: user.mustChangePassword })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!dbUser?.mustChangePassword) {
    redirect("/crm");
  }

  return (
    <div className="min-h-[70vh] bg-background flex items-center justify-center p-6">
      <ForcedPasswordChangeForm />
    </div>
  );
}
