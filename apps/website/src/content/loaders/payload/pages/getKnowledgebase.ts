import { headingToSlug, generateToC, type TocItem } from "../generateToC"
import type { LexicalRoot, LexicalText } from "../schemas/lexical"
import type { KnowledgebasePage } from "."
import { getPayload } from "payload"
import { config, type Knowledgebase } from "@collectivechange/payload"


export async function getKnowledgeBase(): Promise<KnowledgebasePage[]> {
	const payload = await getPayload({ config })
	const pages = await payload.find({
		collection: "knowledgebase",
		sort: "docOrder",
	})

	return pages.docs.map((doc, i) => {
		function extractTextFromLexical(textArray: LexicalText[]): string {
			return textArray.map(({ text }) => text).join("")
		}

		const astroHeadings = []

		let items: TocItem[] = []

		if (doc.content && doc.content.root) {
			console.log("doc.content.root", doc.content.root)
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
				title: doc.title,
			})
		}

		return {
			id: "knowledgebase/" + getPageSlug(doc),
			title: doc.title,
			template: "doc",
			lexical: doc.content.root as LexicalRoot,
			tableOfContents: { items },
			sidebar: {
				order: i,
			},
			restricted: doc.restricted ?? "public",
		} satisfies KnowledgebasePage
	})
}

export function getPageSlug(page: Knowledgebase): string {
	if (typeof page.group === "number") { return page.group.toString() }
	const baseSlug = page.group
		? page.group.breadcrumbs?.map((b) => typeof b?.doc === "number" ? b?.doc : b?.doc?.slug || "").join("/") || ""
		: ""
	return baseSlug ? `${baseSlug}/${page.slug}` : page.slug || ""
}
