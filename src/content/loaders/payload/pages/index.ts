import { defineCollection, z, type BaseSchema } from "astro:content"
import { getKnowledgeBase } from "./getKnowledgebase"
import { getPages, type CallToActionBlock, type ContentBlock } from "./getPages"
import { pagesSchema } from "./schema"
import type { LexicalRoot } from "../schemas/lexical"
import type { CustomSidebar } from "../getSidebar"

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

async function loadAllPages() {
	const knowledgebase = getKnowledgeBase()
	const pages = getPages()

	return Promise.all([...(await knowledgebase), ...(await pages)])
}

export const knowledgebase = defineCollection({
	loader: () => loadAllPages(),
	schema: pagesSchema
})