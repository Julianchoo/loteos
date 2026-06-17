import { db } from "../src/lib/db";
import { project } from "../src/lib/schema";

async function upsertGeneralRodriguez() {
  await db
    .insert(project)
    .values({
      id: "general-rodriguez",
      name: "General Rodríguez",
      description:
        "Proyecto de 450 lotes en General Rodríguez, frente a Barrio Bicentenario.",
      location:
        "C. Cam. A Navarro, B1748 Gral. Rodríguez, Provincia de Buenos Aires",
      totalArea: null,
      totalLots: "450",
      basePrice: null,
      minCashDown: null,
      maxFinancingMonths: 60,
      tna: null,
      airtableRecordId: null,
      lastSyncedAt: null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: project.id,
      set: {
        name: "General Rodríguez",
        description:
          "Proyecto de 450 lotes en General Rodríguez, frente a Barrio Bicentenario.",
        location:
          "C. Cam. A Navarro, B1748 Gral. Rodríguez, Provincia de Buenos Aires",
        totalArea: null,
        totalLots: "450",
        basePrice: null,
        minCashDown: null,
        maxFinancingMonths: 60,
        tna: null,
        updatedAt: new Date(),
      },
    });

  console.log("Proyecto general-rodriguez creado/actualizado.");
}

upsertGeneralRodriguez().catch((error) => {
  console.error("Error al crear/actualizar General Rodríguez:", error);
  process.exit(1);
});
