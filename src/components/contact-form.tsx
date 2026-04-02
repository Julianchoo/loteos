"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createLead } from "@/lib/actions/lead-actions";

export function ContactForm() {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        // Store form reference before async operations
        const form = e.currentTarget;

        try {
            const formData = new FormData(form);

            // Basic validation
            const nombre = formData.get("nombre") as string;
            const apellido = formData.get("apellido") as string;
            const email = formData.get("email") as string;
            const phone = formData.get("phone") as string;
            const message = formData.get("message") as string;

            if (!nombre || !apellido || !email) {
                toast.error("Por favor completá todos los campos obligatorios");
                setIsLoading(false);
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                toast.error("Por favor ingresá un email válido");
                setIsLoading(false);
                return;
            }

            const result = await createLead({
                firstName: nombre,
                lastName: apellido,
                email,
                phone: phone || undefined,
                contactChannel: "web_form_general",
                initialMessage: message || undefined,
            });

            if (result.success) {
                toast.success("¡Mensaje enviado con éxito! Nos contactaremos pronto.");
                // Reset form using stored reference
                form.reset();
            } else {
                toast.error(result.error || "Hubo un error al enviar el mensaje. Por favor intentá nuevamente.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Hubo un error al enviar el mensaje. Por favor intentá nuevamente.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nombre">
                        Nombre <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="nombre"
                        name="nombre"
                        type="text"
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="apellido">
                        Apellido <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="apellido"
                        name="apellido"
                        type="text"
                        required
                        disabled={isLoading}
                    />
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
                    disabled={isLoading}
                />
            </div>
            <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full rounded-xl h-12 text-lg"
            >
                {isLoading ? "Enviando..." : "Enviar Mensaje"}
            </Button>
        </form>
    );
}
