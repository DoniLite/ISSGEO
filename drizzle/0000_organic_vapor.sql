CREATE TYPE "public"."Job_contract" AS ENUM('CDI', 'CDD', 'Freelance', 'Stage');--> statement-breakpoint
CREATE TABLE "Contact" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Job_offer" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"title" text NOT NULL,
	"location" text NOT NULL,
	"contract" "Job_contract"
);
--> statement-breakpoint
CREATE TABLE "Session" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"start_date" date NOT NULL,
	"location" text NOT NULL,
	"module_id" text
);
--> statement-breakpoint
CREATE TABLE "Thematic" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"name" text NOT NULL,
	"icon" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Key_competency" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"sectors" text[],
	"advantages" text[],
	"module_id" text
);
--> statement-breakpoint
CREATE TABLE "Training" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"duration" integer NOT NULL,
	"price_min" integer NOT NULL,
	"price_max" integer NOT NULL,
	"participants" integer,
	"enrolled" integer,
	"thematic" text,
	"learning_outcomes" text[],
	"target_audience" text,
	"modules" text[]
);
--> statement-breakpoint
ALTER TABLE "Session" ADD CONSTRAINT "Session_module_id_Training_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."Training"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Key_competency" ADD CONSTRAINT "Key_competency_module_id_Training_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."Training"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Training" ADD CONSTRAINT "Training_thematic_Thematic_id_fk" FOREIGN KEY ("thematic") REFERENCES "public"."Thematic"("id") ON DELETE no action ON UPDATE no action;