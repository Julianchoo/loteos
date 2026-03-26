# Rename Existing Project

You are helping the user rename an existing real estate project. This involves updating the project name and/or ID across multiple systems while maintaining data integrity.

## Important Distinction

- **Project Name**: The display name shown to users (e.g., "San Nicolás")
- **Project ID**: The URL slug used in routes and databases (e.g., "san-nicolas")
- **Location**: The geographic location where the project is located (e.g., "Guernica, Buenos Aires")

A project can have:
- Name: "San Nicolás" (what it's called)
- Location: "Guernica" (where it is)

## When to Use This Guide

Use this guide when you need to:
1. Change the project display name (e.g., "Guernica" → "San Nicolás")
2. Change the project ID/slug (e.g., "guernica" → "san-nicolas")
3. Both of the above

**Do NOT use this guide** for changing the project location - that's just a simple field update.

## Step 1: Confirm Changes with User

Ask the user to confirm:
1. **Current Project ID**: What is the current project ID?
2. **New Project ID**: What should the new project ID be?
3. **Current Project Name**: What is the current display name?
4. **New Project Name**: What should the new display name be?
5. **Location**: What is the project location? (this usually stays the same)

## Step 2: Update Database Records

### PostgreSQL Update

Create a script at `scripts/update-[old-id]-to-[new-id].ts`:

```typescript
import { db } from "../src/lib/db";
import { project } from "../src/lib/schema";
import { eq } from "drizzle-orm";

async function update[OldName]To[NewName]() {
  try {
    // Update the existing project
    const result = await db
      .update(project)
      .set({
        id: "[new-id]",
        name: "[New Name]",
        location: "[Location]",
      })
      .where(eq(project.id, "[old-id]"));

    console.log("✅ Proyecto actualizado exitosamente en PostgreSQL");
    console.log("   ID: [old-id] → [new-id]");
    console.log("   Nombre: [Old Name] → [New Name]");
    console.log("   Ubicación: [Location] (mantenida)");
  } catch (error) {
    console.error("❌ Error:", error);
    console.log("\n💡 Si el proyecto '[old-id]' no existe, ejecuta:");
    console.log("   pnpm tsx scripts/insert-[new-id].ts");
    process.exit(1);
  }
  process.exit(0);
}

update[OldName]To[NewName]();
```

### Airtable Update

Create a script at `scripts/update-[old-id]-to-[new-id]-airtable.ts`:

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

async function update[OldName]To[NewName]InAirtable() {
  try {
    // First, find the record
    const records = await projects
      .select({
        filterByFormula: "{Project ID} = '[old-id]'",
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) {
      console.log("⚠️  No se encontró el proyecto '[old-id]' en Airtable");
      console.log("💡 Ejecuta: pnpm tsx scripts/create-[new-id]-in-airtable.ts");
      process.exit(1);
    }

    const recordId = records[0].id;

    // Update the record
    await projects.update(recordId, {
      "Project ID": "[new-id]",
      "Project Name": "[New Name]",
      "Location": "[Location]",
    });

    console.log("✅ Proyecto actualizado exitosamente en Airtable!");
    console.log(`   Record ID: ${recordId}`);
    console.log("   Project ID: [old-id] → [new-id]");
    console.log("   Project Name: [Old Name] → [New Name]");
    console.log("   Location: [Location] (mantenida)");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
  process.exit(0);
}

update[OldName]To[NewName]InAirtable();
```

## Step 3: Update File Structure

If the project ID is changing, rename the project folder:

```bash
mv src/app/proyectos/[old-id] src/app/proyectos/[new-id]
```

## Step 4: Update Project Page

In `src/app/proyectos/[new-id]/page.tsx`, update:

1. **Function name**: `[OldName]Page` → `[NewName]Page`
2. **Page title (h1)**: Update to new project name
3. **projectId prop**: Update in `SanMatiasFinancingSection` component
4. **Location badge**: Keep location as-is (unless also changing)
5. **All references**: Update any hardcoded project name references

Example changes:
```typescript
// Before
export default async function GuernicaPage() {
  // ...
  <h1>Guernica</h1>
  // ...
  <SanMatiasFinancingSection projectId="guernica" />
}

// After
export default async function SanNicolasPage() {
  // ...
  <h1>San Nicolás</h1>
  // ...
  <SanMatiasFinancingSection projectId="san-nicolas" />
}
```

## Step 5: Update Navigation

In `src/components/site-header.tsx`, update the project link:

```typescript
// Before
<DropdownMenuItem asChild>
  <Link href="/proyectos/[old-id]" className="...">
    <div className="font-medium">[Old Name]</div>
    <div className="text-xs text-muted-foreground">[Old Location]</div>
  </Link>
</DropdownMenuItem>

// After
<DropdownMenuItem asChild>
  <Link href="/proyectos/[new-id]" className="...">
    <div className="font-medium">[New Name]</div>
    <div className="text-xs text-muted-foreground">[Location]</div>
  </Link>
</DropdownMenuItem>
```

## Step 6: Rename Database Scripts

Rename the creation scripts to match new naming:

```bash
mv scripts/insert-[old-id].ts scripts/insert-[new-id].ts
mv scripts/create-[old-id]-in-airtable.ts scripts/create-[new-id]-in-airtable.ts
```

Update the content of these renamed scripts:
- Function names
- Project ID
- Project Name
- Console log messages

## Step 7: Run Update Scripts

Execute the database update scripts in order:

```bash
# 1. Update PostgreSQL
pnpm tsx scripts/update-[old-id]-to-[new-id].ts

# 2. Update Airtable
pnpm tsx scripts/update-[old-id]-to-[new-id]-airtable.ts

# 3. Verify code quality
pnpm lint && pnpm typecheck
```

## Step 8: Verify Updates

Check that updates were successful:

1. **PostgreSQL**: Query the database to confirm the project record shows new ID and name
2. **Airtable**: Open Airtable and verify the Projects table shows the updated record
3. **Website**: Navigate to `/proyectos/[new-id]` and verify the page loads correctly
4. **Navigation**: Check that the dropdown menu shows the new project name

## Step 9: Clean Up (Optional)

After successful update, you can delete the update scripts:

```bash
rm scripts/update-[old-id]-to-[new-id].ts
rm scripts/update-[old-id]-to-[new-id]-airtable.ts
```

Keep the create/insert scripts with the new naming for future reference.

## Files That Need Updates

**Checklist of all files to update:**

- [ ] `src/app/proyectos/[old-id]/` → `src/app/proyectos/[new-id]/`
- [ ] `src/app/proyectos/[new-id]/page.tsx` (function name, title, projectId)
- [ ] `src/components/site-header.tsx` (navigation link and display name)
- [ ] `scripts/insert-[old-id].ts` → `scripts/insert-[new-id].ts` (renamed and updated)
- [ ] `scripts/create-[old-id]-in-airtable.ts` → `scripts/create-[new-id]-in-airtable.ts` (renamed and updated)
- [ ] `scripts/update-[old-id]-to-[new-id].ts` (create and run)
- [ ] `scripts/update-[old-id]-to-[new-id]-airtable.ts` (create and run)
- [ ] PostgreSQL database (via update script)
- [ ] Airtable database (via update script)

## Common Pitfalls to Avoid

1. **Don't confuse project name with location**: The project can be called "San Nicolás" and be located in "Guernica"
2. **Update projectId in financing section**: Make sure the `SanMatiasFinancingSection` component gets the new projectId
3. **Rename folder before updating page**: Move the folder first, then update the page content
4. **Run database updates before testing**: The website won't work correctly until both databases are updated
5. **Don't forget the navigation**: Users won't find the renamed project if the header isn't updated

## Example: Guernica → San Nicolás

**Before:**
- Project ID: `guernica`
- Project Name: `Guernica`
- Location: `Guernica, Buenos Aires`

**After:**
- Project ID: `san-nicolas`
- Project Name: `San Nicolás`
- Location: `Guernica, Buenos Aires` (unchanged - this is where it's located!)

This is a perfect example of why project name and location are different fields.
