CREATE TYPE "public"."estado_contrato" AS ENUM('vigente', 'cancelada');--> statement-breakpoint
CREATE TYPE "public"."origen_lead" AS ENUM('web', 'link_comercial', 'crm');--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"entidad" text NOT NULL,
	"entidad_id" text NOT NULL,
	"accion" text NOT NULL,
	"usuario" text NOT NULL,
	"cambios" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "contratos_reserva_idx";--> statement-breakpoint
ALTER TABLE "contratos" ADD COLUMN "estado" "estado_contrato" DEFAULT 'vigente' NOT NULL;--> statement-breakpoint
ALTER TABLE "contratos" ADD COLUMN "cancelado_por" text;--> statement-breakpoint
ALTER TABLE "contratos" ADD COLUMN "cancelado_at" timestamp;--> statement-breakpoint
ALTER TABLE "lead" ADD COLUMN "origen" "origen_lead" DEFAULT 'web' NOT NULL;--> statement-breakpoint
ALTER TABLE "lead" ADD COLUMN "referido_por" text;--> statement-breakpoint
CREATE INDEX "audit_log_entidad_idx" ON "audit_log" USING btree ("entidad","entidad_id");--> statement-breakpoint
CREATE INDEX "audit_log_created_idx" ON "audit_log" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "lead" ADD CONSTRAINT "lead_referido_por_user_id_fk" FOREIGN KEY ("referido_por") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "contratos_reserva_vigente_idx" ON "contratos" USING btree ("reserva_id") WHERE "contratos"."estado" = 'vigente';--> statement-breakpoint
CREATE INDEX "contratos_reserva_idx" ON "contratos" USING btree ("reserva_id");--> statement-breakpoint
-- Las cuentas de reservas que dejaron de estar realizadas quedaban ocultas: pasan a canceladas (historial).
UPDATE "contratos" SET "estado" = 'cancelada', "cancelado_por" = 'sistema (migración)', "cancelado_at" = now()
FROM "reservas" WHERE "reservas"."id" = "contratos"."reserva_id" AND "reservas"."estado" <> 'realizada';--> statement-breakpoint
-- Los formularios públicos usan canales web_form_*; el resto se cargó desde el CRM por quien lo tiene asignado.
UPDATE "lead" SET "origen" = 'crm', "referido_por" = "asignado_a"
WHERE "contact_channel" NOT LIKE 'web\_form\_%';