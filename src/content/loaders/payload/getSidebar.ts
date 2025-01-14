import { CMS_URL } from "astro:env/server"
import { authenticatePayload } from "./authenticate"
import type { LexicalRootContainer } from "./schemas/lexical"
import type { Badge } from "../../../schemas/badge"
import { getPageSlug } from "./pages/getKnowledgebase"
import { z, defineCollection } from "astro:content"
import { type LinkHTMLAttributes, linkHTMLAttributesSchema } from "../../../schemas/sidebar"

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
	let badge: Badge | undefined
	if (page.badgeText) {
		badge = {
			text: page.badgeText,
			variant: page.badgeVariant || 'default'
		}
	}
	return {
		id: "knowledgebase/" + getPageSlug(page),
		type: "link",
		label: page.restricted === "members" ? '🔒 ' + page.title : page.title,
		href: "/knowledgebase/" + getPageSlug(page),
		isCurrent: false,
		attrs: {},
		badge: badge,
	}
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
	const pageRes = await pageResponse.json() as PayloadPageResponse
	console.log(pageRes)
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


export interface Link {
	id: string
	type: "link"
	label: string
	href: string
	isCurrent: boolean
	badge?: Badge
	attrs: LinkHTMLAttributes
}
export interface Group {
	id: string
	type: "group"
	label: string
	entries: (Link | Group)[]
	collapsed: boolean
	badge?: Badge
}
export type CustomSidebar = {
	order?: number
	label?: string
	hidden?: boolean
	// badge?: BadgeConfig
	// attrs?: SidebarLinkItemHTMLAttributes;
}
export type SidebarEntry = Link | Group
export const linkSchema: z.ZodSchema<Link> = z.object({
	id: z.string(),
	type: z.literal("link"),
	label: z.string(),
	href: z.string(),
	isCurrent: z.boolean(),
	attrs: linkHTMLAttributesSchema,
})
const groupSchema: z.ZodSchema<Group> = z.lazy(() =>
	z.object({
		id: z.string(),
		type: z.literal("group"),
		label: z.string(),
		entries: z.array(z.union([linkSchema, groupSchema])),
		collapsed: z.boolean(),
	}),
)

export const sidebar = defineCollection({
	loader: getSidebar,
	// TODO: Fix schema
	// schema: z.array(z.union([linkSchema, groupSchema]))
})

async function getSidebar(): Promise<SidebarEntry[]> {
	// @ts-ignore
	if (MOCKDATA) return new Promise((resolve) => resolve(mockdata.sidebar))
	return await getKnowledgebaseSidebar()
}