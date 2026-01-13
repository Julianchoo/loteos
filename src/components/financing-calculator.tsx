"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, DollarSign, Calendar } from "lucide-react";

interface FinancingCalculatorProps {
    basePrice?: number;
}

export function FinancingCalculator({ basePrice = 17500 }: FinancingCalculatorProps) {
    const [price, setPrice] = useState(basePrice);
    const [downPayment, setDownPayment] = useState(5000);
    const [months, setMonths] = useState(48);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    const annualInterestRate = 0.15;
    const monthlyInterestRate = annualInterestRate / 12;

    useEffect(() => {
        const principal = price - downPayment;
        if (principal <= 0) {
            setMonthlyPayment(0);
            return;
        }

        // Formula: PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
        const pmt = principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) / (Math.pow(1 + monthlyInterestRate, months) - 1);
        setMonthlyPayment(pmt);
    }, [price, downPayment, months]);

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
                        <Label htmlFor="price" className="flex justify-between">
                            Precio del Lote (USD)
                            <span className="font-bold text-primary" suppressHydrationWarning>USD {price.toLocaleString('es-AR')}</span>
                        </Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="downPayment" className="flex justify-between">
                            Anticipo (USD)
                            <span className="font-bold text-primary" suppressHydrationWarning>USD {downPayment.toLocaleString('es-AR')}</span>
                        </Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="downPayment"
                                type="number"
                                value={downPayment}
                                onChange={(e) => setDownPayment(Number(e.target.value))}
                                className="pl-9"
                            />
                        </div>
                        <Slider
                            value={[downPayment]}
                            min={5000}
                            max={price}
                            step={500}
                            onValueChange={(val: number[]) => setDownPayment(val[0] ?? 5000)}
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
                                className="pl-9"
                            />
                        </div>
                        <Slider
                            value={[months]}
                            min={12}
                            max={48}
                            step={6}
                            onValueChange={(val: number[]) => setMonths(val[0] ?? 48)}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="mt-8 p-6 bg-primary/10 rounded-xl border border-primary/20 text-center">
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                        Cuota Mensual Estimada
                    </p>
                    <p className="text-4xl font-extrabold text-primary" suppressHydrationWarning>
                        USD {monthlyPayment.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 italic">
                        * Sujeto a aprobación y términos comerciales. Interés implícito 15% anual.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
