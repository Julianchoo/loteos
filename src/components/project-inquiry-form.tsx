"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProjectLead } from "@/lib/actions/lead-actions";

interface ProjectInquiryFormProps {
  projectId: string;
  projectName: string;
}

export function ProjectInquiryForm({
  projectId,
  projectName,
}: ProjectInquiryFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;

    try {
      const formData = new FormData(form);
      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const message = formData.get("message") as string;

      if (!firstName || !lastName || !email) {
        toast.error("Por favor completá todos los campos obligatorios");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Por favor ingresá un email válido");
        return;
      }

      const result = await createProjectLead({
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        contactChannel: "web_form_project",
        initialMessage:
          message ||
          `Consulta por ${projectName}. Precio a consultar. Financiación hasta 60 cuotas.`,
        projectId,
      });

      if (!result.success) {
        toast.error(result.error || "Hubo un error al enviar la consulta");
        return;
      }

      toast.success("Consulta enviada. Nos contactaremos pronto.");
      form.reset();
    } catch (error) {
      console.error("Error submitting project inquiry:", error);
      toast.error("Hubo un error al enviar la consulta");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            Nombre <span className="text-destructive">*</span>
          </Label>
          <Input id="firstName" name="firstName" required disabled={isLoading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">
            Apellido <span className="text-destructive">*</span>
          </Label>
          <Input id="lastName" name="lastName" required disabled={isLoading} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+54 9 11 1234 5678"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mensaje</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Quiero recibir información sobre General Rodríguez."
          disabled={isLoading}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Enviando..." : "Consultar por el proyecto"}
      </Button>
    </form>
  );
}
