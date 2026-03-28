"use client";

import { useState } from "react";
import Link from "next/link";
import { TreePine, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./ui/mode-toggle";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:rounded-md"
      >
        Skip to main content
      </a>
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-40" role="banner">
        <nav
          className="container mx-auto px-4 py-4 flex justify-between items-center"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold">
              <Link
                href="/"
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                aria-label="Fitzroya Desarrollos - Go to homepage"
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10"
                  aria-hidden="true"
                >
                  <TreePine className="h-5 w-5" />
                </div>
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Fitzroya Desarrollos
                </span>
              </Link>
            </h1>

            <Menubar className="hidden md:flex border-none shadow-none bg-transparent">
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Link href="/#nosotros" className="cursor-pointer">
                    Nosotros
                  </Link>
                </MenubarTrigger>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger className="flex items-center gap-1">
                  Proyectos <ChevronDown className="h-3 w-3" />
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem asChild>
                    <Link href="/proyectos/san-matias" className="cursor-pointer flex flex-col items-start">
                      <div className="font-medium">San Matías</div>
                      <div className="text-xs text-muted-foreground">Arroyo de La Cruz</div>
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link href="/proyectos/san-nicolas" className="cursor-pointer flex flex-col items-start">
                      <div className="font-medium">San Nicolás</div>
                      <div className="text-xs text-muted-foreground">Guernica</div>
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Link href="/#contacto" className="cursor-pointer">
                    Contacto
                  </Link>
                </MenubarTrigger>
              </MenubarMenu>
            </Menubar>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <TreePine className="h-5 w-5 text-primary" />
                    Menú
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/#nosotros"
                    className="text-lg font-medium hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Nosotros
                  </Link>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-muted-foreground">Proyectos</p>
                    <Link
                      href="/proyectos/san-matias"
                      className="pl-4 py-2 hover:bg-accent rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="font-medium">San Matías</div>
                      <div className="text-xs text-muted-foreground">Arroyo de La Cruz</div>
                    </Link>
                    <Link
                      href="/proyectos/san-nicolas"
                      className="pl-4 py-2 hover:bg-accent rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="font-medium">San Nicolás</div>
                      <div className="text-xs text-muted-foreground">Guernica</div>
                    </Link>
                  </div>

                  <Link
                    href="/#contacto"
                    className="text-lg font-medium hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contacto
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-4" role="group" aria-label="User actions">
            <ModeToggle />
          </div>
        </nav>
      </header>
    </>
  );
}
