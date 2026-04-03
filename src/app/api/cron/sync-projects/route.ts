import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { project } from "@/lib/schema";

/**
 * Cron endpoint to sync projects from Airtable to Postgres
 *
 * Security: Requires CRON_SECRET header to match environment variable
 *
 * Vercel Cron configuration in vercel.json:
 * - Runs every 5 minutes to keep project data in sync
 * - Can also be triggered manually via POST request with correct secret
 *
 * Usage:
 * POST /api/cron/sync-projects
 * Headers: { "x-cron-secret": "your-cron-secret" }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("[CRON] CRON_SECRET not configured");
      return NextResponse.json(
        { error: "Cron secret not configured" },
        { status: 500 }
      );
    }

    // Accept both "Bearer <secret>" and plain secret
    const providedSecret = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    if (providedSecret !== cronSecret) {
      console.error("[CRON] Unauthorized sync attempt");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[CRON] Starting project sync from Airtable...");

    // Fetch projects from Airtable
    const airtableApiToken = process.env.AIRTABLE_API_TOKEN;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const airtableProjectsTableId = process.env.AIRTABLE_PROJECTS_TABLE_ID;

    if (!airtableApiToken || !airtableBaseId || !airtableProjectsTableId) {
      console.error("[CRON] Airtable configuration missing");
      return NextResponse.json(
        { error: "Airtable configuration missing" },
        { status: 500 }
      );
    }

    const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableProjectsTableId}`;
    const response = await fetch(airtableUrl, {
      headers: {
        Authorization: `Bearer ${airtableApiToken}`,
      },
    });

    if (!response.ok) {
      console.error("[CRON] Failed to fetch from Airtable:", response.statusText);
      return NextResponse.json(
        { error: "Failed to fetch from Airtable" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const airtableProjects = data.records;

    console.log(`[CRON] Fetched ${airtableProjects.length} projects from Airtable`);

    let syncedCount = 0;
    let errorCount = 0;

    // Sync each project to Postgres
    for (const airtableProject of airtableProjects) {
      try {
        const fields = airtableProject.fields;
        const projectId = fields["Project ID"];

        if (!projectId) {
          console.warn("[CRON] Skipping project without Project ID:", airtableProject.id);
          errorCount++;
          continue;
        }

        // Check if project exists
        const existingProjects = await db
          .select()
          .from(project)
          .where(eq(project.id, projectId))
          .limit(1);

        const projectData = {
          id: projectId,
          name: fields["Project Name"] || projectId,
          description: fields["Description"] || null,
          location: fields["Location"] || null,
          totalArea: fields["Total Area"] || null,
          totalLots: fields["Total Lots"]?.toString() || null,
          basePrice: fields["Base Price (USD)"]?.toString() || null,
          minCashDown: fields["Min Cash Down (USD)"]?.toString() || null,
          maxFinancingMonths: fields["Max Financing Months"] || null,
          tna: fields["TNA"]?.toString() || null,
          airtableRecordId: airtableProject.id,
          lastSyncedAt: new Date(),
          updatedAt: new Date(),
        };

        if (existingProjects.length > 0) {
          // Update existing project
          await db
            .update(project)
            .set(projectData)
            .where(eq(project.id, projectId));
          console.log(`[CRON] Updated project: ${projectId}`);
        } else {
          // Insert new project
          await db.insert(project).values({
            ...projectData,
            createdAt: new Date(),
          });
          console.log(`[CRON] Created project: ${projectId}`);
        }

        syncedCount++;
      } catch (error) {
        console.error(`[CRON] Error syncing project ${airtableProject.id}:`, error);
        errorCount++;
      }
    }

    console.log(`[CRON] Sync completed: ${syncedCount} synced, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      errors: errorCount,
      total: airtableProjects.length,
    });
  } catch (error) {
    console.error("[CRON] Unexpected error during sync:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Also support GET for manual testing (still requires auth)
export async function GET(request: NextRequest) {
  return POST(request);
}
