"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { lot, contactRequest } from "@/lib/schema";

export async function getLots() {
    try {
        const results = await db.select().from(lot).orderBy(lot.number);
        return { success: true, data: results };
    } catch (error) {
        console.error("Error fetching lots:", error);
        return { success: false, error: "Failed to fetch lots" };
    }
}

export async function submitContactRequest(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;
    const lotId = formData.get("lotId") as string | null;

    try {
        await db.insert(contactRequest).values({
            id: crypto.randomUUID(),
            name,
            email,
            phone,
            message,
            lotId: lotId || null,
        });

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error submitting contact request:", error);
        return { success: false, error: "Failed to submit request" };
    }
}
