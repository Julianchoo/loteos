import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Home,
  MapPin,
  Shield,
  TrendingDown,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cómo Financiar un Terreno | Lotes Financiados en Pesos | Fitzroya",
  description:
    "Todo sobre la financiación de terrenos en pesos: cuotas fijas, sin banco, sin garante, solo DNI. Hasta 72 cuotas. Conocé cómo funciona y mirá los proyectos disponibles.",
  keywords: [
    "lotes financiados",
    "terrenos en cuotas",
    "lotes en pesos y cuotas",
    "financiacion de terrenos",
    "calculadora cuotas terreno",
    "lotes 100 financiados",
    "terrenos financiados",
    "compra terrenos en cuotas",
    "lotes a pagar en cuotas",
    "venta de terrenos en cuotas",
  ],
  alternates: {
    canonical: "/financiacion/calculadora-cuotas",
  },
  openGraph: {
    title: "Calculadora de Cuotas para Terrenos | Fitzroya",
    description:
      "Calculá tu cuota mensual para comprar un terreno financiado en pesos. Sin banco, sin garante, solo DNI. Hasta 72 cuotas.",
  },
};

const faqItems = [
  {
    question: "¿Necesito ir al banco para comprar lotes financiados?",
    answer:
      "No. La financiación es directa con Fitzroya Desarrollos, sin intervención bancaria. No hay evaluación crediticia, no se piden recibos de sueldo ni se consultan bases de datos de deudores. El único requisito es tu DNI y el pago del anticipo inicial.",
  },
  {
    question: "¿Las cuotas están indexadas a la inflación, el dólar o bolsas de cemento?",
    answer:
      "Las cuotas se mantienen fijas en dólares durante toda la duración del plan. No utilizamos índices UVA, indexación por cemento ni ajustes por inflación. Sabés exactamente cuánto vas a pagar cada mes desde el primer día hasta el último.",
  },
  {
    question: "¿Cuánto es el anticipo mínimo para comprar un terreno en cuotas?",
    answer:
      "El anticipo mínimo varía según el proyecto. Representa generalmente entre el 20% y el 30% del valor del lote. A mayor anticipo, menor cuota mensual. Consultanos por el proyecto que te interese para conocer el monto exacto.",
  },
  {
    question: "¿Puedo pagar anticipadamente y cancelar la deuda antes de término?",
    answer:
      "Sí. Podés realizar pagos parciales adicionales o cancelar la totalidad del saldo pendiente en cualquier momento sin penalidades. Al cancelar anticipadamente, el interés se recalcula sobre el tiempo efectivamente financiado, lo que representa un ahorro significativo.",
  },
  {
    question: "¿Qué documentación necesito para comprar un terreno en cuotas?",
    answer:
      "Solo tu DNI. No pedimos comprobantes de ingresos, declaraciones juradas ni garantes. El trámite completo se hace con: DNI del/los compradores, firma del boleto de compraventa, y pago del anticipo. Si el lote es para una sociedad, se agrega el estatuto y el acta de designación de autoridades.",
  },
  {
    question: "¿El terreno puede estar a nombre de dos personas?",
    answer:
      "Sí. Podés comprar el lote en condominio con otra persona (pareja, familiar, socio). Cada cotitular firma el boleto y figura en la escritura. No hay restricción en la cantidad de cotitulares.",
  },
  {
    question: "¿Cuándo recibo la escritura del terreno?",
    answer:
      "La escritura se tramita una vez abonado el 100% del precio de venta. Mientras pagás las cuotas, el lote queda reservado a tu nombre mediante el boleto de compraventa, que tiene plena validez legal. En algunos proyectos ofrecemos posesión anticipada; consultá según el lote que te interese.",
  },
  {
    question: "¿Puedo construir mientras pago las cuotas?",
    answer:
      "Sí. Podés iniciar la obra una vez que tenés la posesión del lote, sin necesidad de esperar la escritura. Solo debés tramitar el permiso de obra ante el municipio correspondiente.",
  },
  {
    question: "¿Qué pasa si me atraso en el pago de una cuota?",
    answer:
      "Las cuotas vencidas generan un interés punitorio sobre el saldo impago. Si el atraso es puntual, alcanza con ponerse al día para regularizar la situación. Ante cualquier inconveniente, recomendamos contactarnos antes del vencimiento para acordar alternativas de pago.",
  },
];

