import { db } from "@/lib/db";
import { legacyLotPrice, legacyLotSize } from "@/lib/lotes";
import {
  NUEVO_AMANECER_PROJECT_ID,
  nuevoAmanecerLotes,
  nuevoAmanecerStats,
} from "@/lib/nuevo-amanecer";
import { lot, project } from "@/lib/schema";

/**
 * Crea el proyecto Nuevo Amanecer y sus lotes del plano. Idempotente: no pisa
 * proyecto ni lotes existentes (estado, precios y visibilidad los maneja el admin/CRM).
 */
export async function seedNuevoAmanecer({ isVisible }: { isVisible: boolean }) {
  await db
    .insert(project)
    .values({
      id: NUEVO_AMANECER_PROJECT_ID,
      name: "Nuevo Amanecer",
      description: `Loteo de ${nuevoAmanecerStats.totalLotes} lotes de ${nuevoAmanecerStats.superficieMin} a ${nuevoAmanecerStats.superficieMax} m² en Guernica, al lado de la Finca San Antonio.`,
      location: "Guernica, Partido de Presidente Perón, Provincia de Buenos Aires",
      totalLots: String(nuevoAmanecerStats.totalLotes),
      isVisible,
    })
    .onConflictDoNothing({ target: project.id });

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

  return { lotesCreados: inserted.length };
}
