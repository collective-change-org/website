import type { LexicalRootContainer } from "./schemas/lexical"
import type { Badge } from "../../../schemas/badge"
import { getPageSlug } from "./pages/getKnowledgebase"
import { z, defineCollection } from "astro:content"
import {
	type LinkHTMLAttributes,
	linkHTMLAttributesSchema,
} from "../../../schemas/sidebar"
import { config, type Knowledgebase } from "@collectivechange/payload"
import { getPayload, type Payload } from "payload"

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
				badgeVariant?:
				| "note"
				| "danger"
				| "success"
				| "caution"
				| "tip"
				| "default"
			}
		}>
	}
	slug: string
	content: LexicalRootContainer
	restricted: "public" | "members"
	badge?: Badge
}

interface OrderedGroup extends Group {
	parentSlug?: string
	slug: string
	docOrder: number
}

async function pageToLink(page: Knowledgebase, payload: Payload): Promise<Link> {
	const payloadBadge = typeof page.badge === "number" ? undefined : page.badge
	let badge: Badge | undefined

	if (payloadBadge) {
		badge = {
			text: payloadBadge.text || "",
			variant: payloadBadge.variant || "default",
		}
	}
	return {
		id: "wissen/" + await getPageSlug(page, payload),
		type: "link",
		label: page.restricted === "members" ? "🔒 " + page.title : page.title,
		href: "/wissen/" + await getPageSlug(page, payload),
		isCurrent: false,
		attrs: {},
		badge: badge,
	}
}

export async function getKnowledgebaseSidebar(): Promise<SidebarEntry[]> {
	const payload = await getPayload({ config })
	const pages = await payload.find({
		collection: "knowledgebase",
		sort: "docOrder",
	})

	const sidebar: SidebarEntry[] = []

	const groups: OrderedGroup[] = []

	for (const page of pages.docs) {
		if (!page.group) {
			// Knowledgebase page is on the root level
			sidebar.push(await pageToLink(page, payload))
			continue
		}

		if (typeof page.group === "number") {
			console.log("page.group is a number")
			continue
		}

		const breadcrumbs = page.group.breadcrumbs

		if (!breadcrumbs || breadcrumbs.length === 0) {
			console.log("no breadcrumbs")
			continue
		}

		for (let i = 0; i < breadcrumbs.length; i++) {
			const group = breadcrumbs[i]
			if (!group.doc || !group) {
				console.log("no group.doc")
				continue
			}
			if (typeof group.doc === "number") {
				const g = await payload.findByID({
					collection: "groups",
					id: group.doc,
				})
				group.doc = g
			}

			const groupDoc = group.doc
			if (!groupDoc.slug) {
				console.log("no groupDoc.slug")
				continue
			}

			const parentBreadcrumb = breadcrumbs[i - 1]
			let parentSlug
			if (parentBreadcrumb) {
				if (typeof parentBreadcrumb.doc === "number") {
					const g = await payload.findByID({
						collection: "groups",
						id: parentBreadcrumb.doc,
					})
					if (g) {
						parentSlug = g.slug
					}
				} else {
					parentSlug = parentBreadcrumb.doc?.slug
				}
			}

			// Find the group in the list of groups
			let tempGroup = groups.find((g) => g.slug === groupDoc.slug)
			if (!tempGroup) {
				tempGroup = {
					id: "wissen/" + groupDoc.slug,
					docOrder: groupDoc.docOrder || 0,
					label: groupDoc.title,
					slug: groupDoc.slug,
					entries: [],
					collapsed: true,
					parentSlug:
						i > 0
							? parentSlug || ""
							: undefined,
					type: "group",
					...(groupDoc.badgeText && {
						badge: {
							text: groupDoc.badgeText,
							variant: groupDoc.badgeVariant || "default",
						},
					}),
				}
				groups.push(tempGroup)
			}
			if (i === breadcrumbs.length - 1) {
				tempGroup.entries.push(await pageToLink(page, payload))
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
	return await getKnowledgebaseSidebar()
}