const howToSteps = [
  {
    name: "Elegí tu anticipo",
    text: "Usá el slider para seleccionar el monto que podés poner como anticipo. A mayor anticipo, menor cuota mensual.",
  },
  {
    name: "Seleccioná el plazo",
    text: "Elegí entre 12 y 72 meses según tu comodidad de pago. La calculadora ajusta la cuota automáticamente.",
  },
  {
    name: "Revisá la cuota estimada",
    text: "La cuota mensual en dólares aparece en tiempo real. El cálculo usa la fórmula PMT con TNA 15% anual.",
  },
  {
    name: "Consultanos por tu lote",
    text: "Elegí el proyecto que te interesa y contactanos para conocer disponibilidad, precio y condiciones.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
    {
      "@type": "HowTo",
      name: "Cómo calcular cuotas para comprar un terreno financiado",
      description:
        "Usá nuestra calculadora para simular tu plan de cuotas y encontrar el terreno ideal para comprar en cuotas.",
      step: howToSteps.map((step, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: step.name,
        text: step.text,
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: "https://fitzroya.com.ar",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Financiación",
          item: "https://fitzroya.com.ar/financiacion",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Calculadora de Cuotas",
          item: "https://fitzroya.com.ar/financiacion/calculadora-cuotas",
        },
      ],
    },
  ],
};

const projects = [
  {
    slug: "jardines-de-arroyo",
    name: "Jardines de Arroyo",
    location: "Arroyo de la Cruz, Exaltación de la Cruz",
    commercialLabel: undefined,
    financingFrom: "Anticipo inicial + cuotas fijas en USD",
    description:
      "182 lotes de 300m² en barrio abierto con infraestructura completa. A 6 km de Capilla del Señor.",
    tags: ["Barrio abierto", "Luz y agua", "Sin expensas"],
  },
  {
    slug: "san-nicolas",
    name: "San Nicolás",
    location: "Guernica, sur del GBA",
    commercialLabel: undefined,
    financingFrom: "Anticipo inicial + cuotas fijas en USD",
    description:
      "Lotes en zona estratégica del sur del Gran Buenos Aires. Financiación directa hasta 72 cuotas.",
    tags: ["Sur GBA", "Todos los servicios", "Financiación directa"],
  },
  {
    slug: "general-rodriguez",
    name: "General Rodríguez",
    location: "General Rodríguez, Buenos Aires",
    commercialLabel: "Financiación en hasta 60 cuotas",
    financingFrom: "Consultá disponibilidad y condiciones",
    description:
      "Proyecto de 450 lotes frente a Barrio Bicentenario, en General Rodríguez.",
    tags: ["450 lotes", "Frente a Barrio Bicentenario", "Hasta 60 cuotas"],
  },
];

