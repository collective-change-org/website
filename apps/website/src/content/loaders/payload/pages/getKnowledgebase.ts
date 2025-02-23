import { headingToSlug, generateToC, type TocItem } from "../generateToC"
import type { LexicalRoot, LexicalText } from "../schemas/lexical"
import type { KnowledgebasePage } from "."
import { getPayload, type Payload } from "payload"
import { config, type Group, type Knowledgebase } from "@collectivechange/payload"


export async function getKnowledgeBase(): Promise<KnowledgebasePage[]> {
	const payload = await getPayload({ config })
	const pages = await payload.find({
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

		const astroHeadings = []

		let items: TocItem[] = []

		if (doc.content && doc.content?.root) {
			for (const lexicalElements of doc.content.root.children) {
				if (lexicalElements.type === "heading") {
					const tag = lexicalElements.tag as string
					const depth = parseInt(tag.replace("h", ""))
					const text = extractTextFromLexical(lexicalElements.children as LexicalText[])
					astroHeadings.push({
						depth,
						slug: headingToSlug(text),
						text: text,
					})
				}
			}

			items = generateToC(astroHeadings, {
				minHeadingLevel: 2,
				maxHeadingLevel: 3,
				title: doc.title || "<no title>",
			})
		}

		const pageSlug = await getPageSlug(doc, payload)

		return {
			id: "knowledgebase/" + pageSlug,
			title: doc.title || "<no title>",
			template: "doc",
			lexical: doc.content ? doc.content.root as LexicalRoot : { type: "root", children: [], version: 1 },
			tableOfContents: { items },
			sidebar: {
				order: i,
			},
			restricted: doc.restricted ?? "public",
		} satisfies KnowledgebasePage
	}))
	return knowledgebasePages
}

export async function getPageSlug(page: Knowledgebase, payload: Payload): Promise<string> {
	let group: Group | undefined
	if (typeof page.group === "number") {
		group = await payload.findByID({
			collection: "groups",
			id: page.group,
		})
	} else if (typeof page.group === "object" && page.group !== null) {
		group = page.group
	}

	const baseSlug = group?.slug
	return baseSlug ? `${baseSlug}/${page.slug}` : page.slug || ""
}
