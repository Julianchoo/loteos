"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProject, type UpdateProjectData } from "@/lib/actions/project-actions";
import type { ProjectWithPricing } from "@/lib/actions/project-actions";

interface EditProjectDialogProps {
  project: ProjectWithPricing;
}

export function EditProjectDialog({ project }: EditProjectDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<UpdateProjectData>({
    name: project.name,
    description: project.description,
    location: project.location,
    totalArea: project.totalArea,
    totalLots: project.totalLots,
    isVisible: project.isVisible,
    basePrice: project.basePrice,
    minCashDown: project.minCashDown,
    maxFinancingMonths: project.maxFinancingMonths,
    tna: project.tna,
  });

  function handleChange(field: keyof UpdateProjectData, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value === "" ? null : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updateProject(project.id, form);
      if (!result.success) {
        toast.error(result.error ?? "Error al guardar los cambios");
        return;
      }
      toast.success("Proyecto actualizado");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Error inesperado al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar proyecto</DialogTitle>
          <DialogDescription>
            {project.name} - modifica los datos y guarda los cambios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} required disabled={loading} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Descripcion</Label>
            <Input id="description" value={form.description ?? ""} onChange={(e) => handleChange("description", e.target.value)} disabled={loading} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">Ubicacion</Label>
            <Input id="location" value={form.location ?? ""} onChange={(e) => handleChange("location", e.target.value)} disabled={loading} />
          </div>
          <div className="flex items-center gap-2 rounded-md border p-3">
            <input
              id="isVisible"
              type="checkbox"
              checked={form.isVisible}
              onChange={(e) => setForm((prev) => ({ ...prev, isVisible: e.target.checked }))}
              disabled={loading}
              className="h-4 w-4"
            />
            <Label htmlFor="isVisible">Visible en el sitio publico</Label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="totalArea">Superficie total</Label>
              <Input id="totalArea" value={form.totalArea ?? ""} onChange={(e) => handleChange("totalArea", e.target.value)} disabled={loading} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="totalLots">Cant. lotes</Label>
              <Input id="totalLots" value={form.totalLots ?? ""} onChange={(e) => handleChange("totalLots", e.target.value)} disabled={loading} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="basePrice">Precio base (USD)</Label>
              <Input id="basePrice" value={form.basePrice ?? ""} onChange={(e) => handleChange("basePrice", e.target.value)} disabled={loading} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="minCashDown">Anticipo min. (USD)</Label>
              <Input id="minCashDown" value={form.minCashDown ?? ""} onChange={(e) => handleChange("minCashDown", e.target.value)} disabled={loading} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="maxFinancingMonths">Plazo max. (meses)</Label>
              <Input
                id="maxFinancingMonths"
                type="number"
                value={form.maxFinancingMonths ?? ""}
                onChange={(e) => setForm((prev) => ({ ...prev, maxFinancingMonths: e.target.value === "" ? null : parseInt(e.target.value, 10) }))}
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tna">TNA (%)</Label>
              <Input id="tna" value={form.tna ?? ""} onChange={(e) => handleChange("tna", e.target.value)} disabled={loading} />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar cambios"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
