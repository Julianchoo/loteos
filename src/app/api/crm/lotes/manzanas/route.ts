import { NextResponse } from "next/server";
import { and, asc, eq, isNotNull } from "drizzle-orm";
import { requireApiCrm, isErrorResponse } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { lot } from "@/lib/schema";

export async function GET(request: Request) {
  const authResult = await requireApiCrm();
  if (isErrorResponse(authResult)) return authResult;

  const projectId = new URL(request.url).searchParams.get("projectId");

  const rows = await db
    .selectDistinct({ manzana: lot.manzana })
    .from(lot)
    .where(
      projectId
        ? and(isNotNull(lot.manzana), eq(lot.projectId, projectId))
        : isNotNull(lot.manzana)
    )
    .orderBy(asc(lot.manzana));

  const values = rows
    .map((r) => r.manzana)
    .filter((m): m is string => m !== null);

  return NextResponse.json(values);
}
