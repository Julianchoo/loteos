"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { submitContactRequest } from "@/lib/actions/lot-actions";

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

            if (!nombre || !apellido || !email) {
                toast.error("Por favor completá todos los campos obligatorios");
                setIsLoading(false);
                return;
            }

            // Combine nombre and apellido into name field expected by server action
            const serverFormData = new FormData();
            serverFormData.append("name", `${nombre} ${apellido}`);
            serverFormData.append("email", email);
            serverFormData.append("phone", phone || "");
            serverFormData.append("message", formData.get("message") as string || "");

            const result = await submitContactRequest(serverFormData);

            if (result.success) {
                toast.success("¡Mensaje enviado con éxito! Nos contactaremos pronto.");
                // Reset form using stored reference
                form.reset();
            } else {
                toast.error("Hubo un error al enviar el mensaje. Por favor intentá nuevamente.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Hubo un error al enviar el mensaje. Por favor intentá nuevamente.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-12 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="nombre" className="text-sm font-medium">
                        Nombre <span className="text-destructive">*</span>
                    </label>
                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="apellido" className="text-sm font-medium">
                        Apellido <span className="text-destructive">*</span>
                    </label>
                    <input
                        id="apellido"
                        name="apellido"
                        type="text"
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-destructive">*</span>
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                    Teléfono
                </label>
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+54 9 11 1234 5678"
                    disabled={isLoading}
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                    Mensaje
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={4}
                    disabled={isLoading}
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
