import { docsSchema } from "@astrojs/starlight/schema"
import { lexicalRoot, lexicalRootContainer } from "../schemas/lexical"
import { z } from "astro:content"

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

const loginBlock = z.object({
	blockType: z.literal("loginBlock"),
	richText: lexicalRootContainer,
})

const signupBlock = z.object({
	blockType: z.literal("signupBlock"),
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

export const layoutUnion = z.union([
	contentBlock,
	loginBlock,
	signupBlock,
	manifestBlock,
])

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
