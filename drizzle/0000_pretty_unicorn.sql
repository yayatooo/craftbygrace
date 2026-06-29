CREATE TYPE "public"."auth_provider" AS ENUM('google', 'github');--> statement-breakpoint
CREATE TYPE "public"."blog_content_type" AS ENUM('markdown', 'mdx');--> statement-breakpoint
CREATE TYPE "public"."blog_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('full_time', 'part_time', 'freelance', 'contract', 'internship', 'self_employed');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('linkeidn', 'indeed', 'telegram', 'jobstreet', 'glints', 'jobsdb', 'facebook', 'threads', 'twitter/X', 'other');--> statement-breakpoint
CREATE TYPE "public"."tracker_type" AS ENUM('screening', 'interview', 'rejected', 'signoff', 'accepted', 'draft');--> statement-breakpoint
CREATE TYPE "public"."work_type" AS ENUM('On-site', 'Hybrid', 'Remote');--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(220) NOT NULL,
	"excerpt" text,
	"cover_image" text,
	"content_type" "blog_content_type" DEFAULT 'mdx' NOT NULL,
	"content" text NOT NULL,
	"status" "blog_status" DEFAULT 'draft' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"reading_time" integer,
	"published_at" timestamp with time zone,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" varchar(160) NOT NULL,
	"role" varchar(160) NOT NULL,
	"company_logo" varchar,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone,
	"is_current" boolean DEFAULT false NOT NULL,
	"type_job" "job_type" NOT NULL,
	"location" varchar(160),
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"image" text NOT NULL,
	"alt" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_tracker" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"company" varchar(160) NOT NULL,
	"location" varchar(160) NOT NULL,
	"role" varchar(160) NOT NULL,
	"cv" varchar,
	"type" "job_type" NOT NULL,
	"platform" "platform" NOT NULL,
	"work_type" "work_type" NOT NULL,
	"status" "tracker_type" DEFAULT 'screening',
	"remarks" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"type" varchar(160) NOT NULL,
	"image" text,
	"link" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thumbnail" text,
	"name" varchar(160) NOT NULL,
	"slug" varchar(180) NOT NULL,
	"description" text NOT NULL,
	"tech_stack" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_current" boolean DEFAULT false NOT NULL,
	"is_secret" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"demo_link" text,
	"repo_link" text,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"writer" varchar(160) NOT NULL,
	"image" text,
	"link" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(80),
	"image" text,
	"bio" text,
	"provider" "auth_provider" NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"is_owner" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "blogs_slug_unique" ON "blogs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blogs_status_idx" ON "blogs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "blogs_featured_idx" ON "blogs" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "blogs_published_at_idx" ON "blogs" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "experiences_current_idx" ON "experiences" USING btree ("is_current");--> statement-breakpoint
CREATE INDEX "experiences_start_date_idx" ON "experiences" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "gallery_active_idx" ON "gallery" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "movies_active_idx" ON "movies" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_slug_unique" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "projects_active_idx" ON "projects" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "projects_current_idx" ON "projects" USING btree ("is_current");--> statement-breakpoint
CREATE INDEX "songs_active_idx" ON "songs" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_provider_account_unique" ON "users" USING btree ("provider","provider_account_id");