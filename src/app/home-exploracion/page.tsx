import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Sprout, Scan, Mail, Phone, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getProjectsForCurrentUser } from "@/lib/actions/project-actions";
import { toPublicProjectSummary } from "@/lib/public-projects";
import { cn } from "@/lib/utils";
import styles from "./home-exploracion.module.css";
import { LandExplorer, Reveal } from "./interactions";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Exploración de home",
  description: "Lotes en venta en Buenos Aires con financiacion directa hasta 72 cuotas sin banco.",
  robots: { index: false, follow: false },
};

const whatsapp = "https://wa.me/5491149708971";
const principles = [
  { number: "01", title: "Transparencia", text: "Todos nuestros lotes cuentan con la documentación al día y procesos claros.", icon: ShieldCheck },
  { number: "02", title: "Ubicación", text: "Elegimos zonas con alto potencial de revalorización y excelente conectividad.", icon: Scan },
  { number: "03", title: "Sustentabilidad", text: "Respetamos el entorno natural en cada uno de nuestros desarrollos.", icon: Sprout },
];

function Brand() {
  return <Link href="/" className={styles.brand} aria-label="Fitzroya Desarrollos, inicio">
    <Image src="/images/logo-icon/icon-192x192.png" alt="" width={38} height={38} />
    <span>fitzroya<span className={styles.brandDot}>.</span><small>DESARROLLOS</small></span>
  </Link>;
}

