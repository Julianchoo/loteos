import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ isAdmin: false });

  const adminSession = await getAdminSession();
  return NextResponse.json({ isAdmin: Boolean(adminSession) });
}
