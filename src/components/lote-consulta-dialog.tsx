"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { CalculadoraCuota, type Simulacion } from "@/components/calculadora-cuota";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createLotLead } from "@/lib/actions/lead-actions";
import { formatUsd } from "@/lib/financiacion";

export type LoteConsulta = {
  /** Id del lote en la base; sin id no se puede consultar desde el plano. */
  id: string;
  titulo: string;
  datos: [string, string][];
  disponible: boolean;
  /** Precio de lista; solo llega si el lote está disponible y tiene precio. */
  precio: number | null;
};

const emptyForm = { firstName: "", lastName: "", email: "", phone: "", message: "" };

export function LoteConsultaDialog({
  lote,
  refId,
  onOpenChange,
}: {
  lote: LoteConsulta | null;
  /** Comercial que compartió el link del plano (?ref=); el lead se le asigna. */
  refId?: string | undefined;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={!!lote} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        {/* key: al cambiar de lote se reinician la simulación y el formulario. */}
        {lote && <Contenido key={lote.id} lote={lote} refId={refId} />}
      </DialogContent>
    </Dialog>
  );
}

function Contenido({ lote, refId }: { lote: LoteConsulta; refId?: string | undefined }) {
  const [simulacion, setSimulacion] = useState<Simulacion | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const update = (key: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      const sim = lote.precio ? simulacion : null;
      const result = await createLotLead({
        lotId: lote.id,
        ref: refId,
        ...form,
        anticipo: sim?.anticipo,
        plazo: sim?.plazo,
      });
      if (result.success) {
        setEnviado(true);
      } else {
        toast.error(result.error ?? "No pudimos enviar la consulta");
      }
    } catch {
      toast.error("No pudimos enviar la consulta");
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <div className="space-y-3 py-6 text-center">
        <CheckCircle2 className="mx-auto size-10 text-primary" />
        <DialogTitle>¡Gracias! Recibimos tu consulta</DialogTitle>
        <DialogDescription>
          Un asesor te va a contactar por {lote.titulo}.
        </DialogDescription>
      </div>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{lote.titulo}</DialogTitle>
        <DialogDescription>
          {lote.precio
            ? "Simulá tu cuota y dejanos tus datos: un asesor te contacta con esta simulación."
            : "Dejanos tus datos y un asesor te contacta por este lote."}
        </DialogDescription>
      </DialogHeader>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        {lote.datos.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-foreground">{v}</dd>
          </div>
        ))}
        {lote.precio && (
          <div className="contents">
            <dt className="text-muted-foreground">Precio de lista</dt>
            <dd className="font-semibold text-foreground">{formatUsd(lote.precio)}</dd>
          </div>
        )}
      </dl>

      {lote.precio ? (
        <div className="space-y-2 border-t pt-4">
          <p className="text-sm font-semibold text-foreground">Simulá tu cuota</p>
          <CalculadoraCuota precio={lote.precio} publico onSimulacion={setSimulacion} />
        </div>
      ) : (
        <p className="border-t pt-4 text-sm text-muted-foreground">
          {lote.disponible
            ? "Consultanos el precio y la financiación de este lote."
            : "Este lote no está disponible. Elegí otro o consultanos por opciones similares."}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 border-t pt-4">
        <p className="text-sm font-semibold text-foreground">Consultar por este lote</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="lote-firstName">Nombre *</Label>
            <Input id="lote-firstName" value={form.firstName} onChange={update("firstName")} required disabled={enviando} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lote-lastName">Apellido *</Label>
            <Input id="lote-lastName" value={form.lastName} onChange={update("lastName")} required disabled={enviando} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lote-email">Email *</Label>
          <Input id="lote-email" type="email" value={form.email} onChange={update("email")} required disabled={enviando} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lote-phone">Teléfono (recomendado)</Label>
          <Input
            id="lote-phone"
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            placeholder="+54 9 11 1234 5678"
            disabled={enviando}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lote-message">Mensaje (opcional)</Label>
          <Textarea id="lote-message" value={form.message} onChange={update("message")} rows={2} disabled={enviando} />
        </div>
        <Button type="submit" className="w-full" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar consulta"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Las condiciones finales se confirman con un asesor.
        </p>
      </form>
    </>
  );
}
