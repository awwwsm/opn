CREATE TABLE "profiles_table" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp NOT NULL,
	"username" text NOT NULL,
	"visits" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "profiles_table_username_unique" UNIQUE("username")
);
