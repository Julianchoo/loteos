import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  ChevronRight,
  FileText,
  Home,
  MapPin,
  Zap,
} from "lucide-react";
import { FinancingSection } from "@/components/financing-section";
import { ProjectAdminVisibilityBanner } from "@/components/project-admin-visibility-banner";
import { ProjectContactForm } from "@/components/project-contact-form";
import { ReplayOnClickVideo } from "@/components/replay-on-click-video";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectBySlug } from "@/lib/actions/project-actions";
import { isCurrentUserAdmin } from "@/lib/session";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const projectId = "san-nicolas";
const projectName = "San Nicolás";
const aerialImage = "/images/San Nicolas/foto aerea opci3.png";
const overviewImage = "/images/San Nicolas/zoom general (1).png";

const facts = [
  { label: "Lotes", value: "20" },
  { label: "Superficie", value: "1 hectárea" },
  { label: "Ubicación", value: "Guernica" },
  { label: "Modalidad", value: "Financiación directa" },
];

const projectHighlights = [
  {
    icon: Calculator,
    title: "Financiación hasta 60 cuotas",
    description: "Financiación directa con planes de pago de hasta 60 cuotas.",
  },
  {
    icon: Zap,
    title: "Servicios",
    description: "Electricidad y acceso a servicios básicos.",
  },
  {
    icon: MapPin,
    title: "Sur GBA / Guernica",
    description: "Ubicación estratégica en el sur del Gran Buenos Aires.",
  },
];

const accessItems = [
  "Ruta Provincial 210",
  "Autopista Buenos Aires - La Plata",
  "Camino de Cintura",
];

const nearbyItems = [
  "Centro de Guernica a 5 minutos",
  "Estación de tren cercana",
  "Comercios y servicios a metros",
];

export const metadata: Metadata = {
  title: "San Nicolás Guernica - Lotes en Guernica | Fitzroya",
  description:
    "20 lotes en Guernica, sur del GBA. Proyecto de 1 hectárea con financiación directa y servicios.",
  keywords: [
    "San Nicolás",
    "Guernica",
    "lotes Guernica",
    "terrenos Guernica",
    "financiación directa",
    "sur Gran Buenos Aires",
    "Ruta 210",
  ],
  alternates: {
    canonical: "/proyectos/san-nicolas",
  },
  openGraph: {
    title: "San Nicolás Guernica - Lotes en Guernica",
    description:
      "20 lotes en venta en Guernica. Proyecto de 1 hectárea con financiación directa.",
  },
  twitter: {
    title: "San Nicolás Guernica - Lotes en Guernica",
    description: "20 lotes en venta en Guernica. Financiación directa.",
  },
};

