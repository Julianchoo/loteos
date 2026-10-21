import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { requireApiCrm, isErrorResponse } from "@/lib/api-auth";
import { logAudit } from "@/lib/audit";
import { crmTransaction } from "@/lib/crm-transaction";
import { contratoVigente, cuentaCorrienteUrl } from "@/lib/cuenta-corriente";
import { db } from "@/lib/db";
import { condicionesLote, getMinimumAnticipoUsd } from "@/lib/financiacion";
import { estadoLoteValues, legacyLotPrice, legacyLotSize } from "@/lib/lotes";
import {
  currentReservaJoin,
  flattenLoteReserva,
  hasReservaData,
  pickReservaData,
  compradorSnapshot,
} from "@/lib/reservas";
import { contratos, lead, lot, project, reservas } from "@/lib/schema";
import type { EstadoLote } from "@/lib/schema";
import { validationMessage } from "@/lib/validation-message";

const COMERCIAL_FIELDS = [
  "estado",
  "leadId",
  "nombreCoComprador",
  "dniCoComprador",
  "nacionalidadCoComprador",
  "fechaNacimientoCoComprador",
  "domicilioCoComprador",
  "cuitCoComprador",
  "estadoCivilCoComprador",
  "porcentajeCoComprador",
  "tipoEntrega",
  "mesEntrega",
  "anioEntrega",
  "nombreCorredor",
  "emailCorredor",
  "formaPago",
  "fechaReserva",
  "fechaVencimiento",
  "fechaFirma",
  "observaciones",
  "precioTotalPalabras",
  "precioTotalNum",
  "reservaPalabras",
  "reservaNum",
  "anticipoPalabras",
  "anticipoNum",
  "saldoPalabras",
  "saldoNum",
  "cantidadCuotas",
  "cuotaMensualPalabras",
  "cuotaMensual",
  "modalidadContrato",
] as const;

const updateSchema = z
  .object({
    // A mano solo se alterna disponible <-> no disponible. "Reservado" y "vendido"
    // salen de la reserva vigente (crearla, realizarla) via PATCH /reservas/[id].
    estado: z.enum(["disponible", "no_disponible"]).optional(),
    leadId: z.string().min(1).nullable().optional(),
    nombreCoComprador: z.string().nullable().optional(),
    dniCoComprador: z.string().nullable().optional(),
    nacionalidadCoComprador: z.string().nullable().optional(),
    fechaNacimientoCoComprador: z.string().nullable().optional(),
    domicilioCoComprador: z.string().nullable().optional(),
    cuitCoComprador: z.string().nullable().optional(),
    estadoCivilCoComprador: z.string().nullable().optional(),
    porcentajeCoComprador: z.string().nullable().optional(),
    tipoEntrega: z.string().nullable().optional(),
    mesEntrega: z.string().nullable().optional(),
    anioEntrega: z.string().nullable().optional(),
    nombreCorredor: z.string().nullable().optional(),
    emailCorredor: z.string().email().nullable().optional(),
    formaPago: z.string().nullable().optional(),
    fechaReserva: z.string().nullable().optional(),
    fechaVencimiento: z.string().nullable().optional(),
    fechaFirma: z.string().nullable().optional(),
    observaciones: z.string().nullable().optional(),
    precioTotalPalabras: z.string().nullable().optional(),
    precioTotalNum: z.string().nullable().optional(),
    reservaPalabras: z.string().nullable().optional(),
    reservaNum: z.string().nullable().optional(),
    anticipoPalabras: z.string().nullable().optional(),
    anticipoNum: z.string().nullable().optional(),
    saldoPalabras: z.string().nullable().optional(),
    saldoNum: z.string().nullable().optional(),
    cantidadCuotas: z.string().nullable().optional(),
    cuotaMensualPalabras: z.string().nullable().optional(),
    cuotaMensual: z.string().nullable().optional(),
    modalidadContrato: z
      .enum(["usd_fijo", "pesos_cac", "requiere_revision"])
      .nullable()
      .optional(),
    number: z.string().trim().min(1).optional(),
    circunscripcion: z.string().nullable().optional(),
    seccion: z.string().nullable().optional(),
    manzana: z.string().nullable().optional(),
    parcela: z.string().nullable().optional(),
    partidaArba: z.string().nullable().optional(),
    partidaMunicipal: z.string().nullable().optional(),
    escritura: z.string().nullable().optional(),
    matriculaFolio: z.string().nullable().optional(),
    certificadoCatastral: z.string().nullable().optional(),
    precioBase: z.string().nullable().optional(),
    precioEtapa1: z.string().nullable().optional(),
    valorM2: z.string().nullable().optional(),
    valuacionFiscal: z.string().nullable().optional(),
    vfAlActo: z.string().nullable().optional(),
    superficieM2: z.string().nullable().optional(),
    metrosFrente: z.string().nullable().optional(),
    metrosFondo: z.string().nullable().optional(),
    calleFrente: z.string().nullable().optional(),
    calleLindera1: z.string().nullable().optional(),
    calleLindera2: z.string().nullable().optional(),
    anticipoPct: z.string().nullable().optional(),
    tasaMensual: z.string().nullable().optional(),
    anticipoUsd: z.string().nullable().optional(),
    saldoUsd: z.string().nullable().optional(),
    cuotas48: z.string().nullable().optional(),
    cuotas60: z.string().nullable().optional(),
    nota: z.string().nullable().optional(),
    // Condiciones de financiación del lote (null = las generales).
    anticipoMinimoPct: z
      .string()
      .refine((value) => Number(value) >= 0 && Number(value) <= 100, "Debe ser un % entre 0 y 100")
      .nullable()
      .optional(),
    plazoMaximo: z.number().int().min(1).max(360).nullable().optional(),
    confirmarEdicionVendida: z.boolean().optional(),
  })
  .strict();

