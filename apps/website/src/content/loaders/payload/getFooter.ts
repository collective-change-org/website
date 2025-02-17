import { defineCollection, z } from "astro:content"
import { getPayload } from "payload"
import { config } from "@collectivechange/payload"

export async function getFooter(): Promise<FooterSchema> {
    const payload = await getPayload({ config })
    const footer = await payload.findGlobal({
        slug: "footer",
        depth: 3,
    })

    const elements = footer?.navItems?.map((navItem) => {
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
                    href = reference.slugWithGroup || ""
                } else {
                    href = reference.slug || ""
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
export type FooterSchema = z.infer<typeof headerSchema>

export const footer = defineCollection({
    loader: getFooter,
    schema: linkSchema
})