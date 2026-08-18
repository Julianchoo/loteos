"use client";

import { useState, useMemo } from "react";
import { Calculator, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClientNumber } from "@/components/ui/client-number";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface FinancingCalculatorProps {
    basePrice?: number;
    minDownPayment?: number;
    maxMonths?: number;
    tna?: number;
    onInterestedClick?: (values: {
        anticipo: number;
        plazo: number;
        cuota: number;
        price: number;
    }) => void;
}

export function FinancingCalculator({
    basePrice,
    minDownPayment: minDownPaymentProp,
    maxMonths: maxMonthsProp,
    tna: tnaProp,
    onInterestedClick
}: FinancingCalculatorProps) {
    // Use props if provided, otherwise fall back to env vars, then hardcoded defaults
    const price = basePrice ?? Number(process.env.NEXT_PUBLIC_LOT_BASE_PRICE || 19500);
    const minDownPayment = minDownPaymentProp ?? Number(process.env.NEXT_PUBLIC_MIN_DOWN_PAYMENT || 2500);
    const maxMonths = maxMonthsProp ?? Number(process.env.NEXT_PUBLIC_MAX_MONTHS || 72);
    const annualInterestRate = tnaProp ?? Number(process.env.NEXT_PUBLIC_ANNUAL_INTEREST_RATE || 0.15);

    const defaultDownPayment = Math.max(minDownPayment, price * 0.2); // 20% or minimum
    const defaultMonths = Math.min(60, maxMonths); // Default to 60 months or max
    const minMonths = 12;
    const maxDownPayment = price;

    const [downPayment, setDownPayment] = useState(defaultDownPayment);
    const [months, setMonths] = useState(defaultMonths);

    const monthlyPayment = useMemo(() => {
        const principal = price - downPayment;
        if (principal <= 0) {
            return 0;
        }

        // Calculate with interest using TNA (Tasa Nominal Anual)
        if (annualInterestRate && annualInterestRate > 0) {
            const monthlyRate = annualInterestRate / 12;
            // PMT formula: P * [r(1+r)^n] / [(1+r)^n - 1]
            const numerator = monthlyRate * Math.pow(1 + monthlyRate, months);
            const denominator = Math.pow(1 + monthlyRate, months) - 1;
            const pmt = principal * (numerator / denominator);
            return pmt;
        }

        // Fallback to simple division (no interest)
        const pmt = principal / months;
        return pmt;
    }, [price, downPayment, months, annualInterestRate]);

    return (
        <Card className="w-full max-w-md mx-auto overflow-hidden border-2 border-primary/20 shadow-xl bg-card">
            <CardHeader className="bg-primary/5 pb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xl">Simulador de Financiación</CardTitle>
                </div>
                <CardDescription>
                    Calculá tu plan de cuotas para el lote de tus sueños
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">

                    <div className="space-y-2">
                        <Label htmlFor="downPayment" className="flex justify-between">
                            Anticipo (USD)
                            <span className="font-bold text-primary">
                                USD <ClientNumber value={downPayment} />
                            </span>
                        </Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="downPayment"
                                type="number"
                                value={downPayment}
                                onChange={(e) => setDownPayment(Number(e.target.value))}
                                onBlur={() => setDownPayment((value) => Math.min(maxDownPayment, Math.max(minDownPayment, value)))}
                                min={minDownPayment}
                                max={maxDownPayment}
                                className="pl-9"
                            />
                        </div>
                        <Slider
                            value={[downPayment]}
                            min={minDownPayment}
                            max={maxDownPayment}
                            step={500}
                            onValueChange={(val: number[]) => setDownPayment(val[0] ?? minDownPayment)}
                            className="mt-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="months" className="flex justify-between">
                            Plazo (Meses)
                            <span className="font-bold text-primary">{months} meses</span>
                        </Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="months"
                                type="number"
                                value={months}
                                onChange={(e) => setMonths(Number(e.target.value))}
                                onBlur={() => setMonths((value) => Math.min(maxMonths, Math.max(minMonths, value)))}
                                min={minMonths}
                                max={maxMonths}
                                className="pl-9"
                            />
                        </div>
                        <Slider
                            value={[months]}
                            min={minMonths}
                            max={maxMonths}
                            step={6}
                            onValueChange={(val: number[]) => setMonths(val[0] ?? defaultMonths)}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="mt-8 p-6 bg-primary/10 rounded-xl border border-primary/20 text-center">
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                        Cuota Mensual Estimada
                    </p>
                    <p className="text-4xl font-extrabold text-primary">
                        USD <ClientNumber value={monthlyPayment} options={{ maximumFractionDigits: 0 }} />
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 italic">
                        * Valor estimativo. El precio y las condiciones exactas se confirman al consultar.
                    </p>
                </div>

                {onInterestedClick && (
                    <Button
                        onClick={() =>
                            onInterestedClick({
                                anticipo: downPayment,
                                plazo: months,
                                cuota: monthlyPayment,
                                price,
                            })
                        }
                        size="lg"
                        className="w-full"
                    >
                        ¿Te interesa este plan? Consultanos
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
