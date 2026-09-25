CREATE TYPE "public"."estado_cuota" AS ENUM('pendiente', 'pendiente_indice', 'parcial', 'pagada', 'vencida', 'calculada', 'proyectada', 'parcial_vencida', 'cancelada');--> statement-breakpoint
CREATE TYPE "public"."estado_lote" AS ENUM('disponible', 'no_disponible', 'reservado', 'vendido');--> statement-breakpoint
CREATE TYPE "public"."estado_pago" AS ENUM('activo', 'anulado');--> statement-breakpoint
CREATE TYPE "public"."estado_reserva" AS ENUM('activa', 'cancelada', 'vencida', 'realizada');--> statement-breakpoint
CREATE TYPE "public"."modalidad_contrato" AS ENUM('usd_fijo', 'pesos_cac', 'requiere_revision');--> statement-breakpoint
CREATE TYPE "public"."moneda_pago" AS ENUM('usd', 'ars');--> statement-breakpoint
CREATE TABLE "contratos" (
	"id" text PRIMARY KEY NOT NULL,
	"reserva_id" text NOT NULL,
	"modalidad" "modalidad_contrato" NOT NULL,
	"fecha_inicio" date NOT NULL,
	"fecha_primer_vencimiento" date NOT NULL,
	"cantidad_cuotas" integer NOT NULL,
	"dia_vencimiento" integer NOT NULL,
	"saldo_inicial" numeric NOT NULL,
	"cuota_base" numeric NOT NULL,
	"moneda_base" "moneda_pago" NOT NULL,
	"tipo_cambio_bna" numeric,
	"periodo_base_cac" text,
	"indice_base_cac" numeric,
	"requiere_revision" boolean DEFAULT false NOT NULL,
	"observaciones" text,
	"creado_por" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cuotas" (
	"id" text PRIMARY KEY NOT NULL,
	"contrato_id" text NOT NULL,
	"numero" integer NOT NULL,
	"fecha_vencimiento" date NOT NULL,
	"periodo_cac" text,
	"indice_cac" numeric,
	"importe_base" numeric NOT NULL,
	"importe_ajustado" numeric,
	"moneda" "moneda_pago" NOT NULL,
	"saldo" numeric NOT NULL,
	"estado" "estado_cuota" DEFAULT 'pendiente' NOT NULL,
	"observaciones" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "indices_cac" (
	"id" text PRIMARY KEY NOT NULL,
	"periodo" text NOT NULL,
	"valor" numeric NOT NULL,
	"fuente" text,
	"nota" text,
	"creado_por" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pagos" (
	"id" text PRIMARY KEY NOT NULL,
	"contrato_id" text NOT NULL,
	"cuota_id" text,
	"fecha_pago" date NOT NULL,
	"monto" numeric NOT NULL,
	"moneda" "moneda_pago" NOT NULL,
	"tipo_cambio_aplicado" numeric,
	"monto_usd" numeric,
	"medio" text,
	"observacion" text,
	"comprobante_url" text,
	"comprobante_pathname" text,
	"comprobante_nombre" text,
	"estado" "estado_pago" DEFAULT 'activo' NOT NULL,
	"creado_por" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reservas" (
	"id" text PRIMARY KEY NOT NULL,
	"lot_id" text NOT NULL,
	"lead_id" text,
	"estado" "estado_reserva" DEFAULT 'activa' NOT NULL,
	"nombre_comprador" text,
	"dni_cuit" text,
	"telefono" text,
	"email_comprador" text,
	"domicilio_comprador" text,
	"nacionalidad" text,
	"fecha_nacimiento" date,
	"estado_civil" text,
	"cuit_comprador" text,
	"nombre_co_comprador" text,
	"dni_co_comprador" text,
	"nacionalidad_co_comprador" text,
	"fecha_nacimiento_co_comprador" date,
	"domicilio_co_comprador" text,
	"cuit_co_comprador" text,
	"estado_civil_co_comprador" text,
	"porcentaje_co_comprador" text,
	"tipo_entrega" text,
	"mes_entrega" text,
	"anio_entrega" text,
	"nombre_corredor" text,
	"email_corredor" text,
	"forma_pago" text,
	"fecha_reserva" date,
	"fecha_vencimiento" date,
	"fecha_firma" date,
	"modificado_por" text,
	"reservado_por" text,
	"observaciones" text,
	"precio_total_palabras" text,
	"precio_total_num" text,
	"reserva_palabras" text,
	"reserva_num" text,
	"anticipo_palabras" text,
	"anticipo_num" text,
	"saldo_palabras" text,
	"saldo_num" text,
	"cantidad_cuotas" text,
	"cuota_mensual_palabras" text,
	"cuota_mensual" text,
	"modalidad_contrato" "modalidad_contrato",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tipos_cambio" (
	"id" text PRIMARY KEY NOT NULL,
	"fecha" date NOT NULL,
	"tipo" text DEFAULT 'bna_vendedor' NOT NULL,
	"valor" numeric NOT NULL,
	"fuente" text,
	"creado_por" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lead" ADD COLUMN "asignado_a" text;--> statement-breakpoint
ALTER TABLE "lead" ADD COLUMN "dni_cuit" text;--> statement-breakpoint
ALTER TABLE "lead" ADD COLUMN "domicilio" text;--> statement-breakpoint
ALTER TABLE "lead" ADD COLUMN "nacionalidad" text;--> statement-breakpoint
ALTER TABLE "lead" ADD COLUMN "fecha_nacimiento" date;--> statement-breakpoint
ALTER TABLE "lead" ADD COLUMN "estado_civil" text;--> statement-breakpoint
ALTER TABLE "lead" ADD COLUMN "cuit_comprador" text;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "estado" "estado_lote" DEFAULT 'disponible' NOT NULL;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "circunscripcion" text;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "seccion" text;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "manzana" text;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "parcela" text;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "partida_arba" text;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "partida_municipal" text;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "escritura" text;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "matricula_folio" text;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "certificado_catastral" text;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "valuacion_fiscal" numeric;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "vf_al_acto" numeric;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "superficie_m2" numeric;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "metros_frente" numeric;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "metros_fondo" numeric;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "calle_frente" text;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "calle_lindera_1" text;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "calle_lindera_2" text;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "precio_base" numeric;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "precio_etapa1" numeric;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "valor_m2" numeric;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "anticipo_pct" numeric;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "tasa_mensual" numeric;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "anticipo_usd" numeric;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "saldo_usd" numeric;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "cuotas_48" numeric;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "cuotas_60" numeric;--> statement-breakpoint
ALTER TABLE "lot" ADD COLUMN "nota" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "must_change_password" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_reserva_id_reservas_id_fk" FOREIGN KEY ("reserva_id") REFERENCES "public"."reservas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cuotas" ADD CONSTRAINT "cuotas_contrato_id_contratos_id_fk" FOREIGN KEY ("contrato_id") REFERENCES "public"."contratos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_contrato_id_contratos_id_fk" FOREIGN KEY ("contrato_id") REFERENCES "public"."contratos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_cuota_id_cuotas_id_fk" FOREIGN KEY ("cuota_id") REFERENCES "public"."cuotas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_lot_id_lot_id_fk" FOREIGN KEY ("lot_id") REFERENCES "public"."lot"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_lead_id_lead_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."lead"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "contratos_reserva_idx" ON "contratos" USING btree ("reserva_id");--> statement-breakpoint
CREATE INDEX "contratos_modalidad_idx" ON "contratos" USING btree ("modalidad");--> statement-breakpoint
CREATE UNIQUE INDEX "cuotas_contrato_numero_idx" ON "cuotas" USING btree ("contrato_id","numero");--> statement-breakpoint
CREATE INDEX "cuotas_contrato_idx" ON "cuotas" USING btree ("contrato_id");--> statement-breakpoint
CREATE INDEX "cuotas_vencimiento_idx" ON "cuotas" USING btree ("fecha_vencimiento");--> statement-breakpoint
CREATE INDEX "cuotas_estado_idx" ON "cuotas" USING btree ("estado");--> statement-breakpoint
CREATE UNIQUE INDEX "indices_cac_periodo_idx" ON "indices_cac" USING btree ("periodo");--> statement-breakpoint
CREATE INDEX "pagos_contrato_idx" ON "pagos" USING btree ("contrato_id");--> statement-breakpoint
CREATE INDEX "pagos_cuota_idx" ON "pagos" USING btree ("cuota_id");--> statement-breakpoint
CREATE INDEX "pagos_fecha_idx" ON "pagos" USING btree ("fecha_pago");--> statement-breakpoint
CREATE INDEX "reservas_lot_idx" ON "reservas" USING btree ("lot_id");--> statement-breakpoint
CREATE INDEX "reservas_lead_idx" ON "reservas" USING btree ("lead_id");--> statement-breakpoint
CREATE UNIQUE INDEX "reservas_active_lot_idx" ON "reservas" USING btree ("lot_id") WHERE "reservas"."estado" = 'activa';--> statement-breakpoint
CREATE UNIQUE INDEX "tipos_cambio_fecha_tipo_idx" ON "tipos_cambio" USING btree ("fecha","tipo");--> statement-breakpoint
ALTER TABLE "lead" ADD CONSTRAINT "lead_asignado_a_user_id_fk" FOREIGN KEY ("asignado_a") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lead_asignado_a_idx" ON "lead" USING btree ("asignado_a");--> statement-breakpoint
CREATE INDEX "lot_project_idx" ON "lot" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "lot_estado_idx" ON "lot" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "lot_manzana_idx" ON "lot" USING btree ("manzana");--> statement-breakpoint
-- Backfill: lotes existentes toman estado CRM desde el status legacy del mapa público.
UPDATE "lot" SET "estado" = CASE "status"
	WHEN 'reserved' THEN 'reservado'::"estado_lote"
	WHEN 'sold' THEN 'vendido'::"estado_lote"
	ELSE 'disponible'::"estado_lote"
END;--> statement-breakpoint
-- Backfill: superficie y precio desde los campos de texto legacy ("300m2", "17500").
UPDATE "lot" SET "superficie_m2" = replace(substring("size" from '^\s*([0-9]+(?:[.,][0-9]+)?)'), ',', '.')::numeric
WHERE "superficie_m2" IS NULL AND "size" ~ '^\s*[0-9]';--> statement-breakpoint
-- Solo enteros ("17500") o miles con punto ("17.500"); lo ambiguo queda vacío para cargar a mano.
UPDATE "lot" SET "precio_base" = replace(trim("price"), '.', '')::numeric
WHERE "precio_base" IS NULL AND "price" ~ '^\s*([0-9]+|[0-9]{1,3}(\.[0-9]{3})+)\s*$';
