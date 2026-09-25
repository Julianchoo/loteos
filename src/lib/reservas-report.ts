import { and, eq, gte, ilike, inArray, lte, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { flattenLoteReserva } from "@/lib/reservas";
import { lead, lot, project, reservas } from "@/lib/schema";
import type { EstadoReserva, LoteConReserva } from "@/lib/schema";

export type ReservaReportRow = Omit<LoteConReserva, "id" | "estado"> & {
  id: string;
  estado: EstadoReserva;
  lotId: string;
  loteEstado: LoteConReserva["estado"];
  loteNumero: string;
  reservaEstado: EstadoReserva;
  reservaCreatedAt: Date;
  reservaUpdatedAt: Date;
};

function isDateKey(value: string | null) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function getValues(searchParams: URLSearchParams, key: string) {
  return searchParams
    .getAll(key)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function getFilteredReservas(searchParams: URLSearchParams): Promise<ReservaReportRow[]> {
  const estados = getValues(searchParams, "estado") as EstadoReserva[];
  const reservadoPor = getValues(searchParams, "reservadoPor");
  const projectId = searchParams.get("projectId");
  const search = searchParams.get("search");
  const formaPago = searchParams.get("formaPago");
  const fechaReservaDesde = searchParams.get("fechaReservaDesde");
  const fechaReservaHasta = searchParams.get("fechaReservaHasta");
  const fechaVencimientoDesde = searchParams.get("fechaVencimientoDesde");
  const fechaVencimientoHasta = searchParams.get("fechaVencimientoHasta");
  const fechaFirmaDesde = searchParams.get("fechaFirmaDesde");
  const fechaFirmaHasta = searchParams.get("fechaFirmaHasta");

  const conditions = [];
  if (estados.length > 0) conditions.push(inArray(reservas.estado, estados));
  if (reservadoPor.length > 0) conditions.push(inArray(reservas.reservadoPor, reservadoPor));
  if (projectId) conditions.push(eq(lot.projectId, projectId));
  if (formaPago) conditions.push(ilike(reservas.formaPago, `%${formaPago}%`));
  if (isDateKey(fechaReservaDesde)) {
    conditions.push(gte(reservas.fechaReserva, fechaReservaDesde!));
  }
  if (isDateKey(fechaReservaHasta)) {
    conditions.push(lte(reservas.fechaReserva, fechaReservaHasta!));
  }
  if (isDateKey(fechaVencimientoDesde)) {
    conditions.push(gte(reservas.fechaVencimiento, fechaVencimientoDesde!));
  }
  if (isDateKey(fechaVencimientoHasta)) {
    conditions.push(lte(reservas.fechaVencimiento, fechaVencimientoHasta!));
  }
  if (isDateKey(fechaFirmaDesde)) {
    conditions.push(gte(reservas.fechaFirma, fechaFirmaDesde!));
  }
  if (isDateKey(fechaFirmaHasta)) {
    conditions.push(lte(reservas.fechaFirma, fechaFirmaHasta!));
  }
  if (search) {
    conditions.push(
      or(
        ilike(reservas.nombreComprador, `%${search}%`),
        ilike(reservas.dniCuit, `%${search}%`),
        ilike(lead.firstName, `%${search}%`),
        ilike(lead.lastName, `%${search}%`),
        ilike(lead.dniCuit, `%${search}%`),
        ilike(lot.manzana, `%${search}%`),
        ilike(lot.parcela, `%${search}%`),
        ilike(lot.number, `%${search}%`)
      )
    );
  }

  const rows = await db
    .select({ lote: lot, reserva: reservas, lead, projectName: project.name })
    .from(reservas)
    .innerJoin(lot, eq(reservas.lotId, lot.id))
    .innerJoin(project, eq(lot.projectId, project.id))
    .leftJoin(lead, eq(reservas.leadId, lead.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(reservas.fechaReserva, reservas.createdAt);

  return rows.map((row) => ({
    ...flattenLoteReserva(row.lote, row.reserva, row.lead, row.projectName),
    id: row.reserva.id,
    lotId: row.lote.id,
    loteEstado: row.lote.estado,
    loteNumero: row.lote.number,
    estado: row.reserva.estado,
    reservaEstado: row.reserva.estado,
    reservaCreatedAt: row.reserva.createdAt,
    reservaUpdatedAt: row.reserva.updatedAt,
  }));
}
