import { CMS_URL } from "astro:env/server"
import { authenticatePayload } from "./authenticate"
import type { KnowledgebasePage } from "../../config"
import type { LexicalRootContainer, LexicalText } from "./schemas/lexical"
import { generateToC, headingToSlug } from "./generateToC"
import type { PayloadPageResponseItem } from "./getSidebar"

type PayloadResponse = {
	data: {
		Knowledgebases: {
			docs: Array<PayloadPageResponseItem>
		}
	}
}

export async function getKnowledgeBase(): Promise<KnowledgebasePage[]> {
	const bearerToken = await authenticatePayload()
	// Auth
	const { error, result } = bearerToken
	if (error || !result) {
		console.error(error)
		return []
	}

	const cmsUrl = new URL(CMS_URL)

	const response = await fetch(`${cmsUrl.origin}/api/graphql`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `
			query {
				Knowledgebases(sort: "docOrder") {
					docs {
					id
					title
					group {
						title
						breadcrumbs{doc{slug}}
					}
					slug
					content 
					restricted
					}
				}
			}
		`,
			headers: {
				Authorization: `Bearer ${result.token}`,
			},
		}),
	})

	const data = (await response.json()) as PayloadResponse

	return data.data.Knowledgebases.docs.map((doc, i) => {
		function extractTextFromLexical(textArray: LexicalText[]): string {
			return textArray.map(({ text }) => text).join("")
		}

		const astroHeadings = []

		for (const lexicalElements of doc.content.root.children) {
			if (lexicalElements.type === "heading") {
				const tag = lexicalElements.tag
				const depth = parseInt(tag.replace("h", ""))
				const text = extractTextFromLexical(lexicalElements.children)
				astroHeadings.push({
					depth,
					slug: headingToSlug(text),
					text: text,
				})
			}
		}

		const items = generateToC(astroHeadings, {
			minHeadingLevel: 2,
			maxHeadingLevel: 3,
			title: doc.title,
		})

		return {
			id: "knowledgebase/" + getPageSlug(doc),
			title: doc.title,
			template: "doc",
			lexical: doc.content.root,
			tableOfContents: { items },
			sidebar: {
				order: i,
			},
		}
	})
}

export function getPageSlug(page: PayloadPageResponseItem): string {
	const baseSlug = page.group
		? page.group.breadcrumbs.map((b) => b.doc.slug).join("/")
		: ""
	return baseSlug ? `${baseSlug}/${page.slug}` : page.slug
}
