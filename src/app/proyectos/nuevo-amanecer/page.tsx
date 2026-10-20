import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileText,
  Grid3x3,
  MapPin,
  Maximize2,
  Ruler,
  Sunrise,
} from "lucide-react";
import { NuevoAmanecerPlano } from "@/components/nuevo-amanecer-plano";
import { NuevoAmanecerPoiMap } from "@/components/nuevo-amanecer-poi-map";
import { ProjectAdminVisibilityBanner } from "@/components/project-admin-visibility-banner";
import { ProjectInquiryForm } from "@/components/project-inquiry-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLotsByProject } from "@/lib/actions/lot-actions";
import { getProjectBySlug } from "@/lib/actions/project-actions";
import {
  NUEVO_AMANECER_PROJECT_ID,
  nuevoAmanecerBounds,
  nuevoAmanecerLoteKey,
  nuevoAmanecerManzanas,
  nuevoAmanecerStats,
} from "@/lib/nuevo-amanecer";
import type { EstadoLote } from "@/lib/schema";
import { sharedOpenGraphImage, sharedTwitterImage, siteUrl } from "@/lib/seo";
import { isCurrentUserAdmin } from "@/lib/session";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const projectId = NUEVO_AMANECER_PROJECT_ID;
const projectName = "Nuevo Amanecer";
const address = "Guernica, Partido de Presidente Perón, Provincia de Buenos Aires";
const mapsUrl = "https://maps.app.goo.gl/17EuMqSaRascdFxb8";
// Completar con "lat,lng" del predio para mostrar el mapa embebido de Google.
const coordinates: string | null = null;

const { totalLotes, totalManzanas, superficieMin, superficieMax } =
  nuevoAmanecerStats;

const pointsOfInterest = [
  {
    title: "Finca San Antonio",
    description: "El loteo está al lado de la finca, en un entorno verde y tranquilo.",
  },
  {
    title: "Autopista Presidente Perón",
    description: "Conexión rápida con Ezeiza, Cañuelas y el resto del conurbano sur.",
  },
  {
    title: "Guernica",
    description: "Comercios, escuelas, servicios y estación del Roca.",
  },
  {
    title: "Alejandro Korn",
    description: "Centro comercial y estación del Roca sobre la Ruta 210.",
  },
];

export const metadata: Metadata = {
  title: "Nuevo Amanecer - Lotes en Guernica | Fitzroya",
  description: `${totalLotes} lotes de ${superficieMin} a ${superficieMax} m² en Guernica, al lado de la Finca San Antonio y cerca de la Autopista Presidente Perón.`,
  keywords: [
    "Nuevo Amanecer",
    "Guernica",
    "lotes Guernica",
    "terrenos Guernica",
    "Presidente Perón",
    "Finca San Antonio",
    "Autopista Presidente Perón",
    "Alejandro Korn",
    "lotes 600 m2",
    "financiación directa",
  ],
  alternates: {
    canonical: "/proyectos/nuevo-amanecer",
  },
  openGraph: {
    title: "Nuevo Amanecer - Lotes en Guernica",
    description: `${totalLotes} lotes de ${superficieMin} a ${superficieMax} m² en Guernica, al lado de la Finca San Antonio.`,
    images: [sharedOpenGraphImage],
  },
  twitter: {
    title: "Nuevo Amanecer - Lotes en Guernica",
    description: `${totalLotes} lotes de ${superficieMin} a ${superficieMax} m² en Guernica.`,
    images: [sharedTwitterImage],
  },
};

