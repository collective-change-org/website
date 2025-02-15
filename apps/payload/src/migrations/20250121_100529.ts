import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_login_block" DROP COLUMN IF EXISTS "rich_text";
  ALTER TABLE "pages_blocks_signup_block" DROP COLUMN IF EXISTS "rich_text";
  ALTER TABLE "_pages_v_blocks_login_block" DROP COLUMN IF EXISTS "rich_text";
  ALTER TABLE "_pages_v_blocks_signup_block" DROP COLUMN IF EXISTS "rich_text";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_login_block" ADD COLUMN "rich_text" jsonb;
  ALTER TABLE "pages_blocks_signup_block" ADD COLUMN "rich_text" jsonb;
  ALTER TABLE "_pages_v_blocks_login_block" ADD COLUMN "rich_text" jsonb;
  ALTER TABLE "_pages_v_blocks_signup_block" ADD COLUMN "rich_text" jsonb;`)
}
