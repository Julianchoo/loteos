import Image from "next/image";
import { ArrowDown, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import { getProjectsForCurrentUser } from "@/lib/actions/project-actions";
import { toPublicProjectSummary } from "@/lib/public-projects";
import { sharedOpenGraphImage, sharedTwitterImage } from "@/lib/seo";
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
    images: [sharedOpenGraphImage],
  },
  twitter: {
    title: "Lotes en Venta en Buenos Aires | Fitzroya Desarrollos",
    description: "Lotes en venta en Buenos Aires. Desarrollos inmobiliarios sustentables con financiacion directa.",
    images: [sharedTwitterImage],
  },
};

const principles = [
  {
    label: "Transparencia",
    text: "Todos nuestros lotes cuentan con la documentación al día y procesos claros.",
  },
  {
    label: "Ubicación",
    text: "Elegimos zonas con alto potencial de revalorización y excelente conectividad.",
  },
  {
    label: "Sustentabilidad",
    text: "Respetamos el entorno natural en cada uno de nuestros desarrollos.",
  },
];

export default async function Home() {
  const { data } = await getProjectsForCurrentUser();
  const projects = data.map(toPublicProjectSummary);
  const leadProject = projects[0];

  return (
    <main id="main-content" className="min-h-screen overflow-clip bg-background">
      <section id="inicio" className="relative min-h-[calc(88svh-5rem)] bg-foreground text-background lg:min-h-[calc(78svh-5rem)]">
        <div className="absolute inset-0">
          <Image
            src="/images/stephen-cobb-4YSQ6wD8lyA-unsplash.webp"
            alt="Fitzroya Desarrollos - Espacios Verdes"
            fill
            priority
            className="object-cover opacity-65"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-foreground/25" />
          <div className="absolute inset-y-0 left-0 w-full bg-foreground/70 lg:w-[38%]" />
        </div>

        <div className="container relative mx-auto flex min-h-[calc(88svh-5rem)] flex-col justify-between px-4 py-7 md:py-9 lg:min-h-[calc(78svh-5rem)]">
          <div className="flex items-center justify-between gap-6 text-xs font-medium tracking-[0.16em]">
            <span>BUENOS AIRES</span>
            <span className="hidden text-right sm:block">TIERRA / PROYECTO / FUTURO</span>
          </div>

          <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="flex flex-col gap-5">
              <h1 className="max-w-5xl text-[clamp(4.7rem,12vw,11rem)] font-semibold leading-[0.72] tracking-[-0.075em]">
                <span className="block">Tierra</span>
                <span className="ml-[0.3em] block text-[0.78em] font-serif font-normal italic text-primary">
                  con futuro.
                </span>
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-background/75 md:text-xl">
                Creamos espacios para tu futuro. Proyectos sustentables en
                ubicaciones estratégicas.
              </p>
            </div>

            <div className="flex flex-col items-start gap-6 lg:items-end">
              {leadProject && (
                <div className="max-w-sm border-l border-background/40 pl-5 lg:border-l-0 lg:border-r lg:pl-0 lg:pr-5 lg:text-right">
                  <p className="text-sm text-background/60">Proyecto destacado</p>
                  <p className="mt-2 text-2xl font-medium">{leadProject.name}</p>
                  <p className="mt-1 text-sm text-background/70">
                    {leadProject.location}
                  </p>
                </div>
              )}
              <Button size="lg" variant="secondary" asChild>
                <a href="#proyectos">
                  Explorar proyectos
                  <ArrowDown data-icon="inline-end" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-8 text-primary-foreground md:py-10">
        <div className="container mx-auto px-4">
          <p className="max-w-6xl text-2xl font-medium leading-tight tracking-tight md:text-4xl lg:text-5xl">
            No vendemos una imagen de vida. Mostramos la tierra, la ubicación y
            las condiciones para que puedas decidir.
          </p>
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

      <section id="nosotros" className="bg-foreground py-20 text-background md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="flex flex-col gap-10">
              <p className="text-sm font-medium text-primary">Nuestra empresa</p>
              <h2 className="text-6xl font-semibold leading-[0.82] tracking-[-0.065em] md:text-8xl lg:text-9xl">
                Menos promesas.
                <span className="block font-serif font-normal italic text-primary">
                  Más claridad.
                </span>
              </h2>
            </div>

            <div className="flex flex-col justify-end gap-8">
              <p className="text-lg leading-relaxed text-background/70">
                En Fitzroya Desarrollos nos dedicamos a la adquisición y
                desarrollo de tierras con un enfoque transparente y centrado en
                el cliente.
              </p>
              <div className="flex flex-col border-y border-background/25">
                {principles.map((principle) => (
                  <div key={principle.label} className="grid gap-3 border-b border-background/25 py-5 last:border-b-0 sm:grid-cols-[0.38fr_0.62fr]">
                    <h3 className="font-medium text-primary">{principle.label}</h3>
                    <p className="leading-relaxed text-background/65">{principle.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="py-20 md:py-32">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="flex flex-col gap-10 lg:sticky lg:top-28">
            <div className="flex flex-col gap-5">
              <p className="text-sm font-medium text-primary">El próximo paso</p>
              <h2 className="text-5xl font-semibold leading-[0.9] tracking-[-0.055em] md:text-7xl">
                Hablemos de tu futuro.
              </h2>
              <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
                Nuestro equipo está listo para asesorarte en tu próxima inversión
                inmobiliaria.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4">
              <a
                href="https://wa.me/5491149708971"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 border-b border-foreground pb-2 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                <Phone className="size-4" />
                WhatsApp: +54 9 11 4970-8971
              </a>
              <a
                href="mailto:matias@fitzroyadesarrollos.com"
                className="flex items-center gap-3 border-b border-foreground pb-2 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                <Mail className="size-4" />
                matias@fitzroyadesarrollos.com
              </a>
            </div>
          </div>

          <div className="border-l-4 border-primary bg-muted/30">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
