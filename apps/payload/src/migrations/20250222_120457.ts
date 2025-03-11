import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ 
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_payload_jobs_log_task_slug') THEN
      CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_payload_jobs_log_state') THEN
      CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_payload_jobs_task_slug') THEN
      CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
    END IF;
  END $$;
  
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
  
  CREATE TABLE IF NOT EXISTS "newsletter_blocks_h3_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_newsletter_v_blocks_h3_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
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
  
  DO $$ 
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns 
      WHERE table_name = 'payload_locked_documents_rels' 
      AND column_name = 'payload_jobs_id'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_jobs_id" integer;
    END IF;
  END $$;
  
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
   ALTER TABLE "newsletter_blocks_h3_block" ADD CONSTRAINT "newsletter_blocks_h3_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."newsletter"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_newsletter_v_blocks_h3_block" ADD CONSTRAINT "_newsletter_v_blocks_h3_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_newsletter_v"("id") ON DELETE cascade ON UPDATE no action;
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
  CREATE INDEX IF NOT EXISTS "newsletter_blocks_h3_block_order_idx" ON "newsletter_blocks_h3_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "newsletter_blocks_h3_block_parent_id_idx" ON "newsletter_blocks_h3_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "newsletter_blocks_h3_block_path_idx" ON "newsletter_blocks_h3_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_blocks_h3_block_order_idx" ON "_newsletter_v_blocks_h3_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_blocks_h3_block_parent_id_idx" ON "_newsletter_v_blocks_h3_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_blocks_h3_block_path_idx" ON "_newsletter_v_blocks_h3_block" USING btree ("_path");
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
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk" FOREIGN KEY ("payload_jobs_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_payload_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_jobs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $$ 
  BEGIN
    -- Only disable row level security if table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages_blocks_account_block') THEN
      ALTER TABLE "pages_blocks_account_block" DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_pages_v_blocks_account_block') THEN
      ALTER TABLE "_pages_v_blocks_account_block" DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'newsletter_blocks_h3_block') THEN
      ALTER TABLE "newsletter_blocks_h3_block" DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_newsletter_v_blocks_h3_block') THEN
      ALTER TABLE "_newsletter_v_blocks_h3_block" DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payload_jobs_log') THEN
      ALTER TABLE "payload_jobs_log" DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payload_jobs') THEN
      ALTER TABLE "payload_jobs" DISABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Drop tables if they exist
    DROP TABLE IF EXISTS "pages_blocks_account_block" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_account_block" CASCADE;
    DROP TABLE IF EXISTS "newsletter_blocks_h3_block" CASCADE;
    DROP TABLE IF EXISTS "_newsletter_v_blocks_h3_block" CASCADE;
    DROP TABLE IF EXISTS "payload_jobs_log" CASCADE;
    DROP TABLE IF EXISTS "payload_jobs" CASCADE;
    
    -- Drop constraint if it exists
    IF EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'payload_locked_documents_rels_payload_jobs_fk'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk";
    END IF;
  END $$;
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_payload_jobs_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payload_jobs_id";
  
  -- Drop types if they exist
  DO $$ 
  BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_payload_jobs_log_task_slug') THEN
      DROP TYPE "public"."enum_payload_jobs_log_task_slug";
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_payload_jobs_log_state') THEN
      DROP TYPE "public"."enum_payload_jobs_log_state";
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_payload_jobs_task_slug') THEN
      DROP TYPE "public"."enum_payload_jobs_task_slug";
    END IF;
  END $$;`)
}
