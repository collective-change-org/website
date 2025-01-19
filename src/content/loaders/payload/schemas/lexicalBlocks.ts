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

const internalLink = z.object({
	type: z.literal("reference"),
	label: z.string(),
	reference: z.object({
		value: z.object({
			slugWithGroup: z.string(),
		}),
		relationTo: z.union([z.literal("knowledgebase"), z.literal("page")]),
	}),
})

const buttonBlock = z.object({
	blockType: z.literal("buttonBlock"),
	hasRightIcon: z.boolean(),
	hasLeftIcon: z.boolean(),
	iconLeft: z.string().optional(),
	iconRight: z.string().optional(),
	variant: z.union([
		z.literal("green"),
		z.literal("orange"),
		z.literal("black"),
	]),
	size: z.union([
		z.literal("small"),
		z.literal("large"),
	]),
	link: z.any(),
})

export const lexicalBlock = z.object({
	version: z.number(),
	type: z.literal("block"),
	fields: z.union([blockBanner, blockBadge, blockCode, blockSteps, buttonBlock]),
})
