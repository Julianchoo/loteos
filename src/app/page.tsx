import Image from "next/image";
import { MapPin, Mail, Phone, CheckCircle2, TreePine } from "lucide-react";
import { AnimatedHero } from "@/components/animated-hero";
import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lotes en Venta en Buenos Aires | Fitzroya Desarrollos",
  description: "Lotes en venta en Buenos Aires. Desarrollos inmobiliarios sustentables en ubicaciones estratégicas. San Matías desde USD 12.500 y San Nicolás desde USD 14.500. Financiación directa.",
  keywords: [
    "lotes en venta",
    "lotes Buenos Aires",
    "terrenos en venta",
    "inversión inmobiliaria",
    "San Matías",
    "Arroyo de La Cruz",
    "Guernica",
    "financiación directa",
    "desarrollos inmobiliarios"
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lotes en Venta en Buenos Aires | Fitzroya Desarrollos",
    description: "Lotes en venta en Buenos Aires. San Matías desde USD 12.500 y San Nicolás desde USD 14.500. Financiación directa.",
  },
  twitter: {
    title: "Lotes en Venta en Buenos Aires | Fitzroya Desarrollos",
    description: "Lotes en venta en Buenos Aires. Desarrollos inmobiliarios sustentables con financiación directa.",
  },
};

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section id="inicio" className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/stephen-cobb-4YSQ6wD8lyA-unsplash.jpg"
            alt="Fitzroya Desarrollos - Espacios Verdes"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-1" />
        </div>

        <AnimatedHero />
      </section>

      {/* Nosotros Section */}
      <section id="nosotros" className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Nuestra Empresa</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              En Fitzroya Desarrollos nos dedicamos a la adquisición y desarrollo de tierras con un enfoque transparente y centrado en el cliente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: CheckCircle2, title: "Transparencia", desc: "Todos nuestros lotes cuentan con la documentación al día y procesos claros." },
              { icon: MapPin, title: "Ubicación", desc: "Elegimos zonas con alto potencial de revalorización y excelente conectividad." },
              { icon: TreePine, title: "Sustentabilidad", desc: "Respetamos el entorno natural en cada uno de nuestros desarrollos." }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-background rounded-2xl border border-border/50 shadow-sm space-y-4 text-center ring-1 ring-border/5 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto text-primary">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proyectos Section */}
      <section id="proyectos" className="py-24">
        <div className="container px-4 mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Nuestros Proyectos</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Descubrí nuestras exclusivas oportunidades de inversión.
            </p>
          </div>

          <div className="space-y-16">
            {/* San Matías Arroyo de La Cruz */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group border bg-muted">
                <Image
                  src="/images/hero-panorama.png"
                  alt="San Matías Arroyo de La Cruz"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-20 group-hover:opacity-10 transition-opacity" />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-bold shadow-lg">
                    LANZAMIENTO EXCLUSIVO
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-4xl font-bold tracking-tight">
                  <a href="/proyectos/san-matias" className="hover:text-primary transition-colors">
                    San Matías Arroyo de La Cruz
                  </a>
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Ruta 192, Arroyo de la Cruz, Exaltación de la Cruz</span>
                </div>
                <p className="text-lg leading-relaxed">
                  Un barrio exclusivo de 9 hectáreas en el corazón de Arroyo de la Cruz. Contamos con 182 lotes de 300m² cada uno, diseñados para quienes buscan tranquilidad y naturaleza sin alejarse de la ciudad.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-xl">
                    <p className="text-sm text-muted-foreground">Area Total</p>
                    <p className="text-xl font-bold">9 Hectáreas</p>
                  </div>
                  <div className="p-4 bg-muted rounded-xl">
                    <p className="text-sm text-muted-foreground">Total de Lotes</p>
                    <p className="text-xl font-bold">182 Lotes</p>
                  </div>
                  <div className="p-4 bg-muted rounded-xl">
                    <p className="text-sm text-muted-foreground">Superficie</p>
                    <p className="text-xl font-bold">300 m² c/u</p>
                  </div>
                  <div className="p-4 bg-muted rounded-xl">
                    <p className="text-sm text-muted-foreground">Desde</p>
                    <p className="text-xl font-bold">USD 12.500*</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button size="lg" className="rounded-full px-8" asChild>
                    <a href="/proyectos/san-matias#mapa-lotes">Ver Mapa de Lotes</a>
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                    <a href="/proyectos/san-matias">Ver Proyecto</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto Section */}
      <section id="contacto" className="py-24">
        <div className="container px-4 mx-auto max-w-5xl">
          <div className="bg-background border rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-12 bg-primary text-primary-foreground space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">¿Hablamos?</h2>
                  <p className="opacity-80 text-lg">
                    Nuestro equipo está listo para asesorarte en tu próxima inversión inmobiliaria.
                  </p>
                </div>

                <div className="space-y-6 pt-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="text-lg">+54 9 11 1234 5678</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="text-lg">matias@fitzroyadesarrollos.com.ar</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="text-lg">Exaltación de la Cruz, Buenos Aires</span>
                  </div>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
