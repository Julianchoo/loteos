import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireApiAdmin, requireApiCrm, isErrorResponse } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { LEAD_CHANNELS, LEAD_STATUSES } from "@/lib/lead-status";
import { lead } from "@/lib/schema";

const updateSchema = z
  .object({
    status: z.enum(LEAD_STATUSES).optional(),
    notes: z.string().nullable().optional(),
    asignadoA: z.string().nullable().optional(),
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
    phone: z.string().trim().min(1).optional(),
    email: z.string().email().optional(),
    contactChannel: z.enum(LEAD_CHANNELS).optional(),
    dniCuit: z.string().nullable().optional(),
    domicilio: z.string().nullable().optional(),
    nacionalidad: z.string().nullable().optional(),
    fechaNacimiento: z.string().nullable().optional(),
    estadoCivil: z.string().nullable().optional(),
    cuitComprador: z.string().nullable().optional(),
  })
  .strict();

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireApiCrm();
  if (isErrorResponse(authResult)) return authResult;

  const { id: leadId } = await params;

  try {
    const body = await request.json();
    const data = updateSchema.parse(body);
    if (data.fechaNacimiento === "") data.fechaNacimiento = null;

    // Only admins can assign leads
    if ("asignadoA" in data && authResult.role !== "admin") {
      return NextResponse.json({ error: "Sin permisos para asignar leads" }, { status: 403 });
    }

    // Comercials can only edit their own leads
    if (authResult.role !== "admin") {
      const [current] = await db
        .select({ asignadoA: lead.asignadoA })
        .from(lead)
        .where(eq(lead.id, leadId));
      if (!current) {
        return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
      }
      if (current.asignadoA !== authResult.id) {
        return NextResponse.json({ error: "Solo podés editar tus propios leads" }, { status: 403 });
      }
    }

    const [updated] = await db
      .update(lead)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(lead.id, leadId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireApiAdmin();
  if (isErrorResponse(authResult)) return authResult;

  const { id: leadId } = await params;

  const [deleted] = await db
    .delete(lead)
    .where(eq(lead.id, leadId))
    .returning({ id: lead.id });

  if (!deleted) {
    return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