// Silueta del plano para el fondo del hero.
function HeroPlanoPattern() {
  const pad = 10;
  return (
    <svg
      viewBox={`${-pad} ${-pad} ${nuevoAmanecerBounds.width + pad * 2} ${nuevoAmanecerBounds.height + pad * 2}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {nuevoAmanecerManzanas.flatMap((manzana) =>
        manzana.lotes.map((lote) => (
          <rect
            key={`${lote.manzana}-${lote.numero}`}
            x={lote.x + 0.6}
            y={lote.y + 0.6}
            width={lote.width - 1.2}
            height={lote.height - 1.2}
            rx={0.8}
            fill="none"
            stroke="#d2e7a6"
            strokeWidth={0.45}
          />
        ))
      )}
    </svg>
  );
}

export default async function NuevoAmanecerPage() {
  const isAdmin = await isCurrentUserAdmin();
  let maxFinancingMonths: number | null = null;
  let projectVisibility: boolean | null = null;

  try {
    const projectResult = await getProjectBySlug(projectId);
    if (projectResult.success && projectResult.data) {
      projectVisibility = projectResult.data.isVisible;
      if (!projectResult.data.isVisible && !isAdmin) {
        notFound();
      }
      maxFinancingMonths = projectResult.data.maxFinancingMonths;
    }
  } catch (error) {
    console.error("Failed to load project data:", error);
  }

  if (projectVisibility === null && !isAdmin) {
    notFound();
  }

  const estados: Record<string, EstadoLote> = {};
  const lotsResult = await getLotsByProject(projectId);
  for (const lote of lotsResult.data ?? []) {
    if (lote.manzana) {
      estados[nuevoAmanecerLoteKey(lote.manzana, lote.number)] = lote.estado;
    }
  }

  const financingLabel = maxFinancingMonths
    ? `Hasta ${maxFinancingMonths} cuotas`
    : "Financiación directa";

  const facts = [
    { icon: Grid3x3, label: "Lotes", value: String(totalLotes) },
    { icon: Maximize2, label: "Manzanas", value: String(totalManzanas) },
    {
      icon: Ruler,
      label: "Superficies",
      value: `${superficieMin} a ${superficieMax} m²`,
    },
    { icon: FileText, label: "Pago", value: financingLabel },
  ];

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
                item: siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Proyectos",
                item: `${siteUrl}/proyectos`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: projectName,
                item: `${siteUrl}/proyectos/nuevo-amanecer`,
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

      <section className="relative overflow-hidden bg-[#193e2e] text-[#f7f8f0]">
        <div className="absolute inset-0 opacity-25">
          <HeroPlanoPattern />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#193e2e] via-[#193e2e]/85 to-[#193e2e]/30" />
        <div className="absolute -bottom-40 -right-24 size-[28rem] rounded-full bg-[#d2e7a6]/20 blur-3xl" />

        <div className="container relative z-10 mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl space-y-7">
            <Badge className="bg-[#d2e7a6] text-[#193e2e] hover:bg-[#d2e7a6]">
              NUEVO PROYECTO
            </Badge>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-[#f7f8f0]/85">
                <MapPin className="h-5 w-5 text-[#d2e7a6]" />
                <span>Guernica, Presidente Perón</span>
              </div>
              <h1 className="flex flex-wrap items-center gap-x-4 text-5xl font-black tracking-tight md:text-7xl">
                {projectName}
                <Sunrise className="size-12 text-[#d2e7a6] md:size-16" aria-hidden="true" />
              </h1>
              <p className="max-w-2xl text-xl text-[#f7f8f0]/85 md:text-2xl">
                {totalLotes} lotes de {superficieMin} a {superficieMax} m² en{" "}
                {totalManzanas} manzanas, al lado de la Finca San Antonio.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="rounded-full bg-[#d2e7a6] px-8 text-[#193e2e] hover:bg-[#c3dc8f]"
                asChild
              >
                <a href="#plano">
                  Ver el plano
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-[#f7f8f0]/40 bg-transparent px-8 text-[#f7f8f0] hover:bg-[#f7f8f0]/10 hover:text-[#f7f8f0]"
                asChild
              >
                <a href="#consulta">Consultar disponibilidad</a>
              </Button>
            </div>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#f7f8f0]/15 bg-[#f7f8f0]/15 md:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-[#193e2e]/90 p-5">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#d2e7a6]">
                  <fact.icon className="size-4" />
                  {fact.label}
                </dt>
                <dd className="mt-2 text-xl font-bold md:text-2xl">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="plano" className="scroll-mt-20 bg-background py-20">
        <div className="container mx-auto space-y-10 px-4">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Masterplan
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              El plano de Nuevo Amanecer
            </h2>
            <p className="text-lg text-muted-foreground">
              Cinco manzanas de 16 lotes cada una. Los lotes sobre las calles
              principales rondan los 600 m², y los lotes centrales, con frente
              a las calles laterales, van de 844 a 910 m².
            </p>
          </div>

          <NuevoAmanecerPlano estados={estados} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {nuevoAmanecerManzanas.map((manzana) => {
              const sizes = [
                ...new Set(manzana.lotes.map((lote) => lote.superficie)),
              ].sort((a, b) => a - b);
              return (
                <Card key={manzana.numero} className="gap-2 py-5">
                  <CardHeader className="px-5">
                    <CardTitle className="text-base">
                      Manzana {manzana.numero}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 px-5 text-sm text-muted-foreground">
                    <p>{manzana.lotes.length} lotes</p>
                    <p>{sizes.map((size) => `${size} m²`).join(" / ")}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Superficies y medidas aproximadas según el plano del proyecto,
            sujetas a ajustes en la aprobación final.
          </p>
        </div>
      </section>

      <section id="ubicacion" className="scroll-mt-20 bg-muted/30 py-20">
        <div className="container mx-auto space-y-10 px-4">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Ubicación
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              Cerca de todo en el sur del GBA
            </h2>
            <p className="text-lg text-muted-foreground">{address}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-start">
            <div className="overflow-hidden rounded-3xl border bg-[#eef2e4] shadow-sm">
              <NuevoAmanecerPoiMap />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Puntos de interés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-sm">
                {pointsOfInterest.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="mr-2 h-4 w-4" />
                    Abrir en Google Maps
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {coordinates && (
            <div className="aspect-video overflow-hidden rounded-2xl border bg-muted">
              <iframe
                title="Ubicación de Nuevo Amanecer en Google Maps"
                src={`https://www.google.com/maps?q=${coordinates}&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>
      </section>

      <section id="consulta" className="scroll-mt-20 bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-start">
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary">
                <FileText className="h-4 w-4" />
                <span>Consulta comercial</span>
              </div>
              <h2 className="text-3xl font-bold md:text-4xl">
                Pedí información sobre Nuevo Amanecer
              </h2>
              <p className="text-lg text-muted-foreground">
                Dejanos tus datos y te respondemos con disponibilidad, precio y
                condiciones comerciales. Si ya elegiste un lote del plano,
                contanos manzana y número.
              </p>
              <p className="text-3xl font-black tracking-tight text-primary md:text-4xl">
                {financingLabel}
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
