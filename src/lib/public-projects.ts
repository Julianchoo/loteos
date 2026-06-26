import type { ProjectWithPricing } from "@/lib/actions/project-actions";

export type PublicProjectSummary = {
  id: string;
  name: string;
  href: string;
  isVisible: boolean;
  image: string;
  alt: string;
  location: string;
  badge: string;
  facts: string;
  tags: string[];
  description: string;
  commercialLabel?: string | undefined;
  financingFrom: string;
};

const fallbackProjects: Record<string, Omit<PublicProjectSummary, "id" | "name" | "href" | "isVisible">> = {
  "jardines-de-arroyo": {
    image: "/images/hero-panorama.png",
    alt: "Jardines de Arroyo - Arroyo de la Cruz",
    location: "Arroyo de la Cruz, Exaltacion de la Cruz",
    badge: "EN VENTA",
    facts: "182 lotes - 300 m2 - Financiacion directa",
    tags: ["Sin expensas", "Financiacion directa", "GBA Norte"],
    description: "Barrio abierto con infraestructura completa en Arroyo de la Cruz.",
    financingFrom: "Anticipo inicial + cuotas fijas en USD",
  },
  "san-nicolas": {
    image: "/images/hero-panorama.png",
    alt: "San Nicolas - Guernica",
    location: "Guernica, Buenos Aires",
    badge: "EN VENTA",
    facts: "20 lotes - 1 hectarea - Financiacion directa",
    tags: ["Escritura inmediata", "Servicios", "Sur GBA"],
    description: "Lotes en zona estrategica del sur del Gran Buenos Aires.",
    financingFrom: "Anticipo inicial + cuotas fijas en USD",
  },
  "general-rodriguez": {
    image: "/images/stephen-cobb-4YSQ6wD8lyA-unsplash.webp",
    alt: "General Rodriguez",
    location: "General Rodriguez, Buenos Aires",
    badge: "NUEVO",
    facts: "450 lotes - Hasta 60 cuotas",
    tags: ["Frente a Barrio Bicentenario", "Financiacion directa", "General Rodriguez"],
    description: "Proyecto de 450 lotes frente a Barrio Bicentenario.",
    commercialLabel: "Financiacion en hasta 60 cuotas",
    financingFrom: "Consulta disponibilidad y condiciones",
  },
};

export function toPublicProjectSummary(project: ProjectWithPricing): PublicProjectSummary {
  const fallback = fallbackProjects[project.id];

  return {
    id: project.id,
    name: project.name,
    href: `/proyectos/${project.id}`,
    isVisible: project.isVisible,
    image: fallback?.image ?? "/images/hero-panorama.png",
    alt: fallback?.alt ?? project.name,
    location: project.location ?? fallback?.location ?? "Buenos Aires",
    badge: fallback?.badge ?? "EN VENTA",
    facts:
      fallback?.facts ??
      [project.totalLots ? `${project.totalLots} lotes` : null, project.totalArea, "Financiacion directa"]
        .filter(Boolean)
        .join(" - "),
    tags: fallback?.tags ?? ["Financiacion directa"],
    description: project.description ?? fallback?.description ?? "Proyecto de lotes con financiacion directa.",
    commercialLabel: fallback?.commercialLabel,
    financingFrom:
      project.maxFinancingMonths != null
        ? `Hasta ${project.maxFinancingMonths} cuotas`
        : fallback?.financingFrom ?? "Consulta condiciones disponibles",
  };
}
