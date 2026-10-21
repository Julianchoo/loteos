"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

// Link al plano público con el id del comercial: los leads que entren por ahí se le asignan.
// Solo se muestra a usuarios del CRM (el servidor además ignora un ref que no sea del CRM).
export function CompartirPlanoButton({
  path,
  title,
  ...props
}: React.ComponentProps<typeof Button> & { path: string; title: string }) {
  const { data: session } = useSession();
  if (!session) return null;

  const compartir = async () => {
    const url = `${window.location.origin}${path}?ref=${session.user.id}`;
    if (navigator.share) {
      // Cerrar el menú de compartir sin elegir nada tira AbortError: no es un error.
      await navigator.share({ title, url }).catch(() => {});
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado: los leads que entren por ahí quedan asignados a vos");
    } catch {
      toast.error(`No se pudo copiar. Tu link: ${url}`);
    }
  };

  return (
    <Button onClick={compartir} {...props}>
      <Share2 className="h-4 w-4 mr-2" />
      Compartir plano
    </Button>
  );
}
