"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCrm } from "@/components/crm/crm-context";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { EstadoLote } from "@/lib/schema";

const TEXT_FIELDS = [
  { key: "manzana", label: "Manzana" },
  { key: "parcela", label: "Parcela catastral" },
  { key: "circunscripcion", label: "Circunscripción" },
  { key: "seccion", label: "Sección" },
  { key: "partidaArba", label: "Partida ARBA" },
  { key: "calleFrente", label: "Calle frente" },
] as const;

const NUMBER_FIELDS = [
  { key: "superficieM2", label: "Superficie (m²)" },
  { key: "metrosFrente", label: "Frente (m)" },
  { key: "metrosFondo", label: "Fondo (m)" },
  { key: "precioBase", label: "Precio base (USD)" },
] as const;

type FieldKey =
  | (typeof TEXT_FIELDS)[number]["key"]
  | (typeof NUMBER_FIELDS)[number]["key"]
  | "number"
  | "nota";

const EMPTY_FORM: Record<FieldKey, string> = {
  number: "",
  manzana: "",
  parcela: "",
  circunscripcion: "",
  seccion: "",
  partidaArba: "",
  calleFrente: "",
  superficieM2: "",
  metrosFrente: "",
  metrosFondo: "",
  precioBase: "",
  nota: "",
};

export function NuevoLoteDialog({ onCreated }: { onCreated: () => void }) {
  const { projects, projectId: selectedProjectId } = useCrm();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [estado, setEstado] = useState<EstadoLote>("disponible");
  const [form, setForm] = useState(EMPTY_FORM);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setProjectId(selectedProjectId);
      setEstado("disponible");
      setForm(EMPTY_FORM);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!projectId) {
      toast.error("Elegí el proyecto del lote");
      return;
    }

    setSaving(true);
    const payload = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim() || null])
    );
    const res = await fetch("/api/crm/lotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, projectId, estado }),
    });
    setSaving(false);

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      toast.error(data?.error ?? "No se pudo crear el lote");
      return;
    }

    toast.success(`Lote ${form.number.trim()} creado`);
    setOpen(false);
    onCreated();
  }

  function update(key: FieldKey, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Nuevo lote
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Nuevo lote</DialogTitle>
            <DialogDescription>
              El resto de los datos catastrales y de precio se completan después desde la ficha
              del lote.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="nuevo-lote-proyecto">Proyecto *</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger id="nuevo-lote-proyecto">
                  <SelectValue placeholder="Elegí un proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nuevo-lote-numero">Número de lote *</Label>
              <Input
                id="nuevo-lote-numero"
                value={form.number}
                onChange={(e) => update("number", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nuevo-lote-estado">Estado inicial</Label>
              <Select value={estado} onValueChange={(v) => setEstado(v as EstadoLote)}>
                <SelectTrigger id="nuevo-lote-estado">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="no_disponible">No disponible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {TEXT_FIELDS.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={`nuevo-lote-${field.key}`}>{field.label}</Label>
                <Input
                  id={`nuevo-lote-${field.key}`}
                  value={form[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                />
              </div>
            ))}
            {NUMBER_FIELDS.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={`nuevo-lote-${field.key}`}>{field.label}</Label>
                <Input
                  id={`nuevo-lote-${field.key}`}
                  type="number"
                  min="0"
                  step="any"
                  value={form[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nuevo-lote-nota">Nota</Label>
            <Textarea
              id="nuevo-lote-nota"
              value={form.nota}
              onChange={(e) => update("nota", e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Creando..." : "Crear lote"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
