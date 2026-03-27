/**
 * Test script to verify form submission, database, and Airtable integration
 * Run with: npx tsx scripts/test-form-submission.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env file
config({ path: resolve(process.cwd(), ".env") });

import { createLead } from "@/lib/actions/lead-actions";
import { db } from "@/lib/db";
import { lead } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

async function testFormSubmission() {
  console.log("🧪 Testing Form Submission System\n");

  // Step 1: Test database connection
  console.log("1️⃣ Testing database connection...");
  try {
    await db.select().from(lead).limit(1);
    console.log("✅ Database connection successful\n");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return;
  }

  // Step 2: Create a test lead
  console.log("2️⃣ Creating test lead...");
  const testData = {
    firstName: "Test",
    lastName: "User",
    email: `test-${Date.now()}@example.com`,
    phone: "+54 9 11 1234 5678",
    contactChannel: "web_form_general",
    initialMessage: "This is a test submission",
  };

  try {
    const result = await createLead(testData);

    if (result.success) {
      console.log("✅ Lead created successfully!");
      console.log(`   Lead ID: ${result.leadId}\n`);

      // Step 3: Verify lead was saved to database
      console.log("3️⃣ Verifying lead in database...");
      const savedLead = await db
        .select()
        .from(lead)
        .where(eq(lead.id, result.leadId!))
        .limit(1);

      if (savedLead.length > 0 && savedLead[0]) {
        console.log("✅ Lead found in database!");
        console.log("   Data:", {
          name: `${savedLead[0].firstName} ${savedLead[0].lastName}`,
          email: savedLead[0].email,
          phone: savedLead[0].phone,
          syncStatus: savedLead[0].syncStatus,
          airtableRecordId: savedLead[0].airtableRecordId,
        });
        console.log();

        // Step 4: Check Airtable sync status
        console.log("4️⃣ Checking Airtable sync status...");
        console.log(`   Waiting 5 seconds for sync to complete...`);

        await new Promise((resolve) => setTimeout(resolve, 5000));

        const syncedLead = await db
          .select()
          .from(lead)
          .where(eq(lead.id, result.leadId!))
          .limit(1);

        if (syncedLead.length > 0 && syncedLead[0]) {
          const leadData = syncedLead[0];
          if (leadData.syncStatus === "synced" && leadData.airtableRecordId) {
            console.log("✅ Lead successfully synced to Airtable!");
            console.log(`   Airtable Record ID: ${leadData.airtableRecordId}`);
          } else if (leadData.syncStatus === "error") {
            console.log("❌ Airtable sync failed!");
            console.log(`   Error: ${leadData.syncError}`);
          } else if (leadData.syncStatus === "pending") {
            console.log("⏳ Airtable sync still pending...");
            console.log("   The sync might take a bit longer or there may be an issue.");
          }
        }
      } else {
        console.log("❌ Lead NOT found in database!");
      }
    } else {
      console.log("❌ Failed to create lead!");
      console.log(`   Error: ${result.error}`);
    }
  } catch (error) {
    console.error("❌ Error during test:", error);
  }

  // Step 5: Show recent leads
  console.log("\n5️⃣ Showing 5 most recent leads in database:");
  try {
    const recentLeads = await db
      .select({
        id: lead.id,
        name: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        syncStatus: lead.syncStatus,
        airtableRecordId: lead.airtableRecordId,
        createdAt: lead.createdAt,
      })
      .from(lead)
      .orderBy(desc(lead.createdAt))
      .limit(5);

    if (recentLeads.length === 0) {
      console.log("   No leads found in database");
    } else {
      console.table(
        recentLeads.map((l) => ({
          Name: `${l.name} ${l.lastName}`,
          Email: l.email,
          "Sync Status": l.syncStatus,
          "Airtable ID": l.airtableRecordId ? "✓" : "✗",
          Created: l.createdAt.toLocaleString(),
        }))
      );
    }
  } catch (error) {
    console.error("   Error fetching recent leads:", error);
  }

  console.log("\n✨ Test complete!");
}

// Run the test
testFormSubmission().catch(console.error);
