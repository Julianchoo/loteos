import Airtable from "airtable";
import { config } from "dotenv";

config();

if (!process.env.AIRTABLE_API_TOKEN) {
  throw new Error("AIRTABLE_API_TOKEN is not defined");
}

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_TOKEN,
});

const base = airtable.base(process.env.AIRTABLE_BASE_ID!);
const projects = base(process.env.AIRTABLE_PROJECTS_TABLE_ID || "tblMkCAojUXvPedrw");

async function createGuernicaInAirtable() {
  try {
    const record = await projects.create({
      "Project ID": "guernica",
      "Project Name": "Guernica",
      "Description": "Proyecto de 20 lotes en zona estratégica del sur del Gran Buenos Aires",
      "Location": "Guernica, Buenos Aires",
      "Total Area": "1 hectárea",
      "Total Lots": "20 lotes",
    });

    console.log("✅ Guernica creado en Airtable!");
    console.log(`   Record ID: ${record.id}`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
  process.exit(0);
}

createGuernicaInAirtable();
