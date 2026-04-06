import Image from "next/image";
import Link from "next/link";
import { MapPin, Calculator, CheckCircle2, Home, TreePine, Zap, Droplet, Shield, ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import { FinancingSection } from "@/components/financing-section";
import { ParallaxBackground } from "@/components/parallax-background";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProjectBySlug } from "@/lib/actions/project-actions";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jardines de Arroyo - Lotes desde USD 12.500 en Arroyo de la Cruz | Fitzroya",
  description: "182 lotes de 300m² desde USD 12.500 en Arroyo de la Cruz. Barrio exclusivo de 9 ha con financiación directa hasta 60 cuotas. Luz, agua y alumbrado público.",
  keywords: [
    "Jardines de Arroyo",
    "Arroyo de la Cruz",
    "Exaltación de la Cruz",
    "Capilla del Señor",
    "lotes en venta",
    "terrenos 300m2",
    "financiación directa",
    "USD 12500",
    "barrio abierto",
    "lotes Buenos Aires",
    "Parada Robles"
  ],
  alternates: {
    canonical: "/proyectos/jardines-de-arroyo",
  },
  openGraph: {
    title: "Jardines de Arroyo - Lotes desde USD 12.500 en Arroyo de la Cruz",
    description: "182 lotes de 300m² desde USD 12.500 en Arroyo de la Cruz, a 6 km de Capilla del Señor. Financiación directa hasta 60 cuotas. Barrio exclusivo de 9 hectáreas.",
  },
  twitter: {
    title: "Jardines de Arroyo - Lotes desde USD 12.500 en Arroyo de la Cruz",
    description: "182 lotes de 300m² desde USD 12.500 en Arroyo de la Cruz, a 6 km de Capilla del Señor. Financiación directa hasta 60 cuotas.",
  },
};

