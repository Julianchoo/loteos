import Airtable from "airtable";

if (!process.env.AIRTABLE_API_TOKEN) {
  throw new Error("AIRTABLE_API_TOKEN is not defined");
}

if (!process.env.AIRTABLE_BASE_ID) {
  throw new Error("AIRTABLE_BASE_ID is not defined");
}

// Initialize Airtable client
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_TOKEN,
});

const base = airtable.base(process.env.AIRTABLE_BASE_ID);

// Table references using table IDs
export const airtableClient = {
  leads: base(process.env.AIRTABLE_LEADS_TABLE_ID || "tbltIPNKFqstVpfVU"),
  projects: base(
    process.env.AIRTABLE_PROJECTS_TABLE_ID || "tblMkCAojUXvPedrw"
  ),
};

// Helper functions
export async function createLeadRecord(fields: Record<string, unknown>) {
  try {
    const record = await airtableClient.leads.create(
      fields as Record<string, string | number | boolean>
    );
    return { success: true, recordId: record.id, fields: record.fields };
  } catch (error) {
    console.error("Error creating Airtable lead record:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateLeadRecord(
  recordId: string,
  fields: Record<string, unknown>
) {
  try {
    const record = await airtableClient.leads.update(
      recordId,
      fields as Record<string, string | number | boolean>
    );
    return { success: true, recordId: record.id, fields: record.fields };
  } catch (error) {
    console.error("Error updating Airtable lead record:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function findLeadByEmail(email: string) {
  try {
    const records = await airtableClient.leads
      .select({
        filterByFormula: `{Email} = "${email}"`,
        maxRecords: 1,
      })
      .firstPage();

    return records.length > 0 ? records[0] : null;
  } catch (error) {
    console.error("Error finding Airtable lead by email:", error);
    return null;
  }
}

export async function findProjectByName(name: string) {
  try {
    const records = await airtableClient.projects
      .select({
        filterByFormula: `{Project Name} = "${name}"`,
        maxRecords: 1,
      })
      .firstPage();

    return records.length > 0 ? records[0] : null;
  } catch (error) {
    console.error("Error finding Airtable project by name:", error);
    return null;
  }
}

export async function getProjectRecordId(
  projectId: string
): Promise<string | null> {
  try {
    const records = await airtableClient.projects
      .select({
        filterByFormula: `{Project ID} = "${projectId}"`,
        maxRecords: 1,
      })
      .firstPage();

    return records.length > 0 ? (records[0]?.id ?? null) : null;
  } catch (error) {
    console.error("Error getting Airtable project record ID:", error);
    return null;
  }
}
