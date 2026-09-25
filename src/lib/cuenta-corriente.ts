import { and, asc, eq, inArray, isNull, ne, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { leadNombre } from "@/lib/reservas";
import { contratos, cuotas, indicesCac, lead, lot, pagos, project, reservas } from "@/lib/schema";
import type {
  Contrato,
  Cuota,
  EstadoCuota,
  IndiceCac,
  ModalidadContrato,
  MonedaPago,
  Pago,
  Reserva,
  TipoCambio,
} from "@/lib/schema";
import {
  argentinaTodayKey,
  ensureCurrentBnaRate,
  listTiposCambioBna,
} from "@/lib/tipos-cambio";

export type CuentaCorrienteSummary = {
  contratoId: string | null;
  reservaId: string;
  lotId: string;
  projectId: string;
  projectName: string;
  loteNumero: string;
  manzana: string | null;
  parcela: string | null;
  comprador: string | null;
  dniCuit: string | null;
  telefono: string | null;
  email: string | null;
  reservadoPor: string | null;
  modalidad: ModalidadContrato;
  requiereRevision: boolean;
  totalVencido: number;
  saldoPendiente: number;
  cuotasPendientes: number;
  cuotasVencidas: number;
  cuotasPendienteIndice: number;
  cuotasProyectadas: number;
  proximoVencimiento: string | null;
  proximaCuotaMonto: number | null;
  moneda: MonedaPago;
  cuentaEstado: "creada" | "pendiente";
  mensajeCuotas: string;
  valorLoteUsd: number | null;
  valorFinanciadoUsd: number | null;
  cantidadCuotasContrato: number | null;
  cuotaBaseUsd: number | null;
  cuotaBaseArs: number | null;
  indiceBase: string | null;
  valorIndiceBase: number | null;
  indiceActual: string | null;
  valorIndiceActual: number | null;
  cuotaActualUsd: number | null;
  cuotaActualArs: number | null;
};

type MensajeCuentaCorrienteInput = Pick<
  CuentaCorrienteSummary,
  "comprador" | "manzana" | "parcela" | "loteNumero" | "modalidad"
> & {
  contrato: Pick<Contrato, "indiceBaseCac">;
  cuotas: Cuota[];
  tipoCambioActual: number | null;
  fechaTipoCambioActual: string | null;
};

export type CuentaCorrienteDetail = CuentaCorrienteSummary & {
  contrato: Contrato;
  reserva: Reserva;
  cuotas: Cuota[];
  pagos: Pago[];
  indices: IndiceCac[];
  totalCobradoUsd: number | null;
  totalFuturoUsd: number | null;
  anticipoCobradoUsd: number;
  tipoCambioActual: number | null;
  fechaTipoCambioActual: string | null;
  fechasPagoSinTipoCambio: string[];
};

export type CuotasDashboard = {
  cuentasTotales: number;
  cuentasAlDia: number;
  cuentasConDeudaVencida: number;
  cuentasPendientesCreacion: number;
  proximoMes: string;
  cuotasProximoMes: number;
  montoProximoMesUsd: number | null;
  cuotasTotalesACobrar: number;
  montoTotalACobrarUsd: number | null;
  tipoCambioBna: number | null;
  fechaTipoCambioBna: string | null;
};

export type CreateContratoInput = {
  modalidad: Exclude<ModalidadContrato, "requiere_revision">;
  fechaInicio?: string | null | undefined;
  fechaPrimerVencimiento?: string | null | undefined;
  cantidadCuotas?: number | null | undefined;
  cuotaBase?: number | null | undefined;
  saldoInicial?: number | null | undefined;
  tipoCambioBna?: number | null | undefined;
  diaVencimiento?: number | null | undefined;
  periodoBaseCac?: string | null | undefined;
  observaciones?: string | null | undefined;
};

const FINAL_CUOTA_STATES: EstadoCuota[] = ["pagada", "cancelada"];

function toNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function moneyString(value: number) {
  return String(Math.max(0, Math.round(value * 100) / 100));
}

function todayKey() {
  return argentinaTodayKey();
}

function periodFromDate(value: string) {
  return value.slice(0, 7);
}

function addMonthsToPeriod(period: string, monthsToAdd: number) {
  const [year, month] = period.split("-").map(Number);
  const date = new Date(Date.UTC(year ?? 2000, (month ?? 1) - 1 + monthsToAdd, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function cacPeriodForDueDate(fechaVencimiento: string) {
  return addMonthsToPeriod(periodFromDate(fechaVencimiento), -2);
}

function parseDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year ?? 2000, (month ?? 1) - 1, day ?? 1));
}

function formatDateKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

function addMonthsOnDay(start: string, monthsToAdd: number, preferredDay: number) {
  const startDate = parseDateKey(start);
  const year = startDate.getUTCFullYear();
  const month = startDate.getUTCMonth() + monthsToAdd;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const day = Math.min(Math.max(preferredDay, 1), lastDay);
  return formatDateKey(new Date(Date.UTC(year, month, day)));
}

function sumActivePayments(items: Pago[]) {
  return items
    .filter((pago) => pago.estado === "activo")
    .reduce((total, pago) => total + (toNumber(pago.monto) ?? 0), 0);
}

function statusForCuota(
  fechaVencimiento: string,
  saldo: number,
  paid: number,
  amountKind: "real" | "projected" | "missing",
  currentEstado: EstadoCuota
): EstadoCuota {
  if (currentEstado === "cancelada") return "cancelada";
  if (saldo <= 0) return "pagada";
  const isOverdue = fechaVencimiento < todayKey();
  if (amountKind === "missing") return "pendiente_indice";
  if (isOverdue && paid > 0) return "parcial_vencida";
  if (isOverdue) return "vencida";
  return amountKind === "projected" ? "proyectada" : "calculada";
}

function latestKnownCacIndex(indexRows: IndiceCac[]) {
  const sorted = [...indexRows].sort((a, b) => b.periodo.localeCompare(a.periodo));
  const latest = sorted.find((item) => {
    const value = toNumber(item.valor);
    return value !== null && value > 0;
  });
  const value = latest ? toNumber(latest.valor) : null;
  return latest && value !== null ? { periodo: latest.periodo, valor: value } : null;
}

function computeCuotaAmount(
  contrato: Contrato,
  cuota: Cuota,
  indicesByPeriodo: Map<string, number>,
  latestIndex: { periodo: string; valor: number } | null
) {
  const base = toNumber(cuota.importeBase) ?? 0;
  if (contrato.modalidad !== "pesos_cac") {
    return { amount: base, indiceCac: null, amountKind: "real" as const };
  }

  const basePeriod = contrato.periodoBaseCac;
  const cuotaPeriod = cacPeriodForDueDate(cuota.fechaVencimiento);
  const baseIndex =
    toNumber(contrato.indiceBaseCac) ?? (basePeriod ? indicesByPeriodo.get(basePeriod) : undefined);
  const cuotaIndex = indicesByPeriodo.get(cuotaPeriod);
  if (!baseIndex || baseIndex <= 0) {
    return { amount: null, indiceCac: null, amountKind: "missing" as const };
  }
  if (cuotaIndex && cuotaIndex > 0) {
    return {
      amount: base * (cuotaIndex / baseIndex),
      indiceCac: cuotaIndex,
      amountKind: "real" as const,
    };
  }
  if (cuota.fechaVencimiento >= todayKey() && latestIndex) {
    return {
      amount: base * (latestIndex.valor / baseIndex),
      indiceCac: latestIndex.valor,
      amountKind: "projected" as const,
    };
  }

  return { amount: null, indiceCac: null, amountKind: "missing" as const };
}

export async function recomputeContratoCuotas(contratoId: string) {
  const [contrato] = await db.select().from(contratos).where(eq(contratos.id, contratoId));
  if (!contrato) return;

  const [cuotaRows, pagoRows, indexRows] = await Promise.all([
    db.select().from(cuotas).where(eq(cuotas.contratoId, contratoId)).orderBy(asc(cuotas.numero)),
    db.select().from(pagos).where(eq(pagos.contratoId, contratoId)),
    db.select().from(indicesCac),
  ]);
  const indicesByPeriodo = new Map(
    indexRows.map((item) => [item.periodo, toNumber(item.valor) ?? 0])
  );
  const latestIndex = latestKnownCacIndex(indexRows);

  for (const cuota of cuotaRows) {
    if (cuota.estado === "cancelada") continue;
    const cuotaPagos = pagoRows.filter((pago) => pago.cuotaId === cuota.id);
    const paid = sumActivePayments(cuotaPagos);
    const computed = computeCuotaAmount(contrato, cuota, indicesByPeriodo, latestIndex);
    const saldo =
      computed.amount === null
        ? (toNumber(cuota.saldo) ?? 0)
        : Math.round((computed.amount - paid) * 100) / 100;
    const nextEstado = statusForCuota(
      cuota.fechaVencimiento,
      Math.max(saldo, 0),
      paid,
      computed.amountKind,
      cuota.estado
    );

    await db
      .update(cuotas)
      .set({
        periodoCac:
          contrato.modalidad === "pesos_cac" ? cacPeriodForDueDate(cuota.fechaVencimiento) : null,
        indiceCac: computed.indiceCac === null ? null : moneyString(computed.indiceCac),
        importeAjustado: computed.amount === null ? null : moneyString(computed.amount),
        saldo: moneyString(saldo),
        estado: nextEstado,
        updatedAt: new Date(),
      })
      .where(eq(cuotas.id, cuota.id));
  }
}

export async function recomputeAllPesosCacCuotas() {
  const rows = await db
    .select({ id: contratos.id })
    .from(contratos)
    .where(eq(contratos.modalidad, "pesos_cac"));

  for (const row of rows) {
    await recomputeContratoCuotas(row.id);
  }
}

export async function createContratoForReserva(
  reservaId: string,
  input: CreateContratoInput,
  userEmail: string
) {
  const [reserva] = await db.select().from(reservas).where(eq(reservas.id, reservaId));
  if (!reserva) return { kind: "not-found" as const };
  if (reserva.estado !== "realizada") return { kind: "not-realizada" as const };

  const [existing] = await db
    .select({ id: contratos.id })
    .from(contratos)
    .where(eq(contratos.reservaId, reservaId));
  if (existing) return { kind: "exists" as const, contratoId: existing.id };

  const cantidadCuotas = input.cantidadCuotas ?? toNumber(reserva.cantidadCuotas);
  const cuotaBaseUsd = input.cuotaBase ?? toNumber(reserva.cuotaMensual);
  const saldoInicialUsd = input.saldoInicial ?? toNumber(reserva.saldoNum);
  const fechaInicio = input.fechaInicio ?? reserva.fechaFirma ?? reserva.fechaReserva;

  if (!cantidadCuotas || !cuotaBaseUsd || !saldoInicialUsd || !fechaInicio) {
    return { kind: "missing-data" as const };
  }
  if (input.modalidad === "pesos_cac" && (!input.tipoCambioBna || input.tipoCambioBna <= 0)) {
    return { kind: "missing-exchange-rate" as const };
  }

  const diaVencimiento = 10;
  const fechaPrimerVencimiento = addMonthsOnDay(fechaInicio, 1, diaVencimiento);
  const periodoBaseCac =
    input.modalidad === "pesos_cac" ? (input.periodoBaseCac ?? periodFromDate(fechaInicio)) : null;
  let indiceBaseCac: number | null = null;
  if (input.modalidad === "pesos_cac") {
    const [baseIndexRow] = await db
      .select({ valor: indicesCac.valor })
      .from(indicesCac)
      .where(eq(indicesCac.periodo, periodoBaseCac!))
      .limit(1);
    indiceBaseCac = toNumber(baseIndexRow?.valor);
    if (!indiceBaseCac || indiceBaseCac <= 0) {
      return { kind: "missing-base-cac" as const };
    }
  }
  const monedaBase: MonedaPago = input.modalidad === "pesos_cac" ? "ars" : "usd";
  const conversionRate = input.modalidad === "pesos_cac" ? input.tipoCambioBna! : 1;
  const cuotaBase = cuotaBaseUsd * conversionRate;
  const saldoInicial = saldoInicialUsd * conversionRate;

  const result = await db.transaction(async (tx) => {
    const [contrato] = await tx
      .insert(contratos)
      .values({
        reservaId,
        modalidad: input.modalidad,
        fechaInicio,
        fechaPrimerVencimiento,
        cantidadCuotas,
        diaVencimiento,
        saldoInicial: moneyString(saldoInicial),
        cuotaBase: moneyString(cuotaBase),
        monedaBase,
        tipoCambioBna:
          input.modalidad === "pesos_cac" ? moneyString(conversionRate) : null,
        periodoBaseCac,
        indiceBaseCac: indiceBaseCac === null ? null : moneyString(indiceBaseCac),
        requiereRevision: false,
        observaciones: input.observaciones ?? null,
        creadoPor: userEmail,
      })
      .returning();
    if (!contrato) throw new Error("No se pudo crear el contrato");

    await tx
      .update(reservas)
      .set({
        formaPago: "financiado",
        modalidadContrato: input.modalidad,
        updatedAt: new Date(),
      })
      .where(eq(reservas.id, reservaId));

    const cuotaValues = Array.from({ length: cantidadCuotas }, (_, index) => {
      const fechaVencimiento = addMonthsOnDay(fechaPrimerVencimiento, index, diaVencimiento);
      return {
        contratoId: contrato.id,
        numero: index + 1,
        fechaVencimiento,
        periodoCac: input.modalidad === "pesos_cac" ? cacPeriodForDueDate(fechaVencimiento) : null,
        importeBase: moneyString(cuotaBase),
        importeAjustado: input.modalidad === "usd_fijo" ? moneyString(cuotaBase) : null,
        moneda: monedaBase,
        saldo: moneyString(cuotaBase),
        estado:
          input.modalidad === "pesos_cac" ? ("pendiente_indice" as const) : ("pendiente" as const),
      };
    });

    await tx.insert(cuotas).values(cuotaValues);
    return contrato;
  });

  if (!result) throw new Error("No se pudo crear el contrato");
  await recomputeContratoCuotas(result.id);
  return { kind: "ok" as const, contratoId: result.id };
}

export async function getCuentaCorrienteDetailByReserva(reservaId: string) {
  const [row] = await db
    .select({
      contrato: contratos,
      reserva: reservas,
      lote: lot,
      project,
      lead,
    })
    .from(contratos)
    .innerJoin(reservas, eq(contratos.reservaId, reservas.id))
    .innerJoin(lot, eq(reservas.lotId, lot.id))
    .innerJoin(project, eq(lot.projectId, project.id))
    .leftJoin(lead, eq(reservas.leadId, lead.id))
    .where(and(eq(contratos.reservaId, reservaId), eq(reservas.estado, "realizada")));

  if (!row) return null;

  const currentRate = await ensureCurrentBnaRate();
  const [cuotaRows, pagoRows, indexRows] = await Promise.all([
    db
      .select()
      .from(cuotas)
      .where(eq(cuotas.contratoId, row.contrato.id))
      .orderBy(asc(cuotas.numero)),
    db
      .select()
      .from(pagos)
      .where(eq(pagos.contratoId, row.contrato.id))
      .orderBy(asc(pagos.fechaPago), asc(pagos.id)),
    db.select().from(indicesCac).orderBy(asc(indicesCac.periodo)),
  ]);

  const summary = buildSummary(row, cuotaRows, currentRate);
  const activePayments = pagoRows.filter((pago) => pago.estado === "activo");
  const fechasPagoSinTipoCambio = Array.from(
    new Set(
      activePayments
        .filter((pago) => pago.moneda === "ars" && toNumber(pago.montoUsd) === null)
        .map((pago) => pago.fechaPago)
    )
  ).sort();
  const anticipoCobradoUsd = toNumber(row.reserva.anticipoNum) ?? 0;
  const pagosCobradosUsd = activePayments.reduce((total, pago) => {
    if (pago.moneda === "usd") return total + (toNumber(pago.monto) ?? 0);
    return total + (toNumber(pago.montoUsd) ?? 0);
  }, 0);
  const tipoCambioActual = toNumber(currentRate?.valor);
  const hasPendingArs = cuotaRows.some(
    (cuota) => !FINAL_CUOTA_STATES.includes(cuota.estado) && cuota.moneda === "ars"
  );
  const totalFuturoUsd =
    hasPendingArs && (!tipoCambioActual || tipoCambioActual <= 0)
      ? null
      : cuotaRows
          .filter((cuota) => !FINAL_CUOTA_STATES.includes(cuota.estado))
          .reduce((total, cuota) => {
            const saldo = toNumber(cuota.saldo) ?? 0;
            return total + (cuota.moneda === "ars" ? saldo / tipoCambioActual! : saldo);
          }, 0);
  return {
    ...summary,
    contrato: row.contrato,
    reserva: row.reserva,
    cuotas: cuotaRows,
    pagos: pagoRows,
    indices: indexRows,
    totalCobradoUsd:
      fechasPagoSinTipoCambio.length > 0 ? null : anticipoCobradoUsd + pagosCobradosUsd,
    totalFuturoUsd,
    anticipoCobradoUsd,
    tipoCambioActual,
    fechaTipoCambioActual: currentRate?.fecha ?? null,
    fechasPagoSinTipoCambio,
  };
}

export async function getCuentaCorrienteDetailByContrato(contratoId: string) {
  const [row] = await db
    .select({ reservaId: contratos.reservaId })
    .from(contratos)
    .where(eq(contratos.id, contratoId));
  if (!row) return null;
  return getCuentaCorrienteDetailByReserva(row.reservaId);
}

function formatDateLabel(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function formatPeriodLabel(value: string) {
  const [year, month] = value.split("-").map(Number);
  const monthLabel = new Intl.DateTimeFormat("es-AR", {
    month: "short",
    timeZone: "UTC",
  })
    .format(new Date(Date.UTC(year!, month! - 1, 1)))
    .replace(".", "");
  return `${monthLabel.charAt(0).toUpperCase()}${monthLabel.slice(1)}-${year}`;
}

export async function getCuotasDashboard(projectId?: string | null): Promise<CuotasDashboard> {
  const [allSummaries, currentRate] = await Promise.all([
    getCuentasCorrientesSummaries(),
    ensureCurrentBnaRate(),
  ]);
  const summaries = projectId
    ? allSummaries.filter((item) => item.projectId === projectId)
    : allSummaries;
  const createdAccounts = summaries.filter((item) => item.cuentaEstado === "creada");
  const tipoCambioBna = toNumber(currentRate?.valor);
  const nextPeriod = addMonthsToPeriod(todayKey().slice(0, 7), 1);
  const followingPeriod = addMonthsToPeriod(nextPeriod, 1);

  const installmentRows = await db
    .select({ cuota: cuotas })
    .from(cuotas)
    .innerJoin(contratos, eq(cuotas.contratoId, contratos.id))
    .innerJoin(reservas, eq(contratos.reservaId, reservas.id))
    .innerJoin(lot, eq(reservas.lotId, lot.id))
    .where(
      projectId
        ? and(eq(reservas.estado, "realizada"), eq(lot.projectId, projectId))
        : eq(reservas.estado, "realizada")
    );
  const activeInstallments = installmentRows
    .map((row) => row.cuota)
    .filter((cuota) => !FINAL_CUOTA_STATES.includes(cuota.estado));
  const nextMonthInstallments = activeInstallments.filter(
    (cuota) =>
      cuota.fechaVencimiento >= `${nextPeriod}-01` &&
      cuota.fechaVencimiento < `${followingPeriod}-01`
  );

  function totalUsd(items: Cuota[]) {
    if (items.some((cuota) => cuota.moneda === "ars") && !tipoCambioBna) return null;
    return items.reduce((total, cuota) => {
      const saldo = toNumber(cuota.saldo) ?? 0;
      return total + (cuota.moneda === "ars" ? saldo / tipoCambioBna! : saldo);
    }, 0);
  }

  return {
    cuentasTotales: createdAccounts.length,
    cuentasAlDia: createdAccounts.filter((item) => item.cuotasVencidas === 0).length,
    cuentasConDeudaVencida: createdAccounts.filter((item) => item.cuotasVencidas > 0).length,
    cuentasPendientesCreacion: summaries.filter((item) => item.cuentaEstado === "pendiente").length,
    proximoMes: nextPeriod,
    cuotasProximoMes: nextMonthInstallments.length,
    montoProximoMesUsd: totalUsd(nextMonthInstallments),
    cuotasTotalesACobrar: activeInstallments.length,
    montoTotalACobrarUsd: totalUsd(activeInstallments),
    tipoCambioBna,
    fechaTipoCambioBna: currentRate?.fecha ?? null,
  };
}

export async function getCuentasCorrientesSummaries() {
  const rows = await db
    .select({
      contrato: contratos,
      reserva: reservas,
      lote: lot,
      project,
      lead,
    })
    .from(contratos)
    .innerJoin(reservas, eq(contratos.reservaId, reservas.id))
    .innerJoin(lot, eq(reservas.lotId, lot.id))
    .innerJoin(project, eq(lot.projectId, project.id))
    .leftJoin(lead, eq(reservas.leadId, lead.id))
    .where(eq(reservas.estado, "realizada"));

  const pendingRows = await db
    .select({
      reserva: reservas,
      lote: lot,
      project,
      lead,
    })
    .from(reservas)
    .innerJoin(lot, eq(reservas.lotId, lot.id))
    .innerJoin(project, eq(lot.projectId, project.id))
    .leftJoin(lead, eq(reservas.leadId, lead.id))
    .leftJoin(contratos, eq(contratos.reservaId, reservas.id))
    .where(
      and(
        eq(reservas.estado, "realizada"),
        or(isNull(reservas.formaPago), ne(reservas.formaPago, "contado")),
        isNull(contratos.id)
      )
    );

  const pendingSummaries = pendingRows.map((row) => buildPendingSummary(row));

  if (rows.length === 0) return pendingSummaries.sort(compareSummaries);

  const [currentRate, rateRows, indexRows] = await Promise.all([
    ensureCurrentBnaRate(),
    listTiposCambioBna(),
    db.select().from(indicesCac).orderBy(asc(indicesCac.periodo)),
  ]);
  const currentCac = latestKnownCacIndex(indexRows);

  const contratoIds = rows.map((row) => row.contrato.id);
  const cuotaRows = await db
    .select()
    .from(cuotas)
    .where(inArray(cuotas.contratoId, contratoIds))
    .orderBy(asc(cuotas.numero));
  const cuotasByContrato = new Map<string, Cuota[]>();
  for (const cuota of cuotaRows) {
    const list = cuotasByContrato.get(cuota.contratoId) ?? [];
    list.push(cuota);
    cuotasByContrato.set(cuota.contratoId, list);
  }

  return [
    ...rows.map((row) =>
      buildSummary(
        row,
        cuotasByContrato.get(row.contrato.id) ?? [],
        currentRate,
        rateRows,
        currentCac
      )
    ),
    ...pendingSummaries,
  ].sort(compareSummaries);
}

function compareSummaries(a: CuentaCorrienteSummary, b: CuentaCorrienteSummary) {
  const compareOptions = { numeric: true } as const;
  return (
    a.projectName.localeCompare(b.projectName, "es", compareOptions) ||
    (a.manzana ?? "").localeCompare(b.manzana ?? "", "es", compareOptions) ||
    a.loteNumero.localeCompare(b.loteNumero, "es", compareOptions)
  );
}

type SummaryRowBase = {
  reserva: Reserva;
  lote: typeof lot.$inferSelect;
  project: typeof project.$inferSelect;
  lead: typeof lead.$inferSelect | null;
};

function buildPendingSummary(row: SummaryRowBase): CuentaCorrienteSummary {
  const modalidad = row.reserva.modalidadContrato ?? "requiere_revision";
  return {
    contratoId: null,
    reservaId: row.reserva.id,
    lotId: row.lote.id,
    projectId: row.project.id,
    projectName: row.project.name,
    loteNumero: row.lote.number,
    manzana: row.lote.manzana,
    parcela: row.lote.parcela,
    comprador: row.lead ? leadNombre(row.lead) : row.reserva.nombreComprador,
    dniCuit: row.lead?.dniCuit ?? row.reserva.dniCuit,
    telefono: row.lead?.phone ?? row.reserva.telefono,
    email: row.lead?.email ?? row.reserva.emailComprador,
    reservadoPor: row.reserva.reservadoPor,
    modalidad,
    requiereRevision: modalidad === "requiere_revision",
    totalVencido: 0,
    saldoPendiente: 0,
    cuotasPendientes: 0,
    cuotasVencidas: 0,
    cuotasPendienteIndice: 0,
    cuotasProyectadas: 0,
    proximoVencimiento: null,
    proximaCuotaMonto: null,
    moneda: modalidad === "pesos_cac" ? "ars" : "usd",
    cuentaEstado: "pendiente",
    mensajeCuotas: "",
    valorLoteUsd: toNumber(row.reserva.precioTotalNum),
    valorFinanciadoUsd: toNumber(row.reserva.saldoNum),
    cantidadCuotasContrato: toNumber(row.reserva.cantidadCuotas),
    cuotaBaseUsd: toNumber(row.reserva.cuotaMensual),
    cuotaBaseArs: null,
    indiceBase: null,
    valorIndiceBase: null,
    indiceActual: null,
    valorIndiceActual: null,
    cuotaActualUsd: null,
    cuotaActualArs: null,
  };
}

// TODO: reemplazar los placeholders con los datos bancarios de Fitzroya.
const DATOS_CUENTA = [
  "Los datos de la cuenta Bancaria para TRANSFERIR son:",
  "Nombre: [Insert Nombre titular]",
  "CUIT: [Insert CUIT]",
  "Alias: [Insert Alias]",
  "CVU: [Insert CVU]",
].join("\n");

const EMAIL_COMPROBANTES = "[Insert Email]";

function formatNumber(value: number, maximumFractionDigits = 2) {
  return value.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
}

function formatCommunicationDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year!, month! - 1, day!)));
}

