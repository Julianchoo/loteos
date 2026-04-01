import { db } from "../src/lib/db";
import { project } from "../src/lib/schema";
import { eq } from "drizzle-orm";

async function updateSanMatiasToJardinesDeArroyo() {
  try {
    // Check current state
    const existing = await db.select().from(project);
    console.log("Proyectos en DB:", existing.map((p) => `${p.id} (${p.name})`));

    // jardines-de-arroyo already exists — just delete the old san-matias record
    const sanMatiasExists = existing.some((p) => p.id === "san-matias");
    const jardinesExists = existing.some((p) => p.id === "jardines-de-arroyo");

    if (!sanMatiasExists) {
      console.log("ℹ️  No existe registro 'san-matias', nada que eliminar.");
    } else {
      await db.delete(project).where(eq(project.id, "san-matias"));
      console.log("🗑️  Registro 'san-matias' eliminado.");
    }

    if (jardinesExists) {
      // Ensure the name is correct on the existing record
      await db
        .update(project)
        .set({ name: "Jardines de Arroyo" })
        .where(eq(project.id, "jardines-de-arroyo"));
      console.log("✅ Registro 'jardines-de-arroyo' confirmado con nombre correcto.");
    }

    console.log("\n✅ Listo.");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
  process.exit(0);
}

updateSanMatiasToJardinesDeArroyo();
