import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_highlight_article_block_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_selected_work_block_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_join_crew_block_button_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_join_crew_block_button_variant" AS ENUM('green', 'orange', 'black');
  CREATE TYPE "public"."enum_pages_blocks_join_crew_block_button_size" AS ENUM('small', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_highlight_article_block_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_selected_work_block_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_join_crew_block_button_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_join_crew_block_button_variant" AS ENUM('green', 'orange', 'black');
  CREATE TYPE "public"."enum__pages_v_blocks_join_crew_block_button_size" AS ENUM('small', 'large');
  CREATE TABLE "pages_blocks_highlight_article_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"thumbnail_id" integer,
  	"article_title" varchar,
  	"article_excerpt" varchar,
  	"link_type" "enum_pages_blocks_highlight_article_block_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_selected_work_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"thumbnail_id" integer,
  	"article_title" varchar,
  	"article_excerpt" varchar,
  	"link_type" "enum_pages_blocks_selected_work_block_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_join_crew_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"button_link_type" "enum_pages_blocks_join_crew_block_button_link_type" DEFAULT 'reference',
  	"button_link_new_tab" boolean,
  	"button_link_url" varchar,
  	"button_link_label" varchar,
  	"button_has_left_icon" boolean DEFAULT false,
  	"button_icon_left" varchar,
  	"button_has_right_icon" boolean DEFAULT false,
  	"button_icon_right" varchar,
  	"button_variant" "enum_pages_blocks_join_crew_block_button_variant" DEFAULT 'green',
  	"button_size" "enum_pages_blocks_join_crew_block_button_size" DEFAULT 'small',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_highlight_article_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"thumbnail_id" integer,
  	"article_title" varchar,
  	"article_excerpt" varchar,
  	"link_type" "enum__pages_v_blocks_highlight_article_block_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_selected_work_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"thumbnail_id" integer,
  	"article_title" varchar,
  	"article_excerpt" varchar,
  	"link_type" "enum__pages_v_blocks_selected_work_block_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_join_crew_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"button_link_type" "enum__pages_v_blocks_join_crew_block_button_link_type" DEFAULT 'reference',
  	"button_link_new_tab" boolean,
  	"button_link_url" varchar,
  	"button_link_label" varchar,
  	"button_has_left_icon" boolean DEFAULT false,
  	"button_icon_left" varchar,
  	"button_has_right_icon" boolean DEFAULT false,
  	"button_icon_right" varchar,
  	"button_variant" "enum__pages_v_blocks_join_crew_block_button_variant" DEFAULT 'green',
  	"button_size" "enum__pages_v_blocks_join_crew_block_button_size" DEFAULT 'small',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  ALTER TABLE "media" ALTER COLUMN "alt" SET NOT NULL;
  ALTER TABLE "media" ALTER COLUMN "caption" SET DATA TYPE varchar;
  ALTER TABLE "pages_blocks_highlight_article_block" ADD CONSTRAINT "pages_blocks_highlight_article_block_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlight_article_block" ADD CONSTRAINT "pages_blocks_highlight_article_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_selected_work_block" ADD CONSTRAINT "pages_blocks_selected_work_block_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_selected_work_block" ADD CONSTRAINT "pages_blocks_selected_work_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_join_crew_block" ADD CONSTRAINT "pages_blocks_join_crew_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlight_article_block" ADD CONSTRAINT "_pages_v_blocks_highlight_article_block_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlight_article_block" ADD CONSTRAINT "_pages_v_blocks_highlight_article_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_selected_work_block" ADD CONSTRAINT "_pages_v_blocks_selected_work_block_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_selected_work_block" ADD CONSTRAINT "_pages_v_blocks_selected_work_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_join_crew_block" ADD CONSTRAINT "_pages_v_blocks_join_crew_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_highlight_article_block_order_idx" ON "pages_blocks_highlight_article_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_highlight_article_block_parent_id_idx" ON "pages_blocks_highlight_article_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_highlight_article_block_path_idx" ON "pages_blocks_highlight_article_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_highlight_article_block_thumbnail_idx" ON "pages_blocks_highlight_article_block" USING btree ("thumbnail_id");
  CREATE INDEX "pages_blocks_selected_work_block_order_idx" ON "pages_blocks_selected_work_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_selected_work_block_parent_id_idx" ON "pages_blocks_selected_work_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_selected_work_block_path_idx" ON "pages_blocks_selected_work_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_selected_work_block_thumbnail_idx" ON "pages_blocks_selected_work_block" USING btree ("thumbnail_id");
  CREATE INDEX "pages_blocks_join_crew_block_order_idx" ON "pages_blocks_join_crew_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_join_crew_block_parent_id_idx" ON "pages_blocks_join_crew_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_join_crew_block_path_idx" ON "pages_blocks_join_crew_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_highlight_article_block_order_idx" ON "_pages_v_blocks_highlight_article_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_highlight_article_block_parent_id_idx" ON "_pages_v_blocks_highlight_article_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_highlight_article_block_path_idx" ON "_pages_v_blocks_highlight_article_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_highlight_article_block_thumbnail_idx" ON "_pages_v_blocks_highlight_article_block" USING btree ("thumbnail_id");
  CREATE INDEX "_pages_v_blocks_selected_work_block_order_idx" ON "_pages_v_blocks_selected_work_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_selected_work_block_parent_id_idx" ON "_pages_v_blocks_selected_work_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_selected_work_block_path_idx" ON "_pages_v_blocks_selected_work_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_selected_work_block_thumbnail_idx" ON "_pages_v_blocks_selected_work_block" USING btree ("thumbnail_id");
  CREATE INDEX "_pages_v_blocks_join_crew_block_order_idx" ON "_pages_v_blocks_join_crew_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_join_crew_block_parent_id_idx" ON "_pages_v_blocks_join_crew_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_join_crew_block_path_idx" ON "_pages_v_blocks_join_crew_block" USING btree ("_path");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  ALTER TABLE "pages_blocks_hero_block" DROP COLUMN "rich_text";
  ALTER TABLE "_pages_v_blocks_hero_block" DROP COLUMN "rich_text";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_highlight_article_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_selected_work_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_join_crew_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_highlight_article_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_selected_work_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_join_crew_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "users_sessions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_highlight_article_block" CASCADE;
  DROP TABLE "pages_blocks_selected_work_block" CASCADE;
  DROP TABLE "pages_blocks_join_crew_block" CASCADE;
  DROP TABLE "_pages_v_blocks_highlight_article_block" CASCADE;
  DROP TABLE "_pages_v_blocks_selected_work_block" CASCADE;
  DROP TABLE "_pages_v_blocks_join_crew_block" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  ALTER TABLE "media" ALTER COLUMN "alt" DROP NOT NULL;
  ALTER TABLE "media" ALTER COLUMN "caption" SET DATA TYPE jsonb;
  ALTER TABLE "pages_blocks_hero_block" ADD COLUMN "rich_text" jsonb;
  ALTER TABLE "_pages_v_blocks_hero_block" ADD COLUMN "rich_text" jsonb;
  DROP TYPE "public"."enum_pages_blocks_highlight_article_block_link_type";
  DROP TYPE "public"."enum_pages_blocks_selected_work_block_link_type";
  DROP TYPE "public"."enum_pages_blocks_join_crew_block_button_link_type";
  DROP TYPE "public"."enum_pages_blocks_join_crew_block_button_variant";
  DROP TYPE "public"."enum_pages_blocks_join_crew_block_button_size";
  DROP TYPE "public"."enum__pages_v_blocks_highlight_article_block_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_selected_work_block_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_join_crew_block_button_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_join_crew_block_button_variant";
  DROP TYPE "public"."enum__pages_v_blocks_join_crew_block_button_size";`)
}
