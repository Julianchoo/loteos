import { Badge } from "@/components/ui/badge";

export function ProjectAdminVisibilityBanner({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="border-b bg-muted/50">
      <div className="container mx-auto flex items-center gap-3 px-4 py-3 text-sm">
        <Badge variant={isVisible ? "default" : "secondary"}>
          {isVisible ? "Visible" : "Oculto"}
        </Badge>
        <span className="text-muted-foreground">Vista de administrador: este estado controla si el proyecto aparece publicamente.</span>
      </div>
    </div>
  );
}
