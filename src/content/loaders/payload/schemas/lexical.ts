import { z } from "astro:schema"
import { blockBanner, blockCode, lexicalBlock } from "./lexicalBlocks"


const lexicalText = z.object({
	version: z.number(),
	type: z.literal("text"),
	text: z.string(),
	mode: z.string(),
	style: z.string(),
	format: z.number(),
})

export type LexicalText = z.infer<typeof lexicalText>

const internalLink = z.object({
	linkType: z.literal("internal"),
	newTab: z.boolean(),
	doc: z.object({
		value: z.object({
			slugWithGroup: z.string(),
		}),
		relationTo: z.union([z.literal("knowledgebase"), z.literal("page")]),
	}),
})

const externalLink = z.object({
	linkType: z.literal("custom"),
	newTab: z.boolean(),
	url: z.string(),
})

const lexicalInlineLink = z.object({
	version: z.number(),
	type: z.literal("link"),
	fields: z.union([internalLink, externalLink]),
	children: z.array(lexicalText),
})

const lexicalParagraph = z.object({
	version: z.number(),
	type: z.literal("paragraph"),
	children: z.array(z.union([lexicalText, lexicalInlineLink])),
})

const lexicalHeading = z.object({
	version: z.number(),
	type: z.literal("heading"),
	indent: z.number(),
	tag: z.union([
		z.literal("h1"),
		z.literal("h2"),
		z.literal("h3"),
		z.literal("h4"),
	]),
	children: z.array(lexicalText),
})

const lexicalComponents = z.union([
	lexicalParagraph,
	lexicalInlineLink,
	lexicalText,
	lexicalBlock,
	lexicalHeading,
])

export type LexicalComponents = z.infer<typeof lexicalComponents>

export const lexicalRoot = z.object({
	version: z.number(),
	type: z.literal("root"),
	children: z.array(lexicalComponents),
})

export const lexicalRootContainer = z.object({
	root: lexicalRoot,
})

export type LexicalRoot = z.infer<typeof lexicalRoot>
export type LexicalRootContainer = z.infer<typeof lexicalRootContainer>
