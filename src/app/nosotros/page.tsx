import Image from "next/image";
import Link from "next/link";
import { MapPin, TreePine, Shield, Leaf, Heart, Eye, ArrowRight } from "lucide-react";
import { ParallaxBackground } from "@/components/parallax-background";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { sharedOpenGraphImage, sharedTwitterImage } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiénes Somos | Fitzroya Desarrollos",
  description:
    "Conocé a Fitzroya Desarrollos: nuestra historia, filosofía y valores. Desarrollos inmobiliarios sustentables en Buenos Aires con transparencia y compromiso.",
  keywords: [
    "Fitzroya Desarrollos",
    "sobre nosotros",
    "quiénes somos",
    "desarrollos inmobiliarios Buenos Aires",
    "lotes sustentables",
    "empresa inmobiliaria",
  ],
  alternates: {
    canonical: "/nosotros",
  },
  openGraph: {
    title: "Quiénes Somos | Fitzroya Desarrollos",
    description:
      "Conocé nuestra historia, filosofía y valores. Desarrollos inmobiliarios sustentables con transparencia y compromiso.",
    images: [sharedOpenGraphImage],
  },
  twitter: {
    title: "Quiénes Somos | Fitzroya Desarrollos",
    description:
      "Conocé nuestra historia, filosofía y valores. Desarrollos inmobiliarios sustentables con transparencia y compromiso.",
    images: [sharedTwitterImage],
  },
};

