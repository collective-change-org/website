import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_knowledgebase_visibility" AS ENUM('public', 'crew', 'team');
  CREATE TYPE "public"."enum__knowledgebase_v_version_visibility" AS ENUM('public', 'crew', 'team');
  ALTER TABLE "knowledgebase" ADD COLUMN "visibility" "enum_knowledgebase_visibility" DEFAULT 'public';
  ALTER TABLE "_knowledgebase_v" ADD COLUMN "version_visibility" "enum__knowledgebase_v_version_visibility" DEFAULT 'public';
  ALTER TABLE "knowledgebase" DROP COLUMN IF EXISTS "restricted";
  ALTER TABLE "_knowledgebase_v" DROP COLUMN IF EXISTS "version_restricted";
  DROP TYPE "public"."enum_knowledgebase_restricted";
  DROP TYPE "public"."enum__knowledgebase_v_version_restricted";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_knowledgebase_restricted" AS ENUM('public', 'members');
  CREATE TYPE "public"."enum__knowledgebase_v_version_restricted" AS ENUM('public', 'members');
  ALTER TABLE "knowledgebase" ADD COLUMN "restricted" "enum_knowledgebase_restricted" DEFAULT 'public';
  ALTER TABLE "_knowledgebase_v" ADD COLUMN "version_restricted" "enum__knowledgebase_v_version_restricted" DEFAULT 'public';
  ALTER TABLE "knowledgebase" DROP COLUMN IF EXISTS "visibility";
  ALTER TABLE "_knowledgebase_v" DROP COLUMN IF EXISTS "version_visibility";
  DROP TYPE "public"."enum_knowledgebase_visibility";
  DROP TYPE "public"."enum__knowledgebase_v_version_visibility";`)
}
