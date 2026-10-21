import { NextResponse } from "next/server";
import { and, desc, eq, gte, inArray, lt } from "drizzle-orm";
import { requireApiAdmin, isErrorResponse } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { auditLog, contratos, cuotas, lead, lot, pagos, project, reservas } from "@/lib/schema";

const PAGE_SIZE = 100;
const ENTIDADES = ["lote", "reserva", "lead", "contrato", "cuota", "pago"] as const;

function isDateKey(value: string | null): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

export async function GET(request: Request) {
  const authResult = await requireApiAdmin();
  if (isErrorResponse(authResult)) return authResult;

  const { searchParams } = new URL(request.url);
  const entidad = searchParams.get("entidad");
  const entidadId = searchParams.get("entidadId")?.trim();
  const usuario = searchParams.get("usuario");
  const desde = searchParams.get("desde");
  const hasta = searchParams.get("hasta");
  const offset = Math.max(Number(searchParams.get("offset")) || 0, 0);

  const conditions = [];
  if (entidad && (ENTIDADES as readonly string[]).includes(entidad)) {
    conditions.push(eq(auditLog.entidad, entidad as (typeof ENTIDADES)[number]));
  }
  if (entidadId) conditions.push(eq(auditLog.entidadId, entidadId));
  if (usuario) conditions.push(eq(auditLog.usuario, usuario));
  if (isDateKey(desde)) conditions.push(gte(auditLog.createdAt, new Date(`${desde}T00:00:00`)));
  if (isDateKey(hasta)) {
    const end = new Date(`${hasta}T00:00:00`);
    end.setDate(end.getDate() + 1);
    conditions.push(lt(auditLog.createdAt, end));
  }

  const rows = await db
    .select()
    .from(auditLog)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(auditLog.createdAt), desc(auditLog.id))
    .limit(PAGE_SIZE + 1)
    .offset(offset);
  const page = rows.slice(0, PAGE_SIZE);

  // Nombres legibles para cada entidad (lote N, reserva #id del lote N, nombre del lead).
  const idsOf = (tipo: (typeof ENTIDADES)[number]) =>
    [...new Set(page.filter((row) => row.entidad === tipo).map((row) => row.entidadId))];
  const loteIds = idsOf("lote");
  const reservaIds = idsOf("reserva");
  const leadIds = idsOf("lead");
  const [loteRows, reservaRows, leadRows, usuarioRows] = await Promise.all([
    loteIds.length
      ? db
          .select({ id: lot.id, numero: lot.number, proyecto: project.name })
          .from(lot)
          .innerJoin(project, eq(lot.projectId, project.id))
          .where(inArray(lot.id, loteIds))
      : [],
    reservaIds.length
      ? db
          .select({ id: reservas.id, loteNumero: lot.number, comprador: reservas.nombreComprador })
          .from(reservas)
          .innerJoin(lot, eq(reservas.lotId, lot.id))
          .where(inArray(reservas.id, reservaIds))
      : [],
    leadIds.length
      ? db
          .select({ id: lead.id, firstName: lead.firstName, lastName: lead.lastName })
          .from(lead)
          .where(inArray(lead.id, leadIds))
      : [],
    db.selectDistinct({ usuario: auditLog.usuario }).from(auditLog).orderBy(auditLog.usuario),
  ]);
  const lotes = new Map(loteRows.map((row) => [row.id, `Lote ${row.numero} · ${row.proyecto}`]));
  const reservasMap = new Map(
    reservaRows.map((row) => [
      row.id,
      `Reserva #${row.id.slice(0, 8)} · Lote ${row.loteNumero}${row.comprador ? ` · ${row.comprador}` : ""}`,
    ])
  );
  const leadsMap = new Map(leadRows.map((row) => [row.id, `${row.firstName} ${row.lastName}`.trim()]));

  // Pagos, cuotas y cuentas corrientes se muestran con el lote y enlazan a la cuenta corriente.
  // Un pago borrado ya no está en la tabla: su contrato sale de lo guardado en el log.
  const pagoIds = idsOf("pago");
  const cuotaIds = idsOf("cuota");
  const [pagoRows, cuotaRows] = await Promise.all([
    pagoIds.length
      ? db.select({ id: pagos.id, contratoId: pagos.contratoId }).from(pagos).where(inArray(pagos.id, pagoIds))
      : [],
    cuotaIds.length
      ? db
          .select({ id: cuotas.id, contratoId: cuotas.contratoId, numero: cuotas.numero })
          .from(cuotas)
          .where(inArray(cuotas.id, cuotaIds))
      : [],
  ]);
  const pagoContrato = new Map(pagoRows.map((row) => [row.id, row.contratoId]));
  const cuotasMap = new Map(cuotaRows.map((row) => [row.id, row]));
  function contratoIdOf(row: (typeof page)[number]) {
    if (row.entidad === "contrato") return row.entidadId;
    if (row.entidad === "cuota") return cuotasMap.get(row.entidadId)?.contratoId;
    if (row.entidad !== "pago") return undefined;
    const logged = row.cambios.contratoId?.despues ?? row.cambios.contratoId?.antes;
    return pagoContrato.get(row.entidadId) ?? (typeof logged === "string" ? logged : undefined);
  }
  const contratoIds = [
    ...new Set(page.map(contratoIdOf).filter((id): id is string => id !== undefined)),
  ];
  const contratoRows = contratoIds.length
    ? await db
        .select({
          id: contratos.id,
          reservaId: contratos.reservaId,
          loteNumero: lot.number,
          comprador: reservas.nombreComprador,
        })
        .from(contratos)
        .innerJoin(reservas, eq(contratos.reservaId, reservas.id))
        .innerJoin(lot, eq(reservas.lotId, lot.id))
        .where(inArray(contratos.id, contratoIds))
    : [];
  const contratosMap = new Map(contratoRows.map((row) => [row.id, row]));
  const entidadNombre = { contrato: "Cuenta corriente", cuota: "Cuota", pago: "Pago" } as const;

  return NextResponse.json({
    rows: page.map((row) => {
      if (row.entidad === "contrato" || row.entidad === "cuota" || row.entidad === "pago") {
        const contratoId = contratoIdOf(row);
        const contrato = contratoId !== undefined ? contratosMap.get(contratoId) : undefined;
        const numeroCuota = row.entidad === "cuota" ? cuotasMap.get(row.entidadId)?.numero : undefined;
        const nombre =
          numeroCuota !== undefined
            ? `Cuota ${numeroCuota}`
            : `${entidadNombre[row.entidad]} #${row.entidadId.slice(0, 8)}`;
        return {
          ...row,
          label: contrato
            ? `${nombre} · Lote ${contrato.loteNumero}${contrato.comprador ? ` · ${contrato.comprador}` : ""}`
            : nombre,
          reservaId: contrato?.reservaId ?? null,
        };
      }
      const nombreBorrado = [row.cambios.firstName?.antes, row.cambios.lastName?.antes]
        .filter((part) => typeof part === "string")
        .join(" ");
      const label =
        row.entidad === "lote"
          ? lotes.get(row.entidadId)
          : row.entidad === "reserva"
            ? reservasMap.get(row.entidadId)
            : leadsMap.get(row.entidadId) ?? (nombreBorrado || undefined);
      return { ...row, label: label ?? `${row.entidad} #${row.entidadId.slice(0, 8)}`, reservaId: null };
    }),
    hasMore: rows.length > PAGE_SIZE,
    usuarios: usuarioRows.map((row) => row.usuario),
  });
}
