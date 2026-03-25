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
const projects = base(process.env.AIRTABLE_PROJECTS_TABLE_ID || "tblMkCAojUXvPedrw");

async function createSanMatiasProject() {
  try {
    console.log("📝 Creating San Matías project in Airtable...\n");

    const record = await projects.create({
      "Project ID": "san-matias",
      "Project Name": "San Matías",
      "Description": "Barrio privado en Arroyo de la Cruz",
      "Location": "Ruta 192, Arroyo de la Cruz, Exaltación de la Cruz",
      "Total Area": "9",
      "Total Lots": "185",
    });

    console.log("✅ San Matías project created in Airtable!");
    console.log(`   Record ID: ${record.id}`);
    console.log(`   Project ID: ${record.fields["Project ID"]}`);
    console.log(`   Project Name: ${record.fields["Project Name"]}`);

  } catch (error) {
    console.error("❌ Error creating project in Airtable:", error);
    process.exit(1);
  }

  process.exit(0);
}

createSanMatiasProject();
