import { docsSchema } from "@astrojs/starlight/schema"
import { lexicalRoot, lexicalRootContainer } from "../schemas/lexical"
import { z } from "astro:content"
import { ImageUpload } from "../globalSchema"
import type { Page } from "@payload/src/payload-types"
import { internalLink } from "../schemas/lexicalBlocks"

type BlockUnion = Page["layout"][number];

type BlockOf<T extends BlockUnion["blockType"]> =
	Extract<BlockUnion, { blockType: T }>;

// 3. Usage
type HeroBlock = BlockOf<"heroBlock">;
type HighlightArticleBlock = BlockOf<"highlightArticleBlock">;
type SelectedWorkBlock = BlockOf<"selectedWorkBlock">;

const h1Block = z.object({
	blockType: z.literal("h1Block"),
	title: z.string(),
})

const h2Block = z.object({
	blockType: z.literal("h2Block"),
	title: z.string(),
})

const emphasizedParagraphBlock = z.object({
	blockType: z.literal("emphasizedParagraph"),
	richText: lexicalRootContainer,
})

const buttonBlock = z.object({
	blockType: z.literal("buttonBlock"),
	hasRightIcon: z.boolean(),
	hasLeftIcon: z.boolean(),
	iconLeft: z.string().nullable(),
	iconRight: z.string().nullable(),
	variant: z.union([
		z.literal("green"),
		z.literal("orange"),
		z.literal("black"),
	]),
	size: z.union([z.literal("small"), z.literal("large")]),
	link: z.any(),
})

const largeRichTextBlock = z.object({
	blockType: z.literal("largeRichTextBlock"),
	title: z.string().nullable(),
	richText: lexicalRootContainer,
})

const manifestBlock = z.object({
	blockType: z.literal("manifestBlock"),
	sections: z.array(
		z.object({
			subtitle: z.string(),
			listItem: z.array(
				z.object({
					title: z.string(),
					description: z.string(),
				}),
			),
		}),
	),
})

const loginBlock = z.object({
	blockType: z.literal("loginBlock"),
})
const signUpBlock = z.object({
	blockType: z.literal("signupBlock"),
})

const upcomingEventsBlock = z.object({
	blockType: z.literal("upcomingEvents"),
	title: z.string(),
})

const accountBlock = z.object({
	blockType: z.literal("accountBlock"),
})

const baseContainerLayouts = z.discriminatedUnion("blockType", [
	h1Block,
	h2Block,
	emphasizedParagraphBlock,
	buttonBlock,
	largeRichTextBlock,
	manifestBlock,
	loginBlock,
	signUpBlock,
	upcomingEventsBlock,
	accountBlock,
])
export type BaseContainerLayouts = z.infer<typeof baseContainerLayouts>

const indentedContainer = z.object({
	blockType: z.literal("indentedContainer"),
	layout: z.array(baseContainerLayouts),
})

const columnContainerBlock = z.object({
	blockType: z.literal("columnContainerBlock"),
	columns: z.array(
		z.object({
			layout: z.array(baseContainerLayouts),
		}),
	),
})

const containerLayouts = z.union([
	baseContainerLayouts,
	indentedContainer,
	columnContainerBlock,
])
export type ContainerLayouts = z.infer<typeof containerLayouts>

const containerBlock = z.object({
	blockType: z.literal("containerBlock"),
	color: z.union([
		z.literal("green"),
		z.literal("white-1"),
		z.literal("white-2"),
	]),
	layout: z.array(containerLayouts),
})

const heroBlock: z.ZodType<HeroBlock> = z.object({
	blockType: z.literal("heroBlock"),
	title: z.string(),
})

const simpleLink = z.object({
	type: z.literal("custom"),
	newTab: z.boolean(),
	url: z.string(),
})

const fullLink: z.ZodType<BlockOf<"joinCrewBlock">["button"]["link"]> = z.discriminatedUnion("type", [
	internalLink,
	z.object({
		type: z.literal("custom"),
		newTab: z.boolean().optional().nullable(),
		url: z.string(),
		label: z.string(),
	}),
])

export const highlightArticle: z.ZodType<BlockOf<"highlightArticleBlock">> = z.object({
	blockType: z.literal("highlightArticleBlock"),
	title: z.string(),
	thumbnail: ImageUpload,
	articleTitle: z.string(),
	articleExcerpt: z.string(),
	link: simpleLink
})

export const selectedWork: z.ZodType<BlockOf<"selectedWorkBlock">> = z.object({
	blockType: z.literal("selectedWorkBlock"),
	title: z.string(),
	thumbnail: ImageUpload,
	articleTitle: z.string(),
	articleExcerpt: z.string(),
	link: simpleLink
})

const button = z.object({
	hasRightIcon: z.boolean(),
	hasLeftIcon: z.boolean(),
	iconLeft: z.string().nullable(),
	iconRight: z.string().nullable(),
	variant: z.union([
		z.literal("green"),
		z.literal("orange"),
		z.literal("black"),
	]),
	size: z.union([z.literal("small"), z.literal("large")]),
	link: fullLink,
})

export const joinCrew: z.ZodType<BlockOf<"joinCrewBlock">> = z.object({
	blockType: z.literal("joinCrewBlock"),
	title: z.string(),
	text: z.string(),
	button
})

export const layoutUnion = z.union([
	containerBlock,
	heroBlock,
	highlightArticle,
	selectedWork,
	joinCrew
])

export type LayoutUnion = z.infer<typeof layoutUnion>

export const HeadConfigSchema = () =>
	z
		.array(
			z.object({
				/** Name of the HTML tag to add to `<head>`, e.g. `'meta'`, `'link'`, or `'script'`. */
				tag: z.enum(['title', 'base', 'link', 'style', 'meta', 'script', 'noscript', 'template']),
				/** Attributes to set on the tag, e.g. `{ rel: 'stylesheet', href: '/custom.css' }`. */
				attrs: z.record(z.union([z.string(), z.boolean(), z.undefined()])).default({}),
				/** Content to place inside the tag (optional). */
				content: z.string().default(''),
			})
		)
		.default([]);

export const knowledgebaseSchema = z.object({
	template: z.literal("doc"),
	lexical: lexicalRoot,
	rendered: z.any(),
	tableOfContents: z.any(),
	toc: z.any(),
	visibility: z
		.union([z.literal("public"), z.literal("crew"), z.literal("team")])
		.default("public"),
})


export const pagesSchema = docsSchema({
	extend: z.union([
		knowledgebaseSchema,
		z.object({
			template: z.literal("splash"),
			head: HeadConfigSchema(),
			layout: z.array(layoutUnion),
		}),
	]),
})
