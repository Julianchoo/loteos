"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
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
import { createLeadWithFinancing } from "@/lib/actions/lead-actions";

interface ProjectLeadFormProps {
  projectId: string;
  projectName: string;
  calculatedValues: {
    anticipo: number;
    plazo: number;
    cuota: number;
    price: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ProjectLeadForm({
  projectId,
  projectName,
  calculatedValues,
  open,
  onOpenChange,
  onSuccess,
}: ProjectLeadFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    anticipo: calculatedValues.anticipo,
    plazo: calculatedValues.plazo,
  });

  // Recalculate cuota when anticipo or plazo changes
  const calculatedCuota = useMemo(() => {
    const principal = calculatedValues.price - formData.anticipo;
    if (principal <= 0) return 0;
    return principal / formData.plazo;
  }, [formData.anticipo, formData.plazo, calculatedValues.price]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Por favor completá todos los campos obligatorios");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Por favor ingresá un email válido");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createLeadWithFinancing({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone ? formData.phone : undefined,
        contactChannel: "web_form_project",
        initialMessage: formData.message ? formData.message : undefined,
        projectId,
        financing: {
          anticipo: formData.anticipo,
          plazo: formData.plazo,
          cuota: calculatedCuota,
          price: calculatedValues.price,
        },
      });

      if (result.success) {
        toast.success("¡Gracias! Nos contactaremos pronto");
        onOpenChange(false);
        onSuccess?.();

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
          anticipo: calculatedValues.anticipo,
          plazo: calculatedValues.plazo,
        });
      } else {
        toast.error(result.error || "Hubo un error al enviar el formulario");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Hubo un error al enviar el formulario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Consultá por {projectName}</DialogTitle>
          <DialogDescription>
            Completá tus datos y nos contactaremos a la brevedad
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                }
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Apellido <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Contact fields */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono (recomendado)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="+54 9 11 1234 5678"
              disabled={isLoading}
            />
          </div>

          {/* Financing details */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Plan de Financiación</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="anticipo">Anticipo (USD)</Label>
                <Input
                  id="anticipo"
                  type="number"
                  value={formData.anticipo}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      anticipo: Number(e.target.value),
                    }))
                  }
                  min={1000}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plazo">Plazo (meses)</Label>
                <Input
                  id="plazo"
                  type="number"
                  value={formData.plazo}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      plazo: Number(e.target.value),
                    }))
                  }
                  min={12}
                  max={72}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="mt-3 p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">Cuota estimada</p>
              <p className="text-2xl font-bold">
                USD ${calculatedCuota.toFixed(0)}
                <span className="text-base font-normal text-muted-foreground">
                  /mes
                </span>
              </p>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje (opcional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="¿Tenés alguna pregunta o comentario?"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Submit button */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Enviando..." : "Enviar Consulta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
