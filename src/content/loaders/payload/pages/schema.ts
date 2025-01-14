import { docsSchema } from "@astrojs/starlight/schema";
import { lexicalRoot, lexicalRootContainer } from "../schemas/lexical";
import { z } from "astro:content";

const columnBlock = z.object({
	size: z.union([
		z.literal("full"),
		z.literal("half"),
		z.literal("oneThird"),
	]),
	richText: lexicalRootContainer.nullable(),
})

const contentBlock = z.object({
	blockType: z.literal("content"),
	columns: z.array(columnBlock),
})

const callToActionBlock = z.object({
	id: z.string(),
	blockType: z.literal("cta"),
	richText: lexicalRootContainer,
})

const loginBlock = z.object({
	blockType: z.literal("loginBlock"),
})

export const layoutUnion = z.union([
	contentBlock,
	callToActionBlock,
	loginBlock,
])

export type LayoutUnion = z.infer<typeof layoutUnion>


export const pagesSchema = docsSchema({
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
		}),
	]),
})