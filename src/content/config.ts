import { defineCollection, z } from "astro:content";
import { docsSchema } from "@astrojs/starlight/schema";
import { docsLoader } from "@astrojs/starlight/loaders";
import { getPages } from "./loaders/kirby/getPages";
import { getPageContent } from "./loaders/kirby/getPageContent";
import type { Badge } from "../schemas/badge";
import type { LinkHTMLAttributes } from "../schemas/sidebar";

const block = z.object({
	id: z.string(),
	type: z.enum(["heading", "image", "card", "link-card", "text"]),
	isHidden: z.boolean(),
	content: z.any(),
});

export type Block = z.infer<typeof block>;

export interface Link {
	type: 'link';
	label: string;
	href: string;
	isCurrent: boolean;
	badge: Badge | undefined;
	attrs: LinkHTMLAttributes;
}

interface Group {
	type: 'group';
	label: string;
	entries: (Link | Group)[];
	collapsed: boolean;
	badge: Badge | undefined;
}

export type SidebarEntry = Link | Group;

const knowledgebase = defineCollection({
	loader: () => getKnowledgeBase("knowledgebase"),
	schema: docsSchema({
		extend: z.object({
			blocks: z.array(block)
		})
	}),
});

export const collections = {
	docs: knowledgebase,
};

export type KnowledgebasePage = {
	id: string;
	title: string;
	blocks: Block[];
	tableOfContents?: any;
}

async function getKnowledgeBase(basePage: string): Promise<KnowledgebasePage[]> {
	// Getting all the leaf pages/pages with content
	const leafPages = await getPages(basePage).catch((e) => {
		console.error("catch", e)
		throw new Error(e);
	})

	// Fetch content for all leaf pages
	const content = await Promise.all(leafPages.map(getPageContent)).catch((e) => {
		console.error("catch", e)
		throw new Error(e);
	})
	console.dir(content, { depth: Infinity })
	return content;
}