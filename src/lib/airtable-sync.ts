import { eq, or } from "drizzle-orm";
import PQueue from "p-queue";
import {
  createLeadRecord,
  updateLeadRecord,
  getProjectRecordId,
} from "@/lib/airtable-client";
import { db } from "@/lib/db";
import { lead, leadFinancingPreference, leadProject } from "@/lib/schema";

// Rate limiting queue: 5 requests per second max for Airtable
export const airtableQueue = new PQueue({
  concurrency: 1,
  interval: 200, // 200ms = 5 requests/second
  intervalCap: 1,
});

// Map contact channel to Airtable-friendly format
function mapContactChannel(channel: string): string {
  const channelMap: Record<string, string> = {
    web_form_general: "Web Form - General",
    web_form_project: "Web Form - Project",
    whatsapp: "WhatsApp",
    phone: "Phone",
    in_person: "In Person",
  };
  return channelMap[channel] || channel;
}

// Map status to Airtable format
function mapStatus(status: string): string {
  const statusMap: Record<string, string> = {
    new: "New",
    contacted: "Contacted",
    interested: "Interested",
    visit_scheduled: "Visit Scheduled",
    proposal_sent: "Proposal Sent",
    sold: "Sold",
    lost: "Lost",
  };
  return statusMap[status] || status;
}

interface SyncLeadResult {
  success: boolean;
  recordId?: string | undefined;
  error?: string | undefined;
}

export async function syncLeadToAirtable(
  leadId: string
): Promise<SyncLeadResult> {
  return airtableQueue.add(async () => {
    try {
      // Fetch lead from database
      const leadData = await db
        .select()
        .from(lead)
        .where(eq(lead.id, leadId))
        .limit(1);

      if (leadData.length === 0 || !leadData[0]) {
        return { success: false, error: "Lead not found in database" };
      }

      const leadRecord = leadData[0]!

      // Fetch financing preferences if they exist
      const financingData = await db
        .select()
        .from(leadFinancingPreference)
        .where(eq(leadFinancingPreference.leadId, leadId))
        .limit(1);

      const financing = financingData.length > 0 ? financingData[0] : null;

      // Fetch associated projects
      const projects = await db
        .select()
        .from(leadProject)
        .where(eq(leadProject.leadId, leadId));

      // Get Airtable project record IDs
      const projectRecordIds: string[] = [];
      for (const proj of projects) {
        const recordId = await getProjectRecordId(proj.projectId);
        if (recordId) {
          projectRecordIds.push(recordId);
        }
      }

      // Build Airtable fields
      const fields: Record<string, unknown> = {
        "Lead ID": leadRecord.id,
        "First Name": leadRecord.firstName,
        "Last Name": leadRecord.lastName,
        Email: leadRecord.email,
        Phone: leadRecord.phone || "",
        "Contact Channel": mapContactChannel(leadRecord.contactChannel),
        Status: mapStatus(leadRecord.status),
        "Initial Message": leadRecord.initialMessage || "",
        "Created At": leadRecord.createdAt.toISOString(),
        "Last Synced": new Date().toISOString(),
        "Sync Status": "Synced",
      };

      // Add marketing attribution if available
      if (leadRecord.marketingSource) {
        fields["Marketing Source"] = leadRecord.marketingSource;
      }
      if (leadRecord.marketingCampaign) {
        fields["Marketing Campaign"] = leadRecord.marketingCampaign;
      }

      // Add financing fields if available
      if (financing) {
        fields["Anticipo (USD)"] = parseFloat(financing.anticipoAmount);
        fields["Plazo (Months)"] = parseInt(financing.plazoMonths, 10);
        fields["Cuota Mensual (USD)"] = parseFloat(financing.calculatedCuota);
      }

      // Add project links if available
      if (projectRecordIds.length > 0) {
        fields["Interested Projects"] = projectRecordIds;
      }

      let result;

      // Update existing record or create new one
      if (leadRecord.airtableRecordId) {
        result = await updateLeadRecord(leadRecord.airtableRecordId, fields);
      } else {
        result = await createLeadRecord(fields);
      }

      if (result.success && result.recordId) {
        // Update lead with Airtable record ID and sync status
        await db
          .update(lead)
          .set({
            airtableRecordId: result.recordId,
            lastSyncedAt: new Date(),
            syncStatus: "synced",
            syncError: null,
          })
          .where(eq(lead.id, leadId));

        return { success: true, recordId: result.recordId };
      } else {
        // Log sync error
        await db
          .update(lead)
          .set({
            syncStatus: "error",
            syncError: result.error || "Unknown sync error",
          })
          .where(eq(lead.id, leadId));

        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Log error to database
      await db
        .update(lead)
        .set({
          syncStatus: "error",
          syncError: errorMessage,
        })
        .where(eq(lead.id, leadId));

      return { success: false, error: errorMessage };
    }
  });
}

export async function syncAllPendingLeads(): Promise<{
  synced: number;
  failed: number;
  errors: Array<{ leadId: string; error: string }>;
}> {
  const results = {
    synced: 0,
    failed: 0,
    errors: [] as Array<{ leadId: string; error: string }>,
  };

  try {
    // Find all leads with pending or error status
    const leadsToSync = await db
      .select()
      .from(lead)
      .where(or(eq(lead.syncStatus, "pending"), eq(lead.syncStatus, "error")));

    console.log(`Found ${leadsToSync.length} leads to sync to Airtable`);

    for (const leadRecord of leadsToSync) {
      const result = await syncLeadToAirtable(leadRecord.id);

      if (result.success) {
        results.synced++;
        console.log(`Successfully synced lead ${leadRecord.id}`);
      } else {
        results.failed++;
        results.errors.push({
          leadId: leadRecord.id,
          error: result.error || "Unknown error",
        });
        console.error(`Failed to sync lead ${leadRecord.id}:`, result.error);
      }
    }

    return results;
  } catch (error) {
    console.error("Error in syncAllPendingLeads:", error);
    throw error;
  }
}
