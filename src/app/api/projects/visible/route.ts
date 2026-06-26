import { NextResponse } from "next/server";
import { getProjectsForCurrentUser } from "@/lib/actions/project-actions";
import { toPublicProjectSummary } from "@/lib/public-projects";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const { data } = await getProjectsForCurrentUser();
  return NextResponse.json({ projects: data.map(toPublicProjectSummary) });
}
