import { defineCollection, z } from "astro:content";
import { docsSchema } from "@astrojs/starlight/schema";
import { docsLoader } from "@astrojs/starlight/loaders";
import { getGroupsAndLinks, getPages } from "./loaders/kirby/getPages";
import { getPageContent } from "./loaders/kirby/getPageContent";
import { linkHTMLAttributesSchema, type LinkHTMLAttributes } from "../schemas/sidebar";
import { MOCKDATA } from "astro:env/server"
import { mockdata } from "./mockdata";
import { block } from "./loaders/kirby/schemas";

export type Block = z.infer<typeof block>;


const knowledgebase = defineCollection({
	loader: () => getKnowledgeBase("ROOT"),
	schema: docsSchema({
		extend: z.object({
			blocks: z.array(block)
		})
	}),
});

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

export type KnowledgebasePage = {
	id: string;
	title: string;
	template: "splash" | "doc";
	blocks: Block[];
	tableOfContents?: any;
}

async function getKnowledgeBase(basePage: string): Promise<KnowledgebasePage[]> {
	// This throws ts errors, but I cant be bothered to fix it right now
	// @ts-ignore
	if (MOCKDATA) return new Promise((resolve) => resolve(mockdata.knowledgebase));
	// Getting all the leaf pages/pages with content
	const leafPages = await getPages(basePage).catch((e) => {
		console.error("catch", e)
		throw new Error(e);
	})

	// Fetch content for all leaf pages
	const content = await Promise.all(leafPages.map(getPageContent)).catch((e) => {
		throw new Error(e);
	})
	return content;
}

async function getSidebar(): Promise<SidebarEntry[]> {
	// @ts-ignore
	if (MOCKDATA) return new Promise((resolve) => resolve(mockdata.sidebar));
	const sidebarObj = getGroupsAndLinks("knowledgebase").then((res) => {
		return res;
	})
	return sidebarObj;
}

export const collections = {
	docs: knowledgebase,
	sidebar
};