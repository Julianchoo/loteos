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
const tickets = base(process.env.AIRTABLE_TICKETS_TABLE_ID!);

// Parse command line arguments
const args = {
  name: process.argv[2],
  description: process.argv[3],
  status: process.argv[4] || "Todo",
  priority: process.argv[5] || "Medium",
  type: process.argv[6] || "Infrastructure",
};

// Validate required fields
if (!args.name) {
  console.error("❌ Error: Ticket name is required");
  console.error(
    "\nUsage: pnpm tsx scripts/create-ticket.ts <name> <description> [status] [priority] [type]"
  );
  console.error("\nArguments:");
  console.error('  name        - Brief title of the task (required, use "quotes" if contains spaces)');
  console.error('  description - Detailed description (required, use "quotes" if contains spaces)');
  console.error("  status      - Todo | In progress | Testing | Done (default: Todo)");
  console.error("  priority    - Critical | High | Medium | Low (default: Medium)");
  console.error("  type        - Infrastructure | Feature | Bug | Marketing (default: Infrastructure)");
  console.error("\nExample:");
  console.error(
    '  pnpm tsx scripts/create-ticket.ts "Fix homepage layout" "Adjust spacing and alignment on mobile" "Todo" "High" "Bug"'
  );
  process.exit(1);
}

if (!args.description) {
  console.error("❌ Error: Ticket description is required");
  console.error(
    '\nUsage: pnpm tsx scripts/create-ticket.ts <name> <description> [status] [priority] [type]'
  );
  process.exit(1);
}

async function createTicket() {
  try {
    console.log("🎫 Creating ticket in Airtable...\n");

    const ticketData = {
      Name: args.name,
      Description: args.description,
      Status: args.status,
      Priority: args.priority,
      Type: args.type,
    };

    console.log("📝 Ticket details:");
    console.log(`   Name: ${ticketData.Name}`);
    console.log(`   Description: ${ticketData.Description}`);
    console.log(`   Status: ${ticketData.Status}`);
    console.log(`   Priority: ${ticketData.Priority}`);
    console.log(`   Type: ${ticketData.Type}\n`);

    const record = await tickets.create(ticketData);

    console.log("✅ Ticket created successfully!");
    console.log(`   Airtable Record ID: ${record.id}`);

    // Try to get the ID field if it exists
    if (record.fields.ID) {
      console.log(`   Ticket ID: ${record.fields.ID}`);
    }

    console.log(`   View in Airtable: https://airtable.com/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TICKETS_TABLE_ID}/${record.id}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating ticket:", error);
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    }
    process.exit(1);
  }
}

createTicket();
