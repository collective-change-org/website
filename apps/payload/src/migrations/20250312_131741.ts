import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_footer_column_two_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_column_three_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_social_links_link_type" AS ENUM('reference', 'custom');
  ALTER TYPE "public"."enum_footer_nav_items_link_type" RENAME TO "enum_footer_column_one_link_type";
  CREATE TABLE IF NOT EXISTS "footer_column_two" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_column_two_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "footer_column_three" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_column_three_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar NOT NULL,
  	"link_type" "enum_footer_social_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  ALTER TABLE "footer_nav_items" RENAME TO "footer_column_one";
  ALTER TABLE "footer_column_one" DROP CONSTRAINT "footer_nav_items_parent_id_fk";
  
  DROP INDEX IF EXISTS "footer_nav_items_order_idx";
  DROP INDEX IF EXISTS "footer_nav_items_parent_id_idx";
  DO $$ BEGIN
   ALTER TABLE "footer_column_two" ADD CONSTRAINT "footer_column_two_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_column_three" ADD CONSTRAINT "footer_column_three_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_social_links" ADD CONSTRAINT "footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "footer_column_two_order_idx" ON "footer_column_two" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_column_two_parent_id_idx" ON "footer_column_two" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_column_three_order_idx" ON "footer_column_three" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_column_three_parent_id_idx" ON "footer_column_three" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_social_links_order_idx" ON "footer_social_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_social_links_parent_id_idx" ON "footer_social_links" USING btree ("_parent_id");
  DO $$ BEGIN
   ALTER TABLE "footer_column_one" ADD CONSTRAINT "footer_column_one_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "footer_column_one_order_idx" ON "footer_column_one" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_column_one_parent_id_idx" ON "footer_column_one" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_footer_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE IF NOT EXISTS "footer_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  DROP TABLE "footer_column_one" CASCADE;
  DROP TABLE "footer_column_two" CASCADE;
  DROP TABLE "footer_column_three" CASCADE;
  DROP TABLE "footer_social_links" CASCADE;
  DO $$ BEGIN
   ALTER TABLE "footer_nav_items" ADD CONSTRAINT "footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "footer_nav_items_order_idx" ON "footer_nav_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_nav_items_parent_id_idx" ON "footer_nav_items" USING btree ("_parent_id");
  DROP TYPE "public"."enum_footer_column_one_link_type";
  DROP TYPE "public"."enum_footer_column_two_link_type";
  DROP TYPE "public"."enum_footer_column_three_link_type";
  DROP TYPE "public"."enum_footer_social_links_link_type";`)
}
