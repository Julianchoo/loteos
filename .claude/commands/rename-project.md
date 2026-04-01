# Rename Existing Project

You are helping the user rename an existing real estate project. This involves updating the project name and/or ID across multiple systems while maintaining data integrity.

## Important Distinction

- **Project Name**: The display name shown to users (e.g., "Jardines de Arroyo")
- **Project ID**: The URL slug used in routes and databases (e.g., "jardines-de-arroyo")
- **Location**: The geographic location where the project is located (e.g., "Arroyo de la Cruz, Buenos Aires")

A project can have:
- Name: "Jardines de Arroyo" (what it's called)
- Location: "Arroyo de la Cruz" (where it is)

## When to Use This Guide

Use this guide when you need to:
1. Change the project display name
2. Change the project ID/slug
3. Both of the above

**Do NOT use this guide** for changing the project location — that's just a simple field update.

---

## Step 1: Confirm Changes with User

Ask the user to confirm:
1. **Current Project ID**: What is the current slug? (e.g., `san-matias`)
2. **New Project ID**: What should the new slug be? (e.g., `jardines-de-arroyo`)
3. **Current Project Name**: What is the current display name?
4. **New Project Name**: What should the new display name be?
5. **Location**: What is the project location? (usually stays the same)

Also ask: **Does the user want to handle Airtable manually?** (they usually do — Airtable changes are done directly in the UI)

---

## Step 2: Rename Files with git mv

Always use `git mv` to preserve git history. Run ALL of these before touching any content:

```bash
# 1. Rename the route folder
git mv src/app/proyectos/[old-id] src/app/proyectos/[new-id]

# 2. Rename SVG map assets
git mv public/maps/[old-id]-plan.svg public/maps/[new-id]-plan.svg
git mv public/maps/[old-id].svg public/maps/[new-id].svg

# 3. Rename the financing component (it's shared across projects — use a generic name)
git mv src/components/[old-id]-financing-section.tsx src/components/financing-section.tsx
```

---

## Step 3: Update the Financing Component

The `FinancingSection` component (`src/components/financing-section.tsx`) was originally named after the first project but is **shared across all projects**. It must:
- Be named `FinancingSection` (generic, not project-specific)
- Accept `projectName` as a prop (NOT hardcoded)

```typescript
// src/components/financing-section.tsx
interface FinancingSectionProps {
  basePrice: number;
  minCashDown: number;
  maxFinancingMonths: number;
  tna: number;
  projectId: string;
  projectName: string;   // ← must be a prop, not hardcoded
}

export function FinancingSection({ ..., projectName }: FinancingSectionProps) {
  // ...
  <ProjectLeadForm
    projectId={projectId}
    projectName={projectName}   // ← use the prop
    // ...
  />
}
```

---

## Step 4: Update Content in All Files

### Complete checklist — every file that references the project name or slug:

| File | What to change |
|------|----------------|
| `src/app/proyectos/[new-id]/page.tsx` | Function name, `getProjectBySlug()` arg, metadata title/description/keywords, canonical URL, OG title/description, Twitter title/description, JSON-LD BreadcrumbList item name + URL, JSON-LD FAQ answers that mention the project name, breadcrumb `<li>` text, hero `<h1>`, image `alt`, all body text mentioning the project name, `FinancingSection` import path + component name + `projectId` + `projectName` props |
| `src/components/financing-section.tsx` | Interface name, function name, `projectName` prop (see Step 3) |
| `src/components/svg-lot-map.tsx` | SVG `src` path |
| `src/components/simple-lot-map.tsx` | SVG `src` path |
| `src/components/site-header.tsx` | Desktop menu: `href` + display name. Mobile menu: `href` + display name |
| `src/app/page.tsx` | `description` in metadata, `keywords` array, all `href` links |
| `src/app/nosotros/page.tsx` | CTA `href` link |
| `src/app/proyectos/page.tsx` | JSON-LD `name` + `url`, card comment, image `alt`, card `<h3>` title, "Ver proyecto" link, financing CTA link |
| `src/app/sitemap.ts` | Static route URL |
| `src/lib/actions/lead-actions.ts` | `revalidatePath()` call |
| `public/llms.txt` | Section heading, `**Page**` URL, contact info URL |
| `scripts/seed.ts` | `projectId` constant and `name` field |
| `src/app/proyectos/san-nicolas/page.tsx` | Import path for `FinancingSection` + add `projectName` prop |

### Quick grep to catch anything missed:

```bash
grep -ri "[old-id]\|[Old Name]" src/ public/ scripts/ --include="*.ts" --include="*.tsx" --include="*.txt"
```

---

## Step 5: Create and Run DB Update Script

Create `scripts/update-[old-id]-to-[new-id].ts`:

```typescript
import { db } from "../src/lib/db";
import { project } from "../src/lib/schema";
import { eq } from "drizzle-orm";

async function updateProject() {
  try {
    // List current state first
    const existing = await db.select().from(project);
    console.log("Proyectos en DB:", existing.map((p) => `${p.id} (${p.name})`));

    const oldExists = existing.some((p) => p.id === "[old-id]");
    const newExists = existing.some((p) => p.id === "[new-id]");

    if (newExists) {
      // New ID already exists — just delete the old record
      if (oldExists) {
        await db.delete(project).where(eq(project.id, "[old-id]"));
        console.log("🗑️  Registro '[old-id]' eliminado.");
      } else {
        console.log("ℹ️  No existe '[old-id]', nada que eliminar.");
      }
      // Ensure name is correct on the existing new record
      await db
        .update(project)
        .set({ name: "[New Name]" })
        .where(eq(project.id, "[new-id]"));
      console.log("✅ Registro '[new-id]' confirmado con nombre correcto.");
    } else if (oldExists) {
      // Normal case — rename old to new
      await db
        .update(project)
        .set({ id: "[new-id]", name: "[New Name]" })
        .where(eq(project.id, "[old-id]"));
      console.log("✅ ID: [old-id] → [new-id]");
      console.log("✅ Nombre: [Old Name] → [New Name]");
    } else {
      console.log("⚠️  No se encontró '[old-id]' ni '[new-id]' en la DB.");
    }

    console.log("\n✅ Listo.");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
  process.exit(0);
}

updateProject();
```

**IMPORTANT**: `tsx` does NOT load `.env` automatically. Always run with:

```bash
pnpm tsx --env-file=.env scripts/update-[old-id]-to-[new-id].ts
```

---

## Step 6: Airtable (user does this manually)

Tell the user to update in Airtable:
- **Project ID**: `[old-id]` → `[new-id]`
- **Project Name**: `[Old Name]` → `[New Name]`

---

## Step 7: Verify

```bash
pnpm lint && pnpm typecheck
```

Both must pass with 0 errors before considering the rename complete.

---

## Step 8: Commit and Push

```bash
git add -A
git commit -m "feat: rename [Old Name] project to [New Name]"
git push
```

**Watch out**: GitHub push protection will reject the push if `settings.local.json` contains a token in a `Bash(TOKEN=...)` allowed-tools entry. Check and remove it before pushing.

---

## Common Pitfalls

1. **`duplicate key value` error in DB script**: The new ID already exists. Use the "newExists" branch of the script above — delete old, confirm new.
2. **`tsx` ignores `.env`**: Always use `--env-file=.env` flag.
3. **`FinancingSection` has hardcoded project name**: Must accept `projectName` as a prop — all projects share this component.
4. **GitHub push protection blocks the push**: Check `settings.local.json` for any tokens in the `allow` array.
5. **Body text in page.tsx**: Beyond metadata and the h1, the page body often mentions the project name in FAQ answers, section descriptions, and alt text. Run the grep above to catch them all.
6. **Both desktop AND mobile nav in site-header.tsx**: The header has two separate project link entries — both need updating.
7. **Don't confuse project name with location**: "Jardines de Arroyo" is the name; "Arroyo de la Cruz" is the location.

## Example: San Matías → Jardines de Arroyo

**Before:**
- Project ID: `san-matias`
- Project Name: `San Matías`
- Location: `Arroyo de la Cruz, Buenos Aires`

**After:**
- Project ID: `jardines-de-arroyo`
- Project Name: `Jardines de Arroyo`
- Location: `Arroyo de la Cruz, Buenos Aires` (unchanged)
