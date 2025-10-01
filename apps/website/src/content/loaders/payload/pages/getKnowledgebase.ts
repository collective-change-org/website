import { headingToSlug, generateToC, type TocItem } from "../generateToC"
import type { LexicalRoot, LexicalText } from "../schemas/lexical"
import type { KnowledgebasePage } from "."
import type { Group, Knowledgebase } from "@collectivechange/payload"
import type { MarkdownHeading } from "astro"
import { sdk } from "../sdk"


export async function getKnowledgeBase(): Promise<KnowledgebasePage[]> {
	const pages = await sdk.find({
		collection: "knowledgebase",
		sort: "docOrder",
		where: {
			_status: {
				equals: "published",
			}
		}
	})

	const knowledgebasePages = await Promise.all(pages.docs.map(async (doc, i) => {
		function extractTextFromLexical(textArray: LexicalText[]): string {
			return textArray.map(({ text }) => text).join("")
		}

		let items: TocItem[] = []
		const headings: MarkdownHeading[] = []

		if (doc.content?.root) {
			for (const lexicalElements of doc.content.root.children) {
				if (lexicalElements.type === "heading") {
					const tag = lexicalElements.tag as string
					const depth = parseInt(tag.replace("h", ""))
					const text = extractTextFromLexical(lexicalElements.children as LexicalText[])
					headings.push({
						depth,
						slug: headingToSlug(text),
						text: text,
					})
				}
			}

			items = generateToC(headings, {
				minHeadingLevel: 2,
				maxHeadingLevel: 3,
				title: doc.title || "<no title>",
			})
		}

		const pageSlug = await getPageSlug(doc)

		return {
			id: "wissen/" + pageSlug,
			title: doc.title || "<no title>",
			template: "doc",
			lexical: doc.content ? doc.content.root as LexicalRoot : { type: "root", children: [], version: 1 },
			tableOfContents: { items },
			sidebar: {
				order: i,
			},
			visibility: doc.visibility ?? "public",
		} satisfies KnowledgebasePage
	}))
	return knowledgebasePages
}

export async function getPageSlug(page: Knowledgebase): Promise<string> {
	let group: Group | undefined
	if (typeof page.group === "number") {
		group = await sdk.findByID({
			collection: "groups",
			id: page.group,
		})
	} else if (typeof page.group === "object" && page.group !== null) {
		group = page.group
	}

	const baseSlug = group?.slug
	return baseSlug ? `${baseSlug}/${page.slug}` : page.slug || ""
}
