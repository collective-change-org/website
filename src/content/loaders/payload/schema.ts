import { z } from "astro:schema";

const lexicalText = z.object({
	version: z.number(),
	type: z.literal("text"),
	text: z.string(),
	mode: z.string(),
	style: z.string(),
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

export const lexicalRoot = z.object({
	version: z.number(),
	type: z.literal("root"),
	children: z.array(z.union([
		lexicalParagraph,
		lexicalCode,
	])),
});
export type LexicalRoot = z.infer<typeof lexicalRoot>;
