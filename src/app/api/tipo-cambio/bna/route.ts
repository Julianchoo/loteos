import { NextResponse } from "next/server";
import { requireApiCrm, isErrorResponse } from "@/lib/api-auth";
import { getBnaBilleteVendedor } from "@/lib/bna-exchange-rate";

export async function GET() {
  const authResult = await requireApiCrm();
  if (isErrorResponse(authResult)) return authResult;

  return NextResponse.json(await getBnaBilleteVendedor());
}
