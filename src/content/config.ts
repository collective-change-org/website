import { defineCollection, z, type BaseSchema } from "astro:content";
import { docsSchema } from "@astrojs/starlight/schema";
import { linkHTMLAttributesSchema, type LinkHTMLAttributes } from "../schemas/sidebar";
import { MOCKDATA } from "astro:env/server"
import { mockdata } from "./mockdata";

export interface Link {
	id: string
	type: 'link';
	label: string;
	href: string;
	isCurrent: boolean;
	// badge: Badge | undefined;
	attrs: LinkHTMLAttributes;
}
export interface Group {
	id: string
	type: 'group';
	label: string;
	entries: (Link | Group)[];
	collapsed: boolean;
	// badge: Badge | undefined;
}
export type CustomSidebar = {
	order?: number;
	label?: string;
	hidden?: boolean;
	// badge?: BadgeConfig;
	// attrs?: SidebarLinkItemHTMLAttributes;
}
export type SidebarEntry = Link | Group;
export const linkSchema: z.ZodSchema<Link> = z.object({
	id: z.string(),
	type: z.literal("link"),
	label: z.string(),
	href: z.string(),
	isCurrent: z.boolean(),
	attrs: linkHTMLAttributesSchema
})
const groupSchema: z.ZodSchema<Group> = z.lazy(() =>
	z.object({
		id: z.string(),
		type: z.literal("group"),
		label: z.string(),
		entries: z.array(z.union([linkSchema, groupSchema])),
		collapsed: z.boolean(),
	})
)
const sidebar = defineCollection({
	loader: getSidebar,
	// TODO: Fix schema
	// schema: z.array(z.union([linkSchema, groupSchema]))
});


import { block } from "./loaders/kirby/schemas";
import { lexicalRoot, type LexicalRoot } from "./loaders/payload/schema";
import { getKnowledgeBase } from "./loaders/payload/getKnowledgebase";

export type Block = z.infer<typeof block>;


const knowledgebase = defineCollection({
	loader: () => getKnowledgeBase(),
	schema: docsSchema({
		extend: z.object({
			lexical: lexicalRoot,
		})
	}),
});

export interface KnowledgebasePage extends BaseSchema {
	id: string;
	title: string;
	template: "splash" | "doc";
	lexical: LexicalRoot;
	tableOfContents?: any;
	sidebar: CustomSidebar;
}



async function getSidebar(): Promise<SidebarEntry[]> {
	// @ts-ignore
	if (MOCKDATA) return new Promise((resolve) => resolve(mockdata.sidebar));

	return [];
}

export const collections = {
	// docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	docs: knowledgebase,
	sidebar
};