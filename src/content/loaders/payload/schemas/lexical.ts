import { z } from "astro:schema";
import { blockBanner, blockCode } from "./lexicalBlocks";

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

const lexicalBlock = z.object({
	version: z.number(),
	type: z.literal("block"),
	fields: z.union([
        blockBanner,
        blockCode
    ]),
});

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
});

const lexicalComponents = z.union([
	lexicalParagraph,
	lexicalText,
    lexicalBlock,
    lexicalHeading
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