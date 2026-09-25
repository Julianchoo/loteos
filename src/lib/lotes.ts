import { sql } from "drizzle-orm";
import { lot } from "@/lib/schema";
import type { EstadoLote, Lot } from "@/lib/schema";

/** Legacy `lot.status` values understood by the public lot map. */
function legacyLotStatus(estado: EstadoLote) {
  if (estado === "reservado") return "reserved";
  if (estado === "disponible") return "available";
  return "sold";
}

/** Values to write when a lot's CRM estado changes (keeps legacy status in sync). */
export function estadoLoteValues(estado: EstadoLote) {
  return { estado, status: legacyLotStatus(estado) };
}

/**
 * Legacy `lot.size` / `lot.price` text columns are NOT NULL and read by the public
 * map; they are derived from the CRM numeric fields whenever those change.
 */
export function legacyLotSize(superficieM2: string | null | undefined) {
  return superficieM2 ? `${superficieM2}m2` : "";
}

export function legacyLotPrice(precioBase: string | null | undefined) {
  return precioBase ?? "";
}

/** Orders lots by manzana, then by lot number numerically ("2" before "10"). */
export const lotOrder = [
  lot.manzana,
  sql`nullif(regexp_replace(${lot.number}, '[^0-9]', '', 'g'), '')::int`,
  lot.number,
];

/** Short "M{manzana}-L{lote}" label; falls back to the lot number when there's no catastral parcela. */
export function loteLabel(value: Pick<Lot, "manzana" | "parcela" | "number">) {
  const loteNumero = value.parcela || value.number;
  return value.manzana ? `M${value.manzana}-L${loteNumero}` : `Lote ${loteNumero}`;
}
