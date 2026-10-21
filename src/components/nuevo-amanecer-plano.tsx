"use client";

import { useState } from "react";
import { ArrowRight, Ruler } from "lucide-react";
import {
  LoteConsultaDialog,
  type LoteConsulta,
} from "@/components/lote-consulta-dialog";
import { Button } from "@/components/ui/button";
import {
  nuevoAmanecerBounds,
  nuevoAmanecerLoteKey,
  nuevoAmanecerManzanas,
  type NuevoAmanecerLote,
} from "@/lib/nuevo-amanecer";
import type { EstadoLote } from "@/lib/schema";

// Paleta de marca Fitzroya (verde bosque + lima + crema).
const brand = {
  forest: "#193e2e",
  moss: "#6e874c",
  lime: "#d2e7a6",
  limeDeep: "#b4d17f",
  cream: "#f7f8f0",
  street: "#e6ebdb",
  line: "#9db08a",
  reserved: "#e8c872",
  sold: "#b9c0b4",
};

const STREET = 14; // margen perimetral (calles) en metros
const HEADER = 10; // espacio para las etiquetas de manzana

const viewWidth = nuevoAmanecerBounds.width + STREET * 2;
const viewHeight = nuevoAmanecerBounds.height + STREET * 2 + HEADER;

const estadoLabel: Record<EstadoLote, string> = {
  disponible: "Disponible",
  reservado: "Reservado",
  vendido: "Vendido",
  no_disponible: "No disponible",
};

