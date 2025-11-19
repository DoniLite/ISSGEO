CREATE TABLE "Checkout" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"code" text,
	"is_validated" boolean NOT NULL,
	"rolling_id" text,
	"amount" integer NOT NULL,
	"meta_data" json,
	CONSTRAINT "Checkout_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "Rolling" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"name" text NOT NULL,
	"contact" text NOT NULL,
	"country" text,
	"profession" text,
	"school_level" text,
	"experience" text,
	"session_id" text
);
--> statement-breakpoint
CREATE TABLE "Module" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"title" text NOT NULL,
	"price" integer NOT NULL,
	"duration" integer NOT NULL,
	"course_id" text
);
--> statement-breakpoint
ALTER TABLE "Training" RENAME COLUMN "duration" TO "total_duration";--> statement-breakpoint
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_rolling_id_Rolling_id_fk" FOREIGN KEY ("rolling_id") REFERENCES "public"."Rolling"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Rolling" ADD CONSTRAINT "Rolling_session_id_Session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."Session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Module" ADD CONSTRAINT "Module_course_id_Training_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."Training"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Training" DROP COLUMN "modules";