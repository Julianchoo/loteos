ALTER TABLE "project" ADD COLUMN "base_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "min_cash_down" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "max_financing_months" integer;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "tna" numeric(5, 4);--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "airtable_record_id" text;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "last_synced_at" timestamp;