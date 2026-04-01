import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";

const ADMIN_EMAILS = ["cohenmat@hotmail.com", "juliankorn@gmail.com"];

export async function POST(request: NextRequest) {
  const { email } = await request.json() as { email: string };

  if (!email || !ADMIN_EMAILS.includes(email.toLowerCase())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  await db
    .update(user)
    .set({ role: "admin" })
    .where(eq(user.email, email.toLowerCase()));

  return NextResponse.json({ success: true });
}
