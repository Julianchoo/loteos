# Create New Project

You are helping the user create a new real estate project for their lot sales website. This includes:
1. Creating the project in the PostgreSQL database
2. Creating the project in Airtable
3. Creating a project page with financing calculator
4. Adding navigation links

## Step 1: Gather Project Information

Ask the user for the following information:

1. **Project ID** (URL-friendly slug, e.g., "arroyo-de-la-cruz")
2. **Project Name** (Display name, e.g., "Arroyo de la Cruz")
3. **Description** (Brief description for marketing)
4. **Location** (Full address)
5. **Total Area** (in hectares)
6. **Total Lots** (number of lots)
7. **Base Price** (price per lot in USD, e.g., 19500)

## Step 2: Create Database Script

Create a script at `scripts/insert-[project-id].ts` to insert the project into PostgreSQL.

Use this template:

```typescript
import { db } from "../src/lib/db";
import { project } from "../src/lib/schema";

async function insert[ProjectName]() {
  try {
    await db.insert(project).values({
      id: "[project-id]",
      name: "[Project Name]",
      description: "[Description]",
      location: "[Location]",
      totalArea: "[Total Area]",
      totalLots: "[Total Lots]",
    });

    console.log("✅ [Project Name] insertado exitosamente en PostgreSQL");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
  process.exit(0);
}

insert[ProjectName]();
```

## Step 3: Create Airtable Script

Create a script at `scripts/create-[project-id]-in-airtable.ts` to create the project in Airtable.

Use this template:

```typescript
import Airtable from "airtable";
import { config } from "dotenv";

config();

if (!process.env.AIRTABLE_API_TOKEN) {
  throw new Error("AIRTABLE_API_TOKEN is not defined");
}

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_TOKEN,
});

const base = airtable.base(process.env.AIRTABLE_BASE_ID!);
const projects = base(process.env.AIRTABLE_PROJECTS_TABLE_ID || "tblMkCAojUXvPedrw");

async function create[ProjectName]InAirtable() {
  try {
    const record = await projects.create({
      "Project ID": "[project-id]",
      "Project Name": "[Project Name]",
      "Description": "[Description]",
      "Location": "[Location]",
      "Total Area": "[Total Area]",
      "Total Lots": "[Total Lots]",
    });

    console.log("✅ [Project Name] creado en Airtable!");
    console.log(`   Record ID: ${record.id}`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
  process.exit(0);
}

create[ProjectName]InAirtable();
```

## Step 4: Create Project Page

Create a new page at `src/app/proyectos/[project-id]/page.tsx`.

Use this template structure:

```typescript
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calculator, CheckCircle2, Home, TreePine, Zap, Droplet, Shield, ArrowRight } from "lucide-react";
import { SanMatiasFinancingSection } from "@/components/san-matias-financing-section";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function [ProjectName]Page() {
  const basePrice = [BASE_PRICE];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />

        <div className="container relative z-10 px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
              <MapPin className="w-4 h-4" />
              <span>[Location]</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              [Project Name]
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              [Description]
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <a href="#financiacion">
                  <Calculator className="mr-2 h-5 w-5" />
                  Calcular Financiación
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#ubicacion">
                  <MapPin className="mr-2 h-5 w-5" />
                  Ver Ubicación
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            Características del Proyecto
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-6 rounded-2xl bg-card border-2 border-border space-y-3">
              <Home className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">[Total Lots] Lotes</h3>
              <p className="text-muted-foreground">
                Variedad de lotes disponibles
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border-2 border-border space-y-3">
              <TreePine className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">[Total Area] Hectáreas</h3>
              <p className="text-muted-foreground">
                Amplio espacio verde
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border-2 border-border space-y-3">
              <Shield className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">Seguridad 24/7</h3>
              <p className="text-muted-foreground">
                Vigilancia permanente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Financing Section */}
      <section id="financiacion" className="py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-black">
                <Calculator className="inline-block mr-3 mb-2" />
                Calculá tu Financiación
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Financiación directa sin intermediarios. Personalizá tu plan de pagos.
              </p>
            </div>

            <SanMatiasFinancingSection
              basePrice={basePrice}
              projectId="[project-id]"
            />
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="ubicacion" className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-black">
                <MapPin className="inline-block mr-3 mb-2" />
                Ubicación Estratégica
              </h2>
              <p className="text-xl text-muted-foreground">
                [Location]
              </p>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden border-4 border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE_HERE"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-8 p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-primary/5 border-2 border-primary/20">
            <h2 className="text-3xl md:text-4xl font-black">
              ¿Listo para Invertir en tu Futuro?
            </h2>
            <p className="text-xl text-muted-foreground">
              Contactanos hoy y asegurá tu lote en [Project Name]
            </p>
            <Button size="lg" asChild>
              <a href="#financiacion">
                Calcular Mi Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
```

## Step 5: Update Navigation

Add the new project to the navigation menu in `src/components/site-header.tsx`:

Find the "Proyectos" dropdown and add:

```typescript
<DropdownMenuItem asChild>
  <Link href="/proyectos/[project-id]">[Project Name]</Link>
</DropdownMenuItem>
```

## Step 6: Run Scripts

After creating all files, run these commands in order:

```bash
# 1. Insert project into PostgreSQL
pnpm tsx scripts/insert-[project-id].ts

# 2. Create project in Airtable
pnpm tsx scripts/create-[project-id]-in-airtable.ts

# 3. Verify everything works
pnpm lint && pnpm typecheck
```

## Step 7: Test

Ask the user to test:
1. Navigate to `/proyectos/[project-id]`
2. Test the financing calculator
3. Fill out the lead form
4. Verify lead appears in Airtable

## Step 8: Commit and Deploy

After testing, commit and push:

```bash
git add .
git commit -m "feat: add [Project Name] project page with lead capture"
git push
```

## Important Notes

- Use the exact project ID format (lowercase, hyphens for spaces)
- Keep the project name in PascalCase for function names in scripts
- Make sure to update the Google Maps embed URL with the actual location
- The financing section will automatically use the existing lead capture system
- All leads will sync to Airtable automatically

Ask the user if they'd like to proceed with creating the project now.
