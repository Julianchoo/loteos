"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { isCrmRole } from "@/lib/api-auth";
import { logAudit } from "@/lib/audit";
import { db } from "@/lib/db";
import {
  calculateInstallment,
  getMinimumAnticipoUsd,
  condicionesLote,
  TASA_PUBLICA,
} from "@/lib/financiacion";
import { lead, leadFinancingPreference, leadProject, lot, user } from "@/lib/schema";

interface CreateLeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | undefined;
  contactChannel: string;
  marketingSource?: string | undefined;
  marketingCampaign?: string | undefined;
  initialMessage?: string | undefined;
}

interface CreateLeadWithFinancingData extends CreateLeadData {
  projectId: string;
  financing: {
    anticipo: number;
    plazo: number;
    cuota: number;
    price: number;
  };
}

interface CreateProjectLeadData extends CreateLeadData {
  projectId: string;
}

export async function createLead(data: CreateLeadData) {
  try {
    const leadId = randomUUID();

    await db.insert(lead).values({
      id: leadId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      contactChannel: data.contactChannel,
      marketingSource: data.marketingSource || null,
      marketingCampaign: data.marketingCampaign || null,
      status: "new",
      initialMessage: data.initialMessage || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/");

    return { success: true, leadId };
  } catch (error) {
    console.error("Error creating lead:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create lead",
    };
  }
}

export async function createLeadWithFinancing(
  data: CreateLeadWithFinancingData
) {
  try {
    const leadId = randomUUID();
    const financingId = randomUUID();
    const leadProjectId = randomUUID();

    await db.insert(lead).values({
      id: leadId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      contactChannel: data.contactChannel,
      marketingSource: data.marketingSource || null,
      marketingCampaign: data.marketingCampaign || null,
      status: "new",
      initialMessage: data.initialMessage || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.insert(leadFinancingPreference).values({
      id: financingId,
      leadId,
      anticipoAmount: data.financing.anticipo.toString(),
      plazoMonths: data.financing.plazo.toString(),
      calculatedCuota: data.financing.cuota.toString(),
      interestedPrice: data.financing.price.toString(),
      createdAt: new Date(),
    });

    await db.insert(leadProject).values({
      id: leadProjectId,
      leadId,
      projectId: data.projectId,
      interestLevel: "high",
      createdAt: new Date(),
    });

    revalidatePath("/");
    revalidatePath("/proyectos/jardines-de-arroyo");

    return { success: true, leadId };
  } catch (error) {
    console.error("Error creating lead with financing:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create lead with financing",
    };
  }
}

export async function createProjectLead(data: CreateProjectLeadData) {
  try {
    const leadId = randomUUID();
    const leadProjectId = randomUUID();

    await db.insert(lead).values({
      id: leadId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      contactChannel: data.contactChannel,
      marketingSource: data.marketingSource || null,
      marketingCampaign: data.marketingCampaign || null,
      status: "new",
      initialMessage: data.initialMessage || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.insert(leadProject).values({
      id: leadProjectId,
      leadId,
      projectId: data.projectId,
      interestLevel: "high",
      createdAt: new Date(),
    });

    revalidatePath("/");
    revalidatePath(`/proyectos/${data.projectId}`);

    return { success: true, leadId };
  } catch (error) {
    console.error("Error creating project lead:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create project lead",
    };
  }
}

const lotLeadSchema = z.object({
  lotId: z.string().min(1),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().max(1000).optional(),
  anticipo: z.number().positive().optional(),
  plazo: z.number().int().min(1).max(360).optional(),
  // Id del comercial que compartió el link del plano (?ref=...).
  ref: z.string().max(100).optional(),
});

/**
 * Consulta por un lote desde el plano público: crea el lead atado al proyecto
 * y al lote, con la simulación si el lote tiene precio. La cuota se recalcula
 * acá con el precio de la base: no se confía en el navegador.
 */
export async function createLotLead(input: z.input<typeof lotLeadSchema>) {
  const parsed = lotLeadSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Revisá los datos del formulario" };
  }
  const data = parsed.data;

  try {
    const [lote] = await db
      .select({
        projectId: lot.projectId,
        manzana: lot.manzana,
        number: lot.number,
        estado: lot.estado,
        precioBase: lot.precioBase,
        anticipoMinimoPct: lot.anticipoMinimoPct,
        plazoMaximo: lot.plazoMaximo,
      })
      .from(lot)
      .where(eq(lot.id, data.lotId));
    if (!lote) return { success: false, error: "Lote inexistente" };

    const precio = Number(lote.precioBase);
    let financing: { anticipo: number; plazo: number; cuota: number } | null = null;
    if (lote.estado === "disponible" && precio > 0 && data.anticipo && data.plazo) {
      const condiciones = condicionesLote(lote);
      const minimo = getMinimumAnticipoUsd(precio, condiciones.anticipoMinimoPct);
      if (data.anticipo < minimo || data.anticipo > precio) {
        return {
          success: false,
          error: `El anticipo tiene que estar entre USD ${minimo} y USD ${precio}`,
        };
      }
      if (data.plazo > condiciones.plazoMaximo) {
        return {
          success: false,
          error: `Este lote se financia en hasta ${condiciones.plazoMaximo} cuotas`,
        };
      }
      financing = {
        anticipo: data.anticipo,
        plazo: data.plazo,
        cuota: calculateInstallment(precio - data.anticipo, TASA_PUBLICA, data.plazo),
      };
    }

    // Un ref que no es un usuario del CRM se ignora: el lead entra como web, sin asignar.
    const [referente] = data.ref
      ? await db.select({ id: user.id, role: user.role }).from(user).where(eq(user.id, data.ref))
      : [];
    const comercial = referente && isCrmRole(referente.role) ? referente.id : null;

    const leadId = randomUUID();
    const loteLabel = `Manzana ${lote.manzana ?? "-"} · Lote ${lote.number}`;

    await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(lead)
        .values({
          id: leadId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || null,
          contactChannel: "web_form_project",
          status: "new",
          initialMessage: data.message
            ? `${loteLabel}\n\n${data.message}`
            : `Consulta por ${loteLabel}`,
          origen: comercial ? "link_comercial" : "web",
          referidoPor: comercial,
          asignadoA: comercial,
        })
        .returning();
      await logAudit(tx, {
        entidad: "lead",
        entidadId: leadId,
        usuario: "web",
        antes: null,
        despues: created,
      });
      await tx.insert(leadProject).values({
        id: randomUUID(),
        leadId,
        projectId: lote.projectId,
        lotId: data.lotId,
        interestLevel: "high",
      });
      if (financing) {
        await tx.insert(leadFinancingPreference).values({
          id: randomUUID(),
          leadId,
          anticipoAmount: financing.anticipo.toString(),
          plazoMonths: financing.plazo.toString(),
          calculatedCuota: financing.cuota.toString(),
          interestedPrice: precio.toString(),
        });
      }
    });

    return { success: true, leadId };
  } catch (error) {
    console.error("Error creating lot lead:", error);
    return { success: false, error: "No pudimos enviar la consulta" };
  }
}

export async function getLeadById(leadId: string) {
  try {
    const leadData = await db.query.lead.findFirst({
      where: (lead, { eq }) => eq(lead.id, leadId),
    });

    return leadData || null;
  } catch (error) {
    console.error("Error getting lead:", error);
    return null;
  }
}
