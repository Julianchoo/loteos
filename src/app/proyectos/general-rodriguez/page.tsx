import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Home,
  MapPin,
} from "lucide-react";
import { ParallaxBackground } from "@/components/parallax-background";
import { ProjectAdminVisibilityBanner } from "@/components/project-admin-visibility-banner";
import { ProjectInquiryForm } from "@/components/project-inquiry-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectBySlug } from "@/lib/actions/project-actions";
import { isCurrentUserAdmin } from "@/lib/session";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const projectId = "general-rodriguez";
const projectName = "General Rodríguez";
const address =
  "C. Cam. A Navarro, B1748 Gral. Rodríguez, Provincia de Buenos Aires";
const coordinates = "-34.622836, -58.970304";
const mapsUrl = "https://maps.app.goo.gl/4KUQAyZWei3ewvAu5";

export const metadata: Metadata = {
  title: "General Rodríguez - Lotes en General Rodríguez | Fitzroya",
  description:
    "Nuevo proyecto de 450 lotes en General Rodríguez, frente a Barrio Bicentenario. Precio a consultar y financiación hasta 60 cuotas.",
  keywords: [
    "General Rodríguez",
    "lotes General Rodríguez",
    "terrenos General Rodríguez",
    "lotes en venta",
    "financiación directa",
    "Barrio Bicentenario",
  ],
  alternates: {
    canonical: "/proyectos/general-rodriguez",
  },
  openGraph: {
    title: "General Rodríguez - Lotes en General Rodríguez",
    description:
      "Proyecto de 450 lotes en General Rodríguez, frente a Barrio Bicentenario. Precio a consultar y financiación hasta 60 cuotas.",
  },
  twitter: {
    title: "General Rodríguez - Lotes en General Rodríguez",
    description:
      "Proyecto de 450 lotes en General Rodríguez. Precio a consultar y financiación hasta 60 cuotas.",
  },
};

export default async function GeneralRodriguezPage() {
  const isAdmin = await isCurrentUserAdmin();
  let totalLots = "450";
  let maxFinancingMonths = 60;
  let projectVisibility: boolean | null = null;

  try {
    const projectResult = await getProjectBySlug(projectId);
    if (projectResult.success && projectResult.data) {
      projectVisibility = projectResult.data.isVisible;
      if (!projectResult.data.isVisible && !isAdmin) {
        notFound();
      }
      totalLots = projectResult.data.totalLots || totalLots;
      maxFinancingMonths =
        projectResult.data.maxFinancingMonths || maxFinancingMonths;
    }
  } catch (error) {
    console.error("Failed to load project data:", error);
  }

  if (projectVisibility === null && !isAdmin) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      {isAdmin && projectVisibility !== null && (
        <ProjectAdminVisibilityBanner isVisible={projectVisibility} />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Inicio",
                item: "https://www.fitzroyadesarrollos.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Proyectos",
                item: "https://www.fitzroyadesarrollos.com/proyectos",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: projectName,
                item: "https://www.fitzroyadesarrollos.com/proyectos/general-rodriguez",
              },
            ],
          }),
        }}
      />

      <nav aria-label="Breadcrumb" className="container mx-auto px-4 py-3">
        <ol className="flex items-center gap-1 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <Link
              href="/proyectos"
              className="hover:text-foreground transition-colors"
            >
              Proyectos
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li className="text-foreground font-medium" aria-current="page">
            {projectName}
          </li>
        </ol>
      </nav>

      <section className="relative h-[70vh] min-h-[560px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParallaxBackground
            src="/images/stephen-cobb-4YSQ6wD8lyA-unsplash.webp"
            srcMobile="/images/stephen-cobb-mobile.webp"
            alt="General Rodríguez"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-background" />
        </div>

        <div className="container relative z-10 px-4 mx-auto">
          <div className="max-w-4xl space-y-7 text-white">
            <Badge className="bg-primary text-primary-foreground">
              NUEVO PROYECTO
            </Badge>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-white/90">
                <MapPin className="h-5 w-5 text-primary" />
                <span>General Rodríguez, Provincia de Buenos Aires</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                {projectName}
              </h1>
              <p className="text-xl md:text-2xl text-white/85 max-w-2xl">
                Proyecto de {totalLots} lotes frente a Barrio Bicentenario.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="rounded-full px-8" asChild>
                <a href="#consulta">
                  Consultar disponibilidad
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 bg-black/35 hover:bg-black/50 border-white/40 text-white backdrop-blur-sm"
                asChild
              >
                <a href="#ubicacion">
                  <MapPin className="mr-2 h-4 w-4" />
                  Ver ubicación
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto space-y-8">
          <div className="overflow-hidden rounded-2xl border bg-muted shadow-sm">
            <Image
              src="/images/Rodriguez - Mapa PoIs.png"
              alt="Mapa de puntos de interes cercanos al proyecto General Rodriguez"
              width={1600}
              height={900}
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Home className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{totalLots} lotes</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Proyecto ubicado en General Rodríguez, Provincia de Buenos Aires.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Frente a Barrio Bicentenario</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Sobre C. Cam. A Navarro, con ubicación confirmada por
                coordenadas.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Financiación</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-black tracking-tight text-primary">
                Hasta {maxFinancingMonths} cuotas
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="ubicacion" className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto space-y-10">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Ubicación</h2>
            <p className="text-lg text-muted-foreground">{address}</p>
            <p className="text-sm text-muted-foreground">
              Coordenadas: {coordinates}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-start">
            <div className="aspect-video overflow-hidden rounded-2xl border bg-muted">
              <iframe
                src="https://www.google.com/maps?q=-34.622836,-58.970304&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Accesos principales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {[
                  "A 5 min del centro de Gral. Rodr�guez",
                  "A 10 min de Au. del Oeste",
                  "A 20 min de Luj�n",
                  "A 25 min de Pilar / Au. Panamericana",
                  "A 60 min de CABA",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                    Abrir en Google Maps
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="consulta" className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-start">
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-primary font-bold uppercase text-sm tracking-wide">
                <FileText className="h-4 w-4" />
                <span>Consulta comercial</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Pedí información sobre General Rodríguez
              </h2>
              <p className="text-lg text-muted-foreground">
                Dejanos tus datos y te respondemos con disponibilidad, precio y
                condiciones comerciales del proyecto.
              </p>
              <p className="text-3xl md:text-4xl font-black tracking-tight text-primary">
                Financiación en hasta {maxFinancingMonths} cuotas
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Consultar disponibilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectInquiryForm
                  projectId={projectId}
                  projectName={projectName}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
