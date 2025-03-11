import { type BaseSchema, defineCollection, z } from "astro:content";
import { getKnowledgeBase } from "./getKnowledgebase";
import { type ContentBlock, getPages } from "./getPages";
import { HeadConfigSchema, pagesSchema } from "./schema";
import type { LexicalRoot } from "../schemas/lexical";
import type { CustomSidebar } from "../getSidebar";
import type { Media } from "@payload/src";

export interface KnowledgebasePage extends BaseSchema {
	id: string;
	title: string;
	template: "doc";
	lexical: LexicalRoot;
	tableOfContents?: any;
	sidebar: CustomSidebar;
	restricted: "public" | "members";
}

export interface Page extends BaseSchema {
	id: string;
	title: string;
	template: "splash";
	head: z.input<ReturnType<typeof HeadConfigSchema>>;
	meta?: {
		title?: string | null | undefined;
		image?: number | Media | null | undefined;
		description?: string | null | undefined;
	};
	tableOfContents: boolean;
	sidebar: CustomSidebar;
	layout: ContentBlock[];
}

async function loadAllPages() {
	const knowledgebase = getKnowledgeBase();
	const pages = getPages();

	return Promise.all([...(await knowledgebase), ...(await pages)]);
}

export const knowledgebase = defineCollection({
	loader: () => loadAllPages(),
	schema: pagesSchema,
});
