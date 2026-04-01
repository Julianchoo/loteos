import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loteos en Buenos Aires — Barrios Abiertos sin Expensas | Fitzroya",
  description:
    "Desarrollamos loteos y barrios abiertos sin expensas en Buenos Aires. Lotes desde USD 12.500 con financiación directa. Conocé nuestros proyectos en Arroyo de la Cruz, Exaltación de la Cruz.",
  keywords: [
    "loteo",
    "loteo Buenos Aires",
    "loteo sin expensas",
    "barrio abierto sin expensas",
    "desarrollos inmobiliarios Buenos Aires",
    "comprar lote Buenos Aires",
  ],
  alternates: {
    canonical: "/proyectos",
  },
  openGraph: {
    title: "Loteos en Buenos Aires — Barrios Abiertos sin Expensas | Fitzroya",
    description:
      "Desarrollamos loteos y barrios abiertos sin expensas en Buenos Aires. Lotes desde USD 12.500 con financiación directa.",
  },
};

export default function ProyectosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "Fitzroya Desarrollos",
            description:
              "Desarrolladora de loteos y barrios abiertos sin expensas en Buenos Aires",
            areaServed: "Buenos Aires, Argentina",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Proyectos de loteos",
              itemListElement: [
                {
                  "@type": "Offer",
                  name: "Jardines de Arroyo",
                  description:
                    "182 lotes de 300m² en Arroyo de la Cruz desde USD 12.500",
                  url: "https://fitzroya.com/proyectos/jardines-de-arroyo",
                },
              ],
            },
          }),
        }}
      />

      <main id="main-content">
        {/* 1. HERO */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Loteos y Barrios Abiertos en Buenos Aires
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Desarrollamos barrios abiertos sin expensas con financiación
              directa. Sin banco, sin burocracia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="#proyectos">Ver proyectos</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/#contacto">Contactanos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 2. NUESTROS PROYECTOS */}
        <section id="proyectos" className="py-20 bg-accent/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Nuestros proyectos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Card Jardines de Arroyo */}
              <Card className="overflow-hidden flex flex-col">
                <div className="relative h-52">
                  <Image
                    src="/images/hero-panorama.png"
                    alt="Jardines de Arroyo — Arroyo de la Cruz"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary text-primary-foreground">
                      EN VENTA
                    </Badge>
                  </div>
                </div>
                <CardContent className="flex flex-col flex-1 pt-5 gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Jardines de Arroyo</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span>Arroyo de la Cruz, Exaltación de la Cruz</span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground border-t pt-3">
                    182 lotes · 300 m² · Desde USD 12.500
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["Sin expensas", "Financiación directa", "GBA Norte"].map(
                      (tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      )
                    )}
                  </div>

                  <div className="mt-auto pt-2">
                    <Button asChild className="w-full">
                      <Link href="/proyectos/jardines-de-arroyo">
                        Ver proyecto <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 3. ¿QUÉ ES UN LOTEO ABIERTO? */}
        <section id="que-es-un-loteo" className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold mb-8">
              ¿Qué es un loteo abierto?
            </h2>
            <div className="flex flex-col gap-5 text-muted-foreground leading-relaxed">
              <p>
                Un loteo abierto es un barrio residencial donde cada familia es
                dueña de su lote con escritura propia. No hay administración
                central ni cuota mensual de expensas. A diferencia de un barrio
                cerrado, el propietario tiene libertad total para construir
                según sus tiempos y necesidades, respetando el reglamento de
                edificación del municipio.
              </p>
              <p>
                El desarrollador provee la infraestructura y servicios necesarios
                y luego transfiere el dominio de cada lote. El comprador obtiene
                la escritura a su nombre y puede construir, vender o transferir
                el lote libremente. No hay asambleas, no hay votos, no hay
                cuota extraordinaria.
              </p>
              <p>
                Es ideal para quienes quieren salir del alquiler sin pagar
                expensas, para inversores que buscan plusvalía en zonas en
                desarrollo, y para familias que quieren construir a su ritmo.
                El loteo abierto es el formato de acceso a la vivienda más
                difundido en la Provincia de Buenos Aires.
              </p>
            </div>
          </div>
        </section>

        {/* 4. ¿POR QUÉ SIN EXPENSAS? */}
        <section id="sin-expensas" className="py-20 bg-accent/20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold mb-8">¿Por qué sin expensas?</h2>
            <div className="flex flex-col gap-5 text-muted-foreground leading-relaxed">
              <p>
                En un barrio cerrado, las expensas mensuales pueden rondar los
                USD 100 a USD 400 según los servicios incluidos —seguridad 24hs,
                mantenimiento de amenities, administración—. A lo largo de 10
                años, eso representa entre USD 12.000 y USD 48.000 adicionales
                al precio del lote.
              </p>
              <p>
                En un barrio abierto sin expensas, ese costo no existe. La
                infraestructura básica —calles, alumbrado, agua, electricidad—
                queda instalada desde el inicio y su mantenimiento es
                responsabilidad del municipio. El propietario solo paga sus
                impuestos municipales habituales, los mismos que pagaría por
                cualquier propiedad urbana.
              </p>
              <p>
                Resultado: menor costo total de tenencia, mayor libertad de
                uso, y un precio de entrada más accesible. Para muchas
                familias, la diferencia que ahorran en expensas financia la
                construcción.
              </p>
            </div>
          </div>
        </section>

        {/* 5. FINANCIACIÓN DIRECTA */}
        <section id="financiacion" className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">
              Financiación directa del desarrollador
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              No necesitás banco ni crédito hipotecario. Financiamos
              directamente nosotros: ingresás con un anticipo desde USD 2.500 y
              financiás el resto en cuotas fijas en dólares. Sin gestión
              bancaria, sin trámites de aprobación crediticia, sin sorpresas. El
              proceso es simple: elegís tu lote, firmás el boleto de
              compraventa y empezás a pagar tus cuotas.
            </p>
            <div className="flex flex-col gap-3 mb-8">
              {[
                "Anticipo desde USD 2.500",
                "Cuotas fijas en dólares",
                "Sin evaluación crediticia",
                "Sin garante requerido",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Button asChild variant="outline">
              <Link href="/proyectos/jardines-de-arroyo#financiacion">
                Calculá tu cuota <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* 6. CTA FINAL */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Hablá con nosotros y encontrá el lote ideal para tu proyecto de
              vida.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
            >
              <Link href="/#contacto">Contactanos</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
