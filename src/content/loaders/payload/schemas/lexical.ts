import { z } from "astro:schema";
import { blockBanner } from "./lexicalBlocks";

const lexicalText = z.object({
	version: z.number(),
	type: z.literal("text"),
	text: z.string(),
	mode: z.string(),
	style: z.string(),
	format: z.number(),
});

const lexicalParagraph = z.object({
	version: z.number(),
	type: z.literal("paragraph"),
	children: z.array(lexicalText),
});

const lexicalCode = z.object({
	version: z.number(),
	type: z.literal("block"),
	fields: z.object({
		id: z.string(),
		code: z.string(),
		language: z.string(),
		blockName: z.string(),
		blockType: z.literal("code"),
	}),
});

const lexicalBlock = z.object({
	version: z.number(),
	type: z.literal("block"),
	fields: blockBanner,
});

const lexicalComponents = z.union([
	lexicalParagraph,
	lexicalCode,
	lexicalText
])

export type LexicalComponents = z.infer<typeof lexicalComponents>;

export const lexicalRoot = z.object({
	version: z.number(),
	type: z.literal("root"),
	children: z.array(lexicalComponents),
});

export const lexicalRootContainer = z.object({
	root: lexicalRoot,
})

export type LexicalRoot = z.infer<typeof lexicalRoot>;
export type LexicalRootContainer = z.infer<typeof lexicalRootContainer>;