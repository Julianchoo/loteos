CREATE TABLE "blog_post" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"content" text DEFAULT '' NOT NULL,
	"featured_image_url" text,
	"author_id" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_post_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blog_post_slug_idx" ON "blog_post" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blog_post_status_idx" ON "blog_post" USING btree ("status");--> statement-breakpoint
CREATE INDEX "blog_post_author_idx" ON "blog_post" USING btree ("author_id");