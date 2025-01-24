import { docsSchema } from "@astrojs/starlight/schema"
import { lexicalRoot, lexicalRootContainer } from "../schemas/lexical"
import { z } from "astro:content"

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
		z.literal("white_1"),
		z.literal("white_2"),
	]),
	layout: z.array(containerLayouts),
})

export const layoutUnion = containerBlock

export type LayoutUnion = z.infer<typeof layoutUnion>

export const pagesSchema = docsSchema({
	extend: z.union([
		z.object({
			template: z.literal("doc"),
			lexical: lexicalRoot,
			restricted: z
				.union([z.literal("public"), z.literal("members")])
				.default("public"),
		}),
		z.object({
			template: z.literal("splash"),
			layout: z.array(layoutUnion),
		}),
	]),
})