export default function CalculadoraCuotasPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/financiacion"
              className="hover:text-foreground transition-colors"
            >
              Financiación
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">
              Calculadora de Cuotas
            </span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Cómo Financiar un Terreno en Cuotas
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Comprá <strong>lotes financiados en pesos</strong> sin banco, sin
              garante y con solo tu DNI. Hasta 72 cuotas fijas en dólares, sin
              indexación por cemento ni UVA.
            </p>
            <ul className="space-y-3">
              {[
                "Sin evaluación crediticia ni garante",
                "Cuotas fijas en USD — sin indexación por cemento ni UVA",
                "Podés construir desde el primer día",
                "Cancelación anticipada sin penalidades",
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Contenido explicativo */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">
            Cómo Funciona la Financiación Directa de Terrenos
          </h2>

          <div className="prose prose-lg max-w-none text-foreground space-y-6">
            <p>
              Comprar <strong>terrenos en cuotas</strong> no debería ser
              complicado. En Fitzroya Desarrollos eliminamos la burocracia
              bancaria y ofrecemos <strong>financiación directa</strong>: vos
              financiás con nosotros, sin intermediarios, sin turnos en el banco
              y sin que te rechacen por un informe crediticio.
            </p>

            <p>
              Tanto si buscás{" "}
              <strong>lotes financiados en la zona norte</strong> de Buenos
              Aires como en la zona sur, nuestros proyectos cubren las dos
              áreas. Jardines de Arroyo está en Exaltación de la Cruz (Capilla
              del Señor, Cardales), y San Nicolás en zona norte bonaerense.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 mb-12">
            {[
              {
                icon: FileText,
                title: "Solo DNI",
                desc: "Sin recibos de sueldo, sin declaraciones juradas, sin consulta a Veraz.",
              },
              {
                icon: Clock,
                title: "Hasta 72 cuotas",
                desc: "Plazo de hasta 6 años para que la cuota se adapte a tu presupuesto.",
              },
              {
                icon: DollarSign,
                title: "Cuotas fijas en USD",
                desc: "Sin indexación. Sabés exactamente cuánto pagás el primer y el último mes.",
              },
              {
                icon: TrendingDown,
                title: "Cancelación anticipada",
                desc: "Podés pagar antes sin penalidades. El interés se recalcula sobre el tiempo real.",
              },
              {
                icon: Home,
                title: "Construí desde el día uno",
                desc: "El boleto de compraventa te habilita a iniciar obra sin esperar la escritura.",
              },
              {
                icon: Shield,
                title: "Respaldo legal",
                desc: "Boleto con validez legal plena. Escritura al 100% del pago del precio.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="border bg-card">
                <CardContent className="pt-6">
                  <Icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="prose prose-lg max-w-none text-foreground space-y-6">
            <h3 className="text-2xl font-bold">El Sistema de Cuotas Paso a Paso</h3>

            <p>
              La <strong>financiación de terrenos</strong> en Fitzroya funciona
              en cuatro pasos simples:
            </p>

            <ol className="list-decimal list-inside space-y-3 ml-4">
              <li>
                <strong>Elegís el lote</strong> que más te gusta en cualquiera
                de nuestros proyectos.
              </li>
              <li>
                <strong>Firmás el boleto de compraventa</strong> con DNI en
                mano. Sin gestiones bancarias.
              </li>
              <li>
                <strong>Pagás el anticipo</strong> (monto según el proyecto) y el lote queda reservado a tu nombre.
              </li>
              <li>
                <strong>Pagás las cuotas mensualmente</strong> durante el plazo
                elegido. La cuota es fija desde el inicio.
              </li>
            </ol>

            <h3 className="text-2xl font-bold">¿Cómo se Calcula la Cuota?</h3>

            <p>
              La cuota mensual se calcula con la fórmula financiera PMT (Payment)
              estándar, aplicando una{" "}
              <strong>Tasa Nominal Anual (TNA) del 15%</strong>. La fórmula
              toma en cuenta el capital a financiar (precio del lote menos
              anticipo), la tasa mensual equivalente y la cantidad de cuotas
              elegida.
            </p>

            <p>
              A diferencia de competidores que usan{" "}
              <em>indexación por bolsas de cemento o UVA</em>, nuestras cuotas
              son en dólares a valor fijo. Esto significa que si tu cuota es
              USD 180 hoy, será USD 180 en el mes 12 y en el mes 60. Sin
              sorpresas.
            </p>

            <h3 className="text-2xl font-bold">Anticipo: ¿Cuánto Conviene Poner?</h3>

            <p>
              El anticipo es el pago inicial que hacés al firmar el boleto.
              Cuanto mayor sea el anticipo, menor será el capital a financiar y,
              en consecuencia, menor la cuota mensual.
            </p>

            <p>
              <strong>Ejemplo orientativo:</strong> Si ponés un anticipo mayor, el capital a financiar es menor y la cuota mensual baja. Usá la calculadora para simular distintos escenarios de anticipo y plazo, y encontrá el plan que mejor se adapta a tu presupuesto. Los valores son estimativos; consultanos para conocer el precio y condiciones exactas del lote que te interesa.
            </p>

            <h3 className="text-2xl font-bold">Pago Anticipado y Cancelación</h3>

            <p>
              Podés hacer pagos extraordinarios en cualquier momento. Cada pago
              adicional se imputa a capital, reduciendo el saldo pendiente y el
              interés futuro. Si decidís cancelar el total del saldo, no pagás
              penalidades: solo abonás el capital pendiente más los intereses
              devengados hasta ese día.
            </p>

            <p>
              Esta flexibilidad convierte a los{" "}
              <strong>lotes en cuotas</strong> de Fitzroya en una opción ideal
              para quienes esperan recibir un dinero extra (liquidación de
              inversión, herencia, bono anual) y quieren acelerar el pago.
            </p>

            <h3 className="text-2xl font-bold">Documentación para Comprar un Terreno en Cuotas</h3>

            <p>
              El proceso es simple y toda la documentación se tramita en una
              sola reunión:
            </p>

            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>DNI</strong> de todos los compradores (original y copia).
              </li>
              <li>
                <strong>Anticipo</strong> en efectivo o transferencia bancaria al
                momento de la firma.
              </li>
              <li>
                <strong>Boleto de compraventa</strong>: lo preparamos nosotros,
                lo revisás con tu escribano si lo deseás.
              </li>
              <li>
                En caso de compra por <strong>sociedad</strong>: estatuto social
                vigente + acta de designación de autoridades.
              </li>
            </ul>

            <p>
              No pedimos recibos de sueldo, constancias de AFIP, ni ningún otro
              tipo de comprobante de ingresos. La financiación directa elimina
              todas esas barreras.
            </p>
          </div>
        </div>
      </section>

      {/* Proyectos disponibles */}
      <section id="proyectos" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Proyectos con Financiación Directa
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Elegí el proyecto que mejor se adapta a tu presupuesto y
              consultá las condiciones disponibles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card
                key={project.slug}
                className="overflow-hidden border-2 hover:border-primary/50 transition-colors"
              >
                <CardHeader className="bg-primary/5 pb-4">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="border-t pt-4 space-y-1">
                    <p className="font-bold text-lg">
                      {project.commercialLabel ?? "Precio a consultar"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {project.financingFrom}
                    </p>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/proyectos/${project.slug}`}>
                      Ver proyecto
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Preguntas Frecuentes sobre Financiación de Terrenos
            </h2>
            <p className="text-muted-foreground">
              Todo lo que necesitás saber antes de comprar{" "}
              <strong>lotes en cuotas</strong>.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 bg-primary/5 border-t">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para Reservar tu Terreno?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Mirá los proyectos disponibles y contactanos. Te respondemos con
            disponibilidad, precio y opciones de financiación según el proyecto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/#contacto">
                Consultá ahora
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/proyectos">Ver todos los proyectos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