const PARCELA_ADMIN_FIELDS = [
  "number",
  "circunscripcion",
  "seccion",
  "manzana",
  "parcela",
  "partidaArba",
  "partidaMunicipal",
  "escritura",
  "matriculaFolio",
  "certificadoCatastral",
  "precioBase",
  "precioEtapa1",
  "valorM2",
  "valuacionFiscal",
  "vfAlActo",
  "superficieM2",
  "metrosFrente",
  "metrosFondo",
  "calleFrente",
  "calleLindera1",
  "calleLindera2",
  "anticipoPct",
  "tasaMensual",
  "anticipoUsd",
  "saldoUsd",
  "cuotas48",
  "cuotas60",
  "nota",
  "anticipoMinimoPct",
  "plazoMaximo",
] as const;

const PARCELA_COMERCIAL_FIELDS = [
  "superficieM2",
  "metrosFrente",
  "metrosFondo",
  "calleFrente",
  "calleLindera1",
  "calleLindera2",
] as const;

function hasReservaValue(data: Record<string, unknown>) {
  return Object.values(data).some((value) => value !== null && value !== "");
}

function numericValue(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function calculateValorM2(precioBase: unknown, superficieM2: unknown) {
  const precio = numericValue(precioBase);
  const superficie = numericValue(superficieM2);
  if (precio === null || superficie === null || superficie <= 0) return null;
  return String(Number((precio / superficie).toFixed(2)));
}

function hasAnyField(data: Record<string, unknown>, fields: readonly string[]) {
  return fields.some((field) => field in data);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireApiCrm();
  if (isErrorResponse(authResult)) return authResult;

  const { id } = await params;
  const lotId = id;
  if (!lotId) {
    return NextResponse.json({ error: "ID invalido" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const data = updateSchema.parse(body);

    let allowedData: Record<string, unknown> = {};
    if (authResult.role === "admin") {
      allowedData = { ...data };
    } else {
      for (const field of COMERCIAL_FIELDS) {
        if (field in data) allowedData[field] = data[field];
      }
      for (const field of PARCELA_COMERCIAL_FIELDS) {
        if (field in data) allowedData[field] = data[field];
      }
    }

    const result = await crmTransaction(async (tx) => {
      // Bloquea el lote: PATCH /reservas/[id] hace lo mismo, asi que crear o reactivar
      // reservas del mismo lote no corren en paralelo y no pueden quedar dos vigentes.
      await tx
        .select({ id: lot.id })
        .from(lot)
        .where(eq(lot.id, lotId))
        .for("update");

      const [currentRow] = await tx
        .select({ lote: lot, reserva: reservas, lead })
        .from(lot)
        .leftJoin(reservas, currentReservaJoin())
        .leftJoin(lead, eq(reservas.leadId, lead.id))
        .where(eq(lot.id, lotId));

      if (!currentRow) return { kind: "not-found" as const };

      const { lote: current, reserva: activeReserva } = currentRow;
      const requestedFormaPago = data.formaPago ?? activeReserva?.formaPago;
      const requestedAnticipo = numericValue(data.anticipoNum);
      const currentAnticipo = numericValue(activeReserva?.anticipoNum);
      const changesAnticipo = "anticipoNum" in data && requestedAnticipo !== currentAnticipo;
      const shouldValidateAnticipo =
        requestedFormaPago !== "contado" &&
        "anticipoNum" in data &&
        (!activeReserva || changesAnticipo);

      if (shouldValidateAnticipo) {
        const precioLista = numericValue(current.precioBase ?? current.precioEtapa1);
        if (precioLista === null) {
          return { kind: "missing-list-price" as const };
        }

        const { anticipoMinimoPct } = condicionesLote(current);
        const minimumAnticipo = getMinimumAnticipoUsd(precioLista, anticipoMinimoPct);
        if (requestedAnticipo === null || requestedAnticipo < minimumAnticipo) {
          return {
            kind: "invalid-anticipo" as const,
            minimumAnticipo,
            anticipoMinimoPct,
          };
        }
      }

      const isSoldOrRealizada =
        current.estado === "vendido" || activeReserva?.estado === "realizada";
      if (
        isSoldOrRealizada &&
        (authResult.role !== "admin" || data.confirmarEdicionVendida !== true)
      ) {
        return { kind: "sold-confirmation-required" as const };
      }
      if (authResult.role !== "admin" && activeReserva?.estado === "realizada") {
        return { kind: "admin-only-realizada" as const };
      }

      const isReservedByOther =
        current.estado === "reservado" &&
        activeReserva &&
        authResult.role !== "admin" &&
        activeReserva.reservadoPor !== authResult.email;

      if (isReservedByOther) {
        return { kind: "forbidden" as const, reservadoPor: activeReserva.reservadoPor };
      }

      const touchesCommercialParcelaFields = hasAnyField(allowedData, PARCELA_COMERCIAL_FIELDS);
      const canComercialEditParcelaFields =
        authResult.role === "admin" ||
        current.estado === "disponible" ||
        activeReserva?.reservadoPor === authResult.email;

      if (
        authResult.role !== "admin" &&
        touchesCommercialParcelaFields &&
        !canComercialEditParcelaFields
      ) {
        return { kind: "forbidden" as const, reservadoPor: null };
      }

      const parcelaData: Record<string, unknown> = {};
      if (authResult.role === "admin") {
        for (const field of PARCELA_ADMIN_FIELDS) {
          if (field in allowedData) parcelaData[field] = allowedData[field];
        }
      } else {
        for (const field of PARCELA_COMERCIAL_FIELDS) {
          if (field in allowedData) parcelaData[field] = allowedData[field];
        }
      }
      if ("precioBase" in allowedData || "superficieM2" in parcelaData) {
        parcelaData.valorM2 = calculateValorM2(
          "precioBase" in allowedData
            ? allowedData.precioBase
            : (current.precioBase ?? current.precioEtapa1),
          "superficieM2" in parcelaData ? parcelaData.superficieM2 : current.superficieM2
        );
      }

      const reservaData = pickReservaData(allowedData);
      const shouldTouchReserva = activeReserva
        ? hasReservaData(reservaData)
        : hasReservaValue(reservaData);
      const requestedLeadId =
        "leadId" in reservaData
          ? (reservaData.leadId as string | null)
          : (activeReserva?.leadId ?? null);
      const createsReserva = !activeReserva && shouldTouchReserva;
      if (
        activeReserva?.leadId &&
        "leadId" in reservaData &&
        (!requestedLeadId ||
          (activeReserva.estado === "realizada" && requestedLeadId !== activeReserva.leadId))
      ) {
        return { kind: "protected-lead" as const };
      }
      if (activeReserva) {
        const [contrato] = await tx
          .select({ id: contratos.id })
          .from(contratos)
          .where(and(eq(contratos.reservaId, activeReserva.id), contratoVigente));
        const protectedFields = [
          "formaPago",
          "modalidadContrato",
          "fechaFirma",
          "fechaReserva",
          "precioTotalNum",
          "precioTotalPalabras",
          "anticipoNum",
          "anticipoPalabras",
          "saldoNum",
          "saldoPalabras",
          "cantidadCuotas",
          "cuotaMensual",
          "cuotaMensualPalabras",
        ] as const;
        if (
          contrato &&
          protectedFields.some(
            (field) => field in reservaData && reservaData[field] !== activeReserva[field]
          )
        ) {
          return { kind: "protected-contract" as const, reservaId: activeReserva.id };
        }
      }

      if (allowedData.estado !== undefined) {
        // Para liberar un lote reservado o vendido hay que cancelar su reserva.
        if (activeReserva) {
          return { kind: "estado-con-reserva" as const, reservaId: activeReserva.id };
        }
        if (shouldTouchReserva) return { kind: "estado-y-reserva" as const };
        // Liberar un lote no disponible es decisión de un administrador.
        if (
          authResult.role !== "admin" &&
          allowedData.estado === "disponible" &&
          current.estado !== "disponible"
        ) {
          return { kind: "admin-only-disponible" as const };
        }
      }
      if (createsReserva && current.estado === "no_disponible") {
        return { kind: "lote-no-disponible" as const };
      }

      if (createsReserva && !requestedLeadId) {
        return { kind: "missing-lead" as const };
      }

      if (requestedLeadId) {
        const leadConditions = [eq(lead.id, requestedLeadId)];
        if (authResult.role !== "admin") {
          leadConditions.push(eq(lead.asignadoA, authResult.id));
        }
        const [selectedLead] = await tx
          .select()
          .from(lead)
          .where(and(...leadConditions));

        if (!selectedLead) return { kind: "invalid-lead" as const };
        if (createsReserva || requestedLeadId !== activeReserva?.leadId)
          Object.assign(reservaData, compradorSnapshot(selectedLead));
      }

      if (allowedData.estado !== undefined) {
        parcelaData.estado = allowedData.estado;
      } else if (shouldTouchReserva) {
        // Editar datos no cambia el estado de la reserva; el lote queda alineado con ella
        // (activa -> reservado, realizada -> vendido, nueva -> reservado).
        parcelaData.estado = activeReserva?.estado === "realizada" ? "vendido" : "reservado";
        if (activeReserva) {
          await tx
            .update(reservas)
            .set({
              ...reservaData,
              modificadoPor: authResult.email,
              updatedAt: new Date(),
            })
            .where(eq(reservas.id, activeReserva.id));
        } else {
          await tx.insert(reservas).values({
            lotId,
            ...reservaData,
            estado: "activa",
            reservadoPor: authResult.email,
            modificadoPor: authResult.email,
          });
        }
      }

      if (Object.keys(parcelaData).length > 0) {
        // Keep the legacy public-map columns in sync with the CRM fields.
        if ("estado" in parcelaData) {
          Object.assign(parcelaData, estadoLoteValues(parcelaData.estado as EstadoLote));
        }
        if ("superficieM2" in parcelaData) {
          parcelaData.size = legacyLotSize(parcelaData.superficieM2 as string | null);
        }
        if ("precioBase" in parcelaData) {
          parcelaData.price = legacyLotPrice(parcelaData.precioBase as string | null);
        }
        await tx.update(lot).set(parcelaData).where(eq(lot.id, lotId));
      }

      const [updatedRow] = await tx
        .select({ lote: lot, reserva: reservas, lead, projectName: project.name })
        .from(lot)
        .innerJoin(project, eq(lot.projectId, project.id))
        .leftJoin(reservas, currentReservaJoin())
        .leftJoin(lead, eq(reservas.leadId, lead.id))
        .where(eq(lot.id, lotId));
      if (!updatedRow) return { kind: "not-found" as const };

      await logAudit(tx, {
        entidad: "lote",
        entidadId: lotId,
        usuario: authResult.email,
        antes: current,
        despues: updatedRow.lote,
      });
      const reservaId = updatedRow.reserva?.id ?? activeReserva?.id;
      if (reservaId) {
        await logAudit(tx, {
          entidad: "reserva",
          entidadId: reservaId,
          usuario: authResult.email,
          antes: activeReserva,
          despues: updatedRow.reserva,
        });
      }

      return {
        kind: "ok" as const,
        data: flattenLoteReserva(
          updatedRow.lote,
          updatedRow.reserva,
          updatedRow.lead,
          updatedRow.projectName
        ),
      };
    });

    if (result.kind === "not-found") {
      return NextResponse.json({ error: "Lote no encontrado" }, { status: 404 });
    }
    if (result.kind === "protected-lead") {
      return NextResponse.json(
        {
          error:
            "El comprador de esta reserva no se puede quitar ni cambiar. Si es otro comprador, cancelá la reserva y creá una nueva",
        },
        { status: 409 }
      );
    }
    if (result.kind === "protected-contract") {
      return NextResponse.json(
        {
          error:
            "Esta reserva tiene cuenta corriente. Para cambiar precio, anticipo, cuotas, forma de pago o fechas, primero cancelá la cuenta corriente (queda guardada como historial) y después generá una nueva.",
          cuentaCorrienteUrl: cuentaCorrienteUrl(result.reservaId),
        },
        { status: 409 }
      );
    }
    if (result.kind === "forbidden") {
      return NextResponse.json(
        {
          error: result.reservadoPor
            ? `Este lote lo reservó ${result.reservadoPor}. Pedile a un administrador que lo modifique o lo reasigne`
            : "Solo podés modificar lotes disponibles o reservados por vos. Pedile el cambio a un administrador",
        },
        { status: 403 }
      );
    }
    if (result.kind === "sold-confirmation-required") {
      return NextResponse.json(
        {
          error:
            "Este lote o reserva ya está vendido. Para modificarlo, tocá \"Editar vendido\" en la ficha, confirmá y volvé a guardar",
        },
        { status: 403 }
      );
    }
    if (result.kind === "admin-only-realizada") {
      return NextResponse.json(
        {
          error:
            "La reserva ya está realizada: solo un administrador puede editarla a ella o a su lote. Pedile el cambio a un admin",
        },
        { status: 403 }
      );
    }
    if (result.kind === "estado-con-reserva") {
      return NextResponse.json(
        {
          error: `El lote tiene la reserva #${result.reservaId} vigente. Para liberarlo, cancelá esa reserva`,
        },
        { status: 409 }
      );
    }
    if (result.kind === "estado-y-reserva") {
      return NextResponse.json(
        {
          error:
            "No se puede cambiar el estado del lote y cargar una reserva en el mismo guardado: guardá primero el estado y después la reserva",
        },
        { status: 400 }
      );
    }
    if (result.kind === "admin-only-disponible") {
      return NextResponse.json(
        { error: "Solo un administrador puede pasar un lote a disponible. Pedile el cambio a un admin" },
        { status: 403 }
      );
    }
    if (result.kind === "lote-no-disponible") {
      return NextResponse.json(
        { error: "El lote está marcado como no disponible. Pasalo a disponible antes de reservarlo" },
        { status: 409 }
      );
    }
    if (result.kind === "missing-lead") {
      return NextResponse.json(
        { error: "Seleccioná el lead comprador antes de reservar el lote" },
        { status: 400 }
      );
    }
    if (result.kind === "invalid-lead") {
      return NextResponse.json(
        {
          error:
            "El lead seleccionado no existe o no está asignado a vos. Elegí uno de tus leads o pedile a un admin que te lo asigne",
        },
        { status: 403 }
      );
    }

    if (result.kind === "missing-list-price") {
      return NextResponse.json(
        {
          error:
            "El lote no tiene precio de lista, así que no se puede validar el anticipo. Un administrador tiene que cargarle el precio antes de reservarlo",
        },
        { status: 400 }
      );
    }
    if (result.kind === "invalid-anticipo") {
      return NextResponse.json(
        {
          error: `El anticipo mínimo para este lote es USD ${result.minimumAnticipo} (${result.anticipoMinimoPct}% del precio de lista)`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: validationMessage(error.issues), details: error.issues },
        { status: 400 }
      );
    }
    console.error("PUT /api/crm/lotes/[id]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireApiCrm();
  if (isErrorResponse(authResult)) return authResult;

  const { id } = await params;
  const lotId = id;
  if (!lotId) {
    return NextResponse.json({ error: "ID invalido" }, { status: 400 });
  }

  const [row] = await db
    .select({ lote: lot, reserva: reservas, lead, projectName: project.name })
    .from(lot)
    .innerJoin(project, eq(lot.projectId, project.id))
    .leftJoin(reservas, currentReservaJoin())
    .leftJoin(lead, eq(reservas.leadId, lead.id))
    .where(eq(lot.id, lotId));

  if (!row) {
    return NextResponse.json({ error: "Lote no encontrado" }, { status: 404 });
  }

  return NextResponse.json(
    flattenLoteReserva(row.lote, row.reserva, row.lead, row.projectName)
  );
}
