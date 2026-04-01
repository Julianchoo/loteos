"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { randomUUID } from "crypto";
import { syncLeadToAirtable } from "@/lib/airtable-sync";
import { db } from "@/lib/db";
import { lead, leadFinancingPreference, leadProject } from "@/lib/schema";

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

export async function createLead(data: CreateLeadData) {
  try {
    const leadId = randomUUID();

    // Insert lead into database
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
      syncStatus: "pending",
    });

    // Trigger sync to Airtable after response is sent
    after(async () => {
      await syncLeadToAirtable(leadId).catch((error) => {
        console.error("Failed to sync lead to Airtable:", error);
      });
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

    // Insert lead
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
      syncStatus: "pending",
    });

    // Insert financing preferences
    await db.insert(leadFinancingPreference).values({
      id: financingId,
      leadId,
      anticipoAmount: data.financing.anticipo.toString(),
      plazoMonths: data.financing.plazo.toString(),
      calculatedCuota: data.financing.cuota.toString(),
      interestedPrice: data.financing.price.toString(),
      createdAt: new Date(),
    });

    // Link lead to project
    await db.insert(leadProject).values({
      id: leadProjectId,
      leadId,
      projectId: data.projectId,
      interestLevel: "high", // Default to high for project-specific forms
      createdAt: new Date(),
    });

    // Trigger sync to Airtable after response is sent
    after(async () => {
      await syncLeadToAirtable(leadId).catch((error) => {
        console.error("Failed to sync lead to Airtable:", error);
      });
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
