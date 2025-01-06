import { CMS_URL } from "astro:env/server"
import { authenticatePayload } from "./authenticate"
import type { KnowledgebasePage, Page } from "../../config"
import type { LexicalRootContainer } from "./schema"



export type ContentBlock = {
	id: string
	columns: Array<{
		size: number
		richText: LexicalRootContainer
	}>
}

export type CallToActionBlock = {
	id: string
	richText: LexicalRootContainer
}

type PayloadResponse = {
	data: {
		Pages: {
			docs: Array<{
				title: string
				slug: string
				layout: (ContentBlock | CallToActionBlock)[]
			}>
		}
	}
}


export async function getPages(): Promise<Page[]> {
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
			query pages {
				Pages {
					docs {
						title
						slug
						layout {
							... on CallToActionBlock {
								id
								blockType
								richText
							}
							... on ContentBlock {
								id
								blockType
								columns {
									size
									richText
								}
							}
							... on MediaBlock {
								id
								blockType
							}
						}
						meta {
							title
							image {
								url
							}
							description
						}
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

	return data.data.Pages.docs.map(doc => {
		return {
			id: doc.slug === "home" ? "/" : doc.slug,
			title: doc.title,
			template: "splash",
			layout: doc.layout,
			tableOfContents: false,
			sidebar: {
				order: 0,
			}
		}
	})
}