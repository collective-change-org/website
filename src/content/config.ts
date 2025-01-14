import { defineCollection, z, type BaseSchema } from "astro:content"
import { docsSchema } from "@astrojs/starlight/schema"
import {
	linkHTMLAttributesSchema,
	type LinkHTMLAttributes,
} from "../schemas/sidebar"
import { MOCKDATA } from "astro:env/server"
import { mockdata } from "./mockdata"

export interface Link {
	id: string
	type: "link"
	label: string
	href: string
	isCurrent: boolean
	badge?: Badge
	attrs: LinkHTMLAttributes
}
export interface Group {
	id: string
	type: "group"
	label: string
	entries: (Link | Group)[]
	collapsed: boolean
	badge?: Badge
}
export type CustomSidebar = {
	order?: number
	label?: string
	hidden?: boolean
	// badge?: BadgeConfig
	// attrs?: SidebarLinkItemHTMLAttributes;
}
export type SidebarEntry = Link | Group
export const linkSchema: z.ZodSchema<Link> = z.object({
	id: z.string(),
	type: z.literal("link"),
	label: z.string(),
	href: z.string(),
	isCurrent: z.boolean(),
	attrs: linkHTMLAttributesSchema,
})
const groupSchema: z.ZodSchema<Group> = z.lazy(() =>
	z.object({
		id: z.string(),
		type: z.literal("group"),
		label: z.string(),
		entries: z.array(z.union([linkSchema, groupSchema])),
		collapsed: z.boolean(),
	}),
)
const sidebar = defineCollection({
	loader: getSidebar,
	// TODO: Fix schema
	// schema: z.array(z.union([linkSchema, groupSchema]))
})

import {
	lexicalRoot,
	type LexicalRoot,
} from "./loaders/payload/schemas/lexical"
import { getKnowledgeBase } from "./loaders/payload/getKnowledgebase"
import {
	getPages,
	type CallToActionBlock,
	type ContentBlock,
} from "./loaders/payload/getPages"
import { layoutUnion } from "./loaders/payload/schema"
import { getKnowledgebaseSidebar } from "./loaders/payload/getSidebar"
import type { Badge } from "../schemas/badge"
import { getHeader, header } from "./loaders/payload/getHeader"
import { string } from "astro:schema"
import { footer } from "./loaders/payload/getFooter"

async function loadAllPages() {
	const knowledgebase = getKnowledgeBase()
	const pages = getPages()

	return Promise.all([...(await knowledgebase), ...(await pages)])
}

const knowledgebase = defineCollection({
	loader: () => loadAllPages(),
	schema: docsSchema({
		extend: z.union([
			z.object({
				template: z.literal("doc"),
				lexical: lexicalRoot,
				restricted: z
					.union([z.literal("public"), z.literal("members")])
					.default("public"),
			}),
			z.object({
				template: z.literal("splash"),
				layout: z.array(layoutUnion),
				// restricted: z.union([
				// 	z.literal("public"),
				// 	z.literal("members"),
				// ]),
			}),
		]),
	}),
})

export interface KnowledgebasePage extends BaseSchema {
	id: string
	title: string
	template: "doc"
	lexical: LexicalRoot
	tableOfContents?: any
	sidebar: CustomSidebar
}

export interface Page extends BaseSchema {
	id: string
	title: string
	template: "splash"
	layout: (ContentBlock | CallToActionBlock)[]
}

async function getSidebar(): Promise<SidebarEntry[]> {
	// @ts-ignore
	if (MOCKDATA) return new Promise((resolve) => resolve(mockdata.sidebar))
	return await getKnowledgebaseSidebar()
}

export const collections = {
	docs: knowledgebase,
	sidebar,
	header,
	footer,
}
