"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProjectLead } from "@/lib/actions/lead-actions";

type FieldErrors = Partial<
  Record<"firstName" | "lastName" | "email", string>
>;

interface ProjectContactFormProps {
  projectId: string;
  projectName: string;
  defaultMessage?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ProjectContactForm({
  projectId,
  projectName,
  defaultMessage,
}: ProjectContactFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);
    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const nextErrors: FieldErrors = {};
    if (!firstName) nextErrors.firstName = "Ingresá tu nombre.";
    if (!lastName) nextErrors.lastName = "Ingresá tu apellido.";
    if (!email) {
      nextErrors.email = "Ingresá tu email.";
    } else if (!emailRegex.test(email)) {
      nextErrors.email = "Ingresá un email válido.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await createProjectLead({
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        contactChannel: "web_form_project",
        initialMessage:
          message ||
          defaultMessage ||
          `Consulta directa por ${projectName}.`,
        projectId,
      });

      if (!result.success) {
        toast.error(result.error || "Hubo un error al enviar la consulta");
        return;
      }

      toast.success("Consulta enviada. Nos contactaremos pronto.");
      form.reset();
    } catch (error) {
      console.error("Error submitting project contact form:", error);
      toast.error("Hubo un error al enviar la consulta");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldSet disabled={isLoading}>
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.firstName}>
              <FieldLabel htmlFor={`${projectId}-firstName`}>
                Nombre <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id={`${projectId}-firstName`}
                name="firstName"
                autoComplete="given-name"
                aria-invalid={!!errors.firstName}
                disabled={isLoading}
              />
              <FieldError>{errors.firstName}</FieldError>
            </Field>

            <Field data-invalid={!!errors.lastName}>
              <FieldLabel htmlFor={`${projectId}-lastName`}>
                Apellido <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id={`${projectId}-lastName`}
                name="lastName"
                autoComplete="family-name"
                aria-invalid={!!errors.lastName}
                disabled={isLoading}
              />
              <FieldError>{errors.lastName}</FieldError>
            </Field>
          </div>

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor={`${projectId}-email`}>
              Email <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id={`${projectId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              disabled={isLoading}
            />
            <FieldError>{errors.email}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor={`${projectId}-phone`}>Teléfono</FieldLabel>
            <Input
              id={`${projectId}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+54 9 11 1234 5678"
              disabled={isLoading}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={`${projectId}-message`}>Mensaje</FieldLabel>
            <Textarea
              id={`${projectId}-message`}
              name="message"
              rows={4}
              disabled={isLoading}
            />
            <FieldDescription>
              Opcional. Podés contarnos qué tipo de lote o plan estás buscando.
            </FieldDescription>
          </Field>

          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar consulta"}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
