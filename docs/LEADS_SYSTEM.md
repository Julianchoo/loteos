# Sistema de Gestión de Leads

## Resumen

Sistema completo de captura y gestión de leads integrado con Airtable CRM. Incluye formularios web, sincronización automática y tracking de preferencias de financiación.

## Arquitectura

### Base de Datos (PostgreSQL)

**Tablas principales:**

1. **`lead`** - Información del contacto
   - Datos personales (nombre, apellido, email, teléfono)
   - Canal de contacto (web_form_general, web_form_project, whatsapp, phone, in_person)
   - Atribución de marketing (source, campaign)
   - Estado del lead (new, contacted, interested, visit_scheduled, proposal_sent, sold, lost)
   - Metadatos de sincronización con Airtable

2. **`leadFinancingPreference`** - Preferencias de financiación (1-to-1 con lead)
   - Anticipo (down payment)
   - Plazo en meses
   - Cuota mensual calculada
   - Precio del lote de interés

3. **`leadProject`** - Relación many-to-many entre leads y proyectos
   - Un lead puede estar interesado en múltiples proyectos
   - Nivel de interés (high, medium, low)
   - Notas adicionales

### Sincronización con Airtable

**Flujo:**
```
PostgreSQL (source of truth) → Airtable (CRM para equipo de ventas)
```

**Estrategia híbrida:**
1. **Sync inmediato**: Cuando se crea un lead, se intenta sincronizar inmediatamente
2. **Sync programado**: Cron job cada 15 minutos reintenta leads con errores
3. **One-way sync**: Cambios en Airtable NO se sincronizan de vuelta

**Rate Limiting:**
- Airtable permite máximo 5 requests/segundo
- Implementado con `p-queue` para respetar límite

**Campos en Airtable:**

**Tabla Leads:**
- Lead ID, First Name, Last Name, Email, Phone
- Contact Channel (Single Select)
- Status (Single Select)
- Initial Message (Long text)
- Marketing Source, Marketing Campaign
- Anticipo (USD), Plazo (Months), Cuota Mensual (USD)
- Interested Projects (Link to Projects table)
- Created At, Last Synced, Sync Status

**Tabla Projects:**
- Project ID, Project Name, Description
- Location, Total Area, Total Lots

## Formularios de Captura

### 1. Formulario General de Contacto

**Ubicación:** `src/components/contact-form.tsx`

**Campos:**
- Nombre, Apellido (requeridos)
- Email (requerido, validado)
- Teléfono (opcional)
- Mensaje (opcional)

**Canal:** `web_form_general`

**Uso:** Footer del sitio, página de contacto

### 2. Formulario Proyecto-Específico con Financiación

**Ubicación:** `src/components/project-lead-form.tsx`

**Campos:**
- Nombre, Apellido (requeridos)
- Email (requerido, validado)
- Teléfono (recomendado)
- Mensaje (opcional)
- Anticipo, Plazo (pre-llenados del calculador, editables)
- Cuota (calculada automáticamente)

**Canal:** `web_form_project`

**Uso:** Páginas de proyectos, integrado con calculador de financiación

**Características especiales:**
- Pre-llena valores desde el calculador de financiación
- Re-calcula cuota al cambiar anticipo o plazo
- Asocia lead automáticamente con el proyecto

## Archivos Clave

### Backend

**Server Actions:**
- `src/lib/actions/lead-actions.ts`
  - `createLead()` - Para formulario general
  - `createLeadWithFinancing()` - Para formulario proyecto-específico
  - `getLeadById()` - Consultar lead

**Airtable Integration:**
- `src/lib/airtable-client.ts` - Cliente API de Airtable
- `src/lib/airtable-sync.ts` - Lógica de sincronización con rate limiting

**API Endpoints:**
- `src/app/api/airtable/sync-lead/route.ts` - Sync individual
- `src/app/api/airtable/sync-all/route.ts` - Sync masivo (cron)

**Database Schema:**
- `src/lib/schema.ts` - Definiciones de tablas con Drizzle ORM

### Frontend

**Componentes:**
- `src/components/contact-form.tsx` - Formulario general
- `src/components/project-lead-form.tsx` - Formulario proyecto-específico
- `src/components/financing-calculator.tsx` - Calculador con callback para abrir form
- `src/components/san-matias-financing-section.tsx` - Wrapper con state management

## Cómo Agregar un Nuevo Proyecto

### Paso 1: Crear el Proyecto en PostgreSQL

Usá el script template:

```bash
pnpm tsx scripts/insert-[nombre-proyecto].ts
```

**Ejemplo de script:**
```typescript
import { db } from "../src/lib/db";
import { project } from "../src/lib/schema";

async function insertNuevoProyecto() {
  try {
    await db.insert(project).values({
      id: "nombre-proyecto", // URL-friendly slug
      name: "Nombre del Proyecto",
      description: "Descripción breve del proyecto",
      location: "Dirección completa",
      totalArea: "20", // Hectáreas
      totalLots: "250", // Cantidad de lotes
    });

    console.log("✅ Proyecto insertado exitosamente");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
  process.exit(0);
}

insertNuevoProyecto();
```

### Paso 2: Crear el Proyecto en Airtable

**Opción A: Manual**
1. Abrí la tabla "Projects" en Airtable
2. Agregá un nuevo registro con los mismos datos

**Opción B: Con Script**

```bash
pnpm tsx scripts/create-[nombre-proyecto]-in-airtable.ts
```

**Ejemplo de script:**
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

