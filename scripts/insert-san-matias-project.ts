import { db } from "../src/lib/db";
import { project } from "../src/lib/schema";

async function insertSanMatiasProject() {
  try {
    await db.insert(project).values({
      id: "san-matias",
      name: "San Matías",
      description: "Barrio privado en Arroyo de la Cruz",
      location: "Ruta 192, Arroyo de la Cruz, Exaltación de la Cruz",
      totalArea: "9",
      totalLots: "185",
    });

    console.log("✅ San Matías project inserted successfully");
  } catch (error) {
    console.error("❌ Error inserting project:", error);
    process.exit(1);
  }

  process.exit(0);
}

insertSanMatiasProject();
