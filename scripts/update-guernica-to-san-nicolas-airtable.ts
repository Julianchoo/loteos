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

async function updateGuernicaToSanNicolasInAirtable() {
  try {
    // First, find the Guernica record
    const records = await projects
      .select({
        filterByFormula: "{Project ID} = 'guernica'",
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) {
      console.log("⚠️  No se encontró el proyecto 'guernica' en Airtable");
      console.log("💡 Ejecuta: pnpm tsx scripts/create-san-nicolas-in-airtable.ts");
      process.exit(1);
    }

    const recordId = records[0]?.id;

    if (!recordId) {
      console.log("⚠️  Error: No se pudo obtener el ID del registro");
      process.exit(1);
    }

    // Update the record
    await projects.update(recordId, {
      "Project ID": "san-nicolas",
      "Project Name": "San Nicolás",
      "Location": "Guernica, Buenos Aires",
    });

    console.log("✅ Proyecto actualizado exitosamente en Airtable!");
    console.log(`   Record ID: ${recordId}`);
    console.log("   Project ID: guernica → san-nicolas");
    console.log("   Project Name: Guernica → San Nicolás");
    console.log("   Location: Guernica, Buenos Aires (mantenida)");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
  process.exit(0);
}

updateGuernicaToSanNicolasInAirtable();
