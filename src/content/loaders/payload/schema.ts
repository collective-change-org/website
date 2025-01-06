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

const contentBlock = z.object({
	blockType: z.literal("content"),
	columns: z.array(columnBlock),
})

const callToActionBlock = z.object({
	id: z.string(),
	blockType: z.literal("cta"),
	richText: lexicalRootContainer,
})


export const layoutUnion = z.union([
	contentBlock,
	callToActionBlock,
])

export type LayoutUnion = z.infer<typeof layoutUnion>;