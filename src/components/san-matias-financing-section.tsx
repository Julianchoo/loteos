"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FinancingCalculator } from "@/components/financing-calculator";
import { ProjectLeadForm } from "@/components/project-lead-form";

interface SanMatiasFinancingSectionProps {
  basePrice: number;
  projectId: string;
}

export function SanMatiasFinancingSection({
  basePrice,
  projectId,
}: SanMatiasFinancingSectionProps) {
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
            onInterestedClick={handleInterestedClick}
          />
        </div>
      </div>

      {calculatorValues && (
        <ProjectLeadForm
          projectId={projectId}
          projectName="San Matías"
          calculatedValues={calculatorValues}
          open={showLeadForm}
          onOpenChange={setShowLeadForm}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
