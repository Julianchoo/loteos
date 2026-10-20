import { NUEVO_AMANECER_PROJECT_ID, nuevoAmanecerLotes } from "../src/lib/nuevo-amanecer";
import { seedNuevoAmanecer } from "../src/lib/nuevo-amanecer-seed";

seedNuevoAmanecer({ isVisible: true })
  .then(({ lotesCreados }) => {
    console.log(
      `Proyecto ${NUEVO_AMANECER_PROJECT_ID} listo. Lotes nuevos: ${lotesCreados}/${nuevoAmanecerLotes.length}.`
    );
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error al crear Nuevo Amanecer:", error);
    process.exit(1);
  });
