import { TreePine, MapPin, Calculator, Mail, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FinancingCalculator } from "@/components/financing-calculator";
import { LotMapPlaceholder } from "@/components/lot-map-placeholder";
import { ContactForm } from "@/components/contact-form";
import { getLots } from "@/lib/actions/lot-actions";
import { lot } from "@/lib/schema";

type Lot = typeof lot.$inferSelect;

export const dynamic = "force-dynamic";

export default async function Home() {
  let lots: Lot[] = [];

  try {
    const result = await getLots();
    lots = result.data || [];
  } catch (error) {
    console.error("Failed to load lots:", error);
    // Page will still render with empty lots array
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section id="inicio" className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-panorama.png"
            alt="Loteos Unnamed Panorama"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-1" />
        </div>

        <div className="container relative z-10 px-4 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-white text-sm font-medium mb-4 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <TreePine className="w-4 h-4 text-primary" />
            <span>Desarrollos Inmobiliarios Exclusivos</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white text-balance animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Loteos <span className="text-primary italic">Unnamed</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-white/90 font-medium animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            Creamos espacios para tu futuro. Proyectos sustentables en ubicaciones estratégicas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-700">
            <Button size="lg" className="rounded-full px-8 gap-2 group h-14 text-xl shadow-xl shadow-primary/20" asChild>
              <a href="#proyectos">
                Ver Proyectos <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button size="lg" variant="secondary" className="rounded-full px-8 h-14 text-xl backdrop-blur-md bg-white/10 hover:bg-white/20 border-white/20 text-white" asChild>
              <a href="#financiacion">
                <Calculator className="w-5 h-5 mr-2" /> Calculá tu cuota
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Nosotros Section */}
      <section id="nosotros" className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Nuestra Empresa</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              En Loteos Unnamed nos dedicamos a la adquisición y desarrollo de tierras con un enfoque transparente y centrado en el cliente.
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
                <img
                  src="/images/hero-panorama.png"
                  alt="San Matías Arroyo de La Cruz"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-20 group-hover:opacity-10 transition-opacity" />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-bold shadow-lg">
                    LANZAMIENTO EXCLUSIVO
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-4xl font-bold tracking-tight">San Matías Arroyo de La Cruz</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Ruta 192, Arroyo de la Cruz, Exaltación de la Cruz</span>
                </div>
                <p className="text-lg leading-relaxed">
                  Un barrio exclusivo de 9 hectáreas en el corazón de Arroyo de la Cruz. Contamos con 171 lotes de 300m² cada uno, diseñados para quienes buscan tranquilidad y naturaleza sin alejarse de la ciudad.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-xl">
                    <p className="text-sm text-muted-foreground">Area Total</p>
                    <p className="text-xl font-bold">9 Hectáreas</p>
                  </div>
                  <div className="p-4 bg-muted rounded-xl">
                    <p className="text-sm text-muted-foreground">Total de Lotes</p>
                    <p className="text-xl font-bold">171 Lotes</p>
                  </div>
                  <div className="p-4 bg-muted rounded-xl">
                    <p className="text-sm text-muted-foreground">Superficie</p>
                    <p className="text-xl font-bold">300 m² c/u</p>
                  </div>
                  <div className="p-4 bg-muted rounded-xl">
                    <p className="text-sm text-muted-foreground">Precio Base</p>
                    <p className="text-xl font-bold">USD 17.500</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button size="lg" className="rounded-full px-8">Ver Mapa de Lotes</Button>
                  <Button size="lg" variant="outline" className="rounded-full px-8">Brochure Digital</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financiación Section */}
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
                  Ofrecemos planes de pago diseñados para que puedas cumplir tu sueño. Ingresá con un anticipo mínimo y finanziá el resto en cuotas fijas en dólares.
                </p>
              </div>

              <ul className="space-y-4">
                {[
                  "Anticipo mínimo de USD 5.000",
                  "Financiación hasta en 48 cuotas",
                  "Sin gastos ocultos",
                  "Interés implícito del 15% anual"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg font-medium">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl z-0" />
              <FinancingCalculator />
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
                    <span className="text-lg">ventas@loteosunnamed.com.ar</span>
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

      {/* Map Section */}
      <section id="mapa" className="py-24 bg-muted/20 scroll-mt-20">
        <div className="container px-4 mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Mapa Interactivo</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explorá la disponibilidad en tiempo real. Hacé click en los lotes para ver precios y dimensiones.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <LotMapPlaceholder lots={lots} />
          </div>
        </div>
      </section>
    </div>
  );
}
