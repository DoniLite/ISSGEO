CREATE TABLE "Testimonials" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"name" text NOT NULL,
	"star_number" integer,
	"message" text
);
