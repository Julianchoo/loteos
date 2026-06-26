import Image from "next/image";
import { MapPin, Mail, Phone, CheckCircle2, TreePine } from "lucide-react";
import { AnimatedHero } from "@/components/animated-hero";
import { ContactForm } from "@/components/contact-form";
import { ParallaxBackground } from "@/components/parallax-background";
import { Button } from "@/components/ui/button";
import { getProjectsForCurrentUser } from "@/lib/actions/project-actions";
import { toPublicProjectSummary } from "@/lib/public-projects";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lotes en Venta en Buenos Aires | Fitzroya Desarrollos",
  description: "Lotes en venta en Buenos Aires con financiacion directa hasta 72 cuotas sin banco.",
  keywords: [
    "lotes en venta",
    "lotes Buenos Aires",
    "terrenos en venta",
    "inversion inmobiliaria",
    "Guernica",
    "financiacion directa",
    "desarrollos inmobiliarios"
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Lotes en Venta en Buenos Aires | Fitzroya Desarrollos",
    description: "Lotes en venta en Buenos Aires con financiacion directa.",
  },
  twitter: {
    title: "Lotes en Venta en Buenos Aires | Fitzroya Desarrollos",
    description: "Lotes en venta en Buenos Aires. Desarrollos inmobiliarios sustentables con financiacion directa.",
  },
};

export default async function Home() {
  const { data } = await getProjectsForCurrentUser();
  const projects = data.map(toPublicProjectSummary);

  return (
    <div className="flex flex-col min-h-screen">
      <section id="inicio" className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParallaxBackground src="/images/stephen-cobb-4YSQ6wD8lyA-unsplash.webp" srcMobile="/images/stephen-cobb-mobile.webp" alt="Fitzroya Desarrollos - Espacios Verdes" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-1" />
        </div>
        <AnimatedHero />
      </section>

      <section id="nosotros" className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Nuestra Empresa</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              En Fitzroya Desarrollos nos dedicamos a la adquisicion y desarrollo de tierras con un enfoque transparente y centrado en el cliente.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: CheckCircle2, title: "Transparencia", desc: "Todos nuestros lotes cuentan con la documentacion al dia y procesos claros." },
              { icon: MapPin, title: "Ubicacion", desc: "Elegimos zonas con alto potencial de revalorizacion y excelente conectividad." },
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

      <section id="proyectos" className="py-24">
        <div className="container px-4 mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Nuestros Proyectos</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Descubri nuestras oportunidades de inversion disponibles.
            </p>
          </div>
          <div className="space-y-16">
            {projects.map((project) => (
              <div key={project.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group border bg-muted">
                  <Image src={project.image} alt={project.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-20 group-hover:opacity-10 transition-opacity" />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-bold shadow-lg">{project.isVisible ? project.badge : "OCULTO"}</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-4xl font-bold tracking-tight">
                    <a href={project.href} className="hover:text-primary transition-colors">{project.name}</a>
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{project.location}</span>
                  </div>
                  <p className="text-lg leading-relaxed">{project.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-xl"><p className="text-sm text-muted-foreground">Datos</p><p className="text-xl font-bold">{project.facts}</p></div>
                    <div className="p-4 bg-muted rounded-xl"><p className="text-sm text-muted-foreground">Financiacion</p><p className="text-xl font-bold">{project.financingFrom}</p></div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button size="lg" className="rounded-full px-8" asChild><a href={`${project.href}#financiacion`}>Calcular cuota</a></Button>
                    <Button size="lg" variant="outline" className="rounded-full px-8" asChild><a href={project.href}>Ver Proyecto</a></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="py-24">
        <div className="container px-4 mx-auto max-w-5xl">
          <div className="bg-background border rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 md:p-12 bg-primary text-primary-foreground space-y-4 md:space-y-8">
                <div className="space-y-3"><h2 className="text-2xl md:text-3xl font-bold">Hablamos?</h2><p className="opacity-80 text-base md:text-lg">Nuestro equipo esta listo para asesorarte en tu proxima inversion inmobiliaria.</p></div>
                <div className="space-y-4 md:space-y-6 pt-4 md:pt-8">
                  <div className="flex items-center gap-3"><div className="w-9 h-9 shrink-0 rounded-full bg-white/10 flex items-center justify-center"><Phone className="w-4 h-4" /></div><span className="text-sm md:text-base">+54 9 11 1234 5678</span></div>
                  <div className="flex items-center gap-3"><div className="w-9 h-9 shrink-0 rounded-full bg-white/10 flex items-center justify-center"><Mail className="w-4 h-4" /></div><span className="text-sm md:text-base break-all">matias@fitzroyadesarrollos.com</span></div>
                  <div className="flex items-center gap-3"><div className="w-9 h-9 shrink-0 rounded-full bg-white/10 flex items-center justify-center"><MapPin className="w-4 h-4" /></div><span className="text-sm md:text-base">Buenos Aires</span></div>
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
