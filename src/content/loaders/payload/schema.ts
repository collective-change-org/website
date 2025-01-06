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

const lexicalRootContainer = z.object({
	root: lexicalRoot,
})

export type LexicalRoot = z.infer<typeof lexicalRoot>;
export type LexicalRootContainer = z.infer<typeof lexicalRootContainer>;

const columnBlock = z.object({
	size: z.union([
		z.literal("full"),
		z.literal("half"),
		z.literal("oneThird"),
	]),
	richText: lexicalRootContainer.nullable(),
})

const callToActionBlock = z.object({
	id: z.string(),
	richText: lexicalRootContainer,
})

export const layoutBlock = z.object({
	id: z.string(),
	columns: z.union([
		columnBlock,
		callToActionBlock,
	]).array()
})

