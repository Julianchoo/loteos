import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { requireApiAdmin, requireApiCrm, isErrorResponse } from "@/lib/api-auth";
import { logAudit } from "@/lib/audit";
import { crmTransaction } from "@/lib/crm-transaction";
import { LEAD_CHANNELS, LEAD_STATUSES } from "@/lib/lead-status";
import { lead, reservas } from "@/lib/schema";
import { validationMessage } from "@/lib/validation-message";

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
    marketingSource: z.string().nullable().optional(),
    marketingCampaign: z.string().nullable().optional(),
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
      return NextResponse.json({ error: "Solo un administrador puede asignar leads" }, { status: 403 });
    }

    return await crmTransaction(async (tx) => {
      const [current] = await tx.select().from(lead).where(eq(lead.id, leadId));
      if (!current) {
        return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
      }
      // Comercials can only edit their own leads
      if (authResult.role !== "admin" && current.asignadoA !== authResult.id) {
        return NextResponse.json({ error: "Este lead no está asignado a vos: solo podés editar tus propios leads" }, { status: 403 });
      }
      if (authResult.role !== "admin") {
        const [realizada] = await tx
          .select({ id: reservas.id })
          .from(reservas)
          .where(and(eq(reservas.leadId, leadId), eq(reservas.estado, "realizada")))
          .limit(1);
        if (realizada)
          return NextResponse.json(
            {
              error: `Este lead tiene la reserva #${realizada.id} realizada (venta): solo un administrador puede modificarlo. Pedile el cambio a un admin`,
            },
            { status: 403 }
          );
      }


      const [updated] = await tx
        .update(lead)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(lead.id, leadId))
        .returning();

      if (!updated) {
        return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
      }
      await logAudit(tx, {
        entidad: "lead",
        entidadId: leadId,
        usuario: authResult.email,
        antes: current,
        despues: updated,
      });

      return NextResponse.json(updated);
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: validationMessage(error.issues), details: error.issues },
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

  return crmTransaction(async (tx) => {
    const [linked] = await tx
      .select({ id: reservas.id })
      .from(reservas)
      .where(eq(reservas.leadId, leadId))
      .limit(1);
    if (linked)
      return NextResponse.json(
        {
          error:
            "No se puede eliminar un lead vinculado a una reserva; se debe conservar su historial",
        },
        { status: 409 }
      );
    const [deleted] = await tx.delete(lead).where(eq(lead.id, leadId)).returning();

    if (!deleted) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
    }
    await logAudit(tx, {
      entidad: "lead",
      entidadId: leadId,
      usuario: authResult.email,
      antes: deleted,
      despues: null,
    });

    return NextResponse.json({ ok: true });
  });
}
