import { db } from "../src/lib/db";
import { project } from "../src/lib/schema";

async function insertGuernica() {
  try {
    await db.insert(project).values({
      id: "guernica",
      name: "Guernica",
      description: "Proyecto de 20 lotes en zona estratégica del sur del Gran Buenos Aires",
      location: "Guernica, Buenos Aires",
      totalArea: "1 hectárea",
      totalLots: "20 lotes",
    });

    console.log("✅ Guernica insertado exitosamente en PostgreSQL");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
  process.exit(0);
}

insertGuernica();