function formatCommunicationPeriod(value: string) {
  const [year, month] = value.split("-").map(Number);
  const monthName = new Intl.DateTimeFormat("es-AR", {
    timeZone: "UTC",
    month: "short",
  })
    .format(new Date(Date.UTC(year!, month! - 1, 1)))
    .replace(".", "");
  return `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)}${String(year).slice(-2)}`;
}

function selectCuotaForCommunication(items: Cuota[]) {
  const today = todayKey();
  const calculated = items.filter(
    (cuota) =>
      !FINAL_CUOTA_STATES.includes(cuota.estado) &&
      cuota.estado !== "proyectada" &&
      cuota.importeAjustado !== null
  );
  return (
    calculated
      .filter((cuota) => cuota.fechaVencimiento >= today)
      .sort((a, b) => a.fechaVencimiento.localeCompare(b.fechaVencimiento))[0] ??
    calculated
      .filter((cuota) => cuota.fechaVencimiento < today)
      .sort((a, b) => b.fechaVencimiento.localeCompare(a.fechaVencimiento))[0] ??
    null
  );
}

export function buildMensajeCuentaCorriente(input: MensajeCuentaCorrienteInput) {
  const comprador = input.comprador ?? "cliente";
  const lote = input.parcela || input.loteNumero || "-";
  const manzana = input.manzana ?? "-";
  const encabezado = `Estimado/a ${comprador} (M${manzana}-L${lote}):`;
  const introduccion =
    "Antes que nada, le agradecemos la confianza depositada al acompañarnos en este proyecto.";
  const cuota = selectCuotaForCommunication(input.cuotas);

  if (input.modalidad === "requiere_revision") {
    return [
      encabezado,
      introduccion,
      "No se pudo generar la liquidación porque la modalidad del contrato requiere revisión.",
    ].join("\n\n");
  }

  if (!cuota) {
    const hasPendingCuotas = input.cuotas.some(
      (item) => !FINAL_CUOTA_STATES.includes(item.estado)
    );
    return [
      encabezado,
      introduccion,
      hasPendingCuotas
        ? "La próxima cuota se encuentra pendiente de cálculo por falta del índice CAC correspondiente."
        : "No registra cuotas pendientes a la fecha.",
    ].join("\n\n");
  }

  const period = formatCommunicationPeriod(cuota.fechaVencimiento.slice(0, 7));
  const dueDate = formatCommunicationDate(cuota.fechaVencimiento);
  const adjustedAmount = toNumber(cuota.importeAjustado);
  if (adjustedAmount === null) {
    return [encabezado, introduccion, "No se pudo determinar el importe de la cuota."].join(
      "\n\n"
    );
  }

  if (input.modalidad === "pesos_cac") {
    const baseAmount = toNumber(cuota.importeBase);
    const baseIndex = toNumber(input.contrato.indiceBaseCac);
    const currentIndex = toNumber(cuota.indiceCac);
    if (baseAmount === null || baseIndex === null || currentIndex === null) {
      return [
        encabezado,
        introduccion,
        "La próxima cuota se encuentra pendiente de cálculo por falta del índice CAC correspondiente.",
      ].join("\n\n");
    }
    return [
      encabezado,
      introduccion,
      `El valor de la cuota ${period}, con vencimiento el ${dueDate}, es de $${formatNumber(adjustedAmount)} pesos.`,
      [
        "Detalle de liquidación:",
        `Monto Base = $${formatNumber(baseAmount)}`,
        `Índice Base = ${formatNumber(baseIndex, 3)}`,
        `Índice Actual = ${formatNumber(currentIndex, 3)}`,
        `Cuota Actual = Índice Actual / Índice Base * Monto Base = $${formatNumber(adjustedAmount)}`,
      ].join("\n"),
      DATOS_CUENTA,
      "Por otro lado, les recordamos que para aquellos casos de fuerza mayor en los que se tenga que abonar en pesos en efectivo, deberán coordinar la visita presencial con un mínimo de 48 horas de anticipación.",
    ].join("\n\n");
  }

  if (!input.tipoCambioActual || !input.fechaTipoCambioActual) {
    return [
      encabezado,
      introduccion,
      "No se pudo generar la liquidación porque falta el Tipo de Cambio BNA vendedor del día.",
    ].join("\n\n");
  }
  const amountArs = adjustedAmount * input.tipoCambioActual;
  return [
    encabezado,
    introduccion,
    `El valor de la cuota ${period}, con vencimiento el ${dueDate}, es de $${formatNumber(amountArs)} pesos. Correspondiente a ${formatNumber(adjustedAmount)} USD a ${formatNumber(input.tipoCambioActual)} Tipo de Cambio BNA del día ${formatCommunicationDate(input.fechaTipoCambioActual)}.`,
    DATOS_CUENTA,
    "Por otro lado, les recordamos que para aquellos casos de fuerza mayor en los que se tenga que abonar en dólares en efectivo, deberán coordinar la visita presencial con un mínimo de 48 horas de anticipación.",
    `Les recordamos que los únicos medios habilitados de comunicación oficial para recepción de LOS COMPROBANTES DE TRANSFERENCIA Y LA COORDINACIÓN DE LA VISITA PARA PAGO son el correo electrónico ${EMAIL_COMPROBANTES}`,
  ].join("\n\n");
}

