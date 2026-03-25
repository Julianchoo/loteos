import Airtable from "airtable";
import { config } from "dotenv";

// Load environment variables
config();

if (!process.env.AIRTABLE_API_TOKEN) {
  throw new Error("AIRTABLE_API_TOKEN is not defined");
}

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_TOKEN,
});

const base = airtable.base(process.env.AIRTABLE_BASE_ID!);

async function inspectAirtable() {
  try {
    console.log("🔍 Inspecting Airtable tables...\n");

    // Check Leads table
    console.log("📋 Leads Table:");
    const leads = base(process.env.AIRTABLE_LEADS_TABLE_ID || "tbltIPNKFqstVpfVU");
    const leadsRecords = await leads.select({ maxRecords: 1 }).firstPage();

    if (leadsRecords.length > 0) {
      console.log("  Fields found:");
      Object.keys(leadsRecords[0]!.fields).forEach(field => {
        console.log(`    - "${field}"`);
      });
    } else {
      console.log("  ⚠️  No records found. Please add at least one record manually to see field names.");
    }

    console.log("\n📋 Projects Table:");
    const projects = base(process.env.AIRTABLE_PROJECTS_TABLE_ID || "tblMkCAojUXvPedrw");
    const projectsRecords = await projects.select({ maxRecords: 1 }).firstPage();

    if (projectsRecords.length > 0) {
      console.log("  Fields found:");
      Object.keys(projectsRecords[0]!.fields).forEach(field => {
        console.log(`    - "${field}"`);
      });
    } else {
      console.log("  ⚠️  No records found. Please add at least one record manually to see field names.");
    }

  } catch (error) {
    console.error("❌ Error inspecting Airtable:", error);
    process.exit(1);
  }

  process.exit(0);
}

inspectAirtable();
