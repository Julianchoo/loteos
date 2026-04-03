"use server";

import { eq, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { project } from "@/lib/schema";

export type ProjectWithPricing = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  totalArea: string | null;
  totalLots: string | null;
  basePrice: string | null;
  minCashDown: string | null;
  maxFinancingMonths: number | null;
  tna: string | null;
  publishStatus: string;
  airtableRecordId: string | null;
  lastSyncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Get project by slug/ID from Postgres
 *
 * Returns project data including pricing configuration synced from Airtable
 */
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

/**
 * Get all projects from Postgres
 */
export async function getProjects() {
  try {
    const results = await db.select().from(project).orderBy(project.name);
    return { success: true, data: results as ProjectWithPricing[] };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { success: false, error: "Failed to fetch projects", data: [] };
  }
}

/**
 * Get visible projects (launched + coming_soon), excludes hidden
 */
export async function getVisibleProjects() {
  try {
    const results = await db
      .select()
      .from(project)
      .where(or(eq(project.publishStatus, "launched"), eq(project.publishStatus, "coming_soon")))
      .orderBy(project.name);
    return { success: true, data: results as ProjectWithPricing[] };
  } catch (error) {
    console.error("Error fetching visible projects:", error);
    return { success: false, error: "Failed to fetch projects", data: [] };
  }
}