export default async function SanNicolasPage() {
  const isAdmin = await isCurrentUserAdmin();
  let projectData = null;
  let projectVisibility: boolean | null = null;

  try {
    const projectResult = await getProjectBySlug(projectId);
    if (projectResult.success && projectResult.data) {
      projectVisibility = projectResult.data.isVisible;
      if (!projectResult.data.isVisible && !isAdmin) {
        notFound();
      }
      projectData = projectResult.data;
    }
  } catch (error) {
    console.error("Failed to load project data:", error);
  }

  if (projectVisibility === null && !isAdmin) {
    notFound();
  }

  const basePrice = projectData?.basePrice ? Number(projectData.basePrice) : 14500;
  const minCashDown = projectData?.minCashDown
    ? Number(projectData.minCashDown)
    : 2500;
  const maxFinancingMonths = projectData?.maxFinancingMonths || 72;
  const tna = projectData?.tna ? Number(projectData.tna) : 0.15;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {isAdmin && projectVisibility !== null && (
        <ProjectAdminVisibilityBanner isVisible={projectVisibility} />
      )}

      <nav aria-label="Breadcrumb" className="container mx-auto px-4 py-3">
        <ol className="flex items-center gap-1 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="transition-colors hover:text-foreground">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" />
          </li>
          <li>
            <Link
              href="/proyectos"
              className="transition-colors hover:text-foreground"
            >
              Proyectos
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" />
          </li>
          <li className="font-medium text-foreground" aria-current="page">
            {projectName}
          </li>
        </ol>
      </nav>

      <section className="relative min-h-[620px] overflow-hidden md:min-h-[680px]">
        <Image
          src={aerialImage}
          alt="Vista aérea del proyecto San Nicolás en Guernica"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="container relative mx-auto flex min-h-[620px] items-center px-4 py-16 md:min-h-[680px]">
          <div className="flex max-w-3xl flex-col gap-7 text-white">
            <Badge className="w-fit bg-primary text-primary-foreground">
              Guernica, Buenos Aires
            </Badge>
            <div className="flex flex-col gap-4">
              <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                {projectName}
              </h1>
              <p className="max-w-2xl text-xl leading-relaxed text-white/85 md:text-2xl">
                Proyecto de 20 lotes en una zona estratégica del sur del Gran
                Buenos Aires.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="rounded-full px-8" asChild>
                <a href="#financiacion">
                  <Calculator data-icon="inline-start" />
                  Calcular financiación
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/40 bg-black/35 px-8 text-white backdrop-blur-sm hover:bg-black/50"
                asChild
              >
                <a href="#ubicacion">
                  <MapPin data-icon="inline-start" />
                  Ver ubicación
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="container relative mx-auto px-4 pb-8">
          <dl className="grid overflow-hidden rounded-lg border bg-background/95 shadow-sm backdrop-blur md:grid-cols-4">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex flex-col gap-1 border-b p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <dt className="text-sm font-medium text-muted-foreground">
                  {fact.label}
                </dt>
                <dd className="text-xl font-black tracking-tight">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.92fr_0.88fr] lg:items-stretch">
          <figure className="flex flex-col gap-3">
            <div className="h-full overflow-hidden rounded-lg border bg-foreground p-2 shadow-sm">
              <ReplayOnClickVideo
                src="/videos/san-nicolas-tomaforma.mp4"
                poster={aerialImage}
                autoPlay
                muted
                playsInline
                preload="metadata"
                className="aspect-[9/16] h-full max-h-[680px] min-h-[520px] w-full cursor-pointer rounded-md bg-muted object-cover"
              />
            </div>

          </figure>

          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary">
                <Home className="size-4" />
                <span>El proyecto</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Una propuesta simple y concreta en Guernica
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                San Nicolás reúne lotes, servicios y financiación directa en un
                proyecto compacto de una hectárea.
              </p>
            </div>

            <div className="grid gap-4">
              {projectHighlights.map((item) => (
                <Card key={item.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <item.icon className="size-5 text-primary" />
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    {item.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative min-h-[720px] overflow-hidden rounded-lg border bg-foreground shadow-2xl">
            <Image
              src={overviewImage}
              alt="Plano general del proyecto San Nicolás"
              fill
              className="object-cover object-left brightness-45"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />

            <div className="relative grid min-h-[720px] gap-10 p-6 text-white md:p-10 lg:grid-cols-[0.9fr_0.7fr] lg:items-center lg:p-14">
              <div className="max-w-xl self-end lg:self-center">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary">
                    <MapPin className="size-4" />
                    <span>Presentación del proyecto</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                    Conocé el proyecto San Nicolás
                  </h2>
                  <p className="text-lg leading-relaxed text-white/75">
                    Una recorrida breve para entender el loteo, el entorno y la escala del proyecto.
                  </p>
                </div>
              </div>

              <div className="mx-auto w-full max-w-[340px] lg:ml-auto">
                <div className="overflow-hidden rounded-lg border border-white/20 bg-background p-2 shadow-2xl">
                  <video
                    src="/videos/presentacion-san-nicolas.MOV"
                    poster={aerialImage}
                    controls
                    playsInline
                    preload="metadata"
                    className="aspect-[9/16] max-h-[600px] w-full rounded-md bg-muted object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="financiacion" className="py-20">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary">
              <Calculator className="size-4" />
              <span>Financiación</span>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Simulá tu plan de pago
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Financiación directa sin intermediarios. Ajustá anticipo y
                plazo para estimar una cuota.
              </p>
            </div>
            <ul className="grid gap-3 text-sm">
              {[
                `Anticipo desde USD ${minCashDown.toLocaleString()}`,
                `Financiación hasta ${maxFinancingMonths} cuotas`,
                "Consulta directa por el proyecto",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <FinancingSection
            basePrice={basePrice}
            minCashDown={minCashDown}
            maxFinancingMonths={maxFinancingMonths}
            tna={tna}
            projectId={projectId}
            projectName={projectName}
          />
        </div>
      </section>

      <section id="ubicacion" className="bg-muted/30 py-20">
        <div className="container mx-auto flex flex-col gap-10 px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary">
              <MapPin className="size-4" />
              <span>Ubicación</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Guernica, sur del Gran Buenos Aires
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="aspect-video overflow-hidden rounded-lg border bg-muted shadow-sm">
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

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Accesos principales</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3 text-sm text-muted-foreground">
                    {accessItems.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cercanías</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3 text-sm text-muted-foreground">
                    {nearbyItems.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 border-t pt-12 lg:grid-cols-[0.85fr_1fr] lg:items-start">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary">
                <FileText className="size-4" />
                <span>Consulta comercial</span>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Consultá por San Nicolás
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Dejanos tus datos y te respondemos con disponibilidad y
                  condiciones comerciales del proyecto.
                </p>
              </div>
              <Button variant="outline" className="w-fit rounded-full px-6" asChild>
                <a href="#financiacion">
                  Ver financiación
                  <ArrowRight data-icon="inline-end" />
                </a>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Contactar por el proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectContactForm
                  projectId={projectId}
                  projectName={projectName}
                  defaultMessage="Consulta directa por San Nicolás. Financiación hasta 60 cuotas."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
