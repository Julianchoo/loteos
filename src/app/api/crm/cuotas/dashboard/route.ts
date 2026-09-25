import { NextResponse } from "next/server";
import { requireApiAdmin, isErrorResponse } from "@/lib/api-auth";
import { getCuotasDashboard } from "@/lib/cuenta-corriente";

export async function GET(request: Request) {
  const authResult = await requireApiAdmin();
  if (isErrorResponse(authResult)) return authResult;

  const projectId = new URL(request.url).searchParams.get("projectId");
  return NextResponse.json(await getCuotasDashboard(projectId));
}