export default function NosotrosPage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero */}
      <section className="relative h-[60vh] flex items-end justify-start overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParallaxBackground src="/images/fitzroya-multiple.webp" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-1" />
        </div>

        <div className="container relative z-10 px-4 pb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-white text-sm font-medium backdrop-blur-md">
            <TreePine className="w-4 h-4 text-primary" />
            <span>Nuestra empresa</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
            Quiénes <span className="text-primary italic">Somos</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-xl">
            Una empresa de desarrollo inmobiliario fundada sobre la convicción de que la tierra es el activo más sólido y duradero.
          </p>
        </div>
      </section>

      {/* Fitzroya Cupressoides */}
      <section className="py-16">
        <div className="container px-4 mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Imagen + epígrafe mobile */}
            <div className="space-y-3">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/fitzroya-multiple.webp"
                  alt="Fitzroya Cupressoides"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Epígrafe — visible solo en mobile */}
              <div className="lg:hidden space-y-2 px-1">
                <Badge variant="outline" className="text-primary border-primary/40 px-3 py-1 text-sm">
                  <TreePine className="w-3.5 h-3.5 mr-1.5" />
                  Fitzroya Cupressoides
                </Badge>
                <Separator />
                <p className="text-muted-foreground text-sm leading-relaxed italic">
                  Un árbol milenario de imponente presencia, simboliza la solidez y el crecimiento sostenible, valores que inspiran cada uno de nuestros proyectos.
                </p>
              </div>
            </div>

            {/* Texto completo — visible solo en desktop */}
            <div className="hidden lg:flex flex-col space-y-6">
              <Badge variant="outline" className="text-primary border-primary/40 px-3 py-1 text-sm w-fit">
                <TreePine className="w-3.5 h-3.5 mr-1.5" />
                Fitzroya Cupressoides
              </Badge>
              <Separator />
              <blockquote className="text-2xl md:text-3xl font-light leading-snug text-foreground">
                Un árbol milenario de imponente presencia, simboliza la solidez y el crecimiento sostenible, valores que inspiran cada uno de nuestros proyectos.
              </blockquote>
            </div>

          </div>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto max-w-4xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Nuestra Historia</h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg">
              Fitzroya Desarrollos nació con una convicción simple pero poderosa: en un país donde la desconfianza hacia el sistema financiero es parte del paisaje cotidiano, la tierra sigue siendo el refugio más seguro y tangible para el ahorro y la inversión. No una promesa en papel. No un número en pantalla. Un terreno real, con escritura, en una ubicación que vale.
            </p>
            <p className="text-lg">
              Desde el primer día, decidimos enfocarnos en lo que más nos importa: seleccionar con criterio los mejores proyectos, garantizar que toda la documentación esté en orden, y acompañar a cada comprador desde el primer contacto hasta la firma final. Eso significa rechazar oportunidades que no cumplen con nuestros estándares, aunque el negocio sea tentador. Significa tomarnos el tiempo para explicar cada paso del proceso. Y significa estar disponibles cuando el cliente lo necesita, no solo cuando hay algo que vender.
            </p>
            <p className="text-lg">
              Creemos que el acceso a la tierra no debería ser exclusivo. Por eso diseñamos financiaciones directas, sin bancos ni intermediarios, con condiciones claras y accesibles. Nuestro compromiso es que cada familia que decida invertir con nosotros lo haga con información completa, sin letra chica y con la tranquilidad de saber exactamente qué está comprando.
            </p>
          </div>
        </div>
      </section>

      {/* Nuestra Filosofía */}
      <section className="py-24">
        <div className="container px-4 mx-auto max-w-4xl space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Nuestra Filosofía</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Desarrollamos pensando en el largo plazo. No buscamos vender rápido y pasar al siguiente proyecto. Buscamos crear barrios que tengan sentido: bien ubicados, con infraestructura de calidad, en armonía con el entorno natural que los rodea.
                </p>
                <p>
                  Cada proyecto que llevamos adelante parte de un análisis profundo del territorio: la conectividad con los centros urbanos, el acceso a servicios esenciales, el potencial de revalorización y, sobre todo, la calidad del paisaje. Creemos que vivir rodeado de naturaleza no es un lujo, sino una necesidad que el mercado inmobiliario ha tardado demasiado en reconocer.
                </p>
                <p>
                  La sustentabilidad no es para nosotros una palabra de marketing. Es un criterio de selección. Trabajamos con municipios y propietarios que comparten nuestra visión de desarrollo responsable, y rechazamos cualquier proyecto que comprometa de forma irreparable el entorno donde se inserta.
                </p>
              </div>
            </div>

            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border">
              <Image
                src="/images/stocknature1.webp"
                alt="Naturaleza y desarrollo sustentable"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-semibold text-lg leading-snug drop-shadow-lg">
                  "La tierra no se deprecia. Se cuida, se desarrolla y se hereda."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Nuestros Valores</h2>
            <p className="text-muted-foreground text-lg">
              Los principios que guían cada decisión, desde la selección de un terreno hasta el momento en que entregamos la escritura.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Transparencia",
                desc: "Todos nuestros lotes cuentan con documentación al día, planos aprobados y procesos claros desde el primer paso. Sin sorpresas, sin letra chica.",
              },
              {
                icon: Leaf,
                title: "Sustentabilidad",
                desc: "Seleccionamos proyectos que respetan el entorno natural. El ecosistema donde se desarrollan nuestros barrios es parte del valor que ofrecemos.",
              },
              {
                icon: Heart,
                title: "Compromiso",
                desc: "Acompañamos a cada cliente durante todo el proceso: desde la primera consulta hasta la firma de la escritura. Estamos disponibles, no desaparecemos.",
              },
              {
                icon: Eye,
                title: "Visión",
                desc: "Elegimos ubicaciones con potencial real de revalorización: conectividad, servicios, calidad de vida. Pensamos en el futuro de quienes invierten con nosotros.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 bg-background rounded-2xl border border-border/50 shadow-sm space-y-4 text-center ring-1 ring-border/5 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto text-primary">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestro Nombre */}
      <section className="py-24">
        <div className="container px-4 mx-auto max-w-5xl">
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 rounded-3xl border border-teal-200/50 dark:border-teal-800/50 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="relative min-h-[320px] lg:min-h-full">
                <Image
                  src="/images/Alerce-in-Lenca-forest_1885.webp"
                  alt="Alerce milenario en el bosque de Lenca"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Content */}
              <div className="p-12 lg:p-16 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <TreePine className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Por qué Fitzroya</h2>
                </div>

                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    La <em>Fitzroya cupressoides</em> —conocida popularmente como alerce— es uno de los organismos vivos más antiguos del planeta. Nativa de los bosques templados del sur de América, puede vivir más de 3.000 años. Su madera es densa, resistente y duradera. Su crecimiento es lento pero constante. Es, en todos los sentidos, una metáfora perfecta para lo que buscamos hacer.
                  </p>
                  <p>
                    Elegimos este nombre porque refleja nuestra visión del desarrollo inmobiliario: no buscamos resultados rápidos a costa de la calidad. Buscamos construir algo que dure. Proyectos que se valoricen con el tiempo. Relaciones con los clientes que se mantengan más allá de la venta. Una empresa que crezca sobre bases sólidas, sin comprometer su integridad por atajos.
                  </p>
                  <p>
                    Así como el alerce crece en armonía con su entorno y lo protege, nosotros buscamos desarrollar en armonía con los territorios donde operamos. Respetando su naturaleza, potenciando su valor, y dejando algo mejor de lo que encontramos.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3 rounded-full bg-primary/60" style={{ opacity: 1 - i * 0.15 }} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    Crecimiento lento, sólido y duradero — como el árbol que nos inspira.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto max-w-4xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Por qué elegirnos</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              En un mercado donde abundan las promesas, nos diferenciamos por lo que hacemos —y por lo que no hacemos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Documentación al día",
                desc: "Cada lote que ofrecemos tiene su documentación completa antes de salir a la venta. Nunca vendemos sobre la base de promesas futuras.",
              },
              {
                title: "Financiación directa",
                desc: "Sin bancos, sin intermediarios. Financiamos directamente con cuotas accesibles y condiciones claras desde el primer momento.",
              },
              {
                title: "Ubicaciones estratégicas",
                desc: "Analizamos cada zona en profundidad antes de comprometernos. Buscamos conectividad, servicios y potencial de revalorización real.",
              },
              {
                title: "Proceso acompañado",
                desc: "Desde la primera consulta hasta la entrega de escritura, tenés un equipo disponible para responder cada duda y resolver cada paso.",
              },
              {
                title: "Sin sorpresas",
                desc: "El precio que acordamos es el precio que pagás. No hay gastos ocultos, no hay cargos que aparecen de la nada. Todo está explicado desde el inicio.",
              },
              {
                title: "Entorno natural preservado",
                desc: "Nuestros barrios están diseñados para convivir con el paisaje, no para reemplazarlo. Los espacios verdes son parte central del proyecto, no un agregado.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 bg-background rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container px-4 mx-auto max-w-3xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              ¿Querés conocer nuestros proyectos?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explorá las oportunidades de inversión disponibles y encontrá el lote ideal para tu futuro.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 gap-2 group h-14 text-lg" asChild>
              <Link href="/proyectos/jardines-de-arroyo">
                Ver Proyectos <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg" asChild>
              <Link href="/#contacto">
                <MapPin className="w-5 h-5 mr-2" /> Contactarnos
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