async function createProyectoInAirtable() {
  try {
    const record = await projects.create({
      "Project ID": "nombre-proyecto",
      "Project Name": "Nombre del Proyecto",
      "Description": "Descripción breve del proyecto",
      "Location": "Dirección completa",
      "Total Area": "20",
      "Total Lots": "250",
    });

    console.log("✅ Proyecto creado en Airtable!");
    console.log(`   Record ID: ${record.id}`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
  process.exit(0);
}

createProyectoInAirtable();
```

### Paso 3: Crear la Página del Proyecto

**Ubicación:** `src/app/proyectos/[nombre-proyecto]/page.tsx`

**Template básico:**
```typescript
import { SanMatiasFinancingSection } from "@/components/san-matias-financing-section";

export const dynamic = "force-dynamic";

export default async function NombreProyectoPage() {
  const basePrice = 25000; // Precio base del lote

  return (
    <div>
      {/* Hero Section */}
      <section>
        <h1>Nombre del Proyecto</h1>
        {/* Contenido del hero */}
      </section>

      {/* Financing Section */}
      <section>
        <SanMatiasFinancingSection
          basePrice={basePrice}
          projectId="nombre-proyecto" // Debe coincidir con ID en BD
        />
      </section>

      {/* Otras secciones */}
    </div>
  );
}
```

### Paso 4: Configurar Variables de Entorno (si cambian precios)

Si el proyecto tiene precios/términos diferentes, agregá variables en `.env`:

```env
# Proyecto Específico - Nombre del Proyecto
NEXT_PUBLIC_NOMBRE_PROYECTO_BASE_PRICE=25000
NEXT_PUBLIC_NOMBRE_PROYECTO_DEFAULT_DOWN_PAYMENT=5000
NEXT_PUBLIC_NOMBRE_PROYECTO_MIN_DOWN_PAYMENT=2000
```

Y pasalas al calculador:
```typescript
<FinancingCalculator
  basePrice={Number(process.env.NEXT_PUBLIC_NOMBRE_PROYECTO_BASE_PRICE)}
  onInterestedClick={handleInterestedClick}
/>
```

### Paso 5: Agregar al Menú de Navegación

Editá `src/components/site-header.tsx` para agregar el proyecto al dropdown:

```typescript
<DropdownMenuItem asChild>
  <Link href="/proyectos/nombre-proyecto">Nombre del Proyecto</Link>
</DropdownMenuItem>
```

### Paso 6: Deploy

```bash
git add .
git commit -m "feat: add [nombre proyecto] project page with lead capture"
git push
```

Vercel deployará automáticamente.

## Troubleshooting

### Lead no aparece en Airtable

1. **Verificar PostgreSQL:**
   ```bash
   pnpm db:studio
   # Revisar tabla "lead" para confirmar que se guardó
   ```

2. **Verificar sync status:**
   - En Drizzle Studio, revisar campos `syncStatus` y `syncError` del lead
   - Si `syncStatus = "error"`, revisar `syncError` para ver el mensaje

3. **Probar sync manual:**
   ```bash
   # En producción
   curl -X POST https://tu-dominio.vercel.app/api/airtable/sync-lead \
     -H "Content-Type: application/json" \
     -d '{"leadId": "uuid-del-lead"}'
   ```

4. **Verificar variables de entorno:**
   - Ir a Vercel → Settings → Environment Variables
   - Confirmar que existen: `AIRTABLE_API_TOKEN`, `AIRTABLE_BASE_ID`, etc.

### Cron job no funciona

1. **Verificar configuración en cron-job.org:**
   - URL correcta: `https://tu-dominio.vercel.app/api/airtable/sync-all`
   - Method: `POST`
   - Header `Authorization: Bearer [CRON_SECRET]`

2. **Probar endpoint manualmente:**
   ```bash
   curl -X POST https://tu-dominio.vercel.app/api/airtable/sync-all \
     -H "Authorization: Bearer dc7df17586d28c1d7f065926ef4dcae55e4416692cbb60fc48c79d2bfa6e665c"
   ```

3. **Ver logs del cron en cron-job.org:**
   - Dashboard → Tu job → Execution history

### Migraciones no aplicadas en Vercel

El proyecto está configurado para correr migraciones automáticamente en el build:

```json
// package.json
{
  "scripts": {
    "build": "pnpm db:migrate && next build"
  }
}
```

Si falla, correr manualmente:
```bash
pnpm db:migrate
```

## Seguridad

### Protección del endpoint de Cron

El endpoint `/api/airtable/sync-all` está protegido con token:

```typescript
const authHeader = request.headers.get("authorization");
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

**Nunca expongas el `CRON_SECRET` en el código del cliente.**

### Validación de Formularios

Ambos formularios incluyen:
- Validación de campos requeridos
- Validación de formato de email
- Sanitización de inputs
- Rate limiting implícito (server actions de Next.js)

## Monitoreo

### Métricas Clave

1. **Leads creados:** Revisar tabla `lead` en Drizzle Studio
2. **Sync success rate:** Filtrar por `syncStatus = "synced"` vs `syncStatus = "error"`
3. **Canales más efectivos:** Agrupar por `contactChannel`
4. **Proyectos con más interés:** JOIN con `leadProject`

### Dashboard en Airtable

Podés crear vistas en Airtable para:
- Leads por estado
- Leads por proyecto
- Leads con financiación vs sin financiación
- Conversión por canal

## Próximas Mejoras

- [ ] Agregar campo "lot of interest" para trackear lote específico
- [ ] Implementar webhooks de Airtable para sync bidireccional
- [ ] Agregar analytics tracking (Google Analytics, Mixpanel)
- [ ] Email automation al crear lead
- [ ] Lead scoring basado en interacciones
- [ ] Dashboard admin para ver estadísticas
