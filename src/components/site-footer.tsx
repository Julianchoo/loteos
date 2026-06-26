import Image from "next/image";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40 py-12 text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Image
                src="/images/logo-icon/icon-192x192.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 dark:hidden"
                aria-hidden="true"
              />
              <Image
                src="/images/logo-green-2FBC5B-transparent.png"
                alt=""
                width={24}
                height={24}
                className="hidden h-6 w-6 dark:block"
                aria-hidden="true"
              />
              <span className="text-[#143827] dark:text-[#2FBC5B]">Fitzroya Desarrollos</span>
            </div>
            <p className="max-w-xs">
              Especialistas en la creación de barrios sustentables y oportunidades de inversión en zonas exclusivas.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Proyectos</h4>
            <ul className="space-y-2">
              <li><a href="/proyectos/jardines-de-arroyo" className="hover:text-primary transition-colors">Jardines de Arroyo - Arroyo de La Cruz</a></li>
              <li><a href="/proyectos/general-rodriguez" className="hover:text-primary transition-colors">General Rodríguez</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Próximos Desarrollos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Contacto</h4>
            <ul className="space-y-2">
              <li>Email: matias@fitzroyadesarrollos.com</li>
              <li>Tel: +54 9 11 1234 5678</li>
              <li>Ubicación: Exaltación de la Cruz, PBA</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center">
          <p>© {currentYear} Fitzroya Desarrollos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