function buildSummary(
  row: SummaryRowBase & { contrato: Contrato },
  cuotaRows: Cuota[],
  currentRate: { valor: unknown; fecha: string } | null = null,
  rateRows: TipoCambio[] = [],
  currentCac: { periodo: string; valor: number } | null = null
): CuentaCorrienteSummary {
  const today = todayKey();
  const activeCuotas = cuotaRows.filter((cuota) => !FINAL_CUOTA_STATES.includes(cuota.estado));
  const overdueCuotas = activeCuotas.filter((cuota) => cuota.fechaVencimiento < today);
  const nextCuota = activeCuotas
    .filter((cuota) => cuota.fechaVencimiento >= today)
    .sort((a, b) => a.fechaVencimiento.localeCompare(b.fechaVencimiento))[0];
  const cuotaBaseUsd = toNumber(row.reserva.cuotaMensual);
  const currentBnaValue = toNumber(currentRate?.valor);
  const signingDate = row.reserva.fechaFirma ?? row.contrato.fechaInicio;
  const initialBna = rateRows.find((rate) => rate.fecha <= signingDate) ?? null;
  const initialBnaValue = toNumber(initialBna?.valor);
  const baseCacValue = toNumber(row.contrato.indiceBaseCac);
  const cuotaBaseArs =
    row.contrato.modalidad === "pesos_cac"
      ? toNumber(row.contrato.cuotaBase)
      : cuotaBaseUsd !== null && initialBnaValue !== null
        ? cuotaBaseUsd * initialBnaValue
        : null;
  const cuotaActualArs =
    row.contrato.modalidad === "pesos_cac"
      ? cuotaBaseArs !== null && baseCacValue !== null && currentCac
        ? cuotaBaseArs * (currentCac.valor / baseCacValue)
        : null
      : cuotaBaseUsd !== null && currentBnaValue !== null
        ? cuotaBaseUsd * currentBnaValue
        : null;
  const cuotaActualUsd =
    row.contrato.modalidad === "pesos_cac"
      ? cuotaActualArs !== null && currentBnaValue !== null
        ? cuotaActualArs / currentBnaValue
        : null
      : cuotaBaseUsd;
  const usesCac = row.contrato.modalidad === "pesos_cac";

  const summary: CuentaCorrienteSummary = {
    contratoId: row.contrato.id,
    reservaId: row.reserva.id,
    lotId: row.lote.id,
    projectId: row.project.id,
    projectName: row.project.name,
    loteNumero: row.lote.number,
    manzana: row.lote.manzana,
    parcela: row.lote.parcela,
    comprador: row.lead ? leadNombre(row.lead) : row.reserva.nombreComprador,
    dniCuit: row.lead?.dniCuit ?? row.reserva.dniCuit,
    telefono: row.lead?.phone ?? row.reserva.telefono,
    email: row.lead?.email ?? row.reserva.emailComprador,
    reservadoPor: row.reserva.reservadoPor,
    modalidad: row.contrato.modalidad,
    requiereRevision: row.contrato.requiereRevision,
    totalVencido: overdueCuotas.reduce((total, cuota) => total + (toNumber(cuota.saldo) ?? 0), 0),
    saldoPendiente: activeCuotas.reduce((total, cuota) => total + (toNumber(cuota.saldo) ?? 0), 0),
    cuotasPendientes: activeCuotas.length,
    cuotasVencidas: overdueCuotas.length,
    cuotasPendienteIndice: cuotaRows.filter((cuota) => cuota.estado === "pendiente_indice").length,
    cuotasProyectadas: cuotaRows.filter((cuota) => cuota.estado === "proyectada").length,
    proximoVencimiento: nextCuota?.fechaVencimiento ?? null,
    proximaCuotaMonto: nextCuota
      ? (toNumber(nextCuota.importeAjustado) ?? toNumber(nextCuota.importeBase))
      : null,
    moneda: row.contrato.monedaBase,
    cuentaEstado: "creada",
    mensajeCuotas: "",
    valorLoteUsd: toNumber(row.reserva.precioTotalNum),
    valorFinanciadoUsd: toNumber(row.reserva.saldoNum),
    cantidadCuotasContrato: row.contrato.cantidadCuotas,
    cuotaBaseUsd,
    cuotaBaseArs,
    indiceBase: usesCac
      ? row.contrato.periodoBaseCac
        ? `CAC ${formatPeriodLabel(row.contrato.periodoBaseCac)}`
        : null
      : initialBna
        ? `BNA Vendedor ${formatDateLabel(initialBna.fecha)}`
        : null,
    valorIndiceBase: usesCac ? baseCacValue : initialBnaValue,
    indiceActual: usesCac
      ? currentCac
        ? `CAC ${formatPeriodLabel(currentCac.periodo)}`
        : null
      : currentRate
        ? `BNA Vendedor ${formatDateLabel(currentRate.fecha)}`
        : null,
    valorIndiceActual: usesCac ? (currentCac?.valor ?? null) : currentBnaValue,
    cuotaActualUsd,
    cuotaActualArs,
  };

  return {
    ...summary,
    mensajeCuotas: buildMensajeCuentaCorriente({
      ...summary,
      contrato: row.contrato,
      cuotas: cuotaRows,
      tipoCambioActual: toNumber(currentRate?.valor),
      fechaTipoCambioActual: currentRate?.fecha ?? null,
    }),
  };
}

export function formatCuentaMoney(value: number | string | null, moneda: MonedaPago) {
  const amount = toNumber(value);
  if (amount === null) return "-";
  const prefix = moneda === "usd" ? "USD" : "$";
  return `${prefix} ${amount.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
