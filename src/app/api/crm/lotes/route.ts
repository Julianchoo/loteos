import { NextResponse } from "next/server";
import { and, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";
import { z } from "zod";
import { requireApiAdmin, requireApiCrm, isErrorResponse } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { estadoLoteValues, legacyLotPrice, legacyLotSize, lotOrder } from "@/lib/lotes";
import { currentReservaJoin, flattenLoteReserva } from "@/lib/reservas";
import { lead, lot, project, reservas } from "@/lib/schema";
import type { EstadoLote } from "@/lib/schema";

const numericString = z
  .string()
  .trim()
  .regex(/^\d+(\.\d+)?$/, "Debe ser un número")
  .nullable()
  .optional();

const createSchema = z
  .object({
    projectId: z.string().min(1),
    number: z.string().trim().min(1, "Indicá el número de lote"),
    estado: z.enum(["disponible", "no_disponible", "reservado", "vendido"]).optional(),
    circunscripcion: z.string().nullable().optional(),
    seccion: z.string().nullable().optional(),
    manzana: z.string().nullable().optional(),
    parcela: z.string().nullable().optional(),
    partidaArba: z.string().nullable().optional(),
    partidaMunicipal: z.string().nullable().optional(),
    escritura: z.string().nullable().optional(),
    matriculaFolio: z.string().nullable().optional(),
    certificadoCatastral: z.string().nullable().optional(),
    superficieM2: numericString,
    metrosFrente: numericString,
    metrosFondo: numericString,
    calleFrente: z.string().nullable().optional(),
    calleLindera1: z.string().nullable().optional(),
    calleLindera2: z.string().nullable().optional(),
    precioBase: numericString,
    precioEtapa1: numericString,
    valuacionFiscal: numericString,
    vfAlActo: numericString,
    nota: z.string().nullable().optional(),
  })
  .strict();

function emptyToNull<T extends Record<string, unknown>>(data: T) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      typeof value === "string" && value.trim() === "" ? null : value,
    ])
  ) as T;
}

function calculateValorM2(precioBase: string | null | undefined, superficieM2: string | null | undefined) {
  const precio = Number(precioBase);
  const superficie = Number(superficieM2);
  if (!precioBase || !superficieM2 || !Number.isFinite(precio) || !(superficie > 0)) return null;
  return String(Number((precio / superficie).toFixed(2)));
}

export async function GET(request: Request) {
  const authResult = await requireApiCrm();
  if (isErrorResponse(authResult)) return authResult;

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const estado = searchParams.get("estado") as EstadoLote | null;
  const search = searchParams.get("search");
  const manzanaFilters = searchParams
    .getAll("manzana")
    .map((value) => value.trim())
    .filter(Boolean);
  const superficieMin = searchParams.get("superficieMin");
  const superficieMax = searchParams.get("superficieMax");

  const conditions = [];

  if (projectId) {
    conditions.push(eq(lot.projectId, projectId));
  }

  if (estado) {
    conditions.push(eq(lot.estado, estado));
  }

  if (manzanaFilters.length > 0) {
    conditions.push(inArray(lot.manzana, manzanaFilters));
  }

  if (superficieMin) {
    conditions.push(gte(sql`${lot.superficieM2}::numeric`, Number(superficieMin)));
  }

  if (superficieMax) {
    conditions.push(lte(sql`${lot.superficieM2}::numeric`, Number(superficieMax)));
  }

  if (search) {
    conditions.push(
      or(
        ilike(lot.number, `%${search}%`),
        ilike(lot.manzana, `%${search}%`),
        ilike(lot.parcela, `%${search}%`),
        ilike(reservas.nombreComprador, `%${search}%`),
        ilike(lead.firstName, `%${search}%`),
        ilike(lead.lastName, `%${search}%`),
        ilike(lead.email, `%${search}%`),
        ilike(lead.phone, `%${search}%`),
        ilike(lead.dniCuit, `%${search}%`)
      )
    );
  }

  const rows = await db
    .select({ lote: lot, reserva: reservas, lead, projectName: project.name })
    .from(lot)
    .innerJoin(project, eq(lot.projectId, project.id))
    .leftJoin(reservas, currentReservaJoin())
    .leftJoin(lead, eq(reservas.leadId, lead.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(project.name, ...lotOrder);

  return NextResponse.json(
    rows.map((row) => flattenLoteReserva(row.lote, row.reserva, row.lead, row.projectName))
  );
}

/** Admin: crea un lote nuevo dentro de un proyecto. */
export async function POST(request: Request) {
  const authResult = await requireApiAdmin();
  if (isErrorResponse(authResult)) return authResult;

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos invalidos", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { projectId, number, estado = "disponible", ...rest } = emptyToNull(parsed.data);

  const [targetProject] = await db
    .select({ id: project.id, name: project.name })
    .from(project)
    .where(eq(project.id, projectId))
    .limit(1);
  if (!targetProject) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }

  const [duplicate] = await db
    .select({ id: lot.id })
    .from(lot)
    .where(
      and(
        eq(lot.projectId, projectId),
        eq(lot.number, number),
        rest.manzana ? eq(lot.manzana, rest.manzana) : sql`${lot.manzana} is null`
      )
    )
    .limit(1);
  if (duplicate) {
    return NextResponse.json(
      { error: "Ya existe un lote con ese número en esa manzana del proyecto" },
      { status: 409 }
    );
  }

  const [created] = await db
    .insert(lot)
    .values({
      id: crypto.randomUUID(),
      projectId,
      number,
      ...rest,
      ...estadoLoteValues(estado),
      size: legacyLotSize(rest.superficieM2),
      price: legacyLotPrice(rest.precioBase),
      valorM2: calculateValorM2(rest.precioBase, rest.superficieM2),
    })
    .returning();

  if (!created) {
    return NextResponse.json({ error: "No se pudo crear el lote" }, { status: 500 });
  }

  return NextResponse.json(
    flattenLoteReserva(created, null, null, targetProject.name),
    { status: 201 }
  );
}
