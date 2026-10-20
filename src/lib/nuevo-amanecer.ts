// Datos del plano de Nuevo Amanecer (Guernica), tomados del plano CAD
// "TERRENO AL LADO QUINTA SAN ANTONIO". Medidas en metros.
//
// Cada manzana tiene 16 lotes: 4 sobre la calle superior, 8 lotes profundos
// (4 filas x 2) que dan a las calles laterales y 4 sobre la calle inferior.

export const NUEVO_AMANECER_PROJECT_ID = "nuevo-amanecer";

type ManzanaSpec = {
  numero: number;
  /** Lotes de esquina/cabecera: frente sobre calle superior e inferior. */
  cabecera: { frente: number; fondo: number; superficie: number };
  /** Lotes profundos: frente sobre calle lateral. */
  profundo: { frente: number; fondo: number; superficie: number };
  /** Separación (calle) hasta la manzana siguiente. */
  calleSiguiente: number;
};

const manzanaSpecs: ManzanaSpec[] = [
  {
    numero: 1,
    cabecera: { frente: 20.97, fondo: 29.01, superficie: 607 },
    profundo: { frente: 20.16, fondo: 41.88, superficie: 846 },
    calleSiguiente: 9.24,
  },
  {
    numero: 2,
    cabecera: { frente: 20.97, fondo: 28.86, superficie: 605 },
    profundo: { frente: 20.17, fondo: 41.88, superficie: 844 },
    calleSiguiente: 11.16,
  },
  {
    numero: 3,
    cabecera: { frente: 21.52, fondo: 28.01, superficie: 602 },
    profundo: { frente: 20.49, fondo: 43.03, superficie: 882 },
    calleSiguiente: 14.13,
  },
  {
    numero: 4,
    cabecera: { frente: 21.38, fondo: 28.3, superficie: 604 },
    profundo: { frente: 20.39, fondo: 42.75, superficie: 871 },
    calleSiguiente: 9.25,
  },
  {
    numero: 5,
    cabecera: { frente: 22.0, fondo: 27.5, superficie: 605 },
    profundo: { frente: 20.69, fondo: 44.0, superficie: 910 },
    calleSiguiente: 0,
  },
];

export type NuevoAmanecerLote = {
  manzana: string;
  numero: string;
  tipo: "cabecera" | "profundo";
  superficie: number;
  frente: number;
  fondo: number;
  /** Rectángulo en metros, relativo al borde superior izquierdo del loteo. */
  x: number;
  y: number;
  width: number;
  height: number;
};

export type NuevoAmanecerManzana = {
  numero: string;
  x: number;
  y: number;
  width: number;
  height: number;
  lotes: NuevoAmanecerLote[];
};

function buildManzanas(): NuevoAmanecerManzana[] {
  let cursorX = 0;

  return manzanaSpecs.map((spec) => {
    const { cabecera, profundo } = spec;
    const width = cabecera.frente * 4;
    const height = cabecera.fondo * 2 + profundo.frente * 4;
    const manzana = String(spec.numero);
    const lotes: NuevoAmanecerLote[] = [];
    let numero = 1;

    const pushLote = (
      tipo: NuevoAmanecerLote["tipo"],
      x: number,
      y: number,
      w: number,
      h: number
    ) => {
      const medidas = tipo === "cabecera" ? cabecera : profundo;
      lotes.push({
        manzana,
        numero: String(numero++),
        tipo,
        superficie: medidas.superficie,
        frente: medidas.frente,
        fondo: medidas.fondo,
        x: cursorX + x,
        y,
        width: w,
        height: h,
      });
    };

    // Fila superior: lotes 1 a 4, de izquierda a derecha.
    for (let i = 0; i < 4; i++) {
      pushLote("cabecera", i * cabecera.frente, 0, cabecera.frente, cabecera.fondo);
    }
    // Centro: lotes 5 a 12, de a pares (izquierda, derecha) hacia abajo.
    for (let row = 0; row < 4; row++) {
      const y = cabecera.fondo + row * profundo.frente;
      pushLote("profundo", 0, y, width / 2, profundo.frente);
      pushLote("profundo", width / 2, y, width / 2, profundo.frente);
    }
    // Fila inferior: lotes 13 a 16, de izquierda a derecha.
    for (let i = 0; i < 4; i++) {
      pushLote(
        "cabecera",
        i * cabecera.frente,
        height - cabecera.fondo,
        cabecera.frente,
        cabecera.fondo
      );
    }

    const result = { numero: manzana, x: cursorX, y: 0, width, height, lotes };
    cursorX += width + spec.calleSiguiente;
    return result;
  });
}

export const nuevoAmanecerManzanas = buildManzanas();

export const nuevoAmanecerLotes = nuevoAmanecerManzanas.flatMap(
  (manzana) => manzana.lotes
);

export const nuevoAmanecerBounds = {
  width: Math.max(...nuevoAmanecerManzanas.map((m) => m.x + m.width)),
  height: Math.max(...nuevoAmanecerManzanas.map((m) => m.height)),
};

const superficies = nuevoAmanecerLotes.map((lote) => lote.superficie);

export const nuevoAmanecerStats = {
  totalLotes: nuevoAmanecerLotes.length,
  totalManzanas: nuevoAmanecerManzanas.length,
  superficieMin: Math.min(...superficies),
  superficieMax: Math.max(...superficies),
  superficieLoteada: superficies.reduce((total, value) => total + value, 0),
};

export function nuevoAmanecerLoteKey(manzana: string, numero: string) {
  return `${manzana}-${numero}`;
}
