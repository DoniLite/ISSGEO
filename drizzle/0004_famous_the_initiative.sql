CREATE TABLE "Rolling_to_module" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"module_id" text,
	"rolling_id" text
);
--> statement-breakpoint
ALTER TABLE "Rolling_to_module" ADD CONSTRAINT "Rolling_to_module_module_id_Module_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."Module"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Rolling_to_module" ADD CONSTRAINT "Rolling_to_module_rolling_id_Rolling_id_fk" FOREIGN KEY ("rolling_id") REFERENCES "public"."Rolling"("id") ON DELETE no action ON UPDATE no action;