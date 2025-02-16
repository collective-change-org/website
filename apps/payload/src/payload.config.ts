import { postgresAdapter } from "@payloadcms/db-postgres"
import sharp from "sharp"
import path from "path"
import { buildConfig } from "payload"
import { fileURLToPath } from "url"

import { Groups } from "./collections/Groups"
import { Media } from "./collections/Media"
import { Pages } from "./collections/Pages"
import { Knowledgebase } from "./collections/Knowledgebase"
import { Users } from "./collections/Users"
import { Footer } from "./Footer/config"
import { Header } from "./Header/config"
import { plugins } from "./plugins"
import { defaultLexical } from "./fields/defaultLexical"
import { getServerSideURL } from "./utilities/getURL"
import { Badge } from "./collections/Badge"
import { migrations } from "./migrations"
import { nodemailerAdapter } from "@payloadcms/email-nodemailer"
import { Events } from "./collections/Events/config"
import { NotificationSettings } from "./collections/NotificationSettings/config"
import { Newsletter } from "./collections/Newsletter/config"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  routes: {
    admin: "/",
  },
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
  },
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
    prodMigrations: migrations,
  }),
  collections: [
    Pages,
    Knowledgebase,
    Media,
    Groups,
    Users,
    Badge,
    Events,
    NotificationSettings,
    Newsletter,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_USER || "",
    defaultFromName: "Collective Change",
    // Nodemailer transportOptions
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      dkim: {
        domainName: "collective-change.de",
        keySelector: "payload",
        privateKey: process.env.DKIM_PRIVATE_KEY
      },
    },
  }),
})
