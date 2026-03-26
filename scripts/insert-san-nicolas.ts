import { db } from "../src/lib/db";
import { project } from "../src/lib/schema";

async function insertSanNicolas() {
  try {
    await db.insert(project).values({
      id: "san-nicolas",
      name: "San Nicolás",
      description: "Proyecto de 20 lotes en zona estratégica del sur del Gran Buenos Aires",
      location: "Guernica, Buenos Aires",
      totalArea: "1 hectárea",
      totalLots: "20 lotes",
    });

    console.log("✅ San Nicolás insertado exitosamente en PostgreSQL");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
  process.exit(0);
}

insertSanNicolas();
