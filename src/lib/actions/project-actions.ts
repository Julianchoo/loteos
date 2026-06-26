"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { project } from "@/lib/schema";
import { isCurrentUserAdmin } from "@/lib/session";

export type ProjectWithPricing = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  totalArea: string | null;
  totalLots: string | null;
  isVisible: boolean;
  basePrice: string | null;
  minCashDown: string | null;
  maxFinancingMonths: number | null;
  tna: string | null;
  airtableRecordId: string | null;
  lastSyncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function getProjectBySlug(slug: string) {
  try {
    const results = await db
      .select()
      .from(project)
      .where(eq(project.id, slug))
      .limit(1);

    if (results.length === 0) {
      return { success: false, error: "Project not found", data: null };
    }

    return { success: true, data: results[0] as ProjectWithPricing };
  } catch (error) {
    console.error("Error fetching project:", error);
    return { success: false, error: "Failed to fetch project", data: null };
  }
}

export async function getProjects() {
  try {
    const results = await db.select().from(project).orderBy(project.name);
    return { success: true, data: results as ProjectWithPricing[] };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { success: false, error: "Failed to fetch projects", data: [] };
  }
}

export async function getVisibleProjects() {
  try {
    const results = await db
      .select()
      .from(project)
      .where(eq(project.isVisible, true))
      .orderBy(project.name);

    return { success: true, data: results as ProjectWithPricing[] };
  } catch (error) {
    console.error("Error fetching visible projects:", error);
    return { success: false, error: "Failed to fetch visible projects", data: [] };
  }
}

export async function getProjectsForCurrentUser() {
  const isAdmin = await isCurrentUserAdmin();
  return isAdmin ? getProjects() : getVisibleProjects();
}

export type UpdateProjectData = {
  name: string;
  description: string | null;
  location: string | null;
  totalArea: string | null;
  totalLots: string | null;
  isVisible: boolean;
  basePrice: string | null;
  minCashDown: string | null;
  maxFinancingMonths: number | null;
  tna: string | null;
};

export async function updateProject(id: string, data: UpdateProjectData) {
  try {
    await db
      .update(project)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(project.id, id));

    revalidatePath("/");
    revalidatePath("/proyectos");
    revalidatePath("/financiacion/calculadora-cuotas");
    revalidatePath(`/proyectos/${id}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating project:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update project",
    };
  }
}
