import { db } from "../src/lib/db";
import { legacyLotPrice, legacyLotSize } from "../src/lib/lotes";
import {
  NUEVO_AMANECER_PROJECT_ID,
  nuevoAmanecerLotes,
  nuevoAmanecerStats,
} from "../src/lib/nuevo-amanecer";
import { lot, project } from "../src/lib/schema";

const projectData = {
  name: "Nuevo Amanecer",
  description: `Loteo de ${nuevoAmanecerStats.totalLotes} lotes de ${nuevoAmanecerStats.superficieMin} a ${nuevoAmanecerStats.superficieMax} m² en Guernica, al lado de la Finca San Antonio.`,
  location: "Guernica, Partido de Presidente Perón, Provincia de Buenos Aires",
  totalArea: null,
  totalLots: String(nuevoAmanecerStats.totalLotes),
};

async function upsertNuevoAmanecer() {
  // Se crea oculto: hacerlo visible desde /admin cuando esté listo para publicar.
  await db
    .insert(project)
    .values({
      id: NUEVO_AMANECER_PROJECT_ID,
      ...projectData,
      isVisible: false,
      basePrice: null,
      minCashDown: null,
      maxFinancingMonths: null,
      tna: null,
      airtableRecordId: null,
      lastSyncedAt: null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: project.id,
      set: { ...projectData, updatedAt: new Date() },
    });

  // Los lotes existentes no se tocan (estado y precios los maneja el CRM).
  const inserted = await db
    .insert(lot)
    .values(
      nuevoAmanecerLotes.map((lote) => {
        const superficieM2 = String(lote.superficie);
        return {
          id: `${NUEVO_AMANECER_PROJECT_ID}-m${lote.manzana}-l${lote.numero}`,
          projectId: NUEVO_AMANECER_PROJECT_ID,
          number: lote.numero,
          manzana: lote.manzana,
          superficieM2,
          metrosFrente: String(lote.frente),
          metrosFondo: String(lote.fondo),
          size: legacyLotSize(superficieM2),
          price: legacyLotPrice(null),
        };
      })
    )
    .onConflictDoNothing({ target: lot.id })
    .returning({ id: lot.id });

  console.log(
    `Proyecto ${NUEVO_AMANECER_PROJECT_ID} creado/actualizado. Lotes nuevos: ${inserted.length}/${nuevoAmanecerLotes.length}.`
  );
}

upsertNuevoAmanecer()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error al crear/actualizar Nuevo Amanecer:", error);
    process.exit(1);
  });
