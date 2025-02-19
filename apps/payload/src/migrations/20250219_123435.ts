import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_social_schedule_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__social_schedule_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE IF NOT EXISTS "pages_blocks_account_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_account_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "social_schedule_posts_media_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "social_schedule_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"platforms_instagram" boolean,
  	"platforms_mastodon" boolean,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_social_schedule_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_social_schedule_posts_v_version_media_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_social_schedule_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_platforms_instagram" boolean,
  	"version_platforms_mastodon" boolean,
  	"version_content" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__social_schedule_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "social_schedule_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE IF NOT EXISTS "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "social_schedule_posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "social_schedule_media_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_jobs_id" integer;
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_account_block" ADD CONSTRAINT "pages_blocks_account_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_account_block" ADD CONSTRAINT "_pages_v_blocks_account_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "social_schedule_posts_media_items" ADD CONSTRAINT "social_schedule_posts_media_items_media_id_social_schedule_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."social_schedule_media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "social_schedule_posts_media_items" ADD CONSTRAINT "social_schedule_posts_media_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social_schedule_posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_social_schedule_posts_v_version_media_items" ADD CONSTRAINT "_social_schedule_posts_v_version_media_items_media_id_social_schedule_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."social_schedule_media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_social_schedule_posts_v_version_media_items" ADD CONSTRAINT "_social_schedule_posts_v_version_media_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_social_schedule_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_social_schedule_posts_v" ADD CONSTRAINT "_social_schedule_posts_v_parent_id_social_schedule_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."social_schedule_posts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "pages_blocks_account_block_order_idx" ON "pages_blocks_account_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_account_block_parent_id_idx" ON "pages_blocks_account_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_account_block_path_idx" ON "pages_blocks_account_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_account_block_order_idx" ON "_pages_v_blocks_account_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_account_block_parent_id_idx" ON "_pages_v_blocks_account_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_account_block_path_idx" ON "_pages_v_blocks_account_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "social_schedule_posts_media_items_order_idx" ON "social_schedule_posts_media_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "social_schedule_posts_media_items_parent_id_idx" ON "social_schedule_posts_media_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "social_schedule_posts_media_items_media_idx" ON "social_schedule_posts_media_items" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "social_schedule_posts_updated_at_idx" ON "social_schedule_posts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "social_schedule_posts_created_at_idx" ON "social_schedule_posts" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "social_schedule_posts__status_idx" ON "social_schedule_posts" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_social_schedule_posts_v_version_media_items_order_idx" ON "_social_schedule_posts_v_version_media_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_social_schedule_posts_v_version_media_items_parent_id_idx" ON "_social_schedule_posts_v_version_media_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_social_schedule_posts_v_version_media_items_media_idx" ON "_social_schedule_posts_v_version_media_items" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "_social_schedule_posts_v_parent_idx" ON "_social_schedule_posts_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_social_schedule_posts_v_version_version_updated_at_idx" ON "_social_schedule_posts_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_social_schedule_posts_v_version_version_created_at_idx" ON "_social_schedule_posts_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_social_schedule_posts_v_version_version__status_idx" ON "_social_schedule_posts_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_social_schedule_posts_v_created_at_idx" ON "_social_schedule_posts_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_social_schedule_posts_v_updated_at_idx" ON "_social_schedule_posts_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_social_schedule_posts_v_latest_idx" ON "_social_schedule_posts_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "social_schedule_media_updated_at_idx" ON "social_schedule_media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "social_schedule_media_created_at_idx" ON "social_schedule_media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "social_schedule_media_filename_idx" ON "social_schedule_media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX IF NOT EXISTS "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX IF NOT EXISTS "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX IF NOT EXISTS "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX IF NOT EXISTS "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX IF NOT EXISTS "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX IF NOT EXISTS "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX IF NOT EXISTS "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_social_schedule_posts_fk" FOREIGN KEY ("social_schedule_posts_id") REFERENCES "public"."social_schedule_posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_social_schedule_media_fk" FOREIGN KEY ("social_schedule_media_id") REFERENCES "public"."social_schedule_media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk" FOREIGN KEY ("payload_jobs_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_social_schedule_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("social_schedule_posts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_social_schedule_media_id_idx" ON "payload_locked_documents_rels" USING btree ("social_schedule_media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_payload_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_jobs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_account_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_account_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "social_schedule_posts_media_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "social_schedule_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_social_schedule_posts_v_version_media_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_social_schedule_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "social_schedule_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_account_block" CASCADE;
  DROP TABLE "_pages_v_blocks_account_block" CASCADE;
  DROP TABLE "social_schedule_posts_media_items" CASCADE;
  DROP TABLE "social_schedule_posts" CASCADE;
  DROP TABLE "_social_schedule_posts_v_version_media_items" CASCADE;
  DROP TABLE "_social_schedule_posts_v" CASCADE;
  DROP TABLE "social_schedule_media" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_social_schedule_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_social_schedule_media_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_social_schedule_posts_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_social_schedule_media_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_payload_jobs_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "social_schedule_posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "social_schedule_media_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payload_jobs_id";
  DROP TYPE "public"."enum_social_schedule_posts_status";
  DROP TYPE "public"."enum__social_schedule_posts_v_version_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