function formatMeters(value: number) {
  return value.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export type LotePublico = {
  id: string;
  estado: EstadoLote;
  /** Precio de lista; null si no está disponible o no tiene precio cargado. */
  precio: number | null;
};

interface NuevoAmanecerPlanoProps {
  /** Lotes de la base por "manzana-numero"; los lotes sin dato se muestran disponibles. */
  lotes?: Record<string, LotePublico>;
  /** Admin: ve reservado y vendido. El público solo ve disponible / no disponible. */
  detallado?: boolean;
  /** Comercial que compartió el link del plano (?ref=). */
  refId?: string | undefined;
}

export function NuevoAmanecerPlano({ lotes = {}, detallado = false, refId }: NuevoAmanecerPlanoProps) {
  const [selected, setSelected] = useState<NuevoAmanecerLote | null>(null);
  const [hovered, setHovered] = useState<NuevoAmanecerLote | null>(null);
  const [consulta, setConsulta] = useState<LoteConsulta | null>(null);

  const active = hovered ?? selected;
  const loteDb = (lote: NuevoAmanecerLote) =>
    lotes[nuevoAmanecerLoteKey(lote.manzana, lote.numero)];
  const estadoDe = (lote: NuevoAmanecerLote) =>
    loteDb(lote)?.estado ?? "disponible";

  const abrirConsulta = (lote: NuevoAmanecerLote) => {
    setSelected(lote);
    const db = loteDb(lote);
    if (!db) return; // Lote del plano que todavía no está en la base.
    setConsulta({
      id: db.id,
      titulo: `Manzana ${lote.manzana} · Lote ${lote.numero}`,
      datos: [
        ["Estado", estadoLabel[db.estado]],
        ["Superficie", `${lote.superficie} m²`],
        ["Medidas", `${formatMeters(lote.frente)} × ${formatMeters(lote.fondo)} m`],
      ],
      disponible: db.estado === "disponible",
      precio: db.precio,
    });
  };

  const fillFor = (lote: NuevoAmanecerLote) => {
    const isActive =
      active?.manzana === lote.manzana && active.numero === lote.numero;
    if (isActive) return brand.forest;
    const estado = estadoDe(lote);
    if (estado === "reservado") return brand.reserved;
    if (estado === "vendido" || estado === "no_disponible") return brand.sold;
    return lote.tipo === "cabecera" ? brand.lime : brand.limeDeep;
  };

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto rounded-3xl border border-[#d7dfcb] bg-[#f7f8f0] p-3 shadow-sm sm:p-5">
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="h-auto w-full min-w-[720px] select-none"
          role="img"
          aria-label="Plano de Nuevo Amanecer: 5 manzanas y 80 lotes"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <defs>
            <pattern
              id="na-grass"
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
            >
              <rect width="6" height="6" fill={brand.cream} />
              <circle cx="1.5" cy="1.5" r="0.45" fill={brand.lime} />
              <circle cx="4.5" cy="4.5" r="0.45" fill={brand.lime} />
            </pattern>
          </defs>

          {/* Calles perimetrales e internas */}
          <rect
            x={0}
            y={HEADER}
            width={viewWidth}
            height={viewHeight - HEADER}
            rx={6}
            fill={brand.street}
          />
          {[HEADER + STREET / 2, viewHeight - STREET / 2].map((y) => (
            <line
              key={y}
              x1={4}
              x2={viewWidth - 4}
              y1={y}
              y2={y}
              stroke={brand.cream}
              strokeWidth={0.6}
              strokeDasharray="4 3"
            />
          ))}

          <g transform={`translate(${STREET} ${STREET + HEADER})`}>
            {nuevoAmanecerManzanas.map((manzana, index) => {
              const next = nuevoAmanecerManzanas[index + 1];
              const gapX = manzana.x + manzana.width;
              return (
                <g key={manzana.numero}>
                  {/* Eje de la calle lateral */}
                  {next && (
                    <line
                      x1={(gapX + next.x) / 2}
                      x2={(gapX + next.x) / 2}
                      y1={-STREET + 3}
                      y2={nuevoAmanecerBounds.height + STREET - 3}
                      stroke={brand.cream}
                      strokeWidth={0.6}
                      strokeDasharray="4 3"
                    />
                  )}

                  {/* Etiqueta de manzana */}
                  <g
                    transform={`translate(${manzana.x + manzana.width / 2} ${-STREET - HEADER / 2})`}
                  >
                    <rect
                      x={-17}
                      y={-4.2}
                      width={34}
                      height={8.4}
                      rx={4.2}
                      fill={brand.forest}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={4}
                      fontWeight={700}
                      fill={brand.cream}
                      letterSpacing={0.4}
                    >
                      MANZANA {manzana.numero}
                    </text>
                  </g>

                  <rect
                    x={manzana.x - 0.8}
                    y={-0.8}
                    width={manzana.width + 1.6}
                    height={manzana.height + 1.6}
                    rx={1.6}
                    fill="url(#na-grass)"
                    stroke={brand.forest}
                    strokeWidth={0.9}
                  />

                  {manzana.lotes.map((lote) => {
                    const isActive =
                      active?.manzana === lote.manzana &&
                      active.numero === lote.numero;
                    const textColor = isActive ? brand.cream : brand.forest;
                    const cx = lote.x + lote.width / 2;
                    const cy = lote.y + lote.height / 2;
                    return (
                      <g
                        key={lote.numero}
                        role="button"
                        tabIndex={0}
                        aria-label={`Manzana ${lote.manzana}, lote ${lote.numero}: ${lote.superficie} metros cuadrados, ${estadoLabel[estadoDe(lote)]}`}
                        className="cursor-pointer outline-none"
                        onMouseEnter={() => setHovered(lote)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(lote)}
                        onBlur={() => setHovered(null)}
                        onClick={() => abrirConsulta(lote)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            abrirConsulta(lote);
                          }
                        }}
                      >
                        <rect
                          x={lote.x + 0.5}
                          y={lote.y + 0.5}
                          width={lote.width - 1}
                          height={lote.height - 1}
                          rx={0.8}
                          fill={fillFor(lote)}
                          stroke={brand.cream}
                          strokeWidth={0.5}
                          style={{ transition: "fill 150ms ease" }}
                        />
                        <text
                          x={cx}
                          y={cy - 1.6}
                          textAnchor="middle"
                          fontSize={4.2}
                          fontWeight={700}
                          fill={textColor}
                          pointerEvents="none"
                        >
                          {lote.numero}
                        </text>
                        <text
                          x={cx}
                          y={cy + 3.4}
                          textAnchor="middle"
                          fontSize={2.7}
                          fill={isActive ? brand.lime : brand.moss}
                          pointerEvents="none"
                        >
                          {lote.superficie} m²
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>

          {/* Firma */}
          <text
            x={viewWidth - 6}
            y={viewHeight - 3.2}
            textAnchor="end"
            fontSize={3}
            fontWeight={700}
            fill={brand.moss}
            letterSpacing={0.6}
          >
            NUEVO AMANECER · FITZROYA DESARROLLOS
          </text>
        </svg>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {[
            { color: brand.lime, label: "Lotes de 602 a 607 m²" },
            { color: brand.limeDeep, label: "Lotes de 844 a 910 m²" },
            ...(detallado
              ? [
                  { color: brand.reserved, label: "Reservado" },
                  { color: brand.sold, label: "Vendido" },
                ]
              : [{ color: brand.sold, label: "No disponible" }]),
          ].map((item) => (
            <span key={item.label} className="inline-flex items-center gap-2">
              <span
                className="size-3.5 rounded-sm border border-black/10"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground md:hidden">
          Deslizá el plano hacia los costados para ver todas las manzanas.
        </p>
      </div>

      <div
        className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
        aria-live="polite"
      >
        {active ? (
          <>
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Manzana {active.manzana} · Lote {active.numero}
              </p>
              <p className="text-3xl font-black tracking-tight">
                {active.superficie} m²
              </p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Ruler className="size-4" />
                {formatMeters(active.frente)} m de frente ×{" "}
                {formatMeters(active.fondo)} m de fondo ·{" "}
                {estadoLabel[estadoDe(active)]}
              </p>
            </div>
            <Button className="rounded-full" onClick={() => abrirConsulta(active)}>
              Simular cuota y consultar
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Tocá un lote para ver sus medidas, simular la cuota y consultar.
          </p>
        )}
      </div>

      <LoteConsultaDialog
        lote={consulta}
        refId={refId}
        onOpenChange={(open) => {
          if (!open) setConsulta(null);
        }}
      />
    </div>
  );
}
