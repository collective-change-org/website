import { CMS_URL } from "astro:env/server"
import { authenticatePayload } from "./authenticate"
import type { KnowledgebasePage } from "../../config"
import type { LexicalRootContainer } from "./schemas/lexical"

type PayloadResponse = {
	data: {
		Knowledgebases: {
			docs: Array<{
				id: number
				title: string
				group?: {
					title: string
					breadcrumbs: Array<{
						doc: {
							slug: string
						}
					}>
				}
				slug: string
				content: LexicalRootContainer
			}>
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
				Knowledgebases {
					docs {
					id
					title
					group {
						title
						breadcrumbs{doc{slug}}
					}
					slug
					content 
					}
				}
			}
		`,
			headers: {
				Authorization: `Bearer ${result.token}`,
			},
		}),
	})

	const data = await response.json() as PayloadResponse

	return data.data.Knowledgebases.docs.map(doc => {
		return {
			id: "knowledgebase/" + doc.slug,
			title: doc.title,
			template: "doc",
			lexical: doc.content.root,
			tableOfContents: false,
			sidebar: {
				order: 0,
			}
		}
	})
}