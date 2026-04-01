"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FinancingCalculator } from "@/components/financing-calculator";
import { ProjectLeadForm } from "@/components/project-lead-form";

interface FinancingSectionProps {
  basePrice: number;
  minCashDown: number;
  maxFinancingMonths: number;
  tna: number;
  projectId: string;
  projectName: string;
}

export function FinancingSection({
  basePrice,
  minCashDown,
  maxFinancingMonths,
  tna,
  projectId,
  projectName,
}: FinancingSectionProps) {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [calculatorValues, setCalculatorValues] = useState<{
    anticipo: number;
    plazo: number;
    cuota: number;
    price: number;
  } | null>(null);

  const handleInterestedClick = (values: {
    anticipo: number;
    plazo: number;
    cuota: number;
    price: number;
  }) => {
    setCalculatorValues(values);
    setShowLeadForm(true);
  };

  const handleSuccess = () => {
    toast.success("¡Gracias! Nos contactaremos pronto");
    setShowLeadForm(false);
  };

  return (
    <>
      <div className="relative">
        <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl -z-10" />
        <div className="relative z-10">
          <FinancingCalculator
            basePrice={basePrice}
            minDownPayment={minCashDown}
            maxMonths={maxFinancingMonths}
            tna={tna}
            onInterestedClick={handleInterestedClick}
          />
        </div>
      </div>

      {calculatorValues && (
        <ProjectLeadForm
          projectId={projectId}
          projectName={projectName}
          calculatedValues={calculatorValues}
          open={showLeadForm}
          onOpenChange={setShowLeadForm}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
