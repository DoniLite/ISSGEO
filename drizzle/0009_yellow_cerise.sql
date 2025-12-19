ALTER TABLE "Training_to_key_competency" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "Training_to_key_competency" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "Training_to_key_competency" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "Training_to_key_competency" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "Training_to_module" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "Training_to_module" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "Training_to_module" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "Training_to_module" ADD COLUMN "deleted_at" timestamp;