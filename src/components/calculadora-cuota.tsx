"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  ANTICIPO_STEP_USD,
  calculateInstallment,
  formatUsd,
  getMinimumAnticipoUsd,
  PLAZO_MAX_PUBLICO,
  roundCurrency,
  TASA_PUBLICA,
} from "@/lib/financiacion";

export type Simulacion = { anticipo: number; plazo: number; cuotaMensual: number };

/**
 * Calculadora pública de cuota (portada de Barrio Stefani): el precio es el
 * del lote, la tasa queda fija y el plazo llega hasta PLAZO_MAX_PUBLICO.
 * Para recalcular con otro precio, el padre cambia la `key`.
 */
export function CalculadoraCuota({
  precio,
  onSimulacion,
}: {
  precio: number;
  onSimulacion?: (simulacion: Simulacion) => void;
}) {
  const minimumAnticipo = getMinimumAnticipoUsd(precio);
  const [anticipo, setAnticipo] = useState(minimumAnticipo);
  const [plazo, setPlazo] = useState(PLAZO_MAX_PUBLICO);

  const result = useMemo(() => {
    const cuotaMensual = calculateInstallment(
      Math.max(precio - anticipo, 0),
      TASA_PUBLICA,
      plazo
    );
    const totalFinanciado = roundCurrency(cuotaMensual * plazo);
    return {
      cuotaMensual,
      totalFinanciado,
      precioTotal: roundCurrency(anticipo + totalFinanciado),
    };
  }, [precio, anticipo, plazo]);

  useEffect(() => {
    onSimulacion?.({ anticipo, plazo, cuotaMensual: result.cuotaMensual });
  }, [onSimulacion, anticipo, plazo, result.cuotaMensual]);

  // El input deja tipear valores fuera de rango; el slider los acota.
  const clampAnticipo = (value: number, enforceMinimum: boolean) =>
    Math.min(Math.max(value, enforceMinimum ? minimumAnticipo : 0), precio);
  const clampPlazo = (value: number) =>
    Math.min(Math.max(Math.round(value), 1), PLAZO_MAX_PUBLICO);

  const anticipoInvalido = anticipo < minimumAnticipo;

  const fields = [
    {
      key: "anticipo",
      label: "Anticipo",
      value: anticipo,
      min: minimumAnticipo,
      max: precio,
      step: ANTICIPO_STEP_USD,
      suffix: "USD",
      onInput: (v: number) => setAnticipo(clampAnticipo(v, false)),
      onSlide: (v: number) => setAnticipo(clampAnticipo(v, true)),
    },
    {
      key: "plazo",
      label: "Plazo",
      value: plazo,
      min: 1,
      max: PLAZO_MAX_PUBLICO,
      step: 1,
      suffix: "meses",
      onInput: (v: number) => setPlazo(clampPlazo(v)),
      onSlide: (v: number) => setPlazo(clampPlazo(v)),
    },
  ];

  const results: [string, string][] = [
    ["Cuota inicial base", formatUsd(result.cuotaMensual)],
    ["Total en cuotas", formatUsd(result.totalFinanciado)],
    ["Precio total", formatUsd(result.precioTotal)],
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {fields.map((item) => {
          const invalid = item.key === "anticipo" && anticipoInvalido;
          return (
            <label key={item.key} className="space-y-2">
              <span className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={item.min}
                    max={item.max}
                    step={item.key === "anticipo" ? "any" : item.step}
                    value={item.value}
                    onChange={(e) => item.onInput(Number(e.target.value))}
                    aria-invalid={invalid}
                    className={`h-8 w-28 text-right ${
                      invalid ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                  />
                  <span className="w-10 text-left text-muted-foreground">
                    {item.suffix}
                  </span>
                </span>
              </span>
              <input
                type="range"
                min={item.min}
                max={item.max}
                step={item.step}
                value={Math.min(item.value, item.max)}
                onChange={(e) => item.onSlide(Number(e.target.value))}
                className="w-full accent-primary"
              />
              {invalid && (
                <p className="text-xs font-medium text-red-600" role="alert">
                  Mínimo: {formatUsd(minimumAnticipo)}
                </p>
              )}
            </label>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {results.map(([label, value], i) => (
          <div
            key={label}
            className={`rounded-md border bg-muted/40 px-3 py-2 ${i === 0 ? "col-span-2" : ""}`}
          >
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold text-foreground">{value}</p>
            {i === 0 && (
              <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                No es una cuota fija: se ajusta mes a mes por CAC.
              </p>
            )}
          </div>
        ))}
      </div>
      <p className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
        Valores estimativos. La operación se pacta en pesos con ajuste por CAC y
        las condiciones finales se definen en el contrato.
      </p>
    </div>
  );
}
