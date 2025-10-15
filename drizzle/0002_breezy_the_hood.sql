CREATE TYPE "public"."user_role" AS ENUM('admin', 'user', 'maintainer');--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text,
	"image" text,
	"role" "user_role",
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
