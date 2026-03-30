"use client";

import { useState, useEffect } from "react";
import { TreePine, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnimatedHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <div className="container relative z-10 px-4 text-center space-y-8">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-white text-sm font-medium mb-4 backdrop-blur-md transition-all duration-1000 ${
          mounted
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        <TreePine className="w-4 h-4 text-primary" />
        <span>Desarrollos Inmobiliarios Exclusivos</span>
      </div>
      <h1
        className={`text-6xl md:text-9xl font-black tracking-tighter text-white text-balance transition-all duration-1000 ${
          mounted
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
        style={{ transitionDelay: mounted ? "200ms" : "0ms" }}
      >
        Fitzroya <span className="text-primary italic">Desarrollos</span>
      </h1>
      <p
        className={`max-w-2xl mx-auto text-xl md:text-2xl text-white/90 font-medium transition-all duration-1000 ${
          mounted
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
        }`}
        style={{ transitionDelay: mounted ? "500ms" : "0ms" }}
      >
        Creamos espacios para tu futuro. Proyectos sustentables en ubicaciones estratégicas.
      </p>
      <div
        className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 transition-all duration-1000 ${
          mounted
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-16"
        }`}
        style={{ transitionDelay: mounted ? "700ms" : "0ms" }}
      >
        <Button size="lg" className="rounded-full px-8 gap-2 group h-14 text-xl shadow-xl shadow-primary/20" asChild>
          <a href="/proyectos">
            Ver Proyectos <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </Button>
        <Button size="lg" variant="secondary" className="rounded-full px-8 h-14 text-xl backdrop-blur-md bg-white/10 hover:bg-white/20 border-white/20 text-white" asChild>
          <a href="#contacto">
            <Mail className="w-5 h-5 mr-2" /> Contáctanos
          </a>
        </Button>
      </div>
    </div>
  );
}
