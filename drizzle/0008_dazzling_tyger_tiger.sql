CREATE TABLE "Training_to_key_competency" (
	"training_id" text NOT NULL,
	"competency_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Training_to_module" (
	"training_id" text NOT NULL,
	"module_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Key_competency" DROP CONSTRAINT "Key_competency_module_id_Training_id_fk";
--> statement-breakpoint
ALTER TABLE "Module" DROP CONSTRAINT "Module_course_id_Training_id_fk";
--> statement-breakpoint
ALTER TABLE "Training_to_key_competency" ADD CONSTRAINT "Training_to_key_competency_training_id_Training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."Training"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Training_to_key_competency" ADD CONSTRAINT "Training_to_key_competency_competency_id_Key_competency_id_fk" FOREIGN KEY ("competency_id") REFERENCES "public"."Key_competency"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Training_to_module" ADD CONSTRAINT "Training_to_module_training_id_Training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."Training"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Training_to_module" ADD CONSTRAINT "Training_to_module_module_id_Module_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."Module"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Key_competency" DROP COLUMN "module_id";--> statement-breakpoint
ALTER TABLE "Module" DROP COLUMN "course_id";