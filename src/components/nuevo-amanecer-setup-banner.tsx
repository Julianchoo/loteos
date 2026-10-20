import { Button } from "@/components/ui/button";
import { createNuevoAmanecerProject } from "@/lib/actions/nuevo-amanecer-actions";

export function NuevoAmanecerSetupBanner() {
  return (
    <div className="border-b bg-amber-50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100">
      <form
        action={createNuevoAmanecerProject}
        className="container mx-auto flex flex-col gap-3 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <span>
          Vista de administrador: el proyecto todavía no existe en la base. Al
          crearlo se dan de alta los 80 lotes del plano y queda visible al público.
        </span>
        <Button type="submit" size="sm" className="shrink-0">
          Crear proyecto y lotes
        </Button>
      </form>
    </div>
  );
}
