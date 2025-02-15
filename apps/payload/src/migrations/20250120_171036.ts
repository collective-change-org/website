import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_button_block_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_button_block_variant" AS ENUM('green', 'orange', 'black');
  CREATE TYPE "public"."enum_pages_blocks_button_block_size" AS ENUM('small', 'large');
  CREATE TYPE "public"."enum_pages_blocks_container_block_color" AS ENUM('green', 'white-1', 'white-2');
  CREATE TYPE "public"."enum__pages_v_blocks_button_block_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_button_block_variant" AS ENUM('green', 'orange', 'black');
  CREATE TYPE "public"."enum__pages_v_blocks_button_block_size" AS ENUM('small', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_container_block_color" AS ENUM('green', 'white-1', 'white-2');
  CREATE TABLE IF NOT EXISTS "pages_blocks_h1_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_h2_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_button_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_button_block_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"has_left_icon" boolean DEFAULT false,
  	"icon_left" varchar,
  	"has_right_icon" boolean DEFAULT false,
  	"icon_right" varchar,
  	"variant" "enum_pages_blocks_button_block_variant" DEFAULT 'green',
  	"size" "enum_pages_blocks_button_block_size" DEFAULT 'small',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_emphasized_paragraph" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_indented_container" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_large_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_column_container_block_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_column_container_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_container_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"color" "enum_pages_blocks_container_block_color",
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_h1_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_h2_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_button_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_button_block_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"has_left_icon" boolean DEFAULT false,
  	"icon_left" varchar,
  	"has_right_icon" boolean DEFAULT false,
  	"icon_right" varchar,
  	"variant" "enum__pages_v_blocks_button_block_variant" DEFAULT 'green',
  	"size" "enum__pages_v_blocks_button_block_size" DEFAULT 'small',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_emphasized_paragraph" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_indented_container" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_large_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_column_container_block_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_column_container_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_container_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"color" "enum__pages_v_blocks_container_block_color",
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  ALTER TABLE "pages_blocks_hero_block" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_hero_block" ADD COLUMN "title" varchar;
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_h1_block" ADD CONSTRAINT "pages_blocks_h1_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_h2_block" ADD CONSTRAINT "pages_blocks_h2_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_button_block" ADD CONSTRAINT "pages_blocks_button_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_emphasized_paragraph" ADD CONSTRAINT "pages_blocks_emphasized_paragraph_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_indented_container" ADD CONSTRAINT "pages_blocks_indented_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_large_rich_text_block" ADD CONSTRAINT "pages_blocks_large_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_column_container_block_columns" ADD CONSTRAINT "pages_blocks_column_container_block_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_column_container_block"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_column_container_block" ADD CONSTRAINT "pages_blocks_column_container_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_container_block" ADD CONSTRAINT "pages_blocks_container_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_h1_block" ADD CONSTRAINT "_pages_v_blocks_h1_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_h2_block" ADD CONSTRAINT "_pages_v_blocks_h2_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_button_block" ADD CONSTRAINT "_pages_v_blocks_button_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_emphasized_paragraph" ADD CONSTRAINT "_pages_v_blocks_emphasized_paragraph_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_indented_container" ADD CONSTRAINT "_pages_v_blocks_indented_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_large_rich_text_block" ADD CONSTRAINT "_pages_v_blocks_large_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_column_container_block_columns" ADD CONSTRAINT "_pages_v_blocks_column_container_block_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_column_container_block"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_column_container_block" ADD CONSTRAINT "_pages_v_blocks_column_container_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_container_block" ADD CONSTRAINT "_pages_v_blocks_container_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "pages_blocks_h1_block_order_idx" ON "pages_blocks_h1_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_h1_block_parent_id_idx" ON "pages_blocks_h1_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_h1_block_path_idx" ON "pages_blocks_h1_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_h2_block_order_idx" ON "pages_blocks_h2_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_h2_block_parent_id_idx" ON "pages_blocks_h2_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_h2_block_path_idx" ON "pages_blocks_h2_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_button_block_order_idx" ON "pages_blocks_button_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_button_block_parent_id_idx" ON "pages_blocks_button_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_button_block_path_idx" ON "pages_blocks_button_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_emphasized_paragraph_order_idx" ON "pages_blocks_emphasized_paragraph" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_emphasized_paragraph_parent_id_idx" ON "pages_blocks_emphasized_paragraph" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_emphasized_paragraph_path_idx" ON "pages_blocks_emphasized_paragraph" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_indented_container_order_idx" ON "pages_blocks_indented_container" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_indented_container_parent_id_idx" ON "pages_blocks_indented_container" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_indented_container_path_idx" ON "pages_blocks_indented_container" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_large_rich_text_block_order_idx" ON "pages_blocks_large_rich_text_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_large_rich_text_block_parent_id_idx" ON "pages_blocks_large_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_large_rich_text_block_path_idx" ON "pages_blocks_large_rich_text_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_column_container_block_columns_order_idx" ON "pages_blocks_column_container_block_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_column_container_block_columns_parent_id_idx" ON "pages_blocks_column_container_block_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_column_container_block_order_idx" ON "pages_blocks_column_container_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_column_container_block_parent_id_idx" ON "pages_blocks_column_container_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_column_container_block_path_idx" ON "pages_blocks_column_container_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_container_block_order_idx" ON "pages_blocks_container_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_container_block_parent_id_idx" ON "pages_blocks_container_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_container_block_path_idx" ON "pages_blocks_container_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_h1_block_order_idx" ON "_pages_v_blocks_h1_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_h1_block_parent_id_idx" ON "_pages_v_blocks_h1_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_h1_block_path_idx" ON "_pages_v_blocks_h1_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_h2_block_order_idx" ON "_pages_v_blocks_h2_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_h2_block_parent_id_idx" ON "_pages_v_blocks_h2_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_h2_block_path_idx" ON "_pages_v_blocks_h2_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_button_block_order_idx" ON "_pages_v_blocks_button_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_button_block_parent_id_idx" ON "_pages_v_blocks_button_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_button_block_path_idx" ON "_pages_v_blocks_button_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_emphasized_paragraph_order_idx" ON "_pages_v_blocks_emphasized_paragraph" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_emphasized_paragraph_parent_id_idx" ON "_pages_v_blocks_emphasized_paragraph" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_emphasized_paragraph_path_idx" ON "_pages_v_blocks_emphasized_paragraph" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_indented_container_order_idx" ON "_pages_v_blocks_indented_container" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_indented_container_parent_id_idx" ON "_pages_v_blocks_indented_container" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_indented_container_path_idx" ON "_pages_v_blocks_indented_container" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_large_rich_text_block_order_idx" ON "_pages_v_blocks_large_rich_text_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_large_rich_text_block_parent_id_idx" ON "_pages_v_blocks_large_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_large_rich_text_block_path_idx" ON "_pages_v_blocks_large_rich_text_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_column_container_block_columns_order_idx" ON "_pages_v_blocks_column_container_block_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_column_container_block_columns_parent_id_idx" ON "_pages_v_blocks_column_container_block_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_column_container_block_order_idx" ON "_pages_v_blocks_column_container_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_column_container_block_parent_id_idx" ON "_pages_v_blocks_column_container_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_column_container_block_path_idx" ON "_pages_v_blocks_column_container_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_container_block_order_idx" ON "_pages_v_blocks_container_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_container_block_parent_id_idx" ON "_pages_v_blocks_container_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_container_block_path_idx" ON "_pages_v_blocks_container_block" USING btree ("_path");
  DROP TYPE "public"."enum_pages_blocks_content_columns_size";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TABLE IF NOT EXISTS "pages_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_h1_block" CASCADE;
  DROP TABLE "pages_blocks_h2_block" CASCADE;
  DROP TABLE "pages_blocks_button_block" CASCADE;
  DROP TABLE "pages_blocks_emphasized_paragraph" CASCADE;
  DROP TABLE "pages_blocks_indented_container" CASCADE;
  DROP TABLE "pages_blocks_large_rich_text_block" CASCADE;
  DROP TABLE "pages_blocks_column_container_block_columns" CASCADE;
  DROP TABLE "pages_blocks_column_container_block" CASCADE;
  DROP TABLE "pages_blocks_container_block" CASCADE;
  DROP TABLE "_pages_v_blocks_h1_block" CASCADE;
  DROP TABLE "_pages_v_blocks_h2_block" CASCADE;
  DROP TABLE "_pages_v_blocks_button_block" CASCADE;
  DROP TABLE "_pages_v_blocks_emphasized_paragraph" CASCADE;
  DROP TABLE "_pages_v_blocks_indented_container" CASCADE;
  DROP TABLE "_pages_v_blocks_large_rich_text_block" CASCADE;
  DROP TABLE "_pages_v_blocks_column_container_block_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_column_container_block" CASCADE;
  DROP TABLE "_pages_v_blocks_container_block" CASCADE;
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_content_columns" ADD CONSTRAINT "_pages_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_columns_order_idx" ON "pages_blocks_content_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_columns_parent_id_idx" ON "pages_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_columns_order_idx" ON "_pages_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_columns_parent_id_idx" ON "_pages_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  ALTER TABLE "pages_blocks_hero_block" DROP COLUMN IF EXISTS "title";
  ALTER TABLE "_pages_v_blocks_hero_block" DROP COLUMN IF EXISTS "title";
  DROP TYPE "public"."enum_pages_blocks_button_block_link_type";
  DROP TYPE "public"."enum_pages_blocks_button_block_variant";
  DROP TYPE "public"."enum_pages_blocks_button_block_size";
  DROP TYPE "public"."enum_pages_blocks_container_block_color";
  DROP TYPE "public"."enum__pages_v_blocks_button_block_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_button_block_variant";
  DROP TYPE "public"."enum__pages_v_blocks_button_block_size";
  DROP TYPE "public"."enum__pages_v_blocks_container_block_color";`)
}
