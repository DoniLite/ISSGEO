CREATE TABLE IF NOT EXISTS "Master" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"name" text NOT NULL,
	"description" text,
	"image" text,
	"socials" json
);
--> statement-breakpoint
ALTER TABLE "Checkout" DROP CONSTRAINT IF EXISTS "Checkout_rolling_id_Rolling_id_fk";
--> statement-breakpoint
ALTER TABLE "Rolling" DROP CONSTRAINT IF EXISTS "Rolling_course_id_Training_id_fk";
--> statement-breakpoint
ALTER TABLE "Rolling_to_module" DROP CONSTRAINT IF EXISTS "Rolling_to_module_module_id_Module_id_fk";
--> statement-breakpoint
ALTER TABLE "Rolling_to_module" DROP CONSTRAINT IF EXISTS "Rolling_to_module_rolling_id_Rolling_id_fk";
--> statement-breakpoint
ALTER TABLE "Session" DROP CONSTRAINT IF EXISTS "Session_module_id_Training_id_fk";
--> statement-breakpoint
ALTER TABLE "Key_competency" DROP CONSTRAINT IF EXISTS "Key_competency_module_id_Training_id_fk";
--> statement-breakpoint
ALTER TABLE "Module" DROP CONSTRAINT IF EXISTS "Module_course_id_Training_id_fk";
--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Training' AND column_name='master_id') THEN
        ALTER TABLE "Training" ADD COLUMN "master_id" text;
    END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Checkout_rolling_id_Rolling_id_fk') THEN
        ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_rolling_id_Rolling_id_fk" FOREIGN KEY ("rolling_id") REFERENCES "public"."Rolling"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Rolling_course_id_Training_id_fk') THEN
        ALTER TABLE "Rolling" ADD CONSTRAINT "Rolling_course_id_Training_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."Training"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Rolling_to_module_module_id_Module_id_fk') THEN
        ALTER TABLE "Rolling_to_module" ADD CONSTRAINT "Rolling_to_module_module_id_Module_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."Module"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Rolling_to_module_rolling_id_Rolling_id_fk') THEN
        ALTER TABLE "Rolling_to_module" ADD CONSTRAINT "Rolling_to_module_rolling_id_Rolling_id_fk" FOREIGN KEY ("rolling_id") REFERENCES "public"."Rolling"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Session_module_id_Training_id_fk') THEN
        ALTER TABLE "Session" ADD CONSTRAINT "Session_module_id_Training_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."Training"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Key_competency_module_id_Training_id_fk') THEN
        ALTER TABLE "Key_competency" ADD CONSTRAINT "Key_competency_module_id_Training_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."Training"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Module_course_id_Training_id_fk') THEN
        ALTER TABLE "Module" ADD CONSTRAINT "Module_course_id_Training_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."Training"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Training_master_id_Master_id_fk') THEN
        ALTER TABLE "Training" ADD CONSTRAINT "Training_master_id_Master_id_fk" FOREIGN KEY ("master_id") REFERENCES "public"."Master"("id") ON DELETE no action ON UPDATE no action;
    END IF;
END $$;