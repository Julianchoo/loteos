"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut, useSession } from "@/lib/auth-client";
import { ModeToggle } from "./ui/mode-toggle";

type NavProject = { id: string; name: string; href: string; location: string; isVisible: boolean };

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, isPending: sessionPending } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState<NavProject[]>([]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects/visible", { cache: "no-store" });
        const data: { projects: NavProject[] } = await response.json();
        setProjects(data.projects);
      } catch {
        setProjects([]);
      }
    }
    void loadProjects();
  }, []);

  useEffect(() => {
    async function checkAdmin() {
      if (!session) { setIsAdmin(false); return; }
      try {
        const r = await fetch("/api/auth/me");
        const d: { isAdmin: boolean } = await r.json();
        setIsAdmin(d.isAdmin);
      } catch {
        setIsAdmin(false);
      }
    }
    void checkAdmin();
  }, [session]);

  const projectLinks = projects.map((project) => (
    <MenubarItem asChild key={project.id}>
      <Link href={project.href} className="cursor-pointer flex flex-col items-start">
        <div className="font-medium">{project.name}{!project.isVisible ? " (Oculto)" : ""}</div>
        <div className="text-xs text-muted-foreground">{project.location}</div>
      </Link>
    </MenubarItem>
  ));

  const mobileProjectLinks = projects.map((project) => (
    <Link
      key={project.id}
      href={project.href}
      className="pl-6 py-3 hover:bg-accent/60 rounded-lg transition-all border-l-2 border-transparent hover:border-primary/50 ml-2"
      onClick={() => setMobileMenuOpen(false)}
    >
      <div className="font-semibold">{project.name}{!project.isVisible ? " (Oculto)" : ""}</div>
      <div className="text-sm text-muted-foreground mt-0.5">{project.location}</div>
    </Link>
  ));

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:rounded-md">Skip to main content</a>
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-40" role="banner">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center" aria-label="Main navigation">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold">
              <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors" aria-label="Fitzroya Desarrollos - Go to homepage">
                <Image src="/images/logo-icon/icon-192x192.png" alt="" width={32} height={32} className="h-8 w-8 dark:hidden" aria-hidden="true" priority />
                <Image src="/images/logo-green-2FBC5B-transparent.png" alt="" width={32} height={32} className="hidden h-8 w-8 dark:block" aria-hidden="true" priority />
                <span className="text-[#143827] dark:text-[#2FBC5B]">Fitzroya Desarrollos</span>
              </Link>
            </h1>

            <Menubar className="hidden md:flex border-none shadow-none bg-transparent">
              <MenubarMenu><MenubarTrigger asChild><Link href="/nosotros" className="cursor-pointer">Nosotros</Link></MenubarTrigger></MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="flex items-center gap-1">Proyectos <ChevronDown className="h-3 w-3" /></MenubarTrigger>
                <MenubarContent>
                  <MenubarItem asChild><Link href="/proyectos" className="cursor-pointer font-semibold text-primary">Ver todos los proyectos</Link></MenubarItem>
                  {projectLinks}
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu><MenubarTrigger asChild><Link href="/blog" className="cursor-pointer">Blog</Link></MenubarTrigger></MenubarMenu>
              <MenubarMenu><MenubarTrigger asChild><Link href="/#contacto" className="cursor-pointer">Contacto</Link></MenubarTrigger></MenubarMenu>
              {isAdmin && (<MenubarMenu><MenubarTrigger asChild><Link href="/admin" className="cursor-pointer flex items-center gap-1 text-primary"><LayoutDashboard className="h-3.5 w-3.5" />Admin</Link></MenubarTrigger></MenubarMenu>)}
            </Menubar>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden"><Button variant="ghost" size="icon"><Menu className="h-5 w-5" /><span className="sr-only">Toggle menu</span></Button></SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[400px]">
                <div className="flex flex-col gap-6 mt-12 px-2">
                  <Link href="/nosotros" className="text-lg font-semibold hover:bg-accent/50 transition-all py-4 px-4 rounded-lg border-l-4 border-primary/70 hover:border-primary" onClick={() => setMobileMenuOpen(false)}>Nosotros</Link>
                  <Separator className="my-2" />
                  <div className="flex flex-col gap-3">
                    <Link href="/proyectos" className="text-base font-bold text-primary px-4 py-2 bg-accent/30 rounded-md border-b-2 border-primary/20 hover:bg-accent/50 transition-colors" onClick={() => setMobileMenuOpen(false)}>Proyectos</Link>
                    {mobileProjectLinks}
                  </div>
                  <Separator className="my-2" />
                  <Link href="/blog" className="text-lg font-semibold hover:bg-accent/50 transition-all py-4 px-4 rounded-lg border-l-4 border-primary/70 hover:border-primary" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
                  <Separator className="my-2" />
                  <Link href="/#contacto" className="text-lg font-semibold hover:bg-accent/50 transition-all py-4 px-4 rounded-lg border-l-4 border-primary/70 hover:border-primary" onClick={() => setMobileMenuOpen(false)}>Contacto</Link>
                  {isAdmin && (<><Separator className="my-2" /><Link href="/admin" className="text-lg font-semibold text-primary hover:bg-accent/50 transition-all py-4 px-4 rounded-lg border-l-4 border-primary flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}><LayoutDashboard className="h-5 w-5" />Admin</Link></>)}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-2" role="group" aria-label="User actions">
            <ModeToggle />
            {!sessionPending && session && (
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })}>
                <LogOut className="h-4 w-4" /><span className="hidden sm:inline">Salir</span>
              </Button>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
