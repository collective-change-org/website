import { z } from "astro:schema"
import { lexicalRootContainer } from "./lexical"

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

export const lexicalBlock = z.object({
	version: z.number(),
	type: z.literal("block"),
	fields: z.union([blockBanner, blockBadge, blockCode, blockSteps]),
})
