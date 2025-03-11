import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" RENAME COLUMN "date" TO "begin_date";
  ALTER TABLE "events" RENAME COLUMN "time" TO "end_date";
  ALTER TABLE "_events_v" RENAME COLUMN "version_date" TO "version_begin_date";
  ALTER TABLE "_events_v" RENAME COLUMN "version_time" TO "version_end_date";
  ALTER TABLE "_newsletter_v" ADD COLUMN "autosave" boolean;
  CREATE INDEX IF NOT EXISTS "_newsletter_v_autosave_idx" ON "_newsletter_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "_newsletter_v_autosave_idx";
  ALTER TABLE "events" ADD COLUMN "date" timestamp(3) with time zone;
  ALTER TABLE "events" ADD COLUMN "time" timestamp(3) with time zone;
  ALTER TABLE "_events_v" ADD COLUMN "version_date" timestamp(3) with time zone;
  ALTER TABLE "_events_v" ADD COLUMN "version_time" timestamp(3) with time zone;
  ALTER TABLE "events" DROP COLUMN IF EXISTS "begin_date";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "end_date";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_begin_date";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_end_date";
  ALTER TABLE "_newsletter_v" DROP COLUMN IF EXISTS "autosave";`)
}
