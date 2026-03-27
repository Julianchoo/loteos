import { MapPin, Calculator, CheckCircle2, Home, TreePine, Zap, Shield, ArrowRight } from "lucide-react";
import { SanMatiasFinancingSection } from "@/components/san-matias-financing-section";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "San Nicolás Guernica - Lotes desde USD 14.500 | Fitzroya",
  description: "20 lotes en venta en Guernica, sur del Gran Buenos Aires, desde USD 14.500. Proyecto de 1 hectárea con financiación directa. Escritura inmediata, servicios completos y ubicación estratégica sobre Ruta 210.",
  keywords: [
    "San Nicolás",
    "Guernica",
    "lotes Guernica",
    "terrenos Guernica",
    "USD 14500",
    "financiación directa",
    "sur Gran Buenos Aires",
    "escritura inmediata",
    "Ruta 210"
  ],
  openGraph: {
    title: "San Nicolás Guernica - Lotes desde USD 14.500",
    description: "20 lotes en venta en Guernica desde USD 14.500. Proyecto de 1 hectárea con financiación directa y escritura inmediata.",
  },
  twitter: {
    title: "San Nicolás Guernica - Lotes desde USD 14.500",
    description: "20 lotes en venta en Guernica desde USD 14.500. Financiación directa y escritura inmediata.",
  },
};

export default async function SanNicolasPage() {
  const basePrice = 14500;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />

        <div className="container relative z-10 px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
              <MapPin className="w-4 h-4" />
              <span>Guernica, Buenos Aires</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              San Nicolás
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Proyecto de 20 lotes en zona estratégica del sur del Gran Buenos Aires
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <a href="#financiacion">
                  <Calculator className="mr-2 h-5 w-5" />
                  Calcular Financiación
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#ubicacion">
                  <MapPin className="mr-2 h-5 w-5" />
                  Ver Ubicación
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            Características del Proyecto
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-6 rounded-2xl bg-card border-2 border-border space-y-3">
              <Home className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">20 Lotes</h3>
              <p className="text-muted-foreground">
                Variedad de lotes disponibles en ubicación estratégica
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border-2 border-border space-y-3">
              <TreePine className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">1 Hectárea</h3>
              <p className="text-muted-foreground">
                Proyecto compacto y bien planificado
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border-2 border-border space-y-3">
              <MapPin className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">Ubicación Estratégica</h3>
              <p className="text-muted-foreground">
                En el corazón del sur del Gran Buenos Aires
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border-2 border-border space-y-3">
              <Zap className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">Servicios</h3>
              <p className="text-muted-foreground">
                Electricidad y acceso a todos los servicios básicos
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border-2 border-border space-y-3">
              <Shield className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">Escritura Inmediata</h3>
              <p className="text-muted-foreground">
                Documentación en regla y legalizada
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border-2 border-border space-y-3">
              <CheckCircle2 className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">Financiación Directa</h3>
              <p className="text-muted-foreground">
                Sin intermediarios, trato directo con el propietario
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Financing Section */}
      <section id="financiacion" className="py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-black">
                <Calculator className="inline-block mr-3 mb-2" />
                Calculá tu Financiación
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Financiación directa sin intermediarios. Personalizá tu plan de pagos.
              </p>
            </div>

            <SanMatiasFinancingSection
              basePrice={basePrice}
              projectId="san-nicolas"
            />
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="ubicacion" className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-black">
                <MapPin className="inline-block mr-3 mb-2" />
                Ubicación Estratégica
              </h2>
              <p className="text-xl text-muted-foreground">
                Guernica, sur del Gran Buenos Aires
              </p>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden border-4 border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3274.045574882629!2d-58.36786562345093!3d-34.91289537280555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzTCsDU0JzQ2LjQiUyA1OMKwMjInMDQuMyJX!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-8">
              <div className="p-6 rounded-xl bg-card border border-border space-y-2">
                <h3 className="font-bold text-lg">Accesos Principales</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Ruta Provincial 210</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Autopista Buenos Aires - La Plata</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Camino de Cintura</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border space-y-2">
                <h3 className="font-bold text-lg">Cercanías</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Centro de Guernica a 5 minutos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Estación de tren cercana</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Comercios y servicios a metros</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-8 p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-primary/5 border-2 border-primary/20">
            <h2 className="text-3xl md:text-4xl font-black">
              ¿Listo para Invertir en tu Futuro?
            </h2>
            <p className="text-xl text-muted-foreground">
              Contactanos hoy y asegurá tu lote en Guernica
            </p>
            <Button size="lg" asChild>
              <a href="#financiacion">
                Calcular Mi Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
