import { NextResponse } from "next/server";
import { getAmbitoBlueAverage } from "@/lib/ambito-blue-rate";
import { isErrorResponse, requireApiCrm } from "@/lib/api-auth";

export async function GET() {
  const authResult = await requireApiCrm();
  if (isErrorResponse(authResult)) return authResult;
  return NextResponse.json(await getAmbitoBlueAverage());
}
