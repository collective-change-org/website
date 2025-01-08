import { z } from "astro:schema"
import { lexicalRootContainer } from "./schemas/lexical"

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
