import { CMS_URL } from "astro:env/server"
import type { Group, Link, SidebarEntry } from "../../config"
import { authenticatePayload } from "./authenticate"
import type { LexicalRootContainer } from "./schemas/lexical"
import { getPageSlug } from "./getKnowledgebase"
import { undefined } from "astro:schema"

type PayloadPageResponse = {
	data: {
		Knowledgebases: {
			docs: Array<PayloadPageResponseItem>
		}
	}
}

export type PayloadPageResponseItem = {
	id: number
	title: string
	group?: {
		title: string
		breadcrumbs: Array<{
			doc: {
				docOrder?: number
				title: string
				slug: string
				badgeText?: string
				badgeVariant?: 'note' | 'danger' | 'success' | 'caution' | 'tip' | 'default'
			}
		}>
	}
	slug: string
	content: LexicalRootContainer
	restricted: "public" | "members"
	badgeText?: string
	badgeVariant?: 'note' | 'danger' | 'success' | 'caution' | 'tip' | 'default'


}

interface OrderedGroup extends Group {
	parentSlug?: string
	slug: string
	docOrder: number
}

function pageToLink(page: PayloadPageResponseItem): Link {
	return {
		id: "knowledgebase/" + getPageSlug(page),
		type: "link",
		label: page.restricted ===  "members" ? '🔒 ' + page.title : page.title,
		href: "/knowledgebase/" + getPageSlug(page),
		isCurrent: false,
		attrs: {},
		badge: page.badgeText ? { text: page.badgeText, variant: page.badgeVariant } : undefined,
		// ...(page.badgeText && { badge: { text: page.badgeText, variant: page.badgeVariant } }),
}

export async function getKnowledgebaseSidebar(): Promise<SidebarEntry[]> {
	const bearerToken = await authenticatePayload()
	// Auth
	const { error, result } = bearerToken
	if (error || !result) {
		console.error(error)
		return []
	}

	const cmsUrl = new URL(CMS_URL)

	const pageResponse = await fetch(`${cmsUrl.origin}/api/graphql`, {
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
                        breadcrumbs{
                            doc{
                                title
                                slug
                                docOrder
								badgeText
								badgeVariant
                            }
                        }
                    }
                    slug
                    content
					badgeText
					badgeVariant
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
	const pageRes = (await pageResponse.json()) as PayloadPageResponse
	const pages = pageRes.data.Knowledgebases.docs

	const sidebar: SidebarEntry[] = []

	const groups: OrderedGroup[] = []

	for (const page of pages) {
		if (!page.group) {
			// Knowledgebase page is on the root level
			sidebar.push(pageToLink(page))
			continue
		}

		for (let i = 0; i < page.group.breadcrumbs.length; i++) {
			const group = page.group.breadcrumbs[i]
			// Find the group in the list of groups
			let tempGroup = groups.find((g) => g.slug === group.doc.slug)
			if (!tempGroup) {
				tempGroup = {
					id: "knowledgebase/" + group.doc.slug,
					docOrder: group.doc.docOrder || 0,
					label: group.doc.title,
					slug: group.doc.slug,
					entries: [],
					collapsed: true,
					parentSlug:
						i > 0
							? page.group.breadcrumbs[i - 1].doc.slug
							: undefined,
					type: "group",
					...(group.doc.badgeText && { badge: { text: group.doc.badgeText, variant: group.doc.badgeVariant || 'default' } }),
				}
				groups.push(tempGroup)
			}
			if (i === page.group.breadcrumbs.length - 1) {
				tempGroup.entries.push(pageToLink(page))
			}
		}
	}

	groups.sort((a, b) => a.docOrder - b.docOrder)
	for (const group of groups) {
		if (group.parentSlug) {
			const parentGroup = groups.find((g) => g.slug === group.parentSlug)
			if (parentGroup) {
				parentGroup.entries.push(group)
			} else {
				sidebar.push(group)
			}
		} else {
			sidebar.push(group)
		}
	}

	return [...sidebar]
}
