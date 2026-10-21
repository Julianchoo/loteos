export const MIN_ANTICIPO_PCT = 19;
export const ANTICIPO_STEP_USD = 100;
// Condiciones que ve el público en el plano; el comercial puede moverlas.
export const TASA_PUBLICA = 1;
export const PLAZO_MAX_PUBLICO = 60;

export function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateInstallment(saldo: number, tasaMensual: number, plazo: number) {
  const safePlazo = Math.max(plazo, 1);
  return roundCurrency(
    (saldo * (1 + (tasaMensual / 100) * safePlazo)) / safePlazo
  );
}

export function getMinimumAnticipoUsd(precioLista: number, anticipoMinimoPct = MIN_ANTICIPO_PCT) {
  const minimum = (Math.max(precioLista, 0) * anticipoMinimoPct) / 100;
  return Math.ceil(minimum / ANTICIPO_STEP_USD) * ANTICIPO_STEP_USD;
}

// Condiciones de un lote: las que tenga cargadas o, si no, las generales.
export function condicionesLote(lote: {
  anticipoMinimoPct?: string | number | null;
  plazoMaximo?: number | null;
}) {
  const pct = lote.anticipoMinimoPct;
  return {
    anticipoMinimoPct:
      pct !== null && pct !== undefined && pct !== "" && Number.isFinite(Number(pct))
        ? Number(pct)
        : MIN_ANTICIPO_PCT,
    plazoMaximo: lote.plazoMaximo ?? PLAZO_MAX_PUBLICO,
  };
}

export function formatUsd(value: number): string {
  return `USD ${value.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
