ALTER TABLE "lead" ADD COLUMN IF NOT EXISTS "notes" text;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN IF NOT EXISTS "is_visible" boolean DEFAULT true NOT NULL;--> statement-breakpoint
INSERT INTO "project" (
  "id",
  "name",
  "description",
  "location",
  "total_lots",
  "max_financing_months",
  "is_visible",
  "updated_at"
) VALUES (
  'general-rodriguez',
  U&'General Rodr\00EDguez',
  U&'Proyecto de 450 lotes en General Rodr\00EDguez, frente a Barrio Bicentenario.',
  U&'C. Cam. A Navarro, B1748 Gral. Rodr\00EDguez, Provincia de Buenos Aires',
  '450',
  60,
  false,
  now()
)
ON CONFLICT ("id") DO UPDATE SET
  "name" = excluded."name",
  "description" = excluded."description",
  "location" = excluded."location",
  "total_lots" = excluded."total_lots",
  "max_financing_months" = excluded."max_financing_months",
  "is_visible" = false,
  "updated_at" = now();--> statement-breakpoint
UPDATE "project" SET "is_visible" = false, "updated_at" = now() WHERE "id" <> 'san-nicolas';--> statement-breakpoint
UPDATE "project" SET "is_visible" = true, "updated_at" = now() WHERE "id" = 'san-nicolas';
