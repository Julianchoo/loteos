import { and, eq, or } from "drizzle-orm";
import { lot, reservas } from "@/lib/schema";
import type { Lead, LoteConReserva, Lot, Reserva } from "@/lib/schema";

export const RESERVA_FIELDS = [
  "leadId",
  "nombreComprador",
  "dniCuit",
  "telefono",
  "emailComprador",
  "domicilioComprador",
  "nacionalidad",
  "fechaNacimiento",
  "estadoCivil",
  "cuitComprador",
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

export type ReservaField = (typeof RESERVA_FIELDS)[number];

const EMPTY_RESERVA_FIELDS = {
  leadId: null,
  nombreComprador: null,
  dniCuit: null,
  telefono: null,
  emailComprador: null,
  domicilioComprador: null,
  nacionalidad: null,
  fechaNacimiento: null,
  estadoCivil: null,
  cuitComprador: null,
  nombreCoComprador: null,
  dniCoComprador: null,
  nacionalidadCoComprador: null,
  fechaNacimientoCoComprador: null,
  domicilioCoComprador: null,
  cuitCoComprador: null,
  estadoCivilCoComprador: null,
  porcentajeCoComprador: null,
  tipoEntrega: null,
  mesEntrega: null,
  anioEntrega: null,
  nombreCorredor: null,
  emailCorredor: null,
  formaPago: null,
  fechaReserva: null,
  fechaVencimiento: null,
  fechaFirma: null,
  modificadoPor: null,
  reservadoPor: null,
  observaciones: null,
  precioTotalPalabras: null,
  precioTotalNum: null,
  reservaPalabras: null,
  reservaNum: null,
  anticipoPalabras: null,
  anticipoNum: null,
  saldoPalabras: null,
  saldoNum: null,
  cantidadCuotas: null,
  cuotaMensualPalabras: null,
  cuotaMensual: null,
  modalidadContrato: null,
};

export function activeReservaJoin() {
  return and(eq(reservas.lotId, lot.id), eq(reservas.estado, "activa"));
}

export function currentReservaJoin() {
  return and(
    eq(reservas.lotId, lot.id),
    or(eq(reservas.estado, "activa"), eq(reservas.estado, "realizada"))
  );
}

/** Full name of a lead (loteos stores first and last name separately). */
export function leadNombre(value: Pick<Lead, "firstName" | "lastName">) {
  return [value.firstName, value.lastName].filter(Boolean).join(" ").trim();
}

export function flattenLoteReserva(
  lote: Lot,
  reserva: Reserva | null,
  lead?: Lead | null,
  projectName: string | null = null
): LoteConReserva {
  if (!reserva) {
    return {
      ...lote,
      ...EMPTY_RESERVA_FIELDS,
      projectName,
      reservaId: null,
      reservaEstado: null,
      leadStatus: null,
      leadAsignadoA: null,
    };
  }

  const leadData = lead
    ? {
        nombreComprador: leadNombre(lead),
        dniCuit: lead.dniCuit,
        telefono: lead.phone,
        emailComprador: lead.email,
        domicilioComprador: lead.domicilio,
        nacionalidad: lead.nacionalidad,
        fechaNacimiento: lead.fechaNacimiento,
        estadoCivil: lead.estadoCivil,
        cuitComprador: lead.cuitComprador,
      }
    : {
        nombreComprador: reserva.nombreComprador,
        dniCuit: reserva.dniCuit,
        telefono: reserva.telefono,
        emailComprador: reserva.emailComprador,
        domicilioComprador: reserva.domicilioComprador,
        nacionalidad: reserva.nacionalidad,
        fechaNacimiento: reserva.fechaNacimiento,
        estadoCivil: reserva.estadoCivil,
        cuitComprador: reserva.cuitComprador,
      };

  return {
    ...lote,
    projectName,
    reservaId: reserva.id,
    reservaEstado: reserva.estado,
    leadId: reserva.leadId,
    ...leadData,
    leadStatus: lead?.status ?? null,
    leadAsignadoA: lead?.asignadoA ?? null,
    nombreCoComprador: reserva.nombreCoComprador,
    dniCoComprador: reserva.dniCoComprador,
    nacionalidadCoComprador: reserva.nacionalidadCoComprador,
    fechaNacimientoCoComprador: reserva.fechaNacimientoCoComprador,
    domicilioCoComprador: reserva.domicilioCoComprador,
    cuitCoComprador: reserva.cuitCoComprador,
    estadoCivilCoComprador: reserva.estadoCivilCoComprador,
    porcentajeCoComprador: reserva.porcentajeCoComprador,
    tipoEntrega: reserva.tipoEntrega,
    mesEntrega: reserva.mesEntrega,
    anioEntrega: reserva.anioEntrega,
    nombreCorredor: reserva.nombreCorredor,
    emailCorredor: reserva.emailCorredor,
    formaPago: reserva.formaPago,
    fechaReserva: reserva.fechaReserva,
    fechaVencimiento: reserva.fechaVencimiento,
    fechaFirma: reserva.fechaFirma,
    modificadoPor: reserva.modificadoPor,
    reservadoPor: reserva.reservadoPor,
    observaciones: reserva.observaciones,
    precioTotalPalabras: reserva.precioTotalPalabras,
    precioTotalNum: reserva.precioTotalNum,
    reservaPalabras: reserva.reservaPalabras,
    reservaNum: reserva.reservaNum,
    anticipoPalabras: reserva.anticipoPalabras,
    anticipoNum: reserva.anticipoNum,
    saldoPalabras: reserva.saldoPalabras,
    saldoNum: reserva.saldoNum,
    cantidadCuotas: reserva.cantidadCuotas,
    cuotaMensualPalabras: reserva.cuotaMensualPalabras,
    cuotaMensual: reserva.cuotaMensual,
    modalidadContrato: reserva.modalidadContrato,
  };
}

export function pickReservaData(data: Record<string, unknown>) {
  const picked: Record<string, unknown> = {};
  for (const field of RESERVA_FIELDS) {
    if (field in data) picked[field] = data[field];
  }
  return picked;
}

export function hasReservaData(data: Record<string, unknown>) {
  return RESERVA_FIELDS.some((field) => data[field] !== undefined);
}
