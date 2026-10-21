"use client";

import { useState } from "react";
import { CheckCircle2, MessageSquare, X } from "lucide-react";
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
  anticipoMinimoPct: number;
  plazoMaximo: number;
};

/**
 * Panel del lote elegido en el plano (como en Barrio Stefani): datos y calculadora en la
 * página; recién "Consultar por este lote" abre el formulario de contacto.
 * El padre cambia la `key` al elegir otro lote para reiniciar la simulación.
 */
export function LoteConsultaPanel({
  lote,
  refId,
  onClose,
}: {
  lote: LoteConsulta;
  /** Comercial que compartió el link del plano (?ref=); el lead se le asigna. */
  refId?: string | undefined;
  onClose: () => void;
}) {
  const [simulacion, setSimulacion] = useState<Simulacion | null>(null);
  const [consultando, setConsultando] = useState(false);
  const sim = lote.precio ? simulacion : null;

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Lote seleccionado
          </p>
          <h3 className="text-2xl font-black tracking-tight">{lote.titulo}</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar lote">
          <X className="size-4" />
        </Button>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
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
          {!lote.precio && (
            <p className="text-sm text-muted-foreground">
              {lote.disponible
                ? "Consultanos el precio y la financiación de este lote."
                : "Este lote no está disponible. Elegí otro o consultanos por opciones similares."}
            </p>
          )}
          <Button className="w-full rounded-full sm:w-auto" onClick={() => setConsultando(true)}>
            <MessageSquare className="mr-2 size-4" />
            Consultar por este lote
          </Button>
          <p className="text-xs text-muted-foreground">
            Las condiciones finales se confirman con un asesor.
          </p>
        </div>

        {lote.precio && (
          <div className="space-y-2 lg:border-l lg:pl-6">
            <p className="text-sm font-semibold text-foreground">Simulá tu cuota</p>
            <CalculadoraCuota
              precio={lote.precio}
              publico
              anticipoMinimoPct={lote.anticipoMinimoPct}
              plazoMaximo={lote.plazoMaximo}
              onSimulacion={setSimulacion}
            />
          </div>
        )}
      </div>

      <Dialog open={consultando} onOpenChange={setConsultando}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
          <FormularioConsulta lote={lote} sim={sim} refId={refId} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const emptyForm = { firstName: "", lastName: "", email: "", phone: "", message: "" };

function FormularioConsulta({
  lote,
  sim,
  refId,
}: {
  lote: LoteConsulta;
  sim: Simulacion | null;
  refId?: string | undefined;
}) {
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
        <DialogDescription>Un asesor te va a contactar por {lote.titulo}.</DialogDescription>
      </div>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Consultar por este lote</DialogTitle>
        <DialogDescription>
          {lote.titulo}
          {sim
            ? ` · Anticipo ${formatUsd(sim.anticipo)} + ${sim.plazo} cuotas de ${formatUsd(sim.cuotaMensual)}`
            : ""}
          . Dejanos tus datos y un asesor te contacta.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-3">
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
      </form>
    </>
  );
}
