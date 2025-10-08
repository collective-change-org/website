import { defineCollection, z } from "astro:content"
import { sdk } from "./sdk"

export async function getHeader(): Promise<HeaderSchema> {
	const header = await sdk.findGlobal({
		slug: "header",
		depth: 3,
	})

	const elements = header.navItems?.map((navItem) => {
		let href: string
		// check if internal link
		if (navItem.link.reference) {
			// check if page or knowlegebase link
			const reference = navItem.link.reference.value
			if (typeof reference === "number") {
				href = ""
			} else {
				// If referemce is a page, not a knowledgebase, use the slug
				// If it is a knowledgebase, use the slugWithGroup
				if ("slugWithGroup" in reference) {
					href = reference.slugWithGroup ? `/wissen/${reference.slugWithGroup}` : ""
				} else {
					href = reference.slug ? `/${reference.slug}` : ""
				}
			}
		} else {
			href = navItem.link.url || ""
		}
		const item: LinkSchema = {
			id: navItem.id || "",
			label: navItem.link.label,
			newTab: navItem.link.newTab,
			href: href,
		}
		return item
	})
	return elements || []
}

export const linkSchema = z.object({
	id: z.string(),
	label: z.string(),
	newTab: z.boolean().optional().nullable(),
	href: z.string().optional().nullable(),
})
export type LinkSchema = z.infer<typeof linkSchema>
const headerSchema = z.array(linkSchema)
export type HeaderSchema = z.infer<typeof headerSchema>

export const header = defineCollection({
	loader: getHeader,
	schema: linkSchema
})