export default async function ExplorationHome() {
  const result = await getProjectsForCurrentUser();
  const projects = result.data.map(toPublicProjectSummary);
  const leadProject = projects[0];

  return (
    <div className={cn("home-exploration", styles.page)} id="inicio">
      <a className={styles.skipLink} href="#main-content">Saltar al contenido</a>
      <header className={styles.header}>
        <div className={cn(styles.container, styles.headerInner)}>
          <Brand />
          <nav className={styles.navigation} aria-label="Navegación principal">
            <Link href="/nosotros">Nosotros</Link>
            <Link href="/proyectos">Proyectos</Link>
            <Link href="/blog">Blog</Link>
          </nav>
          <Button asChild variant="outline" size="lg" className={styles.headerButton}>
            <a href="#contacto">Contacto <ArrowUpRight data-icon="inline-end" /></a>
          </Button>
        </div>
      </header>

      <main id="main-content">
        <section className={cn(styles.container, styles.hero)} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span className={styles.statusDot} /> BUENOS AIRES</p>
            <h1 id="hero-title">Tierra<span className={styles.heroWord}>con futuro.
              <svg viewBox="0 0 600 25" preserveAspectRatio="none" aria-hidden="true"><path d="M5 17Q290 -3 595 12M24 24Q300 5 565 19" pathLength="1" /></svg>
            </span></h1>
            <p className={styles.heroDescription}>Creamos espacios para tu futuro. Proyectos sustentables en ubicaciones estratégicas.</p>
            <div className={styles.heroActions}>
              <Button asChild size="lg" className={styles.largeButton}><a href="#proyectos">Explorar proyectos <ArrowUpRight data-icon="inline-end" /></a></Button>
            </div>
            <p className={styles.heroNote}><Sprout className="size-5" aria-hidden="true" /> TIERRA / PROYECTO / FUTURO</p>
            {leadProject && <div className={styles.featuredProject}><p>Proyecto destacado</p><strong>{leadProject.name}</strong><span>{leadProject.location}</span></div>}
          </div>
          <LandExplorer />
        </section>

        <div className={styles.featureStrip}>
          <div className={cn(styles.container, styles.homeStatement)}>
            <p>No vendemos una imagen de vida. Mostramos la tierra, la ubicación y las condiciones para que puedas decidir.</p>
          </div>
        </div>

        <section id="nosotros" className={cn(styles.container, styles.section)} aria-labelledby="company-title">
          <Reveal>
            <p className={styles.eyebrow}>Nuestra empresa</p>
            <div className={styles.sectionHeading}>
              <h2 id="company-title">Menos promesas.<br /><span>Más claridad.</span></h2>
              <p className={styles.companyDescription}>En Fitzroya Desarrollos nos dedicamos a la adquisición y desarrollo de tierras con un enfoque transparente y centrado en el cliente.</p>
            </div>
            <div className={styles.steps}>
              {principles.map(({ number, title, text, icon: Icon }) => <article key={number} className={styles.step}>
                <div className={styles.stepTop}><span>{number}</span><Icon aria-hidden="true" strokeWidth={1} /></div>
                <h3>{title}</h3><p>{text}</p>
              </article>)}
            </div>
          </Reveal>
        </section>

        <section id="proyectos" className={cn(styles.container, styles.projectSection)} aria-labelledby="projects-title">
          <Reveal>
            <div className={styles.sectionHeading}>
              <div><h2 id="projects-title">Nuestros <span>Proyectos</span></h2><p className={styles.projectIntro}>Descubri nuestras oportunidades de inversion disponibles.</p></div>
              <Link href="/proyectos" className={styles.textLink}>Ver todos los proyectos <ArrowUpRight className="size-5" aria-hidden="true" /></Link>
            </div>
            <div className={styles.projectGrid}>
              {projects.map((project, index) => <Card key={project.id} className={styles.projectCard}>
                <CardContent className={styles.projectImage}>
                  <Image src={project.image} alt={project.alt} fill sizes="(max-width: 800px) 100vw, 60vw" className="object-cover" />
                  <Badge variant="secondary" className={styles.projectBadge}>{project.isVisible ? project.badge : "OCULTO"}</Badge>
                  <span className={styles.imageNumber} aria-hidden="true">/ {String(index + 1).padStart(2, "0")}</span>
                </CardContent>
                <CardHeader className={styles.projectHeader}>
                  <p className={styles.location}><MapPin className="size-4" aria-hidden="true" />{project.location}</p>
                  <CardTitle><Link href={project.href}>{project.name}</Link></CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className={styles.projectFacts}>
                    <div><dt>Datos</dt><dd>{project.facts}</dd></div>
                    <div><dt>Financiacion</dt><dd>{project.financingFrom}</dd></div>
                  </dl>
                </CardContent>
                <CardFooter className={styles.projectFooter}>
                  <Button asChild className={styles.projectButton}><Link href={`${project.href}#financiacion`}>Calcular cuota <ArrowUpRight data-icon="inline-end" /></Link></Button>
                  <Button asChild variant="outline" className={styles.projectButton}><Link href={project.href}>Ver Proyecto <ArrowUpRight data-icon="inline-end" /></Link></Button>
                </CardFooter>
              </Card>)}
            </div>
            {!result.success && <p className={styles.catalogMessage}>No pudimos cargar los proyectos. Podés volver a intentar o consultarnos por WhatsApp.</p>}
          </Reveal>
        </section>

        <section id="contacto" className={cn(styles.container, styles.closingSection)} aria-labelledby="contact-title">
          <Reveal className={cn(styles.toolsGrid, styles.contactGrid)}>
            <Card className={cn("home-exploration-inverse", styles.financeCard)}>
              <CardHeader>
                <p className={styles.eyebrow}>El próximo paso</p>
                <h2 id="contact-title">Hablemos de tu futuro.</h2>
                <CardDescription>Nuestro equipo está listo para asesorarte en tu próxima inversión inmobiliaria.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={styles.contactLinks}>
                  <a href={whatsapp} target="_blank" rel="noreferrer"><Phone className="size-4" aria-hidden="true" />WhatsApp: +54 9 11 4970-8971</a>
                  <a href="mailto:matias@fitzroyadesarrollos.com"><Mail className="size-4" aria-hidden="true" />matias@fitzroyadesarrollos.com</a>
                </div>
                <div className={styles.landDrawing} aria-hidden="true"><svg viewBox="0 0 300 160" fill="none"><path d="M44 114 107 24 254 45 220 137Z" fill="var(--primary)" fillOpacity=".12" stroke="var(--primary)" /><path d="m107 24 113 113M44 114 254 45" stroke="var(--primary)" strokeDasharray="4 5" />{[[44,114],[107,24],[254,45],[220,137]].map(([x,y],i)=><rect key={i} x={x! - 3} y={y! - 3} width="6" height="6" fill="var(--card)" stroke="var(--primary)" />)}</svg></div>
              </CardContent>
            </Card>
            <div className={cn(styles.contactForm, "bg-card text-card-foreground")}><ContactForm /></div>
          </Reveal>
        </section>
      </main>

      <footer className={cn(styles.container, styles.footer)}>
        <Separator />
        <div className={styles.footerContent}>
          <div><Brand /><p>Especialistas en la creacion de barrios sustentables y oportunidades de inversion.</p></div>
          <div><h2>Proyectos</h2><ul>{projects.map(project => <li key={project.id}><Link href={project.href}>{project.name}</Link></li>)}</ul></div>
          <div><h2>Contacto</h2><ul><li>Email: matias@fitzroyadesarrollos.com</li><li>Tel: +54 9 11 4970-8971</li><li>Ubicacion: Buenos Aires</li></ul></div>
        </div>
        <div className={styles.footerBottom}><span>(c) {new Date().getFullYear()} Fitzroya Desarrollos. Todos los derechos reservados.</span><a href="#inicio">Volver arriba <ArrowUpRight className="size-3" aria-hidden="true" /></a></div>
      </footer>
    </div>
  );
}
