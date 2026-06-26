import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProjectsForCurrentUser } from "@/lib/actions/project-actions";
import { toPublicProjectSummary } from "@/lib/public-projects";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Loteos en Buenos Aires - Proyectos Disponibles | Fitzroya",
  description: "Proyectos disponibles de Fitzroya Desarrollos con financiacion directa y barrios abiertos sin expensas.",
  keywords: ["loteo", "loteo Buenos Aires", "loteo sin expensas", "barrio abierto sin expensas", "desarrollos inmobiliarios Buenos Aires", "comprar lote Buenos Aires"],
  alternates: { canonical: "/proyectos" },
  openGraph: {
    title: "Loteos en Buenos Aires - Proyectos Disponibles | Fitzroya",
    description: "Proyectos disponibles con financiacion directa y barrios abiertos sin expensas.",
  },
};

export default async function ProyectosPage() {
  const { data } = await getProjectsForCurrentUser();
  const projects = data.map(toPublicProjectSummary);

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "Fitzroya Desarrollos",
            description: "Desarrolladora de loteos y barrios abiertos sin expensas en Buenos Aires",
            areaServed: "Buenos Aires, Argentina",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Proyectos de loteo",
              itemListElement: projects.map((item) => ({
                "@type": "Offer",
                name: item.name,
                description: item.description,
                url: `https://www.fitzroyadesarrollos.com${item.href}`,
              })),
            },
          }),
        }}
      />
      <main id="main-content">
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Loteos y Barrios Abiertos en Buenos Aires</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">Desarrollamos barrios abiertos sin expensas con financiacion directa. Sin banco, sin burocracia.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg"><a href="#proyectos">Ver proyectos</a></Button>
              <Button asChild size="lg" variant="outline"><Link href="/#contacto">Contactanos</Link></Button>
            </div>
          </div>
        </section>
        <section id="proyectos" className="py-20 bg-accent/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Proyectos disponibles</h2>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {projects.map((item) => (
                  <Card key={item.id} className="overflow-hidden flex flex-col">
                    <div className="relative h-52">
                      <Image src={item.image} alt={item.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                      <div className="absolute top-3 left-3"><Badge className="bg-primary text-primary-foreground">{item.isVisible ? item.badge : "OCULTO"}</Badge></div>
                    </div>
                    <CardContent className="flex flex-col flex-1 pt-5 gap-4">
                      <div><h3 className="text-xl font-bold mb-1">{item.name}</h3>{!item.isVisible && <Badge variant="secondary">Oculto</Badge>}<div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" /><span>{item.location}</span></div></div>
                      <div className="text-sm text-muted-foreground border-t pt-3">{item.facts}</div>
                      <div className="flex flex-wrap gap-2">{item.tags.map((tag) => (<Badge key={tag} variant="secondary">{tag}</Badge>))}</div>
                      <Button asChild className="w-full mt-auto"><Link href={item.href}>Ver proyecto <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (<p className="text-center text-muted-foreground">No hay proyectos visibles por el momento.</p>)}
          </div>
        </section>
        <section id="que-es-un-loteo" className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-3xl"><h2 className="text-3xl font-bold mb-8">Que es un loteo abierto?</h2><div className="flex flex-col gap-5 text-muted-foreground leading-relaxed"><p>Un loteo abierto es un barrio residencial donde cada familia es duena de su lote con escritura propia. No hay administracion central ni cuota mensual de expensas.</p><p>El desarrollador provee la infraestructura y servicios necesarios y luego transfiere el dominio de cada lote.</p></div></div>
        </section>
        <section id="sin-expensas" className="py-20 bg-accent/20">
          <div className="container mx-auto px-4 max-w-3xl"><h2 className="text-3xl font-bold mb-8">Por que sin expensas?</h2><div className="flex flex-col gap-5 text-muted-foreground leading-relaxed"><p>En un barrio abierto sin expensas, el costo mensual de administracion central no existe.</p><p>Resultado: menor costo total de tenencia, mayor libertad de uso y un precio de entrada mas accesible.</p></div></div>
        </section>
        <section id="financiacion" className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-3xl"><h2 className="text-3xl font-bold mb-6">Financiacion directa del desarrollador</h2><p className="text-muted-foreground leading-relaxed mb-6">No necesitas banco ni credito hipotecario. Financiamos directamente nosotros.</p><div className="flex flex-col gap-3 mb-8">{["Anticipo inicial", "Cuotas fijas en dolares", "Sin evaluacion crediticia", "Sin garante requerido"].map((item) => (<div key={item} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /><span>{item}</span></div>))}</div><Button asChild variant="outline"><Link href="/financiacion/calculadora-cuotas">Conoce la financiacion <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
        </section>
        <section className="py-20 bg-primary text-primary-foreground"><div className="container mx-auto px-4 text-center max-w-2xl"><h2 className="text-3xl font-bold mb-4">Listo para empezar?</h2><p className="text-primary-foreground/80 mb-8 text-lg">Habla con nosotros y encontra el lote ideal para tu proyecto de vida.</p><Button asChild size="lg" variant="secondary"><Link href="/#contacto">Contactanos</Link></Button></div></section>
      </main>
    </div>
  );
}
