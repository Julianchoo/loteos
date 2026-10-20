"use server";

import { revalidatePath } from "next/cache";
import { seedNuevoAmanecer } from "@/lib/nuevo-amanecer-seed";
import { isCurrentUserAdmin } from "@/lib/session";

export async function createNuevoAmanecerProject() {
  if (!(await isCurrentUserAdmin())) {
    throw new Error("Solo un administrador puede crear el proyecto");
  }

  await seedNuevoAmanecer({ isVisible: true });

  revalidatePath("/", "layout");
}
