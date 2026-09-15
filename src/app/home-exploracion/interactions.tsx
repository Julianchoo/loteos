"use client";

import { useEffect, useId, useRef, type PointerEvent, type ReactNode } from "react";
import { ArrowUpRight, Layers2, MoveUpRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import styles from "./home-exploracion.module.css";

const views = [
  { id: "terreno", label: "Terreno", caption: "Tierra" },
  { id: "calles", label: "Calles", caption: "Proyecto" },
  { id: "lotes", label: "Lotes", caption: "Futuro" },
] as const;
type PlanView = (typeof views)[number]["id"];

export function Reveal({ children, className }: { children: ReactNode; className?: string | undefined }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const show = () => { element.removeAttribute("data-reveal-pending"); observer?.disconnect(); };
    if (!preference.matches && element.getBoundingClientRect().top >= window.innerHeight) {
      element.setAttribute("data-reveal-pending", "");
      observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) show(); }, { threshold: 0.08 });
      observer.observe(element);
    }
    const onPreferenceChange = () => { if (preference.matches) show(); };
    preference.addEventListener("change", onPreferenceChange);
    return () => { show(); preference.removeEventListener("change", onPreferenceChange); };
  }, []);
  return <div ref={ref} className={className} data-reveal="">{children}</div>;
}

function PlanDrawing({ view }: { view: PlanView }) {
  const id = useId();
  return (
    <svg className={styles.planSvg} viewBox="0 0 660 480" role="img" aria-labelledby={`${id}-title`}>
      <title id={`${id}-title`}>{view === "terreno" ? "Contorno de un terreno ilustrativo" : view === "calles" ? "Calles que conectan el terreno ilustrativo" : "Distribución ilustrativa de lotes"}. No representa un proyecto ni disponibilidad real.</title>
      <defs><pattern id={`${id}-grid`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="var(--border)" strokeWidth="0.6" /></pattern></defs>
      <rect width="660" height="480" fill="var(--secondary)" />
      <rect width="660" height="480" fill={`url(#${id}-grid)`} />
      <g fill="none" stroke="var(--ring)" opacity="0.2">
        <path d="M-20 380C90 365 40 42 238 20S504 20 688 138" /><path d="M-20 405C125 380 68 64 250 42S522 42 688 160" /><path d="M-20 430C148 405 96 86 265 65S548 64 688 184" /><path d="M200 505C300 405 480 478 685 290" /><path d="M240 505C334 432 502 491 685 323" />
      </g>
      <g fill="none" stroke="var(--ring)" strokeWidth="1"><path d="M78 62V54H582V62M60 78H52V402H60" /><path d="M600 58V30m-5 7 5-7 5 7" /><path d="M22 22v12m-6-6h12M631 442v12m-6-6h12" /></g>
      <g fill="var(--muted-foreground)" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.6"><text x="330" y="40" textAnchor="middle">TIERRA / PROYECTO / FUTURO</text><text x="600" y="21" textAnchor="middle">N</text><text x="80" y="439">FITZROYA DESARROLLOS</text></g>
      <rect x="78" y="78" width="504" height="324" fill="var(--accent)" fillOpacity="0.46" />
      {view !== "terreno" && <g className={styles.planLayer}><path d="M78 241H582M330 78V402" fill="none" stroke="var(--background)" strokeWidth="34" /><path d="M78 241H582M330 78V402" fill="none" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="6 7" /></g>}
      {view === "lotes" && <g className={styles.planLayer}>{Array.from({ length: 24 }, (_, index) => {
        const column = index % 6;
        const row = Math.floor(index / 6);
        const x = 94 + column * 73 + (column >= 3 ? 34 : 0);
        const y = 94 + row * 65 + (row >= 2 ? 34 : 0);
        return <g key={index}><rect x={x} y={y} width="64" height="57" rx="2" fill="var(--accent)" stroke="var(--ring)" strokeOpacity="0.75" /><text x={x + 32} y={y + 33} fill="var(--foreground)" fontFamily="var(--font-mono)" fontSize="9" textAnchor="middle">{String(index + 1).padStart(2, "0")}</text></g>;
      })}</g>}
      {view === "terreno" && <g className={styles.planLayer} fill="var(--foreground)" textAnchor="middle"><text x="330" y="226" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="40">Tierra con futuro.</text><text x="330" y="256" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="2">FITZROYA DESARROLLOS</text></g>}
      <rect x="78" y="78" width="504" height="324" fill="none" stroke="var(--primary)" strokeWidth="1.5" />
      {[[78,78],[582,78],[78,402],[582,402]].map(([x,y], index) => <rect key={index} x={x! - 3.5} y={y! - 3.5} width="7" height="7" fill="var(--card)" stroke="var(--primary)" />)}
    </svg>
  );
}

export function LandExplorer() {
  const surface = useRef<HTMLDivElement>(null);
  const resetTilt = () => { surface.current?.style.removeProperty("transform"); };
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", resetTilt);
    return () => preference.removeEventListener("change", resetTilt);
  }, []);
  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (surface.current) surface.current.style.transform = `rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  };
  return <div className={styles.explorer} onPointerMove={tilt} onPointerLeave={resetTilt} onPointerCancel={resetTilt}>
    <div className={styles.orbit} aria-hidden="true" />
    <div ref={surface} className={styles.planSurface}>
      <div className={styles.floatingTop} aria-hidden="true"><span /> Creamos espacios para tu futuro.</div>
      <Tabs defaultValue="lotes" className={styles.planCard}>
        <div className={styles.planHeader}><span><Layers2 aria-hidden="true" /> Fitzroya Desarrollos</span><span className={styles.technical}>VISTA ILUSTRATIVA</span></div>
        {views.map(view => <TabsContent key={view.id} value={view.id} className={styles.planPanel}><PlanDrawing view={view.id} /><p className={styles.planCaption}>{view.caption}</p></TabsContent>)}
        <div className={styles.planControls}><TabsList aria-label="Vista del plano ilustrativo" className="h-11">{views.map(view => <TabsTrigger key={view.id} value={view.id} className="min-h-10 px-4">{view.label}</TabsTrigger>)}</TabsList><MoveUpRight className="size-4" aria-hidden="true" /></div>
      </Tabs>
      <div className={styles.floatingBottom} aria-hidden="true"><span className={styles.floatingIcon}><Layers2 /></span><span><strong>Tierra con futuro.</strong><small>Proyectos sustentables en ubicaciones estratégicas.</small></span><ArrowUpRight className="size-5" /></div>
    </div>
    <div className={styles.planFootnote}><span>TIERRA / PROYECTO / FUTURO</span><span>ESQUEMA CONCEPTUAL ↗</span></div>
    <p className={styles.planDisclaimer}>Ilustración conceptual. No representa un proyecto ni su disponibilidad.</p>
  </div>;
}
