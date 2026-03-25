import Image from "next/image";
import Link from "next/link";
import { MapPin, Calculator, CheckCircle2, Home, TreePine, Zap, Droplet, Shield, ArrowRight, Sparkles } from "lucide-react";
import { InteractiveLotMap } from "@/components/interactive-lot-map";
import { SanMatiasFinancingSection } from "@/components/san-matias-financing-section";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLots } from "@/lib/actions/lot-actions";
import { lot } from "@/lib/schema";

type Lot = typeof lot.$inferSelect;

export const dynamic = "force-dynamic";

export default async function SanMatiasPage() {
  let lots: Lot[] = [];

  try {
    const result = await getLots();
    lots = result.data || [];
  } catch (error) {
    console.error("Failed to load lots:", error);
  }

  const cashPrice = 12500;
  const basePrice = 20000;
  const savings = basePrice - cashPrice;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-panorama.png"
            alt="San Matías Arroyo de La Cruz"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-1" />
        </div>

        <div className="container relative z-10 px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold mb-4 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Sparkles className="w-4 h-4" />
            <span>LANZAMIENTO EXCLUSIVO</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white text-balance animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            San Matías <span className="text-primary">Arroyo de La Cruz</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/90 text-lg md:text-xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Ruta 192, Arroyo de la Cruz, Exaltación de la Cruz</span>
          </div>
        </div>
      </section>

      {/* Cash Promotion Banner */}
      <section className="py-20 bg-background border-y">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-3xl border-2 border-primary/20 p-8 md:p-12 shadow-xl">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Left side - Promo badge and text */}
                <div className="flex-1 text-center lg:text-left space-y-4">
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

                {/* Right side - Price comparison */}
                <div className="flex-1">
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
              Un barrio exclusivo de 9 hectáreas en el corazón de Arroyo de la Cruz. 185 lotes de 300m² cada uno, diseñados para quienes buscan tranquilidad y naturaleza sin alejarse de la ciudad.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 bg-background rounded-2xl border text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Área Total</p>
              <p className="text-3xl font-black text-primary">9 Ha</p>
            </div>
            <div className="p-6 bg-background rounded-2xl border text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Total Lotes</p>
              <p className="text-3xl font-black text-primary">185</p>
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
                  "Anticipo desde USD 3,500",
                  "Financiación hasta en 60 cuotas fijas en dólares (5 años)",
                  "Cuotas desde USD 267 mensuales",
                  "Descuento especial por pago de contado: USD 12,500",
                  "Sin gastos ocultos ni sorpresas"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg font-medium">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <SanMatiasFinancingSection
              basePrice={basePrice}
              projectId="san-matias"
            />
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
              <div className="w-full relative bg-card rounded-3xl overflow-hidden border shadow-2xl aspect-[16/9]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3287.0688907661604!2d-59.11358222434968!3d-34.33512147317584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bb63f1da8c4c8d%3A0x5efc04b4b3b46e89!2sSan%20Matias%20-%20Arroyo%20de%20la%20Cruz!5e0!3m2!1ses-419!2sar!4v1234567890123"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-background/95 backdrop-blur p-6 rounded-2xl border shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">San Matías - Arroyo de la Cruz</h4>
                      <p className="text-sm text-muted-foreground">Ruta 192, Exaltación de la Cruz, Buenos Aires</p>
                    </div>
                  </div>
                  <Button className="w-full md:w-auto h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20" asChild>
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
                    alt="Plano del Barrio San Matías"
                    fill
                    className="object-contain"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">Plano general del barrio San Matías</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Interactive Lot Map */}
      <section id="mapa-lotes" className="py-24">
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
      </section>

      {/* CTA Section */}
      <section id="contacto" className="py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container px-4 mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">¿Listo para tu próximo proyecto?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Contactanos hoy mismo y asegurá tu lote en San Matías
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full px-10 h-14 text-xl" asChild>
              <Link href="/#contacto">
                Contactar Ahora <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-xl" asChild>
              <a href="#mapa-lotes">
                Ver Lotes Disponibles
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
