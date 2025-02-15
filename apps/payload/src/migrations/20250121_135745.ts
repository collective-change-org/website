import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'team', 'crew');
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role";
  ALTER TABLE "users" ADD COLUMN "profile_image_id" integer;
  ALTER TABLE "users" ADD COLUMN "_verified" boolean;
  ALTER TABLE "users" ADD COLUMN "_verificationtoken" varchar;
  DO $$ BEGIN
   ALTER TABLE "users" ADD CONSTRAINT "users_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_profile_image_idx" ON "users" USING btree ("profile_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP CONSTRAINT "users_profile_image_id_media_id_fk";
  
  DROP INDEX IF EXISTS "users_profile_image_idx";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "role";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "profile_image_id";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "_verified";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "_verificationtoken";
  DROP TYPE "public"."enum_users_role";`)
}
