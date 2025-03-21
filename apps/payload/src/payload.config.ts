import { postgresAdapter } from "@payloadcms/db-postgres"
import { nodemailerAdapter } from "@payloadcms/email-nodemailer"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { buildConfig } from "payload"
import sharp from "sharp"

import { Badge } from "./collections/Badge"
import { Events } from "./collections/Events/config"
import { Groups } from "./collections/groups"
import { Knowledgebase } from "./collections/Knowledgebase"
import { Media } from "./collections/media"
import { Newsletter } from "./collections/Newsletter/config"
import { NotificationSettings } from "./collections/NotificationSettings/config"
import { Pages } from "./collections/Pages"
import { Users } from "./collections/Users"
import { defaultLexical } from "./fields/default-lexical"
import { Footer } from "./Footer/config"
import { Header } from "./Header/config"
import { migrations } from "./migrations"
import { plugins } from "./plugins"
import { getServerSideURL } from "./utilities/get-url"

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
	secret: process.env.PAYLOAD_SECRET || "",
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
				privateKey: process.env.DKIM_PRIVATE_KEY,
			},
		},
	}),
	endpoints: [
		{
			path: "health",
			method: "get",
			handler: async () => {
				const res = new Response("ok")
				return res
			},
		},
	],
})
