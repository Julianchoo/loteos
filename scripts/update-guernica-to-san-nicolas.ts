import { db } from "../src/lib/db";
import { project } from "../src/lib/schema";
import { eq } from "drizzle-orm";

async function updateGuernicaToSanNicolas() {
  try {
    // Update the existing guernica project
    await db
      .update(project)
      .set({
        id: "san-nicolas",
        name: "San Nicolás",
        location: "Guernica, Buenos Aires",
      })
      .where(eq(project.id, "guernica"));

    console.log("✅ Proyecto actualizado exitosamente en PostgreSQL");
    console.log("   ID: guernica → san-nicolas");
    console.log("   Nombre: Guernica → San Nicolás");
    console.log("   Ubicación: Guernica, Buenos Aires (mantenida)");
  } catch (error) {
    console.error("❌ Error:", error);
    console.log("\n💡 Si el proyecto 'guernica' no existe, ejecuta:");
    console.log("   pnpm tsx scripts/insert-san-nicolas.ts");
    process.exit(1);
  }
  process.exit(0);
}

updateGuernicaToSanNicolas();
