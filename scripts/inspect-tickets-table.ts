import Airtable from "airtable";
import { config } from "dotenv";

// Load environment variables
config();

if (!process.env.AIRTABLE_API_TOKEN) {
  throw new Error("AIRTABLE_API_TOKEN is not defined");
}

if (!process.env.AIRTABLE_TICKETS_TABLE_ID) {
  throw new Error("AIRTABLE_TICKETS_TABLE_ID is not defined");
}

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_TOKEN,
});

const base = airtable.base(process.env.AIRTABLE_BASE_ID!);

async function inspectTicketsTable() {
  try {
    console.log("🔍 Inspecting Tickets Table...\n");

    const tickets = base(process.env.AIRTABLE_TICKETS_TABLE_ID!);
    const ticketsRecords = await tickets.select({ maxRecords: 3 }).firstPage();

    if (ticketsRecords.length > 0) {
      console.log("  Fields found:");
      const firstRecord = ticketsRecords[0]!;
      Object.keys(firstRecord.fields).forEach(field => {
        const value = firstRecord.fields[field];
        const type = Array.isArray(value) ? 'array' : typeof value;
        console.log(`    - "${field}" (${type}): ${JSON.stringify(value)}`);
      });

      console.log("\n📝 Sample records:");
      ticketsRecords.forEach((record, idx) => {
        console.log(`\n  Record ${idx + 1}:`);
        console.log(`    ID: ${record.id}`);
        console.log(`    Fields:`, JSON.stringify(record.fields, null, 2));
      });
    } else {
      console.log("  ⚠️  No records found. Please add at least one ticket manually to see field names.");
    }

  } catch (error) {
    console.error("❌ Error inspecting tickets table:", error);
    process.exit(1);
  }

  process.exit(0);
}

inspectTicketsTable();
