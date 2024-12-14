import { defineCollection, z } from "astro:content";
import { docsSchema } from "@astrojs/starlight/schema";
import { docsLoader } from "@astrojs/starlight/loaders";
import { getPages } from "./loaders/kirby/getPages";
import { getPageContent } from "./loaders/kirby/getPageContent";

const knowledgebase = defineCollection({
	loader: getKnowledgeBase,
	schema: docsSchema({
		extend: z.object({
			blocks: z.array(z.object({
				id: z.string(),
				type: z.enum(["heading", "image"]),
				isHidden: z.boolean(),
				content: z.any(),
			}))
		})
	}),
});

export const collections = {
	docs: knowledgebase,
	// docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};

export type KnowledgebasePage = {
	id: string;
	title: string;
	blocks: Block[]
}
type Block = {
	type: "text" | "code";
	value: string;
}

async function getKnowledgeBase(): Promise<KnowledgebasePage[]> {
	// Getting all the leaf pages/pages with content
	const leafPages = await getPages("knowledgebase").catch((e) => {
		console.error("catch", e)
		throw new Error(e);
	})

	// Fetch content for all leaf pages
	const content = await Promise.all(leafPages.map(getPageContent)).catch((e) => {
		console.error("catch", e)
		throw new Error(e);
	})
	return content;
}