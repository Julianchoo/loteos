"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { updateLead, type UpdateLeadData } from "@/lib/actions/lead-actions";

const STATUS_OPTIONS = [
  { value: "new", label: "Nuevo" },
  { value: "contacted", label: "Contactado" },
  { value: "interested", label: "Interesado" },
  { value: "visit_scheduled", label: "Visita agendada" },
  { value: "proposal_sent", label: "Propuesta enviada" },
  { value: "sold", label: "Vendido" },
  { value: "lost", label: "Perdido" },
];

const CHANNEL_OPTIONS = [
  { value: "web_form_general", label: "Web general" },
  { value: "web_form_project", label: "Web proyecto" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Teléfono" },
  { value: "in_person", label: "Presencial" },
];

export interface LeadForDialog {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  contactChannel: string;
  marketingSource: string | null;
  marketingCampaign: string | null;
  status: string;
  initialMessage: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Related data
  projectName: string | null;
  projectId: string | null;
  interestLevel: string | null;
  projectNotes: string | null;
  anticipoAmount: string | null;
  plazoMonths: string | null;
  calculatedCuota: string | null;
  interestedPrice: string | null;
}

interface LeadDetailDialogProps {
  lead: LeadForDialog;
}

export function LeadDetailDialog({ lead }: LeadDetailDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<UpdateLeadData>({
    status: lead.status,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    contactChannel: lead.contactChannel,
    marketingSource: lead.marketingSource,
    marketingCampaign: lead.marketingCampaign,
    notes: lead.notes,
  });

  function handleChange(field: keyof UpdateLeadData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value === "" ? null : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updateLead(lead.id, form);
      if (!result.success) {
        toast.error(result.error ?? "Error al guardar");
        return;
      }
      toast.success("Lead actualizado");
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
          <Eye className="h-3.5 w-3.5" />
          Ver
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {lead.firstName} {lead.lastName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-2">
          {/* Estado — campo principal de CRM */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={form.status}
              onValueChange={(val) => setForm((prev) => ({ ...prev, status: val }))}
              disabled={loading}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Datos de contacto */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Datos de contacto
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={form.phone ?? ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Origen */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Origen
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contactChannel">Canal</Label>
                <Select
                  value={form.contactChannel}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, contactChannel: val }))}
                  disabled={loading}
                >
                  <SelectTrigger id="contactChannel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CHANNEL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="marketingSource">Fuente</Label>
                <Input
                  id="marketingSource"
                  value={form.marketingSource ?? ""}
                  onChange={(e) => handleChange("marketingSource", e.target.value)}
                  placeholder="facebook, google, referral…"
                  disabled={loading}
                />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="marketingCampaign">Campaña</Label>
                <Input
                  id="marketingCampaign"
                  value={form.marketingCampaign ?? ""}
                  onChange={(e) => handleChange("marketingCampaign", e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Mensaje inicial (solo lectura) */}
          {lead.initialMessage && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Mensaje inicial
              </p>
              <p className="text-sm bg-muted/40 rounded-md px-3 py-2 whitespace-pre-wrap">
                {lead.initialMessage}
              </p>
            </div>
          )}

          {/* Proyecto e interés (solo lectura) */}
          {lead.projectName && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Proyecto de interés
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span>
                  <span className="text-muted-foreground">Proyecto: </span>
                  <strong>{lead.projectName}</strong>
                </span>
                {lead.interestLevel && (
                  <span>
                    <span className="text-muted-foreground">Nivel de interés: </span>
                    <Badge variant="outline">{lead.interestLevel}</Badge>
                  </span>
                )}
              </div>
              {lead.projectNotes && (
                <p className="mt-2 text-sm bg-muted/40 rounded-md px-3 py-2">{lead.projectNotes}</p>
              )}
            </div>
          )}

          {/* Preferencias de financiación (solo lectura) */}
          {lead.anticipoAmount && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Simulación de financiación
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="bg-muted/40 rounded-md px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-0.5">Precio</p>
                  <p className="font-medium">USD {lead.interestedPrice}</p>
                </div>
                <div className="bg-muted/40 rounded-md px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-0.5">Anticipo</p>
                  <p className="font-medium">USD {lead.anticipoAmount}</p>
                </div>
                <div className="bg-muted/40 rounded-md px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-0.5">Plazo</p>
                  <p className="font-medium">{lead.plazoMonths} meses</p>
                </div>
                <div className="bg-muted/40 rounded-md px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-0.5">Cuota</p>
                  <p className="font-medium">USD {lead.calculatedCuota}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notas internas */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notas internas</Label>
            <Textarea
              id="notes"
              value={form.notes ?? ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Agregá notas de seguimiento, próximos pasos, etc."
              rows={4}
              disabled={loading}
            />
          </div>

          {/* Metadatos */}
          <div className="flex gap-6 text-xs text-muted-foreground pt-1 border-t">
            <span>
              Creado:{" "}
              {new Date(lead.createdAt).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span>
              Actualizado:{" "}
              {new Date(lead.updatedAt).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