export default async function JardinesDeArroyoPage() {
  let projectData = null;

  try {
    const projectResult = await getProjectBySlug("jardines-de-arroyo");
    if (projectResult.success && projectResult.data) {
      projectData = projectResult.data;
    }
  } catch (error) {
    console.error("Failed to load project data:", error);
  }

  // Use values from Airtable/Postgres, with fallbacks
  const basePrice = projectData?.basePrice ? Number(projectData.basePrice) : 20000;
  const minCashDown = projectData?.minCashDown ? Number(projectData.minCashDown) : 2500;
  const maxFinancingMonths = projectData?.maxFinancingMonths || 72;
  const tna = projectData?.tna ? Number(projectData.tna) : 0.15;
  const cashPrice = 12500; // This could also come from Airtable if needed
  const savings = basePrice - cashPrice;

  return (
    <div className="flex flex-col min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Qué infraestructura incluye el barrio?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Jardines de Arroyo cuenta con red eléctrica completa, red de agua corriente, calles consolidadas y mejoradas, cordón cuneta para drenaje, y alumbrado público LED. La infraestructura está instalada y operativa desde el inicio, no es una promesa a futuro."
                }
              },
              {
                "@type": "Question",
                "name": "¿Cuándo puedo empezar a construir?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Podés iniciar la obra en cualquier momento después de firmar el boleto de compraventa y abonar el anticipo. No hay plazos mínimos ni máximos. Solo necesitás tramitar el permiso de obra ante la Municipalidad de Exaltación de la Cruz."
                }
              },
              {
                "@type": "Question",
                "name": "¿Cómo funciona la financiación directa?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Financiamos nosotros directamente, sin banco. El proceso: elegís tu lote, firmás el boleto, abonás el anticipo desde USD 2.500 y empezás a pagar cuotas fijas en dólares. No hay evaluación crediticia ni garante requerido."
                }
              },
              {
                "@type": "Question",
                "name": "¿El lote viene con escritura?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sí. Una vez completado el pago del lote, iniciamos el proceso de escrituración ante escribano público. La escritura queda a nombre del comprador en el Registro de la Propiedad Inmueble de la Provincia de Buenos Aires."
                }
              },
              {
                "@type": "Question",
                "name": "¿A qué distancia queda de Buenos Aires?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Aproximadamente 90 km del centro de Buenos Aires por Ruta 8 / Panamericana. En auto, 60 a 75 minutos según el tráfico. La salida más cercana desde la autopista es Parada Robles (Km 97 de Ruta 8), a 4 km del barrio."
                }
              },
              {
                "@type": "Question",
                "name": "¿Hay restricciones para el tipo de construcción?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "El reglamento establece FOS 0.6, FOT 1.0 y frente mínimo de 12 metros. Dentro de esos parámetros podés construir casa, duplex o vivienda con local. No hay comisión de estética ni aprobación de fachadas."
                }
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://www.fitzroyadesarrollos.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Proyectos",
                "item": "https://www.fitzroyadesarrollos.com/proyectos"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Jardines de Arroyo",
                "item": "https://www.fitzroyadesarrollos.com/proyectos/jardines-de-arroyo"
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Jardines de Arroyo - Lotes en Arroyo de la Cruz",
            "description": "182 lotes de 300m² en Arroyo de la Cruz, Exaltación de la Cruz, Buenos Aires. Barrio exclusivo de 9 hectáreas con red eléctrica, agua corriente, calles consolidadas y alumbrado público LED. A 6 km de Capilla del Señor y 90 km de Buenos Aires.",
            "image": [
              "https://www.fitzroyadesarrollos.com/images/hero-panorama.png",
              "https://www.fitzroyadesarrollos.com/images/fitzroya-multiple.jpg"
            ],
            "brand": {
              "@type": "Brand",
              "name": "Fitzroya Desarrollos"
            },
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": 12500,
              "highPrice": 20000,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": "https://www.fitzroyadesarrollos.com/proyectos/jardines-de-arroyo",
              "seller": {
                "@type": "Organization",
                "name": "Fitzroya Desarrollos"
              }
            },
            "additionalProperty": [
              {
                "@type": "PropertyValue",
                "name": "Superficie de lote",
                "value": "300 m²"
              },
              {
                "@type": "PropertyValue",
                "name": "Cantidad de lotes",
                "value": "182"
              },
              {
                "@type": "PropertyValue",
                "name": "Ubicación",
                "value": "Arroyo de la Cruz, Exaltación de la Cruz, Buenos Aires"
              },
              {
                "@type": "PropertyValue",
                "name": "Financiación",
                "value": "Directa hasta 72 cuotas en dólares"
              }
            ]
          })
        }}
      />

      {/* Breadcrumb */}
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
            <Link href="/proyectos" className="hover:text-foreground transition-colors">
              Proyectos
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li className="text-foreground font-medium" aria-current="page">
            Jardines de Arroyo
          </li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParallaxBackground
            src="/images/hero-panorama.png"
            alt="Jardines de Arroyo - Arroyo de La Cruz"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-1" />
        </div>

        <div className="container relative z-10 px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <MapPin className="w-4 h-4" />
            <span>Arroyo de la Cruz, Exaltación de la Cruz</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white text-balance animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Jardines de Arroyo
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/90 text-lg md:text-xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Ruta 192, Arroyo de la Cruz, Exaltación de la Cruz</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
            <Button size="lg" className="rounded-full px-8 h-12 text-base font-bold" asChild>
              <a href="#financiacion">
                <Calculator className="w-4 h-4 mr-2" />
                Calculá tu cuota
              </a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base font-bold bg-black/35 hover:bg-black/50 border-white/40 text-white backdrop-blur-sm" asChild>
              <a href="#ubicacion">
                <MapPin className="w-4 h-4 mr-2" />
                Ver ubicación
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Cash Promotion Banner */}
      <section className="py-20 bg-background border-y">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl border-2 border-primary/20 shadow-xl overflow-hidden">

              {/* Left — promo content */}
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-12 flex flex-col justify-center gap-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm font-bold">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>PROMOCIÓN EXCLUSIVA</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Precio Especial de Contado
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Ahorrá USD {savings.toLocaleString()} pagando el lote en un solo pago
                  </p>
                </div>

                <div className="bg-background rounded-2xl border-2 border-primary/30 p-8 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Precio Financiado</p>
                      <p className="text-2xl font-bold line-through text-muted-foreground">
                        USD {basePrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Ahorro</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                        -USD {savings.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Precio de Contado</p>
                    <p className="text-5xl md:text-6xl font-black text-primary">
                      USD {cashPrice.toLocaleString()}
                    </p>
                  </div>
                  <Button size="lg" className="w-full rounded-xl h-14 text-lg font-bold" asChild>
                    <a href="#contacto">Consultar Promoción</a>
                  </Button>
                </div>
              </div>

              {/* Right — lot map */}
              <div className="relative min-h-[400px] lg:min-h-0 bg-muted/30">
                <Image
                  src="/images/Mapeo ADLC.png"
                  alt="Plano de loteo Jardines de Arroyo - Arroyo de La Cruz"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <a
                  href="#mapa-lotes"
                  className="absolute bottom-4 right-4 px-4 py-2 bg-background/90 backdrop-blur rounded-xl border text-sm font-medium hover:bg-background transition-colors shadow"
                >
                  Ver mapa interactivo →
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Un lugar para vivir, crecer y soñar</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Un barrio exclusivo de 9 hectáreas en el corazón de Arroyo de la Cruz. 182 lotes de 300m² cada uno, diseñados para quienes buscan tranquilidad y naturaleza sin alejarse de la ciudad.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 bg-background rounded-2xl border text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Área Total</p>
              <p className="text-3xl font-black text-primary">9 Ha</p>
            </div>
            <div className="p-6 bg-background rounded-2xl border text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Total Lotes</p>
              <p className="text-3xl font-black text-primary">{projectData?.totalLots || 182}</p>
            </div>
            <div className="p-6 bg-background rounded-2xl border text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Superficie</p>
              <p className="text-3xl font-black text-primary">300 m²</p>
            </div>
            <div className="p-6 bg-background rounded-2xl border text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Desde</p>
              <p className="text-3xl font-black text-primary">USD 12.5K</p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="ubicacion" className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ubicación Estratégica</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              En el corazón de Arroyo de la Cruz, con fácil acceso por Ruta 192 y cercano a todos los servicios.
            </p>
          </div>

          <Tabs defaultValue="google" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2 h-14 rounded-2xl p-1 bg-muted/50 border shadow-inner">
                <TabsTrigger value="google" className="rounded-xl font-bold gap-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  <MapPin className="w-4 h-4" /> Google Maps
                </TabsTrigger>
                <TabsTrigger value="barrio" className="rounded-xl font-bold gap-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  <Home className="w-4 h-4" /> Plano del Barrio
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="google" className="mt-0 focus-visible:outline-none">
              {/* Mobile: Mapa limpio + botón debajo */}
              <div className="md:hidden flex flex-col gap-4">
                <div className="w-full bg-card rounded-3xl overflow-hidden border shadow-2xl aspect-[16/9]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3287.0688907661604!2d-59.114331!3d-34.332788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bb63f1da8c4c8d%3A0x5efc04b4b3b46e89!2sSan%20Matias%20-%20Arroyo%20de%20la%20Cruz!5e0!3m2!1ses-419!2sar!4v1234567890123"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20" asChild>
                  <a href="https://maps.app.goo.gl/KKeZd8cXTS3j1SMF7" target="_blank" rel="noopener noreferrer">
                    Abrir en Google Maps
                  </a>
                </Button>
              </div>

              {/* Desktop: Mapa con overlay */}
              <div className="hidden md:block w-full relative bg-card rounded-3xl overflow-hidden border shadow-2xl aspect-[16/9]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3287.0688907661604!2d-59.114331!3d-34.332788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bb63f1da8c4c8d%3A0x5efc04b4b3b46e89!2sSan%20Matias%20-%20Arroyo%20de%20la%20Cruz!5e0!3m2!1ses-419!2sar!4v1234567890123"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-background/95 backdrop-blur p-6 rounded-2xl border shadow-2xl flex flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">Jardines de Arroyo - Arroyo de la Cruz</h4>
                      <p className="text-sm text-muted-foreground">Ruta 192, Exaltación de la Cruz, Buenos Aires</p>
                    </div>
                  </div>
                  <Button className="w-auto h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20" asChild>
                    <a href="https://maps.app.goo.gl/KKeZd8cXTS3j1SMF7" target="_blank" rel="noopener noreferrer">
                      Abrir en Google Maps
                    </a>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="barrio" className="mt-0 focus-visible:outline-none">
              <div className="w-full relative bg-card rounded-3xl overflow-hidden border shadow-2xl p-8">
                <div className="relative w-full aspect-[4/3] bg-muted/30 rounded-xl overflow-hidden">
                  <Image
                    src="/images/Mapeo ADLC.png"
                    alt="Plano del Barrio Jardines de Arroyo"
                    fill
                    className="object-contain"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">Plano general del barrio Jardines de Arroyo</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Proximity Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Accesos Principales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>A solo 200 metros de Ruta Provincial 192</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Ruta 192 conecta Panamericana/Ruta 8 con Capilla del Señor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Parada Robles (Ruta 8) a 5 minutos en auto</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Cercanías
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Pinares Country Club a 2 km</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Parada Robles a 4 km</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Capilla del Señor a 6 km</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SEO Section 1: Zone Information */}
      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Arroyo de la Cruz: una zona en pleno crecimiento
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Arroyo de la Cruz es una localidad del Partido de Exaltación de la Cruz,
                en el norte del Gran Buenos Aires. Conocida por su tranquilidad y paisajes
                rurales, la zona experimentó un crecimiento sostenido en los últimos años,
                impulsado por el corredor de barrios privados que se desarrolla a lo largo
                de la Ruta 192. Hoy convive con emprendimientos consolidados como Pinares
                Country Club (a 2 km de Jardines de Arroyo), y ofrece la calidad de vida del GBA
                norte a precios todavía accesibles.
              </p>
              <p>
                La conectividad es uno de los principales atractivos. Ruta 192 conecta
                directamente con Parada Robles (Ruta 8) a solo 4 km, desde donde se accede
                a la Autopista Panamericana hacia Buenos Aires. Capilla del Señor, la
                cabecera del partido con todos los servicios (supermercados, hospitales,
                colegios, bancos), queda a apenas 6 km. El trayecto hasta el centro de
                Buenos Aires en auto es de aproximadamente 1 hora, comparable al de otros
                barrios consolidados del GBA norte como Pilar o Zárate.
              </p>
              <p>
                Desde el punto de vista de la inversión, Arroyo de la Cruz está en el
                momento justo: la infraestructura vial ya existe, los barrios vecinos están
                consolidados, y los precios de los terrenos aún reflejan una zona en
                desarrollo. Los lotes que hoy se venden a USD 12.500 en zonas similares del
                corredor norte mostraron plusvalías del 30% al 50% en los últimos 5 años.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities & Features */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Infraestructura y Servicios</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Barrio abierto con toda la infraestructura necesaria para tu proyecto de vida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {[
              { icon: Zap, title: "Red Eléctrica", desc: "Instalación eléctrica completa" },
              { icon: Droplet, title: "Red de Agua", desc: "Conexión de agua corriente" },
              { icon: TreePine, title: "Calles Mejoradas", desc: "Calles consolidadas y en buen estado" },
              { icon: Shield, title: "Cordón Cuneta", desc: "Sistema de drenaje perimetral" },
              { icon: Home, title: "Luminarias", desc: "Alumbrado público en todo el barrio" }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-background rounded-2xl border space-y-4 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto text-primary">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Technical Specifications */}
          <div className="bg-muted/50 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">Especificaciones Técnicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-background rounded-xl">
                <div className="text-primary font-bold text-xl">📐</div>
                <div>
                  <p className="text-sm text-muted-foreground">Superficie por lote</p>
                  <p className="text-lg font-bold">300 m²</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-background rounded-xl">
                <div className="text-primary font-bold text-xl">↔️</div>
                <div>
                  <p className="text-sm text-muted-foreground">Frente mínimo</p>
                  <p className="text-lg font-bold">12 metros</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-background rounded-xl">
                <div className="text-primary font-bold text-xl">🏗️</div>
                <div>
                  <p className="text-sm text-muted-foreground">Factor de Ocupación del Suelo (FOS)</p>
                  <p className="text-lg font-bold">0.6</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-background rounded-xl">
                <div className="text-primary font-bold text-xl">🏢</div>
                <div>
                  <p className="text-sm text-muted-foreground">Factor de Ocupación Total (FOT)</p>
                  <p className="text-lg font-bold">1.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section 2: Open Neighborhood Benefits */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Barrio abierto: sin expensas, con total libertad
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Jardines de Arroyo es un barrio abierto, lo que significa que no existen expensas
                mensuales. A diferencia de un barrio cerrado, donde las cuotas de
                administración, seguridad y mantenimiento pueden rondar los USD 150 a USD 400
                por mes, en Jardines de Arroyo el propietario solo paga los impuestos municipales
                habituales. A lo largo de 10 años, eso representa un ahorro real de entre
                USD 18.000 y USD 48.000, dinero que puede destinarse directamente a la
                construcción.
              </p>
              <p>
                Podés construir cuando quieras, a tu ritmo, siguiendo el reglamento de
                edificación del Municipio de Exaltación de la Cruz. No hay plazos de obra
                obligatorios ni restricciones de estilo arquitectónico impuestas por una
                administración. Sos el único dueño de tus decisiones, y de tu lote, con
                escritura propia a tu nombre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Financing Section */}
      <section id="financiacion" className="py-24 bg-primary/5">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-sm">
                  <Calculator className="w-4 h-4" />
                  <span>Financiación Flexible</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Tu lote, a tu medida.</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Ofrecemos planes de pago diseñados para que puedas cumplir tu sueño. Ingresá con un anticipo mínimo y financiá el resto en cuotas fijas en dólares.
                </p>
              </div>

              <ul className="space-y-4">
                {[
                  `Anticipo desde USD ${minCashDown.toLocaleString()}`,
                  `Financiación hasta en ${maxFinancingMonths} cuotas fijas en dólares (${Math.floor(maxFinancingMonths / 12)} años)`,
                  "Cuotas accesibles ajustadas a tu necesidad",
                  `Descuento especial por pago de contado: USD ${cashPrice.toLocaleString()}`,
                  "Sin gastos ocultos ni sorpresas"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg font-medium">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <FinancingSection
              basePrice={basePrice}
              minCashDown={minCashDown}
              maxFinancingMonths={maxFinancingMonths}
              tna={tna}
              projectId="jardines-de-arroyo"
              projectName="Jardines de Arroyo"
            />
          </div>
        </div>
      </section>

      {/* Interactive Lot Map — hidden */}
      {/* <section id="mapa-lotes" className="py-24">
        <div className="container px-4 mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Mapa Interactivo de Lotes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explorá la disponibilidad en tiempo real. Hacé click en los lotes para ver precios y dimensiones.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <InteractiveLotMap lots={lots} />
          </div>
        </div>
      </section> */}
      <div id="mapa-lotes" />

      {/* CTA Section */}
      <section id="contacto" className="py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container px-4 mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">¿Listo para tu próximo proyecto?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Contactanos hoy mismo y asegurá tu lote en Jardines de Arroyo
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full px-10 h-14 text-xl" asChild>
              <Link href="/#contacto">
                Contactar Ahora <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SEO Section 3: FAQ */}
      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center">
              Preguntas frecuentes sobre Jardines de Arroyo
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  ¿Qué infraestructura incluye el barrio?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  Jardines de Arroyo cuenta con red eléctrica completa, red de agua corriente,
                  calles consolidadas y mejoradas, cordón cuneta para drenaje, y alumbrado
                  público LED. La infraestructura está instalada y operativa desde el inicio,
                  no es una promesa a futuro.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  ¿Cuándo puedo empezar a construir?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  Podés iniciar la obra en cualquier momento después de firmar el boleto de
                  compraventa y abonar el anticipo. No hay plazos mínimos ni máximos. Solo
                  necesitás tramitar el permiso de obra ante la Municipalidad de Exaltación
                  de la Cruz.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  ¿Cómo funciona la financiación directa?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  Financiamos nosotros directamente, sin banco. El proceso: elegís tu lote,
                  firmás el boleto, abonás el anticipo desde USD 2.500 y empezás a pagar
                  cuotas fijas en dólares. No hay evaluación crediticia ni garante requerido.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  ¿El lote viene con escritura?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  Sí. Una vez completado el pago del lote, iniciamos el proceso de
                  escrituración ante escribano público. La escritura queda a nombre del
                  comprador en el Registro de la Propiedad Inmueble de la Provincia de
                  Buenos Aires.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  ¿A qué distancia queda de Buenos Aires?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  Aproximadamente 90 km del centro de Buenos Aires por Ruta 8 / Panamericana.
                  En auto, 60 a 75 minutos según el tráfico. La salida más cercana desde la
                  autopista es Parada Robles (Km 97 de Ruta 8), a 4 km del barrio.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left text-lg font-semibold">
                  ¿Hay restricciones para el tipo de construcción?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  El reglamento establece FOS 0.6, FOT 1.0 y frente mínimo de 12 metros.
                  Dentro de esos parámetros podés construir casa, duplex o vivienda con
                  local. No hay comisión de estética ni aprobación de fachadas.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
