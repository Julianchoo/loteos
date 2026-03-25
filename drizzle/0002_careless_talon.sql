CREATE TABLE "lead" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"contact_channel" text NOT NULL,
	"marketing_source" text,
	"marketing_campaign" text,
	"status" text DEFAULT 'new' NOT NULL,
	"initial_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"airtable_record_id" text,
	"last_synced_at" timestamp,
	"sync_status" text DEFAULT 'pending',
	"sync_error" text
);
--> statement-breakpoint
CREATE TABLE "lead_financing_preference" (
	"id" text PRIMARY KEY NOT NULL,
	"lead_id" text NOT NULL,
	"anticipo_amount" text NOT NULL,
	"plazo_months" text NOT NULL,
	"calculated_cuota" text NOT NULL,
	"interested_price" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_project" (
	"id" text PRIMARY KEY NOT NULL,
	"lead_id" text NOT NULL,
	"project_id" text NOT NULL,
	"interest_level" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lead_financing_preference" ADD CONSTRAINT "lead_financing_preference_lead_id_lead_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."lead"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_project" ADD CONSTRAINT "lead_project_lead_id_lead_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."lead"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_project" ADD CONSTRAINT "lead_project_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lead_email_idx" ON "lead" USING btree ("email");--> statement-breakpoint
CREATE INDEX "lead_status_idx" ON "lead" USING btree ("status");--> statement-breakpoint
CREATE INDEX "lead_channel_idx" ON "lead" USING btree ("contact_channel");--> statement-breakpoint
CREATE INDEX "lead_created_at_idx" ON "lead" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "lead_sync_status_idx" ON "lead" USING btree ("sync_status");--> statement-breakpoint
CREATE INDEX "lead_financing_lead_id_idx" ON "lead_financing_preference" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "lead_project_lead_idx" ON "lead_project" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "lead_project_project_idx" ON "lead_project" USING btree ("project_id");