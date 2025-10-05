import { z } from "astro:schema"

export const blockBanner = z.object({
	id: z.string(),
	title: z.string().optional(),
	type: z.union([
		z.literal("note"),
		z.literal("tip"),
		z.literal("caution"),
		z.literal("danger"),
	]),
	content: z.any(),
	blockType: z.literal("aside"),
})

export const blockBadge = z.object({
	id: z.string(),
	text: z.string(),
	variant: z.union([
		z.literal("default"),
		z.literal("note"),
		z.literal("danger"),
		z.literal("success"),
		z.literal("caution"),
		z.literal("tip"),
	]),
	size: z.union([
		z.literal("small"),
		z.literal("medium"),
		z.literal("large"),
	]),
	blockType: z.literal("badge"),
})

export const blockCode = z.object({
	id: z.string(),
	code: z.string(),
	language: z.string(),
	blockName: z.string(),
	blockType: z.literal("code"),
})

const blockSteps = z.object({
	blockType: z.literal("steps"),
})

// export const internalLink = z.object({
// 	type: z.literal("reference"),
// 	label: z.string(),
// 	reference: z.object({
// 		value: z.object({
// 			slugWithGroup: z.string(),
// 		}),
// 		relationTo: z.union([z.literal("knowledgebase"), z.literal("page")]),
// 	}),
// })
export const internalLink = z.object({
	type: z.literal("reference"),
	label: z.string(),
	reference: z.any().nullable().optional(),
	newTab: z.boolean().nullable().optional(),
	url: z.string().nullable().optional()
})


const linkCardBlock = z.object({
	blockType: z.literal("linkCardBlock"),
	title: z.string(),
	href: z.string(),
	description: z.string().optional(),
})
export type LinkCardBlock = z.infer<typeof linkCardBlock>

export const lexicalBlock = z.object({
	version: z.number(),
	type: z.literal("block"),
	fields: z.union([blockBanner, blockBadge, blockCode, blockSteps, linkCardBlock]),
})
