import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { requireApiCrm, isErrorResponse } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { project } from "@/lib/schema";

/** Projects for the CRM project selector (visible and hidden). */
export async function GET() {
  const authResult = await requireApiCrm();
  if (isErrorResponse(authResult)) return authResult;

  const rows = await db
    .select({ id: project.id, name: project.name, isVisible: project.isVisible })
    .from(project)
    .orderBy(asc(project.name));

  return NextResponse.json(rows);
}
