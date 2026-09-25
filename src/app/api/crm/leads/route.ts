import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { requireApiCrm, isErrorResponse } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { LEAD_CHANNELS, LEAD_STATUSES } from "@/lib/lead-status";
import { lead, user } from "@/lib/schema";

const createLeadSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  email: z.string().email(),
  contactChannel: z.enum(LEAD_CHANNELS).default("in_person"),
  initialMessage: z.string().optional().nullable(),
  dniCuit: z.string().optional().nullable(),
  domicilio: z.string().optional().nullable(),
  nacionalidad: z.string().optional().nullable(),
  fechaNacimiento: z.string().optional().nullable(),
  estadoCivil: z.string().optional().nullable(),
  cuitComprador: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function GET(request: Request) {
  const authResult = await requireApiCrm();
  if (isErrorResponse(authResult)) return authResult;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const conditions = [];
  if (status && (LEAD_STATUSES as readonly string[]).includes(status)) {
    conditions.push(eq(lead.status, status));
  }
  if (authResult.role !== "admin") conditions.push(eq(lead.asignadoA, authResult.id));

  const rows = await db
    .select({
      id: lead.id,
      firstName: lead.firstName,
      lastName: lead.lastName,
      phone: lead.phone,
      email: lead.email,
      contactChannel: lead.contactChannel,
      initialMessage: lead.initialMessage,
      status: lead.status,
      notes: lead.notes,
      asignadoA: lead.asignadoA,
      dniCuit: lead.dniCuit,
      domicilio: lead.domicilio,
      nacionalidad: lead.nacionalidad,
      fechaNacimiento: lead.fechaNacimiento,
      estadoCivil: lead.estadoCivil,
      cuitComprador: lead.cuitComprador,
      asignadoNombre: user.name,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    })
    .from(lead)
    .leftJoin(user, eq(lead.asignadoA, user.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(lead.createdAt));

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const authResult = await requireApiCrm();
  if (isErrorResponse(authResult)) return authResult;

  const body = await request.json().catch(() => null);
  const parsed = createLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const data = parsed.data;
  const [created] = await db
    .insert(lead)
    .values({
      id: crypto.randomUUID(),
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      contactChannel: data.contactChannel,
      initialMessage: data.initialMessage ?? null,
      dniCuit: data.dniCuit ?? null,
      domicilio: data.domicilio ?? null,
      nacionalidad: data.nacionalidad ?? null,
      fechaNacimiento: data.fechaNacimiento || null,
      estadoCivil: data.estadoCivil ?? null,
      cuitComprador: data.cuitComprador ?? null,
      notes: data.notes ?? null,
      asignadoA: authResult.id,
      status: "new",
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
